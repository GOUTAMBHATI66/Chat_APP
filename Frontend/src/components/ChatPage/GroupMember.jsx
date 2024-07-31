import React, { useContext } from "react";
import { X } from "lucide-react";
import { ChatContext } from "../Context/ChatProvider";
import { GoDotFill } from "react-icons/go";

const GroupMember = ({ member, removeUser, cancelBtn }) => {
  const { user, selectedUser } = useContext(ChatContext);

  console.log("selectedUser - ", selectedUser);

  // console.log("cancelBtn -> ", cancelBtn);
  return (
    <div className=" yrelative ytext-white ybg-blue-600 yrounded-full ypx-3 ypy-1">
      {member._id === user._id ? "You" : member?.name}

      {member._id !== user._id && cancelBtn ? (
        <X
          size={12}
          onClick={removeUser}
          className=" yabsolute ytop-0 yright-0 yp-0.5 yrounded-full ybg-red-500 ytext-white ycursor-pointer"
        />
      ) : null}

      {member._id === selectedUser?.groupAdmin?._id ? (
        <GoDotFill
          size={24}
          color="darkgreen"
          className=" yabsolute ytop-3.5 yright-0"
        />
      ) : null}
    </div>
  );
};

export default GroupMember;
