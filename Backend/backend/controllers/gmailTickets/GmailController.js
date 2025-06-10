const Gmail = require("../../model/Gmail");
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const GmailProcess =()=>{

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",  // View emails
    "https://www.googleapis.com/auth/gmail.modify"     // Modify emails (mark as read)
];
const TOKEN_PATH = path.join(process.cwd(), '../../token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}
function extractEmail(senderRaw) {
    const match = senderRaw.match(/<([^>]+)>/);
    return match ? match[1] : senderRaw; 
}

function extractProjectId(subject) {
    const match = subject.match(/ProjectID#(\d+)/);
    console.log(match);
    
    return match ? match[1] : null; 
}
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

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) return client;

    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });

    if (client.credentials) await saveCredentials(client);
    return client;
}
function getMessageBody(payload) {
    if (!payload) return 'No message content';
    
    if (payload.body && payload.body.data) {
        return Buffer.from(payload.body.data, 'base64').toString();
    }

    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
                return Buffer.from(part.body.data, 'base64').toString();
            }
            if (part.mimeType === 'text/html' && part.body?.data) {
                return Buffer.from(part.body.data, 'base64').toString();
            }
        }
    }

    return 'No message content';
}


async function processEmail(emailData, auth) {
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

        console.log(`📩 New Email Received from ${senderEmail}`);
        console.log(`- Subject: ${subject}`);

        const projectId = extractProjectId(subject);

        if (projectId) {
            const exists = await Gmail.Gmail.checkProjectId(projectId);

            if (exists) {
                const latestTicketId = await Gmail.Gmail.checkPreviousTicketId(projectId);
                const reportUserId = await Gmail.Gmail.checkUser(senderEmail);
                    console.log("reportUserId",reportUserId);
                    
                if (!reportUserId) {
                    console.error("❌ No user found for email:", senderEmail);
                    return;
                }

                await Gmail.Gmail.insertTicket(projectId, latestTicketId, reportUserId, subject, message);
                console.log(`✅ Ticket added for Project ID ${projectId}`);
                await markEmailAsRead(auth, emailData.id);
                return;
            }
        }

        await Gmail.Gmail.insertTicketEmailTable(senderEmail, subject, message);
        console.log(`✅ Email saved in ticket email table.`);
        await markEmailAsRead(auth, emailData.id);
    } catch (error) {
        console.error('❌ Error processing email:', error.stack);
    }
}

async function markEmailAsRead(auth, emailId) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        await gmail.users.messages.modify({
            userId: 'me',
            id: emailId,
            requestBody: {
                removeLabelIds: ['UNREAD'],
            },
        });
        console.log(`✅ Marked email ${emailId} as read`);
    } catch (error) {
        console.error(`❌ Failed to mark email ${emailId} as read:`, error.message);
    }
}
let lastEmailId = null;
let waitTime = 5000; // Start with 5 seconds

async function checkForNewEmails(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
             q: "is:unread",
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log(`No new emails. Checking again in ${waitTime / 1000} sec...`);
            waitTime = Math.min(waitTime * 2, 60000);
            setTimeout(() => checkForNewEmails(auth), waitTime);
            return;
        }

        const newEmailId = res.data.messages[0].id;
        if (newEmailId === lastEmailId) {
            waitTime = Math.min(waitTime * 2, 60000);
            setTimeout(() => checkForNewEmails(auth), waitTime);
            return;
        }

        lastEmailId = newEmailId;
        waitTime = 5000; // Reset wait time

        const email = await gmail.users.messages.get({
            userId: 'me',
            id: newEmailId,
        });

        await processEmail(email.data,auth);

        setTimeout(() => checkForNewEmails(auth), waitTime);
    } catch (error) {
        console.error('❌ Error fetching emails:', error.message);

        if (error.code === 429) {
            console.log('⚠️ Rate limit exceeded! Retrying in 1 minute...');
            setTimeout(() => checkForNewEmails(auth), 60000);
        } else if (error.code === 401) {
            console.log('⚠️ Authentication expired. Re-authorizing...');
            authorize().then(auth => checkForNewEmails(auth)).catch(console.error);
        } else {
            setTimeout(() => checkForNewEmails(auth), 60000);
        }
    }
}
// module.exports = { authorize, checkForNewEmails };

// Run the script
authorize().then(auth => checkForNewEmails(auth)).catch(console.error);
}
module.exports={GmailProcess}