
import './App.css';
import SideBar from './Components/SideBar/SideBar';
import {BrowserRouter ,Route, Redirect, Routes, useLocation, useNavigate} from "react-router-dom";
import View from './View/View';

import Auth from './Components/Auth';
import { useEffect, useState } from 'react';
import ChatProvider from './ChatProvideContext';
import Chat from './Components/ChatScreen/Chat';
import StarterPage from './Components/StarterPage';


function App() {
  
  const [state, setState] = useState(0)
  const user = JSON.parse(localStorage.getItem("userInfo"));
  
  
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) 
      setState(1)
    else
      setState(0)
    // Navigate("/chats");
  }, []);
  
  return (
    <div className="App h-screen no-scrollbar">
      <BrowserRouter>
      <ChatProvider>
      {state ? <View/> : <Auth/>}
    

      </ChatProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
