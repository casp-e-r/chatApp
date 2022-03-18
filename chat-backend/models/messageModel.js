import mongoose from 'mongoose'
// const mongoose = require("mongoose")

const messageModal=mongoose.Schema({
    content: {type:String,trim:true},
    sender: {type:mongoose.Schema.Types.ObjectId,ref:"user"},
    chat: {type:mongoose.Schema.Types.ObjectId,ref:"chat"},
},{
    timestamps:true,
})
const Message = mongoose.model('message',messageModal)
export default Message
// module.exports =message