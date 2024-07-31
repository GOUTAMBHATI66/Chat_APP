import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import { ChatContext } from "./Context/ChatProvider";

const HomePage = () => {
  const { user } = useContext(ChatContext);
  // console.log("user -> ", user);

  const greetingText = ["WelCome!", "Hi there!", "What's up?", "Hello!"];
  let index = 0;

  const [greet, setGreet] = useState(greetingText[index]);

  // setInterval(changeText, 1000);

  return (
    <div className=" yrelative yw-full yh-screen yoverflow-hidden">
      {/* adding video on Background */}
      <div className=" yw-full yh-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className=" yw-full yh-full yobject-cover -yz-10"
        >
          <source src="/Motion Backgrounds For Edits __ Free Video Background Loops - No Copyright Video Motion Graphics.mp4" />
        </video>
      </div>
      {/* sign up and sign in functionality */}
      <div className=" yflex sm:yflex-row yflex-col yitems-center sm:yitems-start ygap-8 sm:ygap-4 yabsolute ytop-5 sm:yleft-5 yw-[95%] yh-screen yz-20  sm:yp-5 md:yp-8">
        {/* intoduction slogan */}
        <section className=" yflex yflex-col ygap-2 max-[450px]:yw-[85%] yw-[70%] sm:yw-[45%] ytext-white sm:ypx-10 md:ypy-5">
          <h1 className=" ytext-4xl md:ytext-5xl lg:ytext-6xl xl:ytext-7xl heading ytext-[#A6BAFF] ">
            {greet}
          </h1>
          <div className=" yflex sm:yflex-col ygap-2 yflex-wrap">
            <p className=" yinline ytext-3xl sm:ytext-2xl md:ytext-4xl lg:ytext-5xl xl:ytext-6xl  ">
              Start
            </p>
            <p className=" yinline-block ytext-3xl sm:ytext-2xl md:ytext-4xl lg:ytext-5xl xl:ytext-6xl  ">
              messaging to
            </p>
            <p className=" yinline-block  ytext-3xl sm:ytext-2xl md:ytext-4xl lg:ytext-5xl xl:ytext-6xl  ">
              connect
            </p>
            <p className=" yinline-block ytext-3xl sm:ytext-2xl md:ytext-4xl lg:ytext-5xl xl:ytext-6xl ymb-2 md:ymb-5 ">
              instantly,
            </p>
          </div>
          <h1 className=" ytext-6xl sm:ytext-5xl md:ytext-6xl lg:ytext-7xl xl:ytext-8xl heading ytext-center ytext-[#FC6D6D]">
            Anytime
          </h1>
        </section>
        {/* sign in and sing up fields */}
        <section className=" max-[450px]:yw-[90%] yw-[75%] sm:yw-[55%]  yrounded-xl yp-3 md:yp-5  ybg-[#34008dbc]">
          <Tabs defaultValue="account" className=" yw-full">
            <TabsList className="sm:yw-[60%] md:yw-[50%] lg:yw-[40%] xl:yw-[30%] md:yh-8 lg:yh-10">
              <TabsTrigger value="account" className="yw-[50%] yfont-bold ">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="password" className="yw-[50%] yfont-bold">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className=" SignIn ytext-white">
              <SignIn />
            </TabsContent>
            <TabsContent value="password" className=" SignUp ytext-white">
              <SignUp />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
