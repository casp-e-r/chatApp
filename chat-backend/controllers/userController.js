import asyncHandler from 'express-async-handler';
import User from '../models/userModels.js';
import {generateToken} from '../config/generateToken.js'

// const asyncHandler = require("express-async-handler");
// const User = require("../models/userModel");
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;
  
    if (!name || !email || !password) {
      res.status(400);
      throw new Error(`Please Enter all the Feilds${req.body}`);
      
    }
  
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    const user = await User.create({
      name,
      email,
      password,
      picture:`https://avatars.dicebear.com/4.5/api/initials/${email}.svg?backgroundColors[]=lightGreen&backgroundColors[]=lime&backgroundColors[]=green&fontSize=45&bold=1`,
    });
    console.log(user);
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        picture: user.picture,
        token: generateToken(user._id),
      });
     
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  });
  const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        picture: user.picture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });
  export  {registerUser,authUser,allUsers};