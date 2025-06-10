const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer =require('nodemailer');
const app = express();
const multer =require('multer');
const fs =require('fs')
const path =require('path')
const port = 3000;
const JWT_SECRET = 'your_secret_key'
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");

const readline = require('readline');
const { file } = require('jszip');
const { query } = require('./config/db');



app.use(cors({ origin: 'http://localhost:3001' }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// MySQL Connection
const db = mysql.createPool({
  connectionLimit:70,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ticketing_system',
 
});
const promisePool = db.promise();
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release(); // Release the connection back to the pool
})
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Rename file to avoid conflicts
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { ticket_id, user_id } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = `/uploads/${file.filename}`;
    const sql = `
      INSERT INTO attachments (file_name, file_path, file_type, file_size, ticket_id, user_id, uploaded_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    await db.promise().query(sql, [file.filename, filePath, file.mimetype, file.size, ticket_id, user_id]);

    res.status(200).json({ message: "File uploaded successfully", filePath });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

//Gmail-tickets
// const credentials = JSON.parse(fs.readFileSync("credentials.json"));
// const { client_id, client_secret, redirect_uris } = credentials.web;
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// // Load saved token.json
// oAuth2Client.setCredentials(JSON.parse(fs.readFileSync("token.json")));



// async function fetchEmail() {
//     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

//     // Fetch email list (last 5 emails)
//     const res = await gmail.users.messages.list({ userId: "me", maxResults: 5 });
//     if (!res.data.messages) return console.log("❌ No emails found.");

//     for (const message of res.data.messages) {
//         const msg = await gmail.users.messages.get({ userId: "me", id: message.id });

//         // Extract headers
//         const headers = msg.data.payload.headers;
//         const senderHeader = headers.find(h => h.name === "From")?.value || "Unknown";
//         const subject = headers.find(h => h.name === "Subject")?.value || "No Subject";
//         const receivedAt = new Date(parseInt(msg.data.internalDate));

//         // Extract Email Address from Sender
//         const emailMatch = senderHeader.match(/<(.*?)>/); // Extracts email between < >
//         const reportId = emailMatch ? emailMatch[1] : senderHeader; // Store email address as report_id

//         // Extract Email Body
//         let messageBody = "No Message";
//         if (msg.data.payload.body && msg.data.payload.body.data) {
//             messageBody = Buffer.from(msg.data.payload.body.data, "base64").toString("utf-8");
//         } else if (msg.data.payload.parts) {
//             const textPart = msg.data.payload.parts.find(p => p.mimeType === "text/plain");
//             if (textPart && textPart.body.data) {
//                 messageBody = Buffer.from(textPart.body.data, "base64").toString("utf-8");
//             }
//         }

//         // Insert into MySQL
//         db.query(
//             "INSERT INTO email_tickets (sender, report_id, subject, message, received_at) VALUES (?, ?, ?, ?, ?)",
//             [senderHeader, reportId, subject, messageBody, receivedAt],
//             (err, result) => {
//                 if (err) {
//                     console.error("❌ Database Insert Error:", err);
//                 } else {
//                     console.log(`✅ Stored Email: ${subject} from ${senderHeader}`);
//                 }
//             }
//         );
//     }
// }

// // Run the function
// fetchEmail().catch(console.error);


// ✅ Gmail API Credentials
// const CLIENT_ID = '231290054412-qf2b09eq2vp60l86uhft8266givjk0cn.apps.googleusercontent.com';
// const CLIENT_SECRET = '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';
// const REDIRECT_URI = 'http://localhost:3002'; // Adjust to your redirect URI
// const SCOPES = [
//   'https://www.googleapis.com/auth/gmail.modify',
//   'https://www.googleapis.com/auth/gmail.readonly',
//   'https://www.googleapis.com/auth/gmail.compose',
// ];
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// let REFRESH_TOKEN = '1//04gmGPVE8qlNSCgYIARAAGAQSNwF-L9IrVSJufX8nUvNP-xSpCEtlNpKMn6LQeo9cX_aNZkDcIO0u6EIgMkcKkEsQEG_5pma_jw4'; // Replace with the refresh token you obtain after the first OAuth authorization

// // Set credentials
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// // Function to get new refresh token (OAuth2 flow)
// const getNewToken = async () => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);

//   rl.question('Enter the code from that page here: ', async (code) => {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);
//     REFRESH_TOKEN = tokens.refresh_token;
//     console.log('Tokens acquired.', tokens);
//     rl.close();
//   });
// };

// Fetch and store emails
// const fetchAndStoreEmails = async () => {
//   try {
//     const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//     // Fetch unread emails
//     const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });

//     if (!res.data.messages) {
//       console.log('📭 No unread emails.');
//       return;
//     }

//     for (const message of res.data.messages) {
//       const msg = await gmail.users.messages.get({ userId: 'me', id: message.id });

//       const headers = msg.data.payload.headers;
//       const sender = headers.find(header => header.name === 'From')?.value || 'Unknown';
//       const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';
//       const messageSnippet = msg.data.snippet; // Extract message preview

//       // Example report_id (you can adjust this as needed)
//       const reportId = 'test_report_id'; // Replace this with actual logic

//       // Insert email into MySQL database
//       const sql = 'INSERT INTO email_tickets (sender, report_id, subject, message, received_at) VALUES (?, ?, ?, ?, NOW())';
//       db.query(sql, [sender, reportId, subject, messageSnippet], (err, result) => {
//         if (err) {
//           console.error('❌ Database Insert Error:', err);
//         } else {
//           console.log(`✅ Stored email from: ${sender}`);
//         }
//       });

//       // Mark email as read (optional)
//       await gmail.users.messages.modify({
//         userId: 'me',
//         id: message.id,
//         requestBody: { removeLabelIds: ['UNREAD'] },
//       });
//     }
//   } catch (error) {
//     console.error('❌ Error fetching emails:', error);
//   }
// };

// // Fetch emails every 30 seconds
// setInterval(fetchAndStoreEmails, 30 * 1000);

// // Run this only once to get the initial refresh token
// getNewToken(); // Call this to generate the refresh token when starting
//mail transportor
const transportor =nodemailer.createTransport({
  service:'gmail',
  auth  :{
    user:'testmail.ebramha@gamil.com',
    pass:'Nigilan2007'
  }
})
// Function to send verification email
const sendVerificationEmail = (email, verificationToken) => {
  const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: 'testmail.ebramha@gmail.com', // Sender email
    to: email, // Receiver email
    subject: 'Verify Your Email', // Email subject
    html: `
      <h1>Welcome to our platform!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `, // HTML content with the verification link
  };

  // Send the email
  transportor.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};







//team
app.post('/create-team', (req, res) => {
  const { name, description, team_lead_id, members } = req.body;

  // Validate the input
  if (!name || !team_lead_id || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Team name, team lead, and members are required' });
  }

  // Insert the team into the 'teams' table
  const teamQuery = 'INSERT INTO teams (name, team_lead_id) VALUES (?, ?)';
  db.query(teamQuery, [name, team_lead_id], (err, result) => {
      if (err) {
          console.error('Error creating team:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      const teamId = result.insertId;

      // Update the 'team_id' in the 'user' table for each member
      const userUpdateQuery = 'UPDATE user SET team_id = ? WHERE user_id IN (?)';
      db.query(userUpdateQuery, [teamId, members], (err) => {
          if (err) {
              console.error('Error updating team for users:', err);
              return res.status(500).json({ message: 'Internal server error' });
          }

          res.status(201).json({ message: 'Team created and users updated successfully', teamId });
      });
  });
});


// Fetch users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(result);
  });
});


app.get('/tickets', (req, res) => {
  const ticketId = req.query.id;

  const baseQuery = `
    SELECT 
      t.Ticket_id,
      t.Tittle,
      t.description,
      t.priority,
      t.status,
      t.created_at,
      t.updated_at,
      t.Due_date,
      t.Tagging,
      t.Ip_address,
      t.type,
      r.name AS reporter_name,
      a.name AS assignee_name,
      p.name AS project_name,
      at.attach_id,
      at.file_name,
      at.file_path,
      at.file_type
    FROM 
      tickets t
    JOIN 
      user r ON t.reported_id = r.user_id
    JOIN 
      user a ON t.assigin_id = a.user_id
    JOIN 
      project_name p ON t.project_id = p.project_id
    LEFT JOIN 
      attachments at ON t.Ticket_id = at.ticket_id
  `;

  const query = ticketId
    ? `${baseQuery} WHERE t.Ticket_id = ?`
    : baseQuery;

  db.query(query, ticketId ? [ticketId] : [], (err, results) => {
    if (err) {
      console.error('Error fetching tickets:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const ticketsMap = new Map();

    results.forEach(row => {
      const ticketId = row.Ticket_id;

      if (!ticketsMap.has(ticketId)) {
        ticketsMap.set(ticketId, {
          Ticket_id: row.Ticket_id,
          Tittle: row.Tittle,
          description: row.description,
          priority: row.priority,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          Due_date: row.Due_date,
          Tagging: row.Tagging,
          Ip_address: row.Ip_address,
          type: row.type,
          reporter_name: row.reporter_name,
          assignee_name: row.assignee_name,
          project_name: row.project_name,
          attachments: []
        });
      }

      if (row.attach_id) {
        ticketsMap.get(ticketId).attachments.push({
          attach_id: row.attach_id,
          file_name: row.file_name,
          file_path: row.file_path,
          file_type: row.file_type
        });
      }
    });

    res.status(200).json(Array.from(ticketsMap.values()));
  });
});


app.get('/user-tickets', (req, res) => {
  const userId = req.query.userId;  // Retrieve the user_id from query params

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = `
    SELECT 
      t.Ticket_id,
      t.Tittle,
      t.description,
      t.priority,
      t.status,
      t.created_at,
      t.updated_at,
      t.Due_date,
      t.Tagging,
      t.Ip_address,
      t.type,
      r.name AS reporter_name,
      a.name AS assignee_name,
      p.name AS project_name
    FROM 
      tickets t
    JOIN 
      user r ON t.reported_id = r.user_id
    JOIN 
      user a ON t.assigin_id = a.user_id
    JOIN 
      project_name p ON t.project_id = p.project_id
    WHERE 
      t.assigin_id= ?  -- Filter tickets where the user is the reporter
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user tickets:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If no tickets found, send a message
    if (results.length === 0) {
      return res.status(404).json({ message: 'No tickets found for this user' });
    }

    res.status(200).json(results);  // Return the tickets as JSON
  });
});

