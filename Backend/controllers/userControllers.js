const asyncHandler = require("express-async-handler");
const User = require("../Models/usersModel");
// const cloudinary = require("cloudinary").v2;
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  try {
    // accecpting the data from frontend
    const { name, email, password } = req.body;
    // let { pic } = req.body;
    // console.log(name, email, password);

    // checking that any feild is empty or not
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all the feilds");
    }

    // verifying the users with providing email
    const userExists = await User.findOne({ email });
    // console.log(userExists);
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      // throw new Error("Something went wrong!");
    }

    // if (pic) {
    //   const cloudinaryRes = await cloudinary.uploader.upload(pic);
    //   pic = cloudinaryRes.secure_url;
    // }

    // it's confirm that no user thers is and we have to create new user from this info
    const newUser = await User.create({
      name,
      email,
      password,
      // pic,
    });

    // new user created so save the user info
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        pic: newUser.pic,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400);
      throw new Error("fron registerUser method -> Failed to Create the User");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists || !(await userExists.matchPassword(password))) {
      res.status(400);
      throw new Error("Something went wrong!");
    }

    if (userExists && (await userExists.matchPassword(password))) {
      res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        pic: userExists.pic,
        token: generateToken(userExists._id),
      });
    } else {
      res.status(400);
      throw new Error("fron loginUser method -> Failed to Create the User");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// api/users?search=g
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const Users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // console.log("keyword ->", req.query.search);
  res.send(Users);
});

module.exports = { registerUser, loginUser, allUsers };
