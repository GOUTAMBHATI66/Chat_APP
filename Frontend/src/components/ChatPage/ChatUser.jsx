import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  getSelectedUser,
  getSender,
  unreadMessages,
} from "../HelperFunction/chatLogics";

const ChatUser = ({ userOrGroupInfo }) => {
  const { user, selectedUser, setSelectedUser } = useContext(ChatContext);

  // console.log("userOrGroupInfo -> ", userOrGroupInfo);

  // console.log("user -> ", user);

  // console.log("selectedUser -> ", selectedUser);

  // console.log("ans -> ", userOrGroupInfo === selectedUser);

  // function showChats() {
  //   // setCurrChatUser(userInfo._id);
  //   if (!userOrGroupInfo.isGroupChat) {
  //     setSelectedUser(getSelectedUser(user, userOrGroupInfo.users));
  //   } else {
  //     setSelectedUser(userOrGroupInfo);
  //   }
  // }

  return (
    <div
      onClick={() => {
        setSelectedUser(userOrGroupInfo);
      }}
      className={` ${
        userOrGroupInfo === selectedUser ? "ybg-blue-600 ytext-white" : null
        // !userOrGroupInfo.isGroupChat
        //   ? selectedUser?.name === getSender(user, userOrGroupInfo.users)?.name
        //     ? "md:ybg-blue-600 ytext-white"
        //     : null
        //   : selectedUser?.chatName === userOrGroupInfo?.chatName
        //   ? "md:ybg-blue-600 ytext-white"
        //   : null
      }
        yw-full yh-12 yrounded-md ypx-2 ypy-1 ybg-blue-400 hover:ybg-blue-600 hover:ytext-white ycursor-pointer yflex yitems-center yjustify-between  ygap-2 `}
    >
      <div className=" yw-full yh-full yflex ygap-3 yitems-center">
        <div className=" yh-10 yw-11 yoverflow-hidden">
          <img
            src={
              !userOrGroupInfo.isGroupChat
                ? getSender(user, userOrGroupInfo.users)?.pic
                : userOrGroupInfo.groupAdmin?.pic
            }
            className=" yw-full yh-full yobject-cover yrounded-full"
          />
        </div>

        <div className=" yflex yflex-col yw-full">
          {/* for user or group name */}
          <p className=" yfont-semibold ytext-lg yline-clamp-1">
            {!userOrGroupInfo.isGroupChat
              ? getSender(user, userOrGroupInfo.users)?.name
              : userOrGroupInfo.chatName}
          </p>

          {/* for latest message */}
          <div className="yflex ygap-1 ytext-sm">
            <span className=" yfont-bold ">
              {userOrGroupInfo.latestMessage?.sender?._id === user?._id
                ? "You"
                : userOrGroupInfo.latestMessage?.sender?.name}
              :
            </span>
            <span>{userOrGroupInfo.latestMessage?.content}</span>
          </div>
        </div>
      </div>

      <div className=" yflex yitems-center yjustify-center ypy-1 ypx-1.5 yrounded-full ytext-xs ybg-[#2525b1] ytext-white yh-[50%]">
        2
      </div>
    </div>
  );
};

export default ChatUser;
