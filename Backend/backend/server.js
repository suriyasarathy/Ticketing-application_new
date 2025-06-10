const express = require("express")
const bodyParser =require("body-parser")
const cors =require("cors")
const app =express();
  const path = require("path")
const Routes =require('./routes/router')
const sev =require("../backend/sev")
const http =require("http")
const {Server} =require("socket.io")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ticketing_system',
});

// const { encryptGCM, decryptGCM } = require('../backend/middleware/EncrytionAndDecryption');

const { GmailProcess }=require('./controllers/gmailTickets/GmailController')

const { socketHandler } = require("./controllers/CommentSection/socketHandler"); // Import socket logic


const server =http.createServer(app);
const sessionStore = new MySQLStore({expiration: 3600000, // 1 hour in milliseconds
  clearExpired: true,  // ✅ enables automatic cleanup
  checkExpirationInterval: 900000,}, db); // Create a session store
app.use(session({
  key: 'session_id', // cookie name
  secret: 'Ebramha_Ticketing_system',
  store: sessionStore, // Use MySQL session store
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge:  3600 * 1000, // 1 hour
    httpOnly: true,
    secure: false, // set true if using HTTPS
    sameSite: 'lax'
  }
}));

const { initSocket, getIO } = require('../backend/config/socket'); // Make sure getIO is available too

initSocket(server); // ✅ Correct way

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3001", // your frontend's origin
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser()); // required to read cookies

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use('/',Routes);
// console.log(GmailProcess()) 
// socketHandler(io);





// app.get("/",(req,res)=>{
//   const result =GmailProcess();
//   console.log(result);
  
//   res.send(result)
// })
// // Run the script when index.js is executed

// app.use('/',sev);
const port =3000
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
