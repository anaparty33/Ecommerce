import User from "../models/usermodel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(email);

  const user = await User.findOne({ email: email });

  console.log(user);

  if (user && (await user.checkPassword(password))) {
    res.send({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Unauthorized error");
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  res.send("user profile route data");
});
