const express = require("express");
const router = express.Router();
const {downloadVideo,compressVideo,youtubeDownloader} = require("../controller/compress.controller");


//for downloading the video
router.route("/download").get(downloadVideo);

//for uploading and compressing the video to 720p
router.route("/compress").post(compressVideo);

//for downloading youtube video and compressing it to 720p
router.route("/youtube-download").post(youtubeDownloader);


module.exports = router;