// API to update ticket fields (status, priority, due date)
// Update ticket status only
app.put('/update-ticket-status', async (req, res) => {
  const { ticketId, status } = req.body;

  if (!ticketId || !status) {
    return res.status(400).json({ message: 'Ticket ID and status are required' });
  }

  // Mapping common variations to ENUM values
  const statusMapping = {
    'open': 'In open',
    'in open': 'In open',
    'progress': 'In progress',
    'in progress': 'In progress',
    'resolved': 'resolved',
    'closed': 'closed'
  };

  const normalizedStatus = statusMapping[status.toLowerCase().trim()];

  if (!normalizedStatus) {
    return res.status(400).json({ message: `Invalid status value: ${status}` });
  }

  try {
    const query = 'UPDATE tickets SET status = ? WHERE Ticket_id = ?';
    const [results] = await db.promise().query(query, [normalizedStatus, ticketId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket status updated successfully' });
  } catch (err) {
    console.error('Error updating ticket status:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Fetch roles
app.get('/role', (req, res) => {
  const query = 'SELECT * FROM role';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).send('Error fetching roles');
    }
    res.json(results);
  });
});

// Create a new project
app.post('/create-project', (req, res) => {
  const {user_id, name, description, project_manager_id, teams } = req.body; // teams is an array of team IDs

  // Ensure all required fields are provided
  if (!name || !description || !project_manager_id || !teams || teams.length === 0) {
    return res.status(400).json({ message: 'All fields are required, and at least one team must be selected' });
  }

  // Insert new project into the project_name table
  const projectQuery = `
  INSERT INTO project_name (name, user_id, description, project_manager_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, NOW(), NOW())
`;

db.query(projectQuery, [name, user_id, description, project_manager_id], (err, results) => {


    const projectId = results.insertId; // Get the newly created project ID

    // Link the selected teams to the new project in the teams table
    const teamUpdates = teams.map(teamId => {
      return new Promise((resolve, reject) => {
        const updateTeamQuery = `
          UPDATE teams
          SET project_id = ?
          WHERE team_id = ?
        `;
        db.query(updateTeamQuery, [projectId, teamId], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });

    // Wait for all the team updates to finish
    Promise.all(teamUpdates)
      .then(() => {
        res.status(201).json({
          message: 'Project created successfully, and teams linked',
          projectId: projectId,
        });
      })
      .catch((err) => {
        console.error('Error linking teams to project:', err);
        res.status(500).json({ message: 'Error linking teams to the project' });
      });
  });
});

//verify signup
const generateToken = () => {
  return jwt.sign({ timestamp: Date.now() }, JWT_SECRET, { expiresIn: '1h' });
};

// User signup
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the role exists and fetch its ID
    const roleQuery = 'SELECT Role_id FROM role WHERE name = ?';
    db.query(roleQuery, [role], async (roleErr, roleResults) => {
      if (roleErr) return res.status(500).json({ message: 'Error fetching role' });

      if (roleResults.length === 0) return res.status(400).json({ message: 'Invalid role' });

      const roleId = roleResults[0].Role_id;
      const hashedPassword = await bcrypt.hash(password, 10);

      const userQuery = 'INSERT INTO user (name, email, password, Role_id, verified) VALUES (?, ?, ?, ?, true)';
      db.query(userQuery, [name, email, hashedPassword, roleId], (userErr) => {
        if (userErr) return res.status(500).json({ message: 'Error registering user' });

        res.status(201).json({ message: 'Signup successful!' });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/addRole', async (req, res) => {
  const { roleName } = req.body;

  if (!roleName) {
    return res.status(400).json({ message: 'Role name is required' });
  }

  try {
    // Check if the role already exists
    const checkQuery = 'SELECT Role_id FROM role WHERE name = ?';
    db.query(checkQuery, [roleName], (err, results) => {
      if (err) {
        console.error('Error checking role:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Role already exists' });
      }

      // Insert the new role
      const insertQuery = 'INSERT INTO role (name) VALUES (?)';
      db.query(insertQuery, [roleName], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error adding role:', insertErr);
          return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(201).json({ message: 'Role added successfully', roleId: insertResults.insertId });
      });
    });
  } catch (err) {
    console.error('Error adding role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//verfiy email
app.get('/verify-email', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Invalid verification link' });
  }

  // Verify the token using jwt.verify
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Token has expired. Please request a new verification email.' });
      }
      return res.status(400).json({ message: 'Invalid token' });
    }

    // If the token is valid, check the user in the database
    const query = 'SELECT user_id FROM user WHERE verification_token = ? AND verified = false';
    db.query(query, [token], (err, results) => {
      if (err) return res.status(500).json({ message: 'Internal server error' });

      if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

      const userId = results[0].user_id;
      const updateQuery = 'UPDATE user SET verified = true, verification_token = NULL WHERE user_id = ?';
      db.query(updateQuery, [userId], (updateErr) => {
        if (updateErr) return res.status(500).json({ message: 'Internal server error' });

        res.status(200).json({ message: 'Email verified successfully!' });
      });
    });
  });
});

//resend verficaTION
app.post('/resend-verification', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if the user exists and is not verified
  const query = 'SELECT user_id, verified FROM user WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    if (user.verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate a new verification token
    const newToken = generateToken();

    // Update the token in the database
    const updateQuery = 'UPDATE user SET verification_token = ? WHERE user_id = ?';
    db.query(updateQuery, [newToken, user.user_id], (updateErr) => {
      if (updateErr) {
        console.error('Error updating token:', updateErr);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // Resend the verification email
      sendVerificationEmail(email, newToken);
      res.status(200).json({ message: 'Verification email sent successfully. Please check your inbox.' });
    });
  });
});


// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const query = `SELECT user.*, role.role_id, role.name AS role_name 
                 FROM user 
                 JOIN role ON user.role_id = role.role_id 
                 WHERE email = ?`;

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role_id: user.role_id, role: user.role_name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id, // ✅ Now included
        role: user.role_name,  // ✅ Now included
      },
    });
  });
});





// Fetch projects
app.get('/project', (req, res) => {
  const query = 'SELECT project_id AS id, name FROM project_name';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).send('Error fetching projects');
    }
    res.json(results);
  });
});
//createticket
app.post('/create-ticket', (req, res) => {
  console.log('Request Body:', req.body);

  const {
    title,
    description,
    priority,
    status,
    project_id,
    reported_id,
    assign_id,
    due_date,
    tagging,
    ip_address,
    type,
    comment,
  } = req.body;

  console.log('Received data:', req.body);

  // Convert assign_id and reported_id to integers
  const assignIdValue = parseInt(assign_id, 10);
  const reportedIdValue = parseInt(reported_id, 10);

  if (isNaN(assignIdValue) || assignIdValue <= 0) {
    return res.status(400).json({ message: 'Please select a valid user for assignment.' });
  }

  if (isNaN(reportedIdValue) || reportedIdValue <= 0) {
    return res.status(400).json({ message: 'Invalid reported_id.' });
  }

  // Validate required fields
  if (!title || !description || !priority || !status || !project_id || !due_date || !type) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Insert data into the tickets table
  const query = `
    INSERT INTO tickets (
      Tittle, description, priority, status, project_id, reported_id, 
      assigin_id, Due_date, Tagging, Ip_address, type
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [title, description, priority, status, project_id, reportedIdValue, assignIdValue, due_date, tagging, ip_address, type],
    (err, results) => {
      if (err) {
        console.error('Error creating ticket:', err);
        return res.status(500).json({ message: 'Internal server error.' });
      }

      const Ticketid = results.insertId;

      // If comment is not empty, insert into comments table
      if (comment && comment.trim() !== '') {
        const commentQuery = `INSERT INTO comments(ticket_id, user_id, comment) VALUES (?, ?, ?)`;

        db.query(commentQuery, [Ticketid, reportedIdValue, comment], (err) => {
          if (err) {
            console.error('Error inserting comment:', err);
            return res.status(500).json({ message: 'Internal server error while adding comment.' });
          }
          res.status(201).json({
            message: 'Ticket and comment created successfully.',
            ticketId: Ticketid,
          });
        });
      } else {
        res.status(201).json({
          message: 'Ticket created successfully.',
          ticketId: Ticketid,
        });
      }
    }
  );
});

