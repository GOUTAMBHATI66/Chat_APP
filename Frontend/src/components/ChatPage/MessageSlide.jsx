import React, { useContext, useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { ChatContext } from "../Context/ChatProvider";
import { FaFacebookMessenger } from "react-icons/fa6";
import { MdArrowBackIos, MdDelete, MdPersonAddAlt1 } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ProfileModel from "./ProfileModel";
import { ImExit } from "react-icons/im";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Description, DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";

import UserListItem from "./UserListItem";
import GroupMember from "./GroupMember";
import { useToast } from "../ui/use-toast";
import { X } from "lucide-react";
import ChatsUI from "./ChatsUI";
import { arrangeMembers, getSender } from "../HelperFunction/chatLogics";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
console.log(ENDPOINT);
var socket, selectedUserCompare;

const MessageSlide = () => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const {
    user,
    selectedUser,
    setSelectedUser,
    arrOfChatUsers,
    setArrOfChatUsers,
  } = useContext(ChatContext);

  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [NAvailable, setNAvailable] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { toast } = useToast();
  // console.log("selected user -> ", selectedUser);

  // console.log("selectedUser?.users?.length => ", selectedUser?.users?.length);

  // fetch all the messages with a particular user
  const fetchAllMessages = async () => {
    if (!selectedUser) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:3000/api/messages/${selectedUser?._id}`,
        config
      );

      // console.log("data from 75-> ", data);
      setAllMessages(data);

      socket.emit("join chat", selectedUser._id);
    } catch (error) {
      toast({
        title: "Failed to load the chats.",
        variant: "destructive",
      });
    }
  };

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
  async function searchUsers(query) {
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

  // adding new member in newgroupMembers array
  function addNewGroupMember(newMember) {
    if (newGroupMembers.some((member) => member?._id === newMember?._id)) {
      // console.log("member._id -> ", member._id);
      toast({
        title: "User already added in the group.",
      });
      return;
    }

    setNewGroupMembers([newMember, ...newGroupMembers]);
  }
  // console.log(newGroupMembers);

  // removing new users from newgroupMembers array
  const handleRemoveUser = (deleteUser) => {
    setNewGroupMembers(
      newGroupMembers.filter((user) => user?._id !== deleteUser?._id)
    );
  };

  // removing a user form an existing group
  const removeUserFromGroup = async (e, userId) => {
    e.preventDefault();

    if (!userId) return;

    // you can't exit a member if there is only 3 member in a group
    if (selectedUser?.users?.length >= 4) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put(
          "http://localhost:3000/api/chats/groupremove",
          { groupId: selectedUser?._id, userId: userId },
          config
        );

        setSelectedUser(data);

        const newArr = arrOfChatUsers.filter(
          (userOrGroup) => userOrGroup?._id !== data?._id
        );

        setArrOfChatUsers([data, ...newArr]);
      } catch (error) {
        toast({
          title: "Failed to remove user from group.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title:
          "You can't remove any user because a group shoud be 3 or more members.",
        variant: "destructive",
      });
    }
  };

  // handling some stats before closing the dialog
  function handleOnClose() {
    setSearchResult([]);
    setNewGroupMembers([]);
    setIsDialogOpen(false);
    setIsDialogOpen2(false);
    setSelectedMember(null);
  }

  // adding a user in existing group
  const addUserInGroup = async (e) => {
    e.preventDefault();
    console.log("newGroupMembers -> ", newGroupMembers);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:3000/api/chats/groupadd",
        {
          groupId: selectedUser._id,
          newUsersId: JSON.stringify(newGroupMembers.map((user) => user?._id)),
        },
        config
      );

      console.log("data 233 -> ", data);
      setSelectedUser(data);

      const newArr = arrOfChatUsers.filter(
        (userOrGroup) => userOrGroup?._id !== data?._id
      );

      setArrOfChatUsers([data, ...newArr]);
      handleOnClose();
    } catch (error) {
      toast({
        title: "Failed to add users in group.",
        variant: "destructive",
      });
    }
  };

  function handlNewMessage(e) {
    setNewMessage(e.target.value);
    setTyping(false);
    // code of typing indicator

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedUser._id);
    }

    let lastTypingTime = new Date().getTime();
    var timeLength = 5000;
    setTimeout(() => {
      var nowTime = new Date().getTime();
      var timeDiff = nowTime - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedUser._id);
        setTyping(false);
      }
    }, timeLength);
  }

  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
  // console.log("loggedInUser - ", loggedInUser);
  // console.log("searchResult -> ", searchResult);

  useEffect(() => {
    fetchAllMessages();

    selectedUserCompare = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setUp", loggedInUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedUserCompare ||
        selectedUserCompare._id !== newMessageRecieved.chat._id
      ) {
        // notification code
      } else {
        setAllMessages([...allMessages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    fetchChats();
  }, [allMessages]);

  // console.log("allMessages -> ", allMessages);

  // console.log("length -> ", selectedUser.chatName?.length

  // sending message functionality
  const handleOnSendMess = async (e) => {
    e.preventDefault();

    // console.log("It is running...");
    // console.log("newMessage -> ", newMessage);
    // console.log("selectedUser._id -> ", selectedUser._id);
    if (!newMessage) {
      toast({
        title: "Please enter a message to send.",
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
        "http://localhost:3000/api/messages",
        {
          messageContent: newMessage,
          chatId: selectedUser?._id,
        },
        config
      );
      // console.log("Message sent successfully -> ", data);

      socket.emit("new message", data);

      setAllMessages([...allMessages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("error -> ", error.message);
      toast({
        title: "Failed to send a message.",
        variant: "destructive",
      });
    }
  };

  // handling group delete functionality
  const handleDeleteGroup = async () => {
    // console.log("selectedUser._id -> ", selectedUser?._id);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          deletedGroupId: selectedUser?._id,
        },
      };

      const { data } = await axios.delete(
        "http://localhost:3000/api/chats/deletegroup",
        config
      );

      // console.log("data of deleted group -> ", data);
      setSelectedUser("");
      setArrOfChatUsers(
        arrOfChatUsers.filter((chats) => chats?._id !== data?._id)
      );
      toast({
        title: ` ${data?.chatName} Group Deleted.`,
      });
    } catch (error) {
      toast({
        title: "Failed to delete the group.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {selectedUser ? (
        <div
          className={` ${
            selectedUser ? "yflex" : "yhidden"
          } ybg-gray-50/50 yrounded-md ytext-black yh-full yw-full md:yw-[65%] md:yflex yflex-col`}
        >
          {/* Header of message section like user or group name and delete or information button */}
          <section className=" yflex yjustify-between yitems-center max-[450px]:ygap-1 ygap-3 yborder-b yp-3 yh-[13%] yw-full">
            {/* user or group name and logo */}
            <div className=" yflex yitems-center ">
              {/* Back arrow */}
              <MdArrowBackIos
                onClick={() => setSelectedUser("")}
                size={32}
                className=" md:yhidden  ybg-slate-200 hover:ybg-slate-300 yrounded-full yp-1 ypl-2 yh-8 yw-8 ycursor-pointer"
              />

              {/* Profile model */}
              <ProfileModel User={selectedUser}>
                <div className=" yw-full yflex  ygap-1 ycursor-pointer  ">
                  <div className=" yh-11 yw-12 yoverflow-hidden yz-10">
                    <img
                      src={
                        !selectedUser?.isGroupChat
                          ? getSender(user, selectedUser?.users)?.pic
                          : selectedUser?.groupAdmin?.pic
                      }
                      className=" yw-full yh-full yobject-cover yz-10 yrounded-full"
                    />
                  </div>

                  <div className=" yflex yflex-col yitems-start ygap-1">
                    <h1
                      className={`${
                        isTyping ? "ytext-2xl" : null
                      } ytext-3xl max-[450px]:ytext-2xl yline-clamp-1  ytext-start  `}
                    >
                      {!selectedUser?.isGroupChat
                        ? getSender(user, selectedUser?.users)?.name
                        : selectedUser?.chatName}
                    </h1>
                    {isTyping ? (
                      <span className=" ytext-green-600 yfont-bold ytext-sm">
                        typing...
                      </span>
                    ) : null}
                  </div>
                </div>
              </ProfileModel>
            </div>

            {/* Delete and information button of group */}
            <div className="yflex ygap-1 yitems-center">
              {/* add functionality on click delete button   */}
              <Dialog>
                <DialogTrigger className=" yw-full yh-full yflex yitems-center yjustify-between ycursor-pointer ">
                  <MdDelete size={24} color="red" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className=" ytext-red-700">
                      Delete all the messages with
                      <h1 className=" ytext-2xl">
                        {!selectedUser?.isGroupChat
                          ? getSender(user, selectedUser?.users)?.name
                          : selectedUser?.chatName}
                        ?
                      </h1>
                    </DialogTitle>
                    <DialogDescription>
                      Are you absolutely sure?
                      <DialogClose className=" yflex yw-full yjustify-end yitems-center ygap-2 ymt-2 ">
                        <Button variant="ghost" size="sm">
                          cancel
                        </Button>

                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {selectedUser?.groupAdmin?._id === user?._id ? (
                // add functionality on click information button
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger
                    onClick={() => {
                      setIsSheetOpen(true);
                    }}
                  >
                    <IoMdInformationCircleOutline
                      size={20}
                      className=" ycursor-pointer"
                    />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader className=" yh-full ">
                      <SheetTitle className=" yborder-b yborder-white/80">
                        {/* group logo and name */}
                        <div className=" yflex yitems-center ygap-2 yw-full ">
                          <div className=" yw-12 yh-12 yoverflow-hidden ">
                            <img
                              src={selectedUser?.groupAdmin?.pic}
                              className="yw-full yh-full yobject-cover yrounded-full"
                            />
                          </div>
                          <h1
                            className={` ${
                              selectedUser?.chatName?.length >= 30
                                ? "ytext-lg"
                                : "ytext-2xl"
                            }  `}
                          >
                            {selectedUser?.chatName}
                          </h1>
                        </div>
                        <span className=" ytext-sm">
                          Group Members : {selectedUser?.users?.length}
                        </span>
                      </SheetTitle>
                      <SheetDescription className=" yh-[87%] yflex yflex-col ygap-2 yjustify-between">
                        {/* all members of group and exit them functionality */}
                        <div className=" yh-[75%] yflex yflex-col ygap-3 yoverflow-y-scroll yrounded-md yp-2 main-scrollbar  ybg-gray-400/60">
                          {arrangeMembers(
                            selectedUser?.users,
                            user,
                            selectedUser?.groupAdmin
                          ).map((member, i) => (
                            <div
                              key={i}
                              className=" ypy-1 ypx-2 ytext-black yrounded-md ybg-gray-300  hover:ybg-gray-400/80 yshadow-md  hover:yfont-semibold yflex yitems-center yjustify-between "
                            >
                              {/* container for image and name  */}
                              <div className=" yflex ygap-2 yitems-center">
                                <div className=" yw-8 yh-8 yoverflow-hidden">
                                  <img
                                    src={member?.pic}
                                    className="yw-full yh-full yobject-cover yrounded-full"
                                  />
                                </div>
                                {member?._id === user?._id
                                  ? "You"
                                  : member?.name}
                                {member?._id ===
                                selectedUser?.groupAdmin?._id ? (
                                  <span className=" ytext-blue-600 yfont-bold">
                                    (Group Admin)
                                  </span>
                                ) : null}
                              </div>
                              {/* giving functionality to remove button */}
                              {member?._id !== user?._id ? (
                                <Dialog
                                  open={
                                    isDialogOpen2 &&
                                    selectedMember?._id === member?._id
                                  }
                                  onOpenChange={(open) => {
                                    setIsDialogOpen2(open);
                                    if (!open) setSelectedMember(null);
                                  }}
                                >
                                  <DialogTrigger
                                    onClick={() => {
                                      setSelectedMember(member);
                                      setIsDialogOpen2(true);
                                    }}
                                  >
                                    <ImExit className="ycursor-pointer" />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Do you want to remove
                                        <span className=" ytext-xl ytext-red-700">
                                          {" "}
                                          {member?.name}{" "}
                                        </span>
                                        from this group?
                                      </DialogTitle>
                                      <DialogDescription></DialogDescription>

                                      <DialogClose className=" yflex yw-full yitems-center ygap-2 ymt-2 yjustify-end">
                                        <Button
                                          onClick={() => handleOnClose()}
                                          variant="ghost"
                                          size="sm"
                                        >
                                          cancel
                                        </Button>
                                        <Button
                                          onClick={(e) => {
                                            removeUserFromGroup(e, member?._id);
                                            handleOnClose();
                                          }}
                                          variant="destructive"
                                          size="sm"
                                        >
                                          remove
                                        </Button>
                                      </DialogClose>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        {/* group action like delete group, add members */}
                        <div className=" yh-[20%] yflex yflex-col ygap-2 yrounded-md yp-3 ybg-gray-400/60 ">
                          {/* add to members dialoag */}
                          <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                            className="yh-[50%]"
                          >
                            <DialogTrigger
                              onClick={() => {
                                searchUsers();
                                setIsDialogOpen(true);
                              }}
                              className=" yh-full yw-full ypx-3 ypy-1 yrounded-md ybg-white/80  hover:ybg-slate-200 ytext-black yfont-semibold yflex yitems-center yjustify-between  ycursor-pointer"
                            >
                              <MdPersonAddAlt1 size={20} color="blue" />
                              <span> Add Members </span>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <div className=" yflex yrelative">
                                  <DialogTitle className=" ytext-center">
                                    Add Users in the Group
                                  </DialogTitle>

                                  <DialogClose>
                                    <X
                                      onClick={() => handleOnClose()}
                                      className=" yabsolute yright-0.5 ytop-0.5 hover:ybg-gray-300  hover:yrounded-md yp-1 yborder-none"
                                    />
                                  </DialogClose>
                                </div>

                                <DialogDescription className=" yflex ygap-2 yflex-col ">
                                  <input
                                    type="text"
                                    placeholder="search user"
                                    // value={newGroupMembers}
                                    className=" ypx-3 ypy-2 ymt-2  ytext-black ytext-base youtline-none yrounded-md yw-full"
                                    onChange={(e) =>
                                      searchUsers(e.target.value)
                                    }
                                  />

                                  {/* list of already group members */}
                                  <div className=" yflex yflex-col ygap-1">
                                    <span className=" ytext-black yfont-semibold ytext-lg">
                                      Already members :{" "}
                                    </span>
                                    <div className=" yflex yflex-wrap ygap-1">
                                      {arrangeMembers(
                                        selectedUser?.users,
                                        user,
                                        selectedUser?.groupAdmin
                                      ).map((member, i) => (
                                        <GroupMember
                                          key={i}
                                          member={member}
                                          cancelBtn={false}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  {/* list of new group members */}
                                  {newGroupMembers?.length ? (
                                    <div className=" yflex yflex-col ygap-1">
                                      <span className=" ytext-black yfont-semibold ytext-lg">
                                        New members :
                                      </span>
                                      <div className=" yflex yflex-wrap ygap-1">
                                        {newGroupMembers.map((member, i) => (
                                          <GroupMember
                                            key={i}
                                            member={member}
                                            cancelBtn={true}
                                            removeUser={() =>
                                              handleRemoveUser(member)
                                            }
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}

                                  {/* search users */}
                                  {NAvailable && searchResult ? (
                                    <h1 className=" ytext-lg  ytext-red-600 yfont-semibold">
                                      Search is not available.
                                    </h1>
                                  ) : (
                                    <div className=" yflex yflex-col ymy-2 ygap-1 yrounded-md yoverflow-y-scroll ymax-h-[150px] main-scrollbar">
                                      {searchResult
                                        .filter(
                                          (groupMember) =>
                                            !selectedUser?.users?.some(
                                              (item) =>
                                                item._id === groupMember._id
                                            )
                                        )
                                        .map((groupMember, i) => (
                                          <UserListItem
                                            key={i}
                                            userInfo={groupMember}
                                            handleFunction={() =>
                                              addNewGroupMember(groupMember)
                                            }
                                          />
                                        ))}
                                    </div>
                                  )}

                                  <button
                                    onClick={addUserInGroup}
                                    disabled={!newGroupMembers?.length}
                                    className=" disabled:ybg-blue-300 ybg-blue-500 hover:ybg-blue-600 yrounded-md ypx-3 ypy-1 ytext-white"
                                  >
                                    Add Users
                                  </button>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>

                          {/* delete group dialoag */}
                          <Dialog className="yh-[50%]   ">
                            <DialogTrigger className=" yh-full yw-full ypx-3 ypy-1 yrounded-md ybg-white/80  hover:ybg-slate-200 ytext-black yfont-semibold yflex yitems-center yjustify-between  ycursor-pointer">
                              <MdDelete size={20} color="red" />
                              <span> Delete group </span>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="ytext-red-600 ">
                                  Delete {selectedUser?.chatName} group?
                                </DialogTitle>
                                <Description>
                                  <span className=" ytext-sm">
                                    This action will delete the group and all
                                    the chats with group members.
                                  </span>
                                </Description>
                                <div className=" yflex ymt-2 yjustify-end">
                                  <DialogClose className=" yflex ygap-2">
                                    <Button variant="ghost" size="sm">
                                      cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        handleDeleteGroup();
                                        setIsSheetOpen(false);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </div>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              ) : null}
            </div>
          </section>

          {/* section for showing all the messages */}
          <section className=" yflex yflex-col yjustify-between yitems-start yh-[87%] yw-full  ypy-1 ypx-3 ">
            <div
              className={`  yw-full yh-[87%] ${
                isTyping ? "yh-[80%]" : null
              } yflex yflex-col ygap-2 custom-scrollbar yoverflow-scroll`}
            >
              <ChatsUI allmessages={allMessages} />
            </div>

            <form
              onSubmit={handleOnSendMess}
              className="yflex yw-full yh-[13%] ytext-xl yitems-center yrelative "
            >
              <input
                type="text"
                placeholder="Write your message..."
                value={newMessage}
                className=" ypl-4 ypr-14 ypy-1 yw-full yh-[70%] sm:yh-[90%] yrounded-full youtline-none ybg-slate-50"
                onChange={handlNewMessage}
              />
              <BsFillSendFill
                size={28}
                className=" yw-12 yh-9 yabsolute yright-5 ycursor-pointer ybg-blue-800 ytext-white yp-1 yrounded-full"
                onClick={handleOnSendMess}
              />
            </form>
          </section>
        </div>
      ) : (
        <div className=" yhidden ybg-gray-50/30 yrounded-md ytext-[#343ae6b9] yh-full yw-full md:yw-[65%] md:yflex yflex-col yitems-center yjustify-center yfont-semibold ytext-3xl">
          <FaFacebookMessenger size={48} className="  ytext-[#343ae6b9]" />
          Start the chat
        </div>
      )}
    </>
  );
};

export default MessageSlide;
