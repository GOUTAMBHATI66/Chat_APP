import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");

  // const [pic, setPic] = useState(null);
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // const [isLoading, setisLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  function showAndHidePass() {
    {
      type === "password" ? setType("text") : setType("password");
    }
  }

  function showAndHideConfirmPass() {
    {
      type2 === "password" ? setType2("text") : setType2("password");
    }
  }

  async function handlOnSubmit(e) {
    e.preventDefault();

    if (password !== confirmPass) {
      toast({
        title: "Please enter the correct password.",
        variant: "destructive",
      });

      setPassword("");
      setConfirmPass("");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/api/users", {
        name,
        email,
        password,
        // pic,
      });
      // console.log(data);
      toast({
        title: "Registration completed successfully.",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Opps! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
      setname("");
      setEmail("");
      setPassword("");
      setConfirmPass("");
    }
  }

  return (
    <form onSubmit={handlOnSubmit}>
      <div className="lg:ymt-4">
        <p className=" yfont-semibold md:ytext-normal lg:ytext-lg">Username</p>
        <input
          type="text"
          placeholder="enter your name"
          value={name}
          className="youtline-none ypx-3 ypy-0.5 lg:ypy-1 ytext-black yrounded-md max-[450px]:yw-[90%] yw-[80%] lg:ymy-1"
          onChange={(e) => setname(e.target.value)}
        />

        <p className=" yfont-semibold md:ytext-normal lg:ytext-lg ymt-1.5 lg:ymt-2">
          Email
        </p>
        <input
          type="email"
          placeholder="enter your email"
          value={email}
          className="youtline-none ypx-3 ypy-0.5 lg:ypy-1 ytext-black yrounded-md max-[450px]:yw-[90%] yw-[80%] lg:ymy-1"
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className=" yfont-semibold md:ytext-normal lg:ytext-lg ymt-1.5 lg:ymt-2">
          Password
        </p>
        <div className=" ybg-white yflex yjustify-between yrounded-md yz-10 max-[450px]:yw-[90%] yw-[80%] lg:ymy-1">
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

        <p className="   yfont-semibold lg:ytext-lg ymt-1.5 lg:ymt-2 ">
          Confirm Password
        </p>
        <div className=" ybg-white yflex yjustify-between yrounded-md yz-10 lg:ymy-1 max-[450px]:yw-[90%] yw-[80%]">
          <input
            type={type2}
            placeholder="re-enter the password"
            value={confirmPass}
            className="youtline-none ypx-3 ypy-0.5 lg:ypy-1 ytext-black yrounded-md yw-full  "
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <button
            type="button"
            className="ymr-2 yz-20 ytext-black"
            onClick={showAndHideConfirmPass}
          >
            {type2 === "password" ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!name || !email || !password || !confirmPass}
        className=" disabled:ybg-[#f66fed] ymt-5 lg:ymt-6 ybg-[#de2fd3] hover:ybg-[#ef46e4] ytext-lg yfont-semibold yrounded-md ypx-3 sm:ypy-0.5 md:ypy-1 "
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUp;
