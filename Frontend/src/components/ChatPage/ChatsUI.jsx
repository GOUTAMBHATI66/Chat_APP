import React, { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { isSameSenderMargin, isSameUser } from "../HelperFunction/chatLogics";

const ChatsUI = ({ allmessages }) => {
  const { user, selectedUser } = useContext(ChatContext);

  // console.log("allmessages -> ", allmessages);
  // console.log("selectedUser -> ", selectedUser);

  return (
    <>
      {allmessages.map((mess, i) => (
        <div
          key={i}
          className={` ${
            mess.sender?._id === user?._id
              ? "ybg-[#3698fa] ytext-white"
              : "ybg-[#ffffffca]"
          } yflex yflex-col yw-fit yp-1.5 yrounded-2xl yfont-semibold ytext-black/80 yml-${isSameSenderMargin(
            allmessages,
            mess,
            i,
            user?._id
          )}`}
        >
          {" "}
          {selectedUser?.isGroupChat &&
          mess.sender?._id !== user?._id &&
          isSameUser(allmessages, mess, i) ? (
            <span className=" ytext-xs ytext-black yfont-bold ycapitalize">
              {mess.sender?.name}
            </span>
          ) : null}
          {mess?.content}
        </div>
      ))}
    </>
  );
};

export default ChatsUI;
