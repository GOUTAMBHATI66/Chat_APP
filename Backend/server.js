const express = require("express");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const chats = require("./Data/data");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

// config the dotenv file and get the app function
const app = express();
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// connecting the DB
connectDB();

// this is allow to accecpt the data from frontend
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// this is landing route
// app.get("/", (req, res) => {
//   res.send("hello");
// });

// api's
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// --------------------- Deployment --------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/Frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "Frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Backend is running.");
  });
}

// --------------------- Deployment --------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, console.log(`Server ${PORT} started`));

// installing and initializing the socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  // console.log("Socket.io is connected.");

  socket.on("setUp", (userData) => {
    socket.join(userData?._id);
    // console.log(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log(`User Joined Room : ${room}`);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined.");

    chat.users.forEach((user) => {
      // returning nothing for one who send the message
      if (user._id == newMessageRecieved.sender._id) return;

      // sending the message object to rest users
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});
