
import React from 'react'

import { ChatState } from '../../ChatProvideContext';
import { motion } from "framer-motion";

function Message({message,p}) {
  const { selectedChat,user } = ChatState();
  return (
    <div className="grid w-full backdrop-opacity-60 ">
      {message.sender._id===user._id ?
      <div className="sm:w-fit gap-0   lg:mr-1 flex align-bottom group ml-auto">
        <p className=" text-xs text-green-900 w-24 font-thin mt-auto  rounded-full none opacity-0  group-hover:visible group-hover:opacity-100 translate-x-12 group-hover:translate-x-9 duration-300 ease-out ">{message.createdAt.slice(0,10)}</p>
        <div className={`bg-gradient-to-l  from-green-400/40 to-lime-500/40 w-fit flex-grow  rounded-tr-xl rounded-bl-xl rounded-tl-xl py-2 px-5 mb-1 `}>{message.content }</div>
      </div>
        :
        
      <div className="sm:w-fit  lg:mr-10 flex align-bottom group">
        {p && selectedChat.isGroupChat && <img src={message.sender.picture} alt={''} className="w-6  h-6 mt-auto mb-1.5 group rounded-full "/>}
        <div className={`bg-gradient-to-l from-gray-400/60 to-gray-300/60 w-fit  rounded-tr-xl rounded-br-xl rounded-tl-xl py-2 px-5 mb-1 ${ selectedChat.isGroupChat && (p  ? 'ml-0 ' : 'ml-6')}`}>{message.content }</div>
        <p className=" text-xs w-24 text-green-900 font-thin mt-auto  rounded-full none opacity-0  group-hover:visible group-hover:opacity-100 -translate-x-3 group-hover:translate-x-1 duration-300 ease-out ">{message.createdAt.slice(0,10)}</p>
      </div>}  
    </div>);
}

export default Message;
