
// importing 

import express from 'express'
import mongoose from 'mongoose'
import { notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import cors from 'cors';
import { createServer} from 'http';
import { Server } from 'socket.io';


import 'dotenv/config'


// const express = require("express")
// const mongoose = require("mongoose");
// const userRoutes = require("./routes/userRoutes");

//app configuration

const app=express();
app.use(express.json());
const port =process.env.PORT || 9000





//db config
mongoose.connect('mongodb+srv://aswin:ynwa20@cluster0.m74b3.mongodb.net/chatDatabase?retryWrites=true&w=majority').then(console.log('DB connection established'))


//????

//api routes

app.get('/',(req,res)=>{res.status(200).send('hello world')})
app.post('/',(req,res)=>{
    const user=req.body
    console.log(user)
})
app.use('/user',userRoutes)
app.use('/chat',chatRoutes)
app.use('/message',messageRoutes)




//middleware
app.use(notFound);


//listners
const httpServer = createServer(app);
// const server = http.Server(app)
httpServer.listen(port, ()=>console.log(`listening on localhost :${port}`))

const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000' } });


// io.on("connection",(socket)=>{
//     console.log("connected to socket.io");
//     socket.on("setup", (userData) => {
//         socket.join(userData._id);
//         // console.log(userData._id);
//         socket.emit("connected");
//       });
//     socket.on("join chat", (room) => {
//         socket.join(room);
//         // console.log("User Joined Room: " + room);
//       });
//     socket.on("new message", (newMessageRecieved) => {
//         var chat = newMessageRecieved.chat;
    
//         if (!chat.users) return console.log("chat.users not defined");
    
//         chat.users.forEach((user) => {
//           if (user._id === newMessageRecieved.sender._id) return;
    
//           socket.in(user._id).emit("message recieved", newMessageRecieved);
//         });
//       })
//     socket.on("typing", (room) => socket.in(room).emit("typing"));
//     socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//     socket.off("setup", () => {
//         console.log("USER DISCONNECTED");
//         socket.leave(userData._id);
//       });
// })
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});