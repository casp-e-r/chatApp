import React, { useState } from 'react'
import { ChatState } from '../../ChatProvideContext'
import axios from 'axios'
import { MdClose, MdMessage } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';


function SearchUser() {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const {searchButton,setSearchButton,user,setSelectedChat,chats,setChats}=ChatState()


    
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
        //   console.log(data);

          setSearchResults(data);
        } catch (error) { }
      }
      const accessChat = async (userId) => {
        console.log(userId);
    
        try {

          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(`/chat`, { userId }, config);
          if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
          setSelectedChat(data);

          setSearchButton(false)
        } catch (error) {
          console.log('error fetching chat');
        }
      };
    return (
    <div className={`top-0 left-0 shadow-[24px_1px_15px_-15px_rgba(163,230,53,0.5)] rounded-lg absolute p-5 z-40 bg-gradient-to-r from-emerald-300 to-green-300  h-full ease-in-out duration-300  ${searchButton ? "translate-x-0 " : "-translate-x-full opacity-0 "}  `}>
        <div className="">
            <div>
                <button onClick={() =>setSearchButton(false)} className="px-1.5 py-1 bg-green-400/40 rounded-xl hover:bg-green-400/80 mb-2"><MdClose className='text-green-900'/></button>
            </div>
            <div className='flex'>
                <input type='text' placeholder='Search User' value={search} onChange={(e) => handleSearch(e.target.value)}
                className='outline-none py-1 px-3 rounded-3xl placeholder:text-green-500 '/>    
            </div>
            {searchResults.length>0  &&
            <p className=' text-sm mt-2 font-light'>
                search results
            </p >}
            {searchResults && <div className=' pt-4 pb-6 px-2'>
              <AnimatePresence>
                {searchResults.map(u=>
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key={u._id}
                 className='flex w-full items-center my-1.5 p-1.5 rounded-lg bg-green-400/40 hover:bg-green-400/70 duration-150 '>
                  <img src={u.picture} alt={u.name} className='w-11 items-center border mr-3 border-green-900 rounded-full'/>    
                    <div>
                        <p >{u.name}</p>
                        <label className='text-xs font-light'>{u.email}</label>
                    </div>
                    <MdMessage onClick={() => accessChat(u._id)} size={30} className=' cursor-pointer md:scale-95 text-green-900 ml-auto ' />
                </motion.div>
                )}
                </AnimatePresence>

                </div>}
        </div>        
    </div>
    )
}

export default SearchUser
