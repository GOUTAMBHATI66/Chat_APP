import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";

const SignIn = () => {
  const [type, setType] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();

  function showAndHidePass() {
    {
      type === "password" ? setType("text") : setType("password");
    }
  }

  async function handlOnSubmit(e) {
    e.preventDefault();

    // console.log("email : ", email);
    // console.log("password : ", password);

    if (!email || !password) {
      toast({
        title: "Please enter all the feilds.",
      });

      setEmail("");
      setPassword("");

      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        }
      );
      toast({
        title: "Welcome! In our Chat App.",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Opps! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
      setEmail("");
      setPassword("");
    }
  }

  return (
    <form onSubmit={handlOnSubmit}>
      <div className=" max-sm:ymt-5 lg:ymt-5">
        <p className=" yfont-semibold lg:ytext-lg">Email</p>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          className="youtline-none ypx-3 ypy-0.5 lg:ypy-1 ytext-black yrounded-md yw-[80%] lg:ymy-1"
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className=" yfont-semibold md:ytext-normal lg:ytext-lg ymt-1.5 lg:ymt-2">
          Password
        </p>
        <div className=" ybg-white yflex yjustify-between yrounded-md yz-10 yw-[80%] lg:ymy-1">
          <input
            type={type}
            placeholder="enter your password"
            value={password}
            className="youtline-none ypx-3 ypy-0.5 lg:ypy-1 ytext-black yrounded-md yw-full"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="ymr-2 yz-20 ytext-black"
            onClick={showAndHidePass}
          >
            {type === "password" ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!email || !password}
        className=" disabled:ybg-[#f66fed] ymt-5 lg:ymt-10 ybg-[#de2fd3] hover:ybg-[#ef46e4] ytext-lg yfont-semibold yrounded-md ypx-3 sm:ypy-0.5 md:ypy-1 "
      >
        Sign In
      </button>
    </form>
  );
};

export default SignIn;
