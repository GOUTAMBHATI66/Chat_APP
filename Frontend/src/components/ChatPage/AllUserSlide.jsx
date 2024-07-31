import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { MdGroups } from "react-icons/md";
import ChatUser from "./ChatUser";
import axios from "axios";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "../ui/use-toast";
import UserListItem from "./UserListItem";
import { Loader, X } from "lucide-react";
import GroupMember from "./GroupMember";
import { unreadMessages } from "../HelperFunction/chatLogics";

const AllUserSlide = () => {
  const {
    user,
    selectedUser,
    setSelectedUser,
    arrOfChatUsers,
    setArrOfChatUsers,
    unreadMessagesCount,
    setUnreadMessageCount,
  } = useContext(ChatContext);

  // variable for logged in user because user from context is not properly working here
  const loggedInUser = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const [searchResult, setSearchResult] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [NAvailable, setNAvailable] = useState(false);

  const { toast } = useToast();

  // console.log("arrOfChatUsers -> ", arrOfChatUsers);
  // console.log("loggedInUser -> ", loggedInUser);

  // fetching all the previous chats that you did with all the users
  const fetchChats = async () => {
    // console.log("user", user);
    // console.log("fetchChats chala kya?");

    // console.log("Beare token from 52 -> ", user.token);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:3000/api/chats",
        config
      );

      // console.log("data from get request AllUserSlide -> ", data);
      setArrOfChatUsers(data);
    } catch (error) {
      console.log("Error : ", error.message);
      toast({
        title: "Failed to load all the previous chats.",
        variant: "destructive",
      });
    }
  };

  // Searching users for adding to the group
  async function handleSearchUsers(query) {
    // setSearch(query);
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
      // console.log(data);

      if (data.length === 0) {
        setNAvailable(true);
      } else {
        setNAvailable(false);
      }

      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Failed to load search results.",
      });
    }
  }

  // handling some stats before closing the dialog
  const handleOnClose = () => {
    setSearchResult([]);
    setGroupMembers([]);
    setGroupName("");
    setIsDialogOpen(false);
  };

  // Creating a new Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (groupName.length > 50) {
      toast({
        title: "You group name is too long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/chats/group",
        {
          groupName: groupName,
          groupMembers: JSON.stringify(groupMembers.map((user) => user._id)),
        },
        config
      );

      // console.log("114 data -> ", data);

      setSelectedUser(data);
      setArrOfChatUsers([data, ...arrOfChatUsers]);
      handleOnClose();
      toast({
        title: "Your group has been created.",
      });
    } catch (error) {
      toast({
        title: "Failed to create the group.",
        variant: "destructive",
      });
    }
  };

  // adding users as group members
  const handleGroup = (user) => {
    // console.log("user - ", user._id);
    // console.log("groupMembers.includes(user) -> ", groupMembers.includes(user));/

    // console.log("groupMembers from inside -> ", groupMembers);

    if (groupMembers.some((member) => member._id === user._id)) {
      // console.log("member._id -> ", member._id);
      toast({
        title: "User already added in the group.",
      });
      return;
    }

    setGroupMembers([user, ...groupMembers]);
  };

  // removing a particular user from groupMembers list
  const handleRemoveUser = (deleteUser) => {
    setGroupMembers(groupMembers.filter((user) => user._id !== deleteUser._id));
  };

  useEffect(() => {
    fetchChats();
    // setUnreadMessageCount(unreadMessages())
  }, []);

  return (
    <div
      className={` ${selectedUser ? "yhidden" : "yflex"}
       ybg-gray-50/40 yrounded-md ytext-black yh-full yw-full md:yw-[35%] md:yflex  yflex-col`}
    >
      {/* section of chats logo and create group button */}
      <section className=" yflex yjustify-between yitems-center ygap-3 yborder-b yp-3 yh-[13%] yw-full">
        <h1 className=" ytext-4xl heading">Chats</h1>

        {/* Dialog for creating the group */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <MdGroups
              onClick={() => {
                setIsDialogOpen(true);
                setGroupName("");
                setGroupMembers([]);
                handleSearchUsers("com");
              }}
              size={44}
              className="  ybg-slate-100 hover:ybg-gray-300 yrounded-full yp-0.5  ycursor-pointer"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className=" yflex yrelative">
                <DialogTitle className=" ytext-center">
                  Create New Group
                </DialogTitle>

                <DialogClose>
                  <X
                    onClick={() => handleOnClose()}
                    className=" yabsolute yright-0.5 ytop-0.5 hover:ybg-gray-300  hover:yrounded-md yp-1 yborder-none"
                  />
                </DialogClose>
              </div>
              <DialogDescription>
                <form
                  onSubmit={handleCreateGroup}
                  className=" yflex yflex-col ygap-2 ymt-2 "
                >
                  <input
                    type="text"
                    placeholder="group name"
                    value={groupName}
                    className="  ypx-2 ypy-1 yrounded-md youtline-none ytext-black ytext-lg "
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="group members"
                    className="  ypx-2 ypy-1 yrounded-md youtline-none ytext-black ytext-lg"
                    onChange={(e) => handleSearchUsers(e.target.value)}
                  />
                  <div className=" yflex yflex-col ygap-1">
                    {!groupMembers.length ? (
                      <span className=" ytext-center">
                        Add 2 or more members
                      </span>
                    ) : (
                      <div className=" yflex yflex-wrap ygap-1 ymt-1">
                        {groupMembers.map((users, i) => (
                          <GroupMember
                            key={i}
                            member={users}
                            cancelBtn={true}
                            removeUser={() => handleRemoveUser(users)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {NAvailable && searchResult ? (
                    <h1 className=" ytext-lg  ytext-red-600 yfont-semibold">
                      Search is not available.
                    </h1>
                  ) : (
                    <div className=" yflex yflex-col ygap-1 ymt-2 yoverflow-y-scroll ymax-h-[150px] main-scrollbar">
                      {searchResult.map((user, i) => (
                        <UserListItem
                          key={i}
                          userInfo={user}
                          handleFunction={() => handleGroup(user)}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    disabled={!groupName || groupMembers.length < 2}
                    className=" disabled:ybg-blue-300  ybg-blue-600 hover:ybg-blue-700 yrounded-md ypy-2 ypx-3 ymt-2 ytext-white yfont-semibold "
                  >
                    Create
                  </button>
                </form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </section>

      {/* section for render all the users that I did a chat */}
      <section
        className=" yflex yflex-col ygap-1  yh-[87%] yw-full 
       ypy-1 ypx-3 yoverflow-y-scroll custom-scrollbar "
      >
        {arrOfChatUsers.map((user, i) => (
          <ChatUser key={i} userOrGroupInfo={user} />
        ))}
      </section>
    </div>
  );
};

export default AllUserSlide;
