import mongoose from "mongoose";
import connecDB from "./config/db.js";
import Order from "./models/ordermodel.js";
import User from "./models/usermodel.js";
import Product from "./models/productmodel.js";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import colors from "colors";
import { exit } from "process";

dotenv.config();
connecDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log(`data imported`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`error message:${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destrotData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log(`data destroyed`.red.inverse);
  } catch (error) {
    console.error(`error message:${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destrotData();
} else {
  importData();
}
