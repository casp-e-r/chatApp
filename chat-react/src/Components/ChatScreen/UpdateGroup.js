import axios from 'axios';
import React, { useState } from 'react'
import { MdClose, MdDone, MdEdit, MdGroupAdd, MdPersonAdd, MdPersonRemove } from 'react-icons/md';


import { ChatState } from '../../ChatProvideContext';
import {AnimatePresence, motion} from 'framer-motion';

function UpdateGroup() {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [edit,setEdit]=useState(false)
    const [add, setAdd] = useState(false)
    const { selectedChat, setSelectedChat,user,fetching,setFetching,groupButton,setGroupButton } = ChatState();
    
    const handleRename = async () => {
        if (!groupChatName) return;
        try {
         
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(`/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
          console.log(data._id);
          setSelectedChat(data);
          setFetching(!fetching);
        } catch (error) {
          console.log('error occured');  
        }
        setGroupChatName("");
      };

      const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/user?search=${search}`, config);
          console.log(data);
          setSearchResult(data);
        } catch (error) {
          setSearchResult()
          console.log('error occured');
        }
      }
      const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
          console.log('user already in ');
          return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
          console.log('admin can only add');
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(`/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
          setSelectedChat(data);
          setFetching(!fetching);
        } catch (error) {
         console.log('error occured');
        }
        setGroupChatName("");
      };

      const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
          console.log('only admins can remove');
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(`/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetching(!fetching);
        } catch (error) {
          console.log('error occured');
        }
        setGroupChatName("");
      }
      const handleDelete = async (user) => {
        if (selectedChat.groupAdmin._id !== user._id ) {
          console.log('only admins can remove');
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
         await axios.put(`/chat/delete`,
         {
          chatId: selectedChat._id,
         },config)
        setSelectedChat('')
        window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
      const handleClear = async () => {
        console.log(selectedChat._id,user._id);
        if (selectedChat.groupAdmin._id !== user._id ) {
          console.log('only admins can remove');
          return;
        }
        try {
          const config = {
            headers:{
              Authorization: `Bearer ${user.token}`,
            },
          };
         const data=await axios.delete(`/message/${selectedChat._id} `,config)
         
         setFetching(!fetching);
          window.location.reload();
         
        } catch (error) {
          console.log(error);
        }
      }
      const handleExit = async (user) => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(`/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user._id,
            },
            config
          );
          window.location.reload();
        } catch (error) {
          console.log(error);
        }

      }
      
    
    return (
        <div className={`top-0 right-0 rounded-lg shadow-[-24px_1px_15px_-15px_rgba(163,230,53,0.5)] absolute p-5 z-40 bg-gradient-to-l from-emerald-300 to-green-300 h-full ease-in-out duration-300  ${groupButton ? "translate-x-0 " : "translate-x-full opacity-0 "}  `}>
            <div className=" h-full w-80 ">
                <button onClick={() =>{setGroupButton(false);setEdit(false);setAdd(false)}} className="px-1.5 py-1  bbg-green-400/40  rounded-xl hover:bg-green-400/80 mb-2"><MdClose className='text-green-900'/></button> 
                {edit 
                ?<motion.div transition={{ duration: 0.5 }} className=" relative flex flex-row py-2 px-3 items-center ">
                    <input type="text" placeholder="Edit group name" className=" h-7 bg-green-500/10 rounded relative outline-none placeholder:text-green-900/80" value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)} />
                    <MdDone className="absolute right-6 cursor-pointer hover:scale-125 rounded-full w-9 text-green-900/70 p-1 hover:bg-green-400/40 hover:text-green-900 font-bold" size={30} onClick={()=>{setEdit(false);handleRename()}}/>
                </motion.div>
                :<div className="flex py-2 px-4 bg-green-400/40 rounded-lg">
                  <h1 className=" text-lg px-3   cursor-default">{selectedChat.chatName}</h1>
                  <MdEdit className='ml-auto cursor-pointer w-9 text-green-900/70 p-1 hover:bg-green-400/40 hover:text-green-900 rounded-full' size={28} onClick={()=>setEdit(true)}/>
                </div>}
                
                {user.email === selectedChat.groupAdmin.email && 
                <div className=' px-4 my-4 group relative w-full '>
                  {add?<div className='w-full py-1 '>
                    <label className='text-sm font-extralight'>search Users</label>
                    <input type="text" className=" h-7 w-64 outline-none p-3 bg-green-500/10 rounded-3xl placeholder:text-green-900/80" placeholder="add users"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)} />                 
                  </div>:
                  <div className="flex py-1 w-full px-3 justify-center rounded-lg cursor-pointer items-center duration-300 bg-green-500/50 hover:bg-black/5" onClick={()=>setAdd(true)}>
                    Add members<MdGroupAdd size={22} className="ml-3" />
                  </div>}

                     <div className={` max-h-36 absolute hidden no-scrollbar no-scrollbar overflow-y-scroll w-full z-50 py-0.5 rounded-xl -translate-x-3 bg-green-400 ${searchResult.length>0 && add && ' group-hover:block group-focus:bloack'}`}>
                      {searchResult.map(u=>( 
                        <div className='py-1 flex px-3'>
                        <img src={u.picture} alt={u.name} className='w-10 p-1 items-center mr-3 rounded-full'/>    
                        <div>
                        <p className='' >{u.name}</p>
                        <p className='text-xs font-thin' >{u.email}</p>
                        </div>
                        <MdPersonAdd onClick={() => handleAddUser(u)} size={33} className='cursor-pointer duration-300 text-green-900/70 ml-auto hover:bg-green-400/40 hover:scale-105 hover:text-green-900 rounded-full p-1.5'/>
                      </div>
                      ))}
                    </div>
                

                </div> } 
                <div className=" px-3 py-4 w-full bg-green-400/40 rounded-2xl mt-10 no-scrollbar overflow-y-scroll h-[60%]  ">
                  <h1 className="py-2.5  font-light text-lg ">Group Members</h1>
                  <AnimatePresence>
                    {selectedChat.users.map(u=>(

                        <motion.div animate={{opacity: 1}} initial={{opacity:0}} exit={{opacity:0}}  key={u._id} className="flex bg-green-600/30 rounded-lg items-center my-0.5 px-1 flex-row py-2">
                            <img src={u.picture} alt={u.name} className='w-10 items-center mr-3 rounded-full'/>    
                            <div>
                              <p className='' >{u.name}</p>
                              <p className='text-xs font-thin' >{u.email}</p>
                            </div>
                            {u.email===selectedChat.groupAdmin.email &&  <p className='ml-auto  text-xs px-1 py-0.5 rounded-3xl border border-green-900 font-medium text-green-900'>Admin </p>}
                            {(user.email===selectedChat.groupAdmin.email) && (!(user.email===u.email) && !(u.email===selectedChat.groupAdmin.email)  &&
                            <MdPersonRemove onClick={() => handleRemove(u)} size={37} 
                            className='cursor-pointer text-red-900/70 ml-auto hover:scale-105 hover:text-red-900 rounded-full p-1.5'/>) }
                        </motion.div>   

                      ))}
                  </AnimatePresence>
                </div>
                  
                <div className='grid justify-center text-center my-5 text-sm  '>
                      {user.email === selectedChat.groupAdmin.email && <button onClick={() =>handleClear()} className='px-4 my-4 py-1 md:px-5 md:py-1.5 text-white  hover:bg-red-700 duration-300 hover:scale-105 bg-red-600 rounded-lg '>clear chat </button>}
                    <button onClick={() =>(user.email===selectedChat.groupAdmin.email) ? handleDelete(user) : handleExit(user)} 
                    className='px-4 py-1 md:px-5 md:py-1.5    bg-red-600 text-white hover:bg-red-700 duration-300 hover:scale-105 rounded-lg'>
                    {(user.email===selectedChat.groupAdmin.email) ? 'Delete Group' : 'Exit Group'}</button>  
                </div>
            </div>
        </div>
    )
}
export default UpdateGroup