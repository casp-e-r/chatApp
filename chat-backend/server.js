

import express from 'express'
import mongoose from 'mongoose'
import { notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import * as path from 'path'

import { createServer} from 'http';
import { Server } from 'socket.io';


import 'dotenv/config'



const app=express();
app.use(express.json());
const port =process.env.PORT || 9000






mongoose.connect('mongodb+srv://aswin:ynwa20@cluster0.m74b3.mongodb.net/chatDatabase?retryWrites=true&w=majority').then(console.log('DB connection established'))
mongoose.set('strictQuery', false);


// app.get('/',(req,res)=>{res.status(200).send('hello world')})
app.post('/',(req,res)=>{
    const user=req.body
    console.log(user)
})
app.use('/user',userRoutes)
app.use('/chat',chatRoutes)
app.use('/message',messageRoutes)







const httpServer = createServer(app);

httpServer.listen(port, ()=>console.log(`listening on localhost :${port}`))

const __dirname1 = path.resolve();
console.log(process.env.NODE_ENV);
console.log(process.env.JWT_SECRET);
console.log(process.env.PORT);
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1,"/chat-react/build")))
  // app.use(express.static("../chat-react/build"))
  console.log('h');
  app.get('*',(req,res)=> {
    res.sendFile(path.resolve(__dirname1, 'chat-react', 'build', 'index.html'))
  })
  app.get('/', (req, res) => res.send('ho!'))

}else{
  app.get("/",(req,res)=>{
    console.log('jj');
    res.send("API running")
  })
}
app.use(notFound);

const io = new Server(httpServer, { cors: { origin: 'http://localhost:3000' } });



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
