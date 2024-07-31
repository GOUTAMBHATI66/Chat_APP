import React from "react";
import Navbar from "./ChatPage/Navbar";
import AllUserSlide from "./ChatPage/AllUserSlide";
import MessageSlide from "./ChatPage/MessageSlide";

const ChatsPage = () => {
  return (
    <div className="ChatAppBG yw-full yh-full yoverflow-hidden ">
      <Navbar />

      <main className=" yflex ygap-4 yjustify-between yh-[88%] yp-4 ">
        <AllUserSlide />
        <MessageSlide />
      </main>
    </div>
  );
};

export default ChatsPage;
