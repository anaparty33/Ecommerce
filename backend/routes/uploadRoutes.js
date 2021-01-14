import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Disk Storage Engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const fileTypes = /jpg|jpeg|png/; // regex
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // checking the file extension
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb("file cannot be uploaded, Images Only");
  }
};

// UPLOAD CONFIGUTARION

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  //   res.send("hitting this route");
  res.send(`/${req.file.path.replace(/\\/g, "/")}`); // send this path to the front end
});

export default router;
