const Gmail = require("../../model/Gmail");
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify"
];

const TOKEN_PATH = path.join(process.cwd(), '../../token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

let accessToken = null;
let tokenExpiryTime = null;
let refreshToken = null;
async function handleTokenExpiration(oAuth2Client) {
    try {
        console.log("🔄 Refreshing access token...");
        const { credentials } = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(credentials);
        await saveCredentials(oAuth2Client);
        console.log("✅ Token refreshed successfully");
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.error("🚨 Refresh token revoked! Attempting re-authentication...");
            await automaticReAuthentication(oAuth2Client);
        } else {
            console.error("❌ Token refresh failed:", error.message);
        }
    }
}

async function automaticReAuthentication(oAuth2Client) {
    try {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.readonly']
        });

        console.log(`🔗 Open this URL to re-authenticate: ${authUrl}`);

        // Auto-fetch new tokens (assuming headless authentication is possible)
        const { tokens } = await oAuth2Client.getToken(AUTHORIZATION_CODE);  // Replace with actual auth code mechanism
        oAuth2Client.setCredentials(tokens);
        await saveCredentials(oAuth2Client);
        console.log("✅ Automatic re-authentication successful!");
    } catch (error) {
        console.error("❌ Auto re-authentication failed! User must manually re-authenticate.");
    }
}

/**
 * Load saved credentials if exist
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        accessToken = credentials.access_token;
        refreshToken = credentials.refresh_token;
        tokenExpiryTime = credentials.expiry_date;
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Save new credentials when token is refreshed
 */
async function saveCredentials(client) {
    const credentials = client.credentials;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token, 
        expiry_date: credentials.expiry_date
    });

    accessToken = credentials.access_token;
    refreshToken = credentials.refresh_token;
    tokenExpiryTime = credentials.expiry_date;

    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Refresh access token before making requests
 */
async function refreshAccessToken(oAuth2Client) {
    try {
        if (Date.now() < tokenExpiryTime - 30000) {  // Refresh only if 30 sec before expiry
            return;
        }

        const { credentials } = await oAuth2Client.refreshAccessToken();
        await saveCredentials(oAuth2Client);
        console.log("🔄 Access token refreshed");
    } catch (error) {
        console.error("❌ Error refreshing access token:", error.message);

        if (error.response && error.response.status === 403) {
            console.error("🚨 Refresh token revoked! User must re-authenticate.");
        }
    }
}

/**
 * Authenticate and handle token logic
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        await refreshAccessToken(client);
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
 * Check emails periodically, handling rate limits and expired tokens
 */
async function checkForNewEmails(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        await refreshAccessToken(auth);  // Ensure token is valid before request

        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            q: "is:unread",
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log("No new emails. Checking again in 5 sec...");
            setTimeout(() => checkForNewEmails(auth), 1000);
            return;
        }

        for (const message of res.data.messages) {
            const email = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });

            console.log(`📩 Processing email: ${message.id}`);
            // Call your processEmail function here
        }

        setTimeout(() => checkForNewEmails(auth), 5000);
    } catch (error) {
        console.error("❌ Error fetching emails:", error.message);

        if (error.response && error.response.status === 429) {
            console.log("⚠️ Rate limit exceeded! Retrying in 1 minute...");
            setTimeout(() => checkForNewEmails(auth), 60000);
        } else if (error.response && error.response.status === 401) {
            console.log("⚠️ Token expired. Refreshing...");
            await refreshAccessToken(auth);
            setTimeout(() => checkForNewEmails(auth), 5000);
        } else {
            setTimeout(() => checkForNewEmails(auth), 60000);
        }
    }
}

// Run the script
authorize().then(auth => checkForNewEmails(auth)).catch(console.error);
