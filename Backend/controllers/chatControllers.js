const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/usersModel");

const accessChats = asyncHandler(async (req, res) => {
  // Extracting userId from the request body
  const { userId } = req.body;
  // console.log("req.body -> ", req.body);

  if (!userId) {
    console.log("Logged in user do not provide any other user.");
    return res.sendStatus(401);
  }

  // It searches for an existing chat between the logged-in user (req.body._id) and userId, excluding group chats. If the chat exists, it populates user details and the latest message sender details and returns the chat.
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // console.log("isChat -> ", isChat);
  // console.log("isChat type -> ", typeof isChat);

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // If no chat exists, it creates a new chat with the provided users and returns the newly created chat.
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    // console.log("req.user._id = ", req.user._id);
    // console.log("userId = ", userId);
    // console.log("Data -> ", Data);

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      // console.log("fullChat -> ", fullChat);
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error("catch error -> ", error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    var messages = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    messages = await User.populate(messages, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.messages);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  // ensuring that both the field are fill up or not
  if (!req.body.groupName || !req.body.groupMembers) {
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  var groupMembers = JSON.parse(req.body.groupMembers);

  // ensuring that group has 2 or more than uses excluding who creating group
  if (groupMembers.length < 2) {
    return res.status(200).send({
      message: "At least 2 or more than users requied to form a group.",
    });
  }

  // including current user in group
  groupMembers.push(req.user);

  try {
    const createGroup = await Chat.create({
      chatName: req.body.groupName,
      isGroupChat: true,
      users: groupMembers,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: createGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { groupId, newGroupName } = req.body;

  const updateGroupName = await Chat.findByIdAndUpdate(
    groupId,
    {
      chatName: newGroupName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateGroupName) {
    res.status(400);
    throw new Error("Can't rename the group.");
  } else {
    res.json(updateGroupName);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { groupId, newUsersId } = req.body;

  var newGroupMembers = JSON.parse(newUsersId);

  const addUser = await Chat.findByIdAndUpdate(
    groupId,
    {
      $push: { users: { $each: newGroupMembers } },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addUser) {
    res.status(404);
    throw new Error("Can't add user in the group.");
  } else {
    res.json(addUser);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.body;

  const removeUser = await Chat.findByIdAndUpdate(
    groupId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUser) {
    res.status(404);
    throw new Error("Can't remove user from the group.");
  } else {
    res.json(removeUser);
  }
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { deletedGroupId } = req.query;

  if (!deletedGroupId) {
    return res
      .status(400)
      .send({ message: "Id of deleted group is not provided." });
  }

  try {
    const deletedGroup = await Chat.findOneAndDelete({ _id: deletedGroupId });

    if (!deletedGroup) {
      return res.status(404).send({ message: "Group not found." });
    }

    res.status(200).json(deletedGroup);
  } catch (error) {
    res.status(500).send({ message: "Server error. Could not delete group." });
  }
});

module.exports = {
  fetchChats,
  accessChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
};
