// finding current user that want to chat
function getSender(loggedUser, arrOfUsers) {
  return arrOfUsers.find((user) => user?.name !== loggedUser?.name);
}

function getSelectedUser(loggedUser, arrOfUsers) {
  return arrOfUsers.find((user) => user?.name !== loggedUser?.name);
}

// functionality of appreans of group members like logged in user at top then group admin and then all the members
const arrangeMembers = (allMembers, loggedInUser, groupAdmin) => {
  return allMembers.sort((a, b) => {
    if (a?._id === loggedInUser?._id) return -1; // logged-in user first
    if (b?._id === loggedInUser?._id) return 1;
    if (a?._id === groupAdmin?._id && b?._id !== groupAdmin?._id) return -1; // admins next
    if (a?._id !== groupAdmin?._id && b?._id === groupAdmin?._id) return 1;
    return 0; // other members
  });
};

const isSameSenderMargin = (allmessages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < allmessages.length - 1 &&
    allmessages[i + 1]?.sender?._id === m.sender?._id &&
    allmessages[i]?.sender?._id !== userId
  )
    return 33;
  else if (
    (i < allmessages.length - 1 &&
      allmessages[i + 1]?.sender?._id !== m.sender?._id &&
      allmessages[i]?.sender?._id !== userId) ||
    (i === allmessages.length - 1 && allmessages[i]?.sender?._id !== userId)
  )
    return 0;
  else return "auto";
};

const isSameUser = (allmessages, m, i) => {
  if (i === 0) return true;
  return i > 0 && allmessages[i - 1]?.sender?._id !== m.sender?._id;
};

// functionality of showing unread messages
let messageCount = 0;
const unreadMessages = (userOrGroupInfo, loggedInUser) => {
  if (userOrGroupInfo.latestMessage?.sender?._id !== loggedInUser?._id) {
    messageCount++;
    return messageCount;
  } else {
    messageCount = 0;
  }

  return;
};

export {
  getSender,
  getSelectedUser,
  arrangeMembers,
  isSameUser,
  isSameSenderMargin,
  unreadMessages,
};
