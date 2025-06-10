const { PubSub } = require('@google-cloud/pubsub');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Pub/Sub Configuration
const PROJECT_ID = 'my-ticketing-system';
const SUBSCRIPTION_NAME = 'Gmail-notifications-sub';
const pubSubClient = new PubSub({ projectId: PROJECT_ID });

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
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
 * Fetches the latest email from Gmail API.
 */
async function fetchLatestEmail(auth, historyId) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const res = await gmail.users.history.list({
            userId: 'me',
            startHistoryId: historyId,
        });

        if (!res.data.history) {
            console.log('No new emails detected.');
            return;
        }

        console.log(`📩 New email detected! Fetching details...`);

        const latestEmail = res.data.history.find(event => event.messages)?.messages[0];

        if (!latestEmail) {
            console.log('No new messages found.');
            return;
        }

        const msg = await gmail.users.messages.get({
            userId: 'me',
            id: latestEmail.id,
        });

        const headers = msg.data.payload.headers;
        const from = headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
        const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';

        console.log(`✅ Email Fetched!`);
        console.log(`- From: ${from}`);
        console.log(`- Subject: ${subject}`);
    } catch (error) {
        console.error('❌ Error fetching email:', error.message);
    }
}

/**
 * Listens to Pub/Sub for new email notifications.
 */
async function listenForEmails(auth) {
    const subscription = pubSubClient.subscription(SUBSCRIPTION_NAME);

    subscription.on('message', async (message) => {
        console.log(`📬 New Pub/Sub Message Received:`);
        const data = JSON.parse(Buffer.from(message.data, 'base64').toString());

        if (data.historyId) {
            console.log(`🔄 Triggering email fetch for history ID: ${data.historyId}`);
            await fetchLatestEmail(auth, data.historyId);
        } else {
            console.log('⚠️ No history ID found in Pub/Sub message.');
        }

        message.ack(); // Acknowledge the message
    });

    subscription.on('error', (error) => {
        console.error('❌ Pub/Sub Error:', error);
    });

    console.log(`🚀 Listening for Gmail notifications on Pub/Sub...`);
}

// Run the script with Pub/Sub
authorize().then(auth => listenForEmails(auth)).catch(console.error);
