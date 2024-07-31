import React, { useContext, useState } from "react";
// import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChatContext } from "../Context/ChatProvider";
import GroupMember from "./GroupMember";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { arrangeMembers, getSender } from "../HelperFunction/chatLogics";
import { CiEdit } from "react-icons/ci";
import { X } from "lucide-react";

const ProfileModel = ({ User, children }) => {
  const {
    user,
    selectedUser,
    setSelectedUser,
    arrOfChatUsers,
    setArrOfChatUsers,
  } = useContext(ChatContext);

  const [newGroupName, setNewGroupName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { toast } = useToast();

  // closing dialoag
  function handleOnClose() {
    setIsDialogOpen(false);
  }

  // const head = children.props.children;

  // console.log("selectedUser from profile -> ", selectedUser);
  // console.log("children -> ", children);
  // console.log(children.props.children);
  // console.log("User -> ", User);
  // console.log("user -> ", user);

  // console.log((User?.users).toReversed());
  // console.log(User?.users);

  const handleGroupRename = async (e) => {
    e.preventDefault();
    if (!newGroupName) {
      return;
    } else if (newGroupName.length > 50) {
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

      const { data } = await axios.put(
        "http://localhost:3000/api/chats/grouprename",

        { groupId: selectedUser._id, newGroupName: newGroupName },
        config
      );

      // console.log("data after rename group -> ", data);

      setSelectedUser(data);

      const newArr = arrOfChatUsers.filter(
        (userOrGroup) => userOrGroup._id !== data._id
      );

      setArrOfChatUsers([data, ...newArr]);
      setNewGroupName("");
      handleOnClose();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <>
      {children ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            onClick={() => {
              setNewGroupName("");
              setIsEdit(false);
              setIsDialogOpen(true);
            }}
          >
            {/* <span>{children}</span> */}
            <span className={` yflex ygap-1 yw-full yitems-center ypx-2  `}>
              {children.props.children}
            </span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className=" yflex yflex-col ygap-2">
              <DialogTitle className=" yflex yitems-center yjustify-between ytext-[35px] ytext-center yfont-semibold">
                <p className=" ytext-center yw-full ">
                  {!User.isGroupChat
                    ? !User.users
                      ? User.name
                      : getSender(user, User.users)?.name
                    : User.chatName}
                </p>
                {User.isGroupChat ? (
                  !isEdit ? (
                    <CiEdit
                      onClick={() => setIsEdit(true)}
                      className=" yrounded-full yh-8 yw-9 yp-1 ycursor-pointer hover:ybg-gray-300"
                    />
                  ) : (
                    <X
                      onClick={() => setIsEdit(false)}
                      className=" yrounded-full yh-7 yw-8 yp-1 ycursor-pointer hover:ybg-gray-300"
                    />
                  )
                ) : null}
              </DialogTitle>

              <DialogDescription className=" yflex ygap-2 yflex-col yitems-center yjustify-center">
                {!isEdit ? null : (
                  <form
                    onSubmit={handleGroupRename}
                    className=" yw-full yflex ygap-2"
                  >
                    <input
                      type="text"
                      placeholder=" New group name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className=" youtline-none ypx-2 ypy-1 yw-[80%] yrounded-md ytext-black "
                    />
                    <button
                      type="submit"
                      disabled={!newGroupName}
                      className=" disabled:ybg-blue-300 yrounded-md ypx-2 ypy-1 yw-[20%] ybg-blue-500 hover:ybg-blue-600 ytext-white"
                    >
                      Update
                    </button>
                  </form>
                )}

                <div className="yw-[180px] yh-[180px] yrounded-full yoverflow-hidden">
                  <img
                    src={
                      !User.isGroupChat
                        ? !User.users
                          ? User.pic
                          : getSender(user, User.users)?.pic
                        : User.groupAdmin?.pic
                    }
                    className=" yw-full yh-full yobject-cover"
                  />
                </div>
                <span className=" ytext-lg yfont-medium ytext-black">
                  {!User.isGroupChat ? (
                    !User.users ? (
                      User.email
                    ) : (
                      <span>
                        {" "}
                        Email : {getSender(user, User.users)?.email}{" "}
                      </span>
                    )
                  ) : null}
                </span>

                {User.isGroupChat ? (
                  <div className=" yflex yw-full ymt-2">
                    <div className=" yflex yflex-col  ygap-1 ">
                      <p className=" ytext-lg ytext-black">
                        Group Members : {User.users?.length}
                      </p>
                      <div className=" yflex yflex-wrap ygap-1 ">
                        {arrangeMembers(User.users, user, User.groupAdmin).map(
                          (member, i) => (
                            <GroupMember
                              key={i}
                              member={member}
                              cancelBtn={false}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default ProfileModel;
