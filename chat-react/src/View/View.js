
import React from 'react'
import { ChatState } from '../ChatProvideContext.js'
import Chat from '../Components/ChatScreen/Chat.js'
import SideBar from '../Components/SideBar/SideBar.js'
import StarterPage from '../Components/StarterPage.js'
import './View.js'

function View() {

    const {selectedChat}=ChatState()
    
    
  
    
    return (
        
        <div className="flex flex-row  bg-emerald-100/10  ">

            <SideBar/>
            {selectedChat ? <Chat/>: <StarterPage/>}

            
        </div>
    )
}

export default View
