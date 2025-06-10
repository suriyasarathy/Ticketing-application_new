const { google } = require("googleapis");

async function watchGmail() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "C:\\Users\\suriya_sarathy\\Downloads\\light-bootstrap-dashboard-react-master (1)\\light-bootstrap-dashboard-react-master\\Backend\\backend\\service-account.json",
        scopes: ["https://www.googleapis.com/auth/gmail.readonly"]
    });

    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: "projects/my-ticketing-system/topics/Gmail-notifications"
        }
    });

    console.log("🔔 Gmail Watch Response:", response.data);
}

watchGmail();
