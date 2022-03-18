import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Message from './Message'
import { ChatState } from '../../ChatProvideContext';
import UpdateGroup from './UpdateGroup';
import io from "socket.io-client";
import { MdArrowBackIosNew, MdGroups, MdSegment, MdSend } from 'react-icons/md';
import { isLastMessage, isSameSender } from '../../Util';
import 'react-responsive-modal/styles.css';


// const ENDPOINT="http://localhost:9000"
const ENDPOINT='https://hibye-mern.herokuapp.com/'
var socket,selectedChatCompare

function Chat() {
    const { selectedChat,user,setNotification,notification,
      setSelectedChat,setGroupButton ,fetching,setFetching} = ChatState();
    const [messages,setMessages]=useState([])
    const [newMessage,setNewMessage]=useState('')
    const [loading,setLoading]=useState(false)
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesRef = useRef(null)

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          setLoading(true);
          const { data } = await axios.get(`/message/${selectedChat._id}`,
            config
          );
          setMessages(data);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        } catch (error) {
          console.log('failed to load messages',error);
        }
      };
      useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
 
      }, []);

    
     
      const sendMessage = async (e) => {
          e.preventDefault();
          socket.emit("stop typing", selectedChat._id);
        // console.log(newMessage);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post('/message',
              {
                content: newMessage,
                chatId: selectedChat,
              },
              config
            );
            socket.emit("new message", data);
              
            setMessages([...messages, data]);
            setFetching(!fetching);

          } catch (error) {
            console.log('failed to send message',error);
        }
      };
      

      useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
      }, [selectedChat]);
      
      useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
          if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) 
          {
            if (!notification.includes(newMessageRecieved)) {
              
              setNotification([newMessageRecieved, ...notification]);
              setFetching(!fetching);

            }
          } 
          else {
            setMessages([...messages, newMessageRecieved]);
            setFetching(!fetching);

          }
        });
      }); 
    
      

      useEffect(() => {
        messagesRef.current?.scrollIntoView({
          behavior: "smooth"
        });
      });

      const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 2000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
    }
      
      // console.log(messages);

    return (
    <div  className={` sm:p-5 md:p-7 lg:p-10 h-screen overflow-x-hidden bg-emerald-100/20 no-scrollbar z-30 md:flex-grow w-full max-w-screen-2xl  md:flex ${selectedChat?"flex":"none"} `}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}}  transition={{duration:.6}} className="sm:rounded-lg w-full z-40 p-3 relative flex flex-col bg-emerald-100/10 backdrop-blur-lg backdrop-filter bg-clip-padding shadow-lg bg-opacity-30 h-full">
            {selectedChat.isGroupChat && <UpdateGroup/>}
            <div className=" rounded-lg px-1  md:px-10 py-5 bg-gradient-to-l from-green-400/30 to-lime-500/30 flex">
              <MdArrowBackIosNew onClick={()=>setSelectedChat()} size={30} className="text-green-900 block cursor-pointer p-1 mr-5 md:mr-0 md:hidden "/>
                <div className="flex items-center">
               
                {selectedChat.isGroupChat ? <MdGroups size={40} className={`rounded-full p-1  mr-2  bg-lime-400 text-white`}/> :
                  (selectedChat.users.map(u=>{if(u.email!==user.email) return <img src={u.picture} alt={u.name} className='w-10 rounded-full mr-2'/>})) }
                <h1 className='font-bold text-xl'>{selectedChat.isGroupChat ? selectedChat.chatName : (selectedChat.users.map(u=>{if(u.email!==user.email) return u.name}))}</h1>
                {/* {selectedChat.isGroupChat && <p className="text-xs flex px-2 pt-4 h-full ">{selectedChat.users.length} members</p>} */}
                </div>

                {selectedChat.isGroupChat &&
                <MdSegment onClick={()=>setGroupButton(true)} size={30} className="text-green-900 ml-auto mr-3 md:mr-0   cursor-pointer hover:bg-green-900/10 rounded-lg  "/>
                }
            </div>
            {loading?<div className="flex-col px-3 flex-1 overflow-x-scroll no-scrollbar bg-tranparent ">
            <img src='https://c.tenor.com/XOp9mtgoAJEAAAAi/gif-loader.gif' alt='...' className='pt-48 m-auto'/></div>
            :
            <div onClick={() =>setGroupButton(false)} id="chatList" className="flex relative flex-col px-0.5 py-3 my-1 flex-1 overflow-x-scroll no-scrollbar align-text-bottom ">                
                {messages?.map((m,i)=>{
                  return <motion.div  initial={{opacity:0.7}} animate={{opacity: 1}}  transition={{duration:.4}}
                  className={`flex ${!isSameSender(messages, m, i, user._id) ||
                    !isLastMessage(messages, i, user._id) && 'mb-4'} `}>
                   <Message message={m} p={(isSameSender(messages, m, i, user._id) ||
                    isLastMessage(messages, i, user._id))}/>   
                   </motion.div>} 
                )}
                <div  ref={messagesRef} ></div>
            {isTyping ? <img src='https://monophy.com/media/THksdFc9bFRAQcIc13/monophy.gif' alt='Typing..' className="w-14 ml-2  absolute z-50 bottom-0"></img>:<div/>}
            </div>}
            <div onClick={() =>setGroupButton(false)} className="px-7 py-5 mt-2 bottom-10  rounded-lg  text-right">
                <form onSubmit={sendMessage} className="flex h-full" >
                  <div className="bg-gradient-to-r from-green-400/50 to-lime-400/50 p-1 rounded-2xl w-full mr-1 ">
                    <input type='text' value={newMessage}  onChange={typingHandler}  className='w-full h-full outline-none bg-white px-5  fex flex-grow rounded-2xl ' />
                  </div>
                    <button type='submit'  className='rounded-xl  border bg-[#4ade8080] py-2 px-3 '><MdSend className='text-black'/></button>
                </form>
            </div>
        </motion.div>
    </div>
    )
}

export default Chat