//adminProjectTicket
app.get('/ProjectTicket', (req, res) => {
  const projectId = req.query.id; // Retrieve the project_id from the query string
  console.log("Received projectId:", projectId); // Debugging step
  
  // If project_id is not provided, send a 400 Bad Request error
  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required' });
  }

  const query = `
    SELECT t.Ticket_id
    FROM tickets t
    JOIN project_name p ON p.project_id = t.project_id
    WHERE p.project_id = ?;
  `;

  // Run the query with the provided projectId
  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching details:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});

//adminProject
app.get('/project&ticket', (req, res) => {
  const query = `
    SELECT 
    p.created_at,
    u.name AS project_manager_name,  -- Added project manager's name
    p.project_manager_id,
    p.name AS project_name,
    p.Project_Id AS project_id,
    project_summary.total_tickets,
    project_summary.open_tickets_high,
    project_summary.open_tickets_medium,
    project_summary.open_tickets_low,
    project_summary.in_progress_tickets_high,
    project_summary.in_progress_tickets_medium,
    project_summary.in_progress_tickets_low,
    project_summary.resolved_tickets_high,
    project_summary.resolved_tickets_medium,
    project_summary.resolved_tickets_low,
    project_summary.closed_tickets_high,
    project_summary.closed_tickets_medium,
    project_summary.closed_tickets_low
FROM 
    project_name p
LEFT JOIN 
    user u ON p.project_manager_id = u.user_id  -- Join with user table to get project manager's name
LEFT JOIN 
    (
        SELECT 
            p.project_id,
            COUNT(t.ticket_id) AS total_tickets,
            -- Open Tickets
            SUM(CASE WHEN t.status = 'In open' AND t.priority = 'high' THEN 1 ELSE 0 END) AS open_tickets_high,
            SUM(CASE WHEN t.status = 'In open' AND t.priority = 'medium' THEN 1 ELSE 0 END) AS open_tickets_medium,
            SUM(CASE WHEN t.status = 'In open' AND t.priority = 'low' THEN 1 ELSE 0 END) AS open_tickets_low,
            -- In Progress Tickets
            SUM(CASE WHEN t.status = 'In progress' AND t.priority = 'high' THEN 1 ELSE 0 END) AS in_progress_tickets_high,
            SUM(CASE WHEN t.status = 'In progress' AND t.priority = 'medium' THEN 1 ELSE 0 END) AS in_progress_tickets_medium,
            SUM(CASE WHEN t.status = 'In progress' AND t.priority = 'low' THEN 1 ELSE 0 END) AS in_progress_tickets_low,
            -- Resolved Tickets
            SUM(CASE WHEN t.status = 'Resolved' AND t.priority = 'high' THEN 1 ELSE 0 END) AS resolved_tickets_high,
            SUM(CASE WHEN t.status = 'Resolved' AND t.priority = 'medium' THEN 1 ELSE 0 END) AS resolved_tickets_medium,
            SUM(CASE WHEN t.status = 'Resolved' AND t.priority = 'low' THEN 1 ELSE 0 END) AS resolved_tickets_low,
            -- Closed Tickets
            SUM(CASE WHEN t.status = 'Closed' AND t.priority = 'high' THEN 1 ELSE 0 END) AS closed_tickets_high,
            SUM(CASE WHEN t.status = 'Closed' AND t.priority = 'medium' THEN 1 ELSE 0 END) AS closed_tickets_medium,
            SUM(CASE WHEN t.status = 'Closed' AND t.priority = 'low' THEN 1 ELSE 0 END) AS closed_tickets_low
        FROM 
            project_name p
        LEFT JOIN 
            tickets t
        ON 
            p.project_id = t.project_id
        GROUP BY 
            p.project_id
    ) AS project_summary
ON 
    p.project_id = project_summary.project_id;
`
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching details:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});


