import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  // for logged in user
  const [user, setUser] = useState("");

  const [selectedUser, setSelectedUser] = useState();
  // array for data of chat {chatName,isGroupChat,users,latestMessage,groupAdmin}
  const [arrOfChatUsers, setArrOfChatUsers] = useState([]);

  const [unreadMessagesCount, setUnreadMessageCount] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
      // console.log("user nahi hai");
    } else {
      navigate("/chats");
      // console.log("user hai");
      // return;
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedUser,
        setSelectedUser,
        arrOfChatUsers,
        setArrOfChatUsers,
        unreadMessagesCount,
        setUnreadMessageCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };
