import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

const protect = (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  next();
};

export default protect;
