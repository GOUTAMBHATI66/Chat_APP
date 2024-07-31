import React, { useContext, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatContext } from "../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

import axios from "axios";
import UserListItem from "./UserListItem";
import { X } from "lucide-react";
import SkeletonCom from "./SkeletonCom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [NAvailable, setNAvailable] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { user, setSelectedUser, arrOfChatUsers, setArrOfChatUsers } =
    useContext(ChatContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  // functionality to logOut current user and redirect to home page
  const handlLogOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // serching data with typing text
  const handlSearchOnQuery = async (query) => {
    setSearch(query);
    if (!query) {
      query = "com";
      // setSearchResult([]);
      // return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:3000/api/users?search=${query}`,
        config
      );

      if (data.length === 0) {
        setNAvailable(true);
      } else {
        setNAvailable(false);
      }

      // console.log(data);

      setSearchResult(data);

      if (query === "com") setSearch("");
    } catch (error) {
      toast({
        title: "Fialed to load search results.",
        variant: "destructive",
      });
    }
  };

  // seraching data when we hit enter
  const handleOnSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      toast({
        title: "Please enter something in search!",
        variant: "destructive",
        duration: "2000",
      });
      setNAvailable(false);
      handlSearchOnQuery();

      return;
    }

    try {
      setShowSkeleton(true);
      // console.log(user.token);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:3000/api/users?search=${search}`,
        config
      );

      // console.log("data -> ", data);
      if (data.length === 0) {
        setNAvailable(true);
      } else {
        setNAvailable(false);
      }

      setShowSkeleton(false);
      setSearchResult(data);

      setSearch("");
    } catch (error) {
      toast({
        title: "Failed to search a user.",
        variant: "destructive",
      });
    }
  };

  // closing sheet and doing some task before it
  function handleOnSheetClose() {
    setSearchResult([]);
    setNAvailable(false);
    setIsSheetOpen(false);
    // console.log("sheet closed");
  }

  // accessing a chat object that contain {chatName,isGroupChat,users,latestMessage,groupAdmin} by click on search user
  async function accessUser(userId) {
    // console.log("from accessUser userId -> ", userId);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/chats",
        { userId },
        config
      );

      // console.log("data from accessUser -> ", data);
      setSelectedUser(data);
      // setSelectedUser(getSelectedUser(user, data.users));

      // checking there is already a chat exists or not with clicked user
      if (!arrOfChatUsers.find((chat) => chat._id === data._id)) {
        setArrOfChatUsers([data, ...arrOfChatUsers]);
      }

      handleOnSheetClose();

      // if (arrOfChatUsers.length === 0) setArrOfChatUsers([data]);
      // else if (!arrOfChatUsers.find((chat) => chat._id === data._id))
      //   setArrOfChatUsers([data, ...arrOfChatUsers]);
    } catch (error) {
      // res.status(400);
      console.log(error.message);
    }
  }

  // console.log("selectedUser after click on search user -> ", selectedUser);
  // console.log("arrOfChatUsers => ", arrOfChatUsers);
  // console.log("user -> ", user);

  return (
    <div className=" yw-full yh-[12%] ypy-3 ypx-4 ybg-gray-100 ytext-black yflex yjustify-between yitems-center ">
      {/* search users sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger
          onClick={() => {
            setIsSheetOpen(true);
            handlSearchOnQuery("com");
          }}
          className=" ybg-gray-300 hover:ybg-gray-400/70 yrounded-md ypx-3 ypy-1 yflex ygap-3 yitems-center ycursor-pointer max-[450px]:ypy-3 max-[450px]:yrounded-full"
        >
          <IoIosSearch />
          <span className=" yhidden min-[450px]:yinline-block">
            Search User
          </span>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className=" yflex yjustify-between ygap-3">
              Search User
              <SheetClose onClick={handleOnSheetClose}>
                <X className=" hover:ybg-gray-300  hover:yrounded-md yp-1" />
              </SheetClose>
            </SheetTitle>
            <SheetDescription>
              <form
                onSubmit={handleOnSearch}
                className="yflex ygap-2 yjustify-between"
              >
                <input
                  placeholder="user name or email"
                  className=" youtline-none yrounded-md ypx-3 ypy-1 ybg-white/50 yborder yborder-black yw-full ytext-lg max-[450px]:ypx-1.5 max-[400px]:ytext-sm ytext-black"
                  value={search}
                  onChange={(e) => handlSearchOnQuery(e.target.value)}
                />
                <Button onClick={handleOnSearch}>search</Button>
              </form>
            </SheetDescription>
            <div>
              {showSkeleton ? (
                <SkeletonCom />
              ) : (
                <div className=" yh-screen">
                  {NAvailable && searchResult ? (
                    <h1 className=" ytext-lg ytext-red-600 yfont-semibold ">
                      Search is not available.
                    </h1>
                  ) : (
                    <ul className=" yh-[80%] yflex yflex-col ygap-2 yoverflow-y-scroll custom-scrollbar ">
                      {searchResult.map((userItem, i) => (
                        <UserListItem
                          key={i}
                          userInfo={userItem}
                          isSheetOpen={isSheetOpen}
                          handleFunction={() => accessUser(userItem._id)}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* chat logo and name */}
      <Link
        onClick={() => {
          setSelectedUser("");
        }}
        // to={"/chats"}
      >
        <div className=" yflex  ygap-1 ycursor-pointer">
          {/* chat logo */}
          <div className=" yw-[40px] yh-[40px] yoverflow-hidden ">
            <img
              src="/messenger.png"
              className=" yw-full yh-full yobject-cover"
            />
          </div>

          {/* Brand Name */}
          <p className=" yhidden min-[380px]:yblock ytext-4xl ytext-end yfont-semibold heading">
            ChatHub
          </p>
        </div>
      </Link>

      {/*  User Profile */}

      <DropdownMenu>
        <DropdownMenuTrigger className=" yflex ygap-2 yitems-center hover:ybg-gray-300 ypx-3 ypy-1 yrounded-md">
          <Avatar className="yw-8 yh-8">
            <AvatarImage className="ycursor-pointer" src={user?.pic} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <IoChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Profile Model */}
          <ProfileModel User={user}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </ProfileModel>

          <DropdownMenuItem
            onClick={handlLogOut}
            className=" yflex yitems-center ygap-2 ymt-1"
          >
            {" "}
            <FiLogOut /> Log-out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
