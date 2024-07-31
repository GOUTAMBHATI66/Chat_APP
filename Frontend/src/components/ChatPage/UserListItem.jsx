import React, { useContext, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";

const UserListItem = ({ userInfo, handleFunction }) => {
  // const { user, selectedUser } = useContext(ChatContext);

  // console.log("userInfo -> ", userInfo);
  // console.log("selectedUser -> ", selectedUser);

  // function runAccessChats() {
  //   // console.log("from userListItem -> ", id, name);
  //   handleFunction(userInfo._id);
  // }

  return (
    <div
      onClick={handleFunction}
      className="yw-full yh-[50px] yflex yitems-center ygap-2 ypx-3 ypy-1 ytext-black yrounded-md ybg-gray-300 hover:ybg-gray-400 hover:yfont-semibold ycursor-pointer"
    >
      {/* user image */}
      <div className=" yw-10 yh-10 yoverflow-hidden yrounded-full">
        <img src={userInfo.pic} className=" yw-full yh-full yobject-cover" />
      </div>

      {/* user name and email */}
      <div className=" yflex yflex-col yitems-start">
        <p>{userInfo.name}</p>
        <p className=" ytext-sm">{userInfo.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
