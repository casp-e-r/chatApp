
import axios from 'axios';
import React, { useEffect} from 'react'
import { ChatState } from '../../ChatProvideContext';
import NewChat from './NewChat';
import SearchUser from './SearchUser';
import { MdGroupAdd, MdPersonSearch ,MdLogout, MdGroups} from "react-icons/md"
import { SiLivechat } from "react-icons/si"
import { IoMdChatbubbles} from "react-icons/io"
import { motion } from 'framer-motion';



function SideBar() {
    const { user,fetching, chats,
            setChats,selectedChat,setSelectedChat,searchButton,
            setSearchButton,setModal,setGroupButton} = ChatState();
    

    const fetchChats = async () => {
       
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get("/chat", config);
          setChats(data);
        } catch (error) {
          console.log('failed to load chats',error);
        }
      };
      useEffect(() => {
        fetchChats();
      }, [fetching]);

      
  
    const logoutHandler=async ()=>{
      try{localStorage.removeItem("userInfo");
      window.location.reload();
    }
    catch{}
  } 

  const handleClick =  (chat) => {
    setSelectedChat(chat)
    setGroupButton(false)

  }


 
  
  

  
  
    return (
        <div className={`${selectedChat ? 'hidden':'flex' } w-full sm:p-5 md:p-7 bg-emerald-100/20  lg:p-10 sm:max-w-screen-md h-screen  md:flex  duration-700  `}>
            <motion.div  
            initial={{opacity:0}} animate={{opacity:1}}  transition={{duration:.5}}     
            className='w-full p-2 sm:p-3 relative bg-gradient-to-r from-green-400/50 to-lime-400/50 sm:rounded-lg backdrop-blur-lg backdrop-filter bg-clip-padding shadow-lg'>   
              <SearchUser/>
              <div className='py-2.5 my-3 pl-5 bg-slate-300/10 rounded-xl' onClick={()=>searchButton && setSearchButton(false)}>
                <motion.h1 className=' flex gap-3'  transition={{duration: .3 ,delay:.6}} initial={{opacity:0}} animate={{opacity:1}}  ><SiLivechat  size={33} className='text-green-600/70 font-sans '/> HiBye</motion.h1> 
              </div>
              <div onClick={()=>searchButton && setSearchButton(false)} className='rounded-lg grid  md:px-4 lg:px-6  py-2 bg-green-50 backdrop-brightness-75 backdrop-blur-lg backdrop-filter bg-clip-padding shadow-lg'>

                <div className="rounded-lg flex flex-grow mr-auto w-full px-5 lg:px-10 py-4 items-center ">
                  <img src={user.picture} alt={''} className='w-14 sm:w-16 lg:w-20 border-2 border-green-900/80 rounded-full'/>
                  <div>
                    <h1 className='pl-6 text-lg font-medium '>{user.name} </h1>
                    <button  className='text-green-900 border mt-1 group-hover:text-white rounded-2xl duration-150 ease-in transition-all hover:text-red-700 hover:border hover:border-red-600 border-green-500/5 ml-6 hover:bg-gradient-to-r hover:from-green-400/50 hover:to-lime-400/50 text-sm flex items-center  px-1.5' onClick={logoutHandler}>Logout     
                    <MdLogout size={16}  className='ml-2 '/> </button> 
                  </div>
                </div>
                <div className='grid grid-flow-col gap-4 py-2  px-10  '>
                  <div className='flex group justify-center cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-green-400/50 hover:to-lime-400/50 w-3/4' onClick={()=>setSearchButton(true)}>
                    <MdPersonSearch size={20} style={{ height: '33px', width: '35px' }}  className='h-6   text-green-900'/> 
                  </div>
                  <div className='flex group justify-center cursor-pointer hover:bg-gradient-to-r hover:from-green-400/50 hover:to-lime-400/50 rounded-lg w-3/4' onClick={()=>setModal(true)}>
                    <MdGroupAdd size={20} style={{ height: '35px', width: '35px' }}   className=' h-6 0 text-green-900  '/> 
                  </div>
                </div>
              </div>

              <NewChat/>
            
              <div onClick={()=>searchButton && setSearchButton(false)} className="px-3 sm:px-7 pt-10 overflow-scroll no-scrollbar h-[63%]">
               {chats.length>0 && <h1 className='flex items-center text-justify font-light bg-white/40 w-fit px-2 rounded-lg'>Chats <IoMdChatbubbles className='scale-105 text-green-900/80 ml-0.5 mt-1'/></h1>}
               
                {chats.map(chat =>
                <li onClick={() => handleClick(chat)} 
                className={`p-4 cursor-pointer hover:bg-green-400/30 my-2 items-center duration-1500 ease-in transition-all list-none backdrop-blur-lg backdrop-filter border border-white/5  bg-clip-padding shadow-lg rounded-xl bg-[#f0fdf4]/80 flex ${selectedChat && (selectedChat._id === chat._id ? 'bg-green-500/30   ' : 'bg-[#f0fdf4]/80')}`}>
                  {chat.isGroupChat ? <MdGroups size={32} className={`rounded-full p-1  mr-2  text-green-400 bg-white/50`}/> :
                  (chat.users.map(u=>{if(u.email!==user.email) return <img src={u.picture} alt={u.name} className='w-8 rounded-full mr-2'/>})) }
                  <div>
                  <h1 className=''>{chat.isGroupChat ? chat.chatName : (chat.users.map(u=>{if(u.email!==user.email) return u.name}))}</h1>
                  {chat.latestMessage &&<div className='ml-auto mr-10 font-extralight text-xs flex gap-1'>
                    <p className=' font-light'>{chat.isGroupChat ? chat.latestMessage.sender.name+' :' : chat.latestMessage.sender.email===user.email ? 'You :' : ''} </p>
                     <p> {chat.latestMessage.content.slice(0,10)}</p>
                  </div>}
                  </div>
                  
                    
                </li>
                )}     
              </div>
            </motion.div>
        </div>
    )
}

export default SideBar
