
import './App.css';
import {BrowserRouter } from "react-router-dom";
import View from './View/View';

import Auth from './Components/Auth';
import { useEffect, useState } from 'react';
import ChatProvider from './ChatProvideContext';



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
      <link rel="shortcut icon" href="/s.png" />
      <BrowserRouter>
      <ChatProvider>
      {state ? <View/> : <Auth/>}
    

      </ChatProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
