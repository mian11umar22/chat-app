const express = require("express");
const app = express();
const connectDb = require("./db.js");
const dotenv = require("dotenv");
const cors = require("cors");
const AuthRoute = require("./Routes/AuthRoute");
const http = require("http");
const authMiddleware = require("./Middleware/authMiddleware");
const ChatRoutes = require("./Routes/ChatRoutes.js")
const MessageRoutes = require("./Routes/MessageRoute.js")
const socketHandler = require("./sockets/socketHandler.js")
const server = http.createServer(app);
const { Server } = require("socket.io");
dotenv.config();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

socketHandler(io)
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/chat", ChatRoutes);
app.use("/api/message", MessageRoutes)


// Protected route example
app.get("/api/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Protected route accessed",
        user: req.user
    });
});

// Connect Database
connectDb();

// Start Server
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`The App is listening on port ${port}`);
});
