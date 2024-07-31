const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/usersModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { messageContent, chatId } = req.body;

  // console.log("chatId -> ", typeof chatId);
  // console.log("chatId -> ", chatId);
  // console.log("req.user._id -> ", typeof req.user._id);

  if (!messageContent || !chatId) {
    console.log("Invalid data passed into the body.");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: messageContent,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    // console.log("newMessage 25 -> ", newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // console.log("newMessage 36 -> ", newMessage);
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
