const multer = require("multer")
const path = require("path")



const storage = multer.diskStorage({
  destination: function ( req, file, cb ) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb ) {
    console.log(req)
    const uniqueSuffix = req.body.username + '-PFP';
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage,
  limits: {fileSize	:1000000}, 
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== '.gif') {
      return cb(new Error("Only images are allowed."))
    }
    cb(null, true)
  }
})


module.exports = upload;