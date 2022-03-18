import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [fetching, setFetching] = useState(false)
  const [groupButton, setGroupButton] = useState(false)
  const [searchButton, setSearchButton] = useState(false)
  const [modal, setModal] = useState(false)
  const [authState, setAuthState] = useState(0)
  



  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    
  
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        fetching,
        setFetching,
        groupButton,
        setGroupButton,searchButton, setSearchButton,modal, setModal,
        authState,setAuthState
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;