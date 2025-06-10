const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
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

/**
 * Load or request authorization to call APIs.
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

/**
 * Fetches the latest email and checks if it's new.
 */
let lastEmailId = null;
let waitTime = 5000; // Start with 5 seconds

async function checkForNewEmails(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 1, // Only fetch the latest email
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log(`No new emails. Checking again in ${waitTime / 1000} sec...`);
            waitTime = Math.min(waitTime * 2, 60000); // Exponential backoff (max 60 sec)
            setTimeout(() => checkForNewEmails(auth), waitTime);
            return;
        }

        const newEmailId = res.data.messages[0].id;

        console.log('Fetching emails at:', new Date().toLocaleTimeString());

        if (newEmailId !== lastEmailId) {
            lastEmailId = newEmailId; // Update last email ID
            waitTime = 5000; // Reset wait time

            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: newEmailId,
            });

            const headers = msg.data.payload.headers;
            const from = headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
            const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';

            console.log(`\n📩 New Email Received!`);
            console.log(`- From: ${from}`);
            console.log(`- Subject: ${subject}`);
        } else {
            waitTime = Math.min(waitTime * 2, 60000);
        }
        setTimeout(() => checkForNewEmails(auth), waitTime);
    } catch (error) {
        console.error('Error fetching emails:', error.message);
        setTimeout(() => checkForNewEmails(auth), 60000); // Wait 60 sec on error
    }
}

// Run the script
authorize().then(auth => checkForNewEmails(auth)).catch(console.error);


