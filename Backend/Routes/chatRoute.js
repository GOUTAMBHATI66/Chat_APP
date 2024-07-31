const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChats,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChats);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroup);
router.route("/grouprename").put(protect, renameGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/deletegroup").delete(protect, deleteGroup);

module.exports = router;