app.get('/piechart', (req, res) => {
  const query = `
    SELECT 
      status,
      ROUND(COUNT(*) * 100.0 / 
        (SELECT COUNT(*) FROM tickets 
         WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
         AND YEAR(created_at) = YEAR(CURRENT_DATE())
        ), 2) AS percentage
    FROM tickets
    WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    GROUP BY status;
  `;

  const monthQuery = `SELECT DATE_FORMAT(CURRENT_DATE(), '%M %Y') AS month`;
   // Fetch the current month name

  db.query(monthQuery, (err, monthResult) => {
    if (err) {
      console.error('Error fetching month:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching details:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No data found for the current month.' });
      }

      const month = monthResult[0]?.month || 'Unknown Month'; // Get the month name

      res.json({ month, data: results });
    });
  });
});
//project Form
app.get("/team",(req,res)=>{
  const query =`SELECT team_id AS id, name FROM teams
 `
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching ProjectForm detail');
    }
    res.json(result);
  });
})
/////////////////////////////////
app.post('/Comment', (req, res) => {
  const { comment, Ticket_id, user_id } = req.body;
  console.log(comment,Ticket_id,user_id);
  

  if (!comment || !Ticket_id || !user_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const commentQuery = `INSERT INTO comments(ticket_id, user_id, comment) VALUES (?, ?, ?)`;

  db.query(commentQuery, [Ticket_id, user_id, comment], (err) => {
    if (err) {
      console.error('Error inserting comment:', err);
      return res.status(500).json({ message: 'Internal server error while adding comment.' });
    }

    res.status(201).json({
      message: 'Comment added successfully.',
      ticketId: Ticket_id,
    });
  });
});

app.get('/commentdisplay', (req, res) => {
  const { ticket_id } = req.query; // Extract ticket_id from query params

  let query = `SELECT c.*, u.name FROM comments c JOIN user u ON u.user_id = c.user_id`;
  const params = [];

  if (ticket_id) {
    query += ` WHERE ticket_id = ?`;
    params.push(ticket_id);
  }
  query += ` ORDER BY created_at DESC`
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).send('Error fetching comments');
    }
    res.json(results);
  });
});

