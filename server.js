const express = require("express");
const app = express();
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname+"/views");
const allowImagemimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
];

let uploadedImageName = "";
let allImagesName =[];
var storage = multer.diskStorage({
    destination: "./public/image",
    filename: function(req, file, cb){
        crypto.pseudoRandomBytes(16, function(err, raw){
            if (err) return(err);
            uploadedImageName = raw.toString("hex")+path.extname(file.originalname);
            cb(null, uploadedImageName);
                
            
        });
    }
});

const upload = multer ({
    dest: "public/image",
    limits: 10*1024*1024,
    fileFilter: (req, file, cb) => {
        cb(null, allowImagemimeTypes.includes(file.mimetype));
    },
    storage: storage
});

router.get("/", (req, res) => {
    fs.readdir("public/image", (err, files) => {
        if (err) {
            console.error(err);
            res.render("home", {
                allImagesName: [],
                error: "Images non disponibles"
            });
        } else {
            res.render("home", {allImagesName: files, error: ""});
            return files;
        }
    });
});

router.get("/image/new", (req, res) => {
    res.render("image-form", { uploadedImageName });
});

router.post("/image/new", upload.single("picture"), (req, res) =>{
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    res.render("image-form", { uploadedImageName });
});
 app.use("/", router);

const PORT = 3000;
app.listen(3000, () =>{
    console.log("listenning 3000");
});
