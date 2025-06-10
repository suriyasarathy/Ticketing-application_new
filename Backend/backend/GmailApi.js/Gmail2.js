const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const mysql = require('mysql2/promise');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Database configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "ticketing_system",
};

// Load saved credentials
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

// Save new credentials
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

// Authenticate user
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) return client;

    client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
    if (client.credentials) await saveCredentials(client);

    return client;
}

// Extract email from 'From' header
function extractEmail(fromHeader) {
    const match = fromHeader.match(/<(.+?)>/);
    return match ? match[1] : fromHeader; 
}

// Extract plain text message from email
function getMessageBody(payload) {
    if (!payload || !payload.parts) return 'No message content';
    for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
            return Buffer.from(part.body.data, 'base64').toString();
        }
    }
    return 'No message content';
}

// Extract Project ID from the subject
function extractProjectId(subject) {
    const match = subject.match(/ProjectID#(\d+)/);
    return match ? match[1] : null; 
}

// Check if Project ID exists in the database
async function checkProjectExists(projectId) {
    try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute(
            `SELECT project_id FROM projects WHERE project_id = ?`,
            [projectId]
        );
        await db.end();
        return rows.length > 0;
    } catch (err) {
        console.error('❌ Error checking project ID:', err.message);
        return false;
    }
}

// Save email to the tickets table (if Project ID exists)
async function saveEmailToTickets(projectId, senderEmail, subject, message) {
    try {
        const db = await mysql.createConnection(dbConfig);
        await db.execute(
            `INSERT INTO tickets (project_id,ticket_id, Tittle, description, priority, status, assigin_id, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [projectId,2272000025, subject, message, 'low', 'open', null]
        );
        await db.end();
        console.log('✅ Email stored as a ticket.');
    } catch (err) {
        console.error('❌ Error saving ticket:', err.message);
    }
}

// Save email to the email_tickets table (if no Project ID found)
async function saveEmailToEmailTickets(senderEmail, subject, message) {
    try {
        const db = await mysql.createConnection(dbConfig);
        await db.execute(
            `INSERT INTO email_tickets (report_id, sender, subject, message, received_at) 
            VALUES (?, ?, ?, ?, NOW())`,
            [senderEmail, senderEmail, subject, message]
        );
        await db.end();
        console.log('✅ Email stored in email_tickets.');
    } catch (err) {
        console.error('❌ Error saving email ticket:', err.message);
    }
}

// Process incoming email
async function processEmail(emailData) {
    try {
        if (!emailData || !emailData.payload) {
            console.error('❌ Invalid email data received.');
            return;
        }

        const headers = emailData.payload.headers;
        const senderRaw = headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
        const senderEmail = extractEmail(senderRaw);
        const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';
        const message = getMessageBody(emailData.payload);

        console.log(`📩 New Email Received!`);
        console.log(`- From: ${senderEmail}`);
        console.log(`- Subject: ${subject}`);

        // Extract Project ID from subject
        const projectId = extractProjectId(subject);

        if (projectId) {
            const exists = await checkProjectExists(projectId);
            if (exists) {
                await saveEmailToTickets(projectId, senderEmail, subject, message);
                return;
            }
        }

        await saveEmailToEmailTickets(senderEmail, subject, message);
    } catch (error) {
        console.error('❌ Error processing email:', error.message);
    }
}

// Fetch new emails from Gmail
let lastEmailId = null;
let waitTime = 5000;

async function checkForNewEmails(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            labelIds: ['INBOX'],
            maxResults: 1, 
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log(`📭 No new emails. Checking again in ${waitTime / 1000} sec...`);
            setTimeout(() => checkForNewEmails(auth), waitTime);
            return;
        }

        console.log(`📨 Found ${res.data.messages.length} new email(s).`);
        waitTime = 5000; // Reset wait time on success

        for (const message of res.data.messages) {
            if (message.id === lastEmailId) continue; // Skip already processed emails
            lastEmailId = message.id;

            const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
            await processEmail(email.data);
        }
    } catch (error) {
        console.error('❌ Error fetching emails:', error.message);
        waitTime = Math.min(waitTime * 2, 60000); // Increase wait time (max 60s)
    }

    setTimeout(() => checkForNewEmails(auth), waitTime);
}

// Run the script
authorize().then(auth => checkForNewEmails(auth)).catch(console.error);