// app.get('/ProjectUser',(req,res)=>{

//   const query = `SELECT `
// })
app.get("/user12/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from params
    const connection = await promisePool.getConnection();

    // Call stored procedure
    const [rows] = await connection.query("CALL GetUser(?)", [userId]);

    connection.release();
    
    res.json(rows[0]); // Stored procedures return results inside an array
  } catch (error) {
    console.error("Database Error: ", error);
    res.status(500).json({ error: "Database error" });
  }
});


app.get("/project-teams/:projectId", async (req, res) => {
  try {
      const { projectId } = req.params;

      const sql = `
         SELECT 
    p.project_id, 
    p.name AS project_name, 
    t.team_id, 
    t.name AS team_name, 
    t.team_lead_id, 
    lead_user.name AS team_lead_name,  -- Fetch the team lead's name
    u.user_id, 
    u.name AS user_name
FROM project_name p 
JOIN teams t ON t.project_id = p.project_id 
JOIN user u ON u.team_id = t.team_id 
JOIN user lead_user ON lead_user.user_id = t.team_lead_id  -- Join again to get team lead's name
WHERE p.project_id = ?;
`;

      const [rows] = await promisePool.execute(sql, [projectId]);

      if (!Array.isArray(rows) || rows.length === 0) {
          return res.status(404).json({ message: "No teams found for this project" });
      }

      // Group users by team
      const groupedData = rows.reduce((acc, row) => {
          const teamIndex = acc.findIndex(team => team.team_id === row.team_id);

          if (teamIndex === -1) {
              acc.push({
                  team_id: row.team_id,
                  team_name: row.team_name,
                  team_lead_id: row.team_lead_id,
                  users: [{ user_id: row.user_id, user_name: row.user_name }]
              });
          } else {
              acc[teamIndex].users.push({ user_id: row.user_id, user_name: row.user_name });
          }

          return acc;
      }, []);

      res.json(groupedData);
  } catch (error) {
      console.error("❌ Error fetching project teams:", error.message);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
