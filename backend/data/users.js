import bcrypt from "bcryptjs";

const users = [
  {
    name: "Nirmala",
    email: "nirmal@exmaple.com",
    password: bcrypt.hashSync("12345678", 10),
    isAdmin: true,
  },
  {
    name: "Srinivas",
    email: "srinivas@exmaple.com",
    password: bcrypt.hashSync("12345678", 8),
  },
  {
    name: "bhavani",
    email: "bhavani@exmaple.com",
    password: bcrypt.hashSync("12345678", 8),
  },
];

export default users;
