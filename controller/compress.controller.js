//let's use ffmpeg to compress our videos
const ffmpeg = require("fluent-ffmpeg");
//check out the fluent-ffmpeg documentation for more information
const command = new ffmpeg();

const path = require("path");

const fs = require("fs");

//let's import uuid to create unique compressed filename:::::::
const {v4} = require("uuid");

//these modules are used for downloading youtube video in 4k quality
const ffmpegPath = require('ffmpeg-static');
const cp = require('child_process');
const stream = require('stream');
const ytdl = require("ytdl-core");






//let's create a youtube video muxer to merge audioStream and videoStream into one file
function youtubeMuxer(link, options = {}){

    const result = new stream.PassThrough({ highWaterMark: (options).highWaterMark || 1024 * 512 });

    //geting the video info
    ytdl.getInfo(link, options).then(info => {

        let audioStream = ytdl.downloadFromInfo(info, { ...options, quality: 
    'highestaudio' });

        let videoStream = ytdl.downloadFromInfo(info, { ...options, quality: 
    'highestvideo' });
    
    
        // create the ffmpeg process for muxing
        let ffmpegProcess = cp.spawn(ffmpegPath, [

            // supress non-crucial messages
            // '-loglevel', '8', '-hide_banner',

            // input audio and video by pipe
            '-i', 'pipe:3', '-i', 'pipe:4',

            // map audio and video correspondingly
            '-map', '0:a', '-map', '1:v',
            //set the video size to 1280x720
            // '-s','1280x720',
            // no need to change the codec
            '-c', 'copy',

            // output mp4 and pipe
            '-f', 'matroska', 'pipe:5'
        ],
        
        {
            // no popup window for Windows users
            windowsHide: true,
            stdio: [
                // silence stdin/out, forward stderr,
                'inherit', 'inherit', 'inherit',
                // and pipe audio, video, output
                'pipe', 'pipe', 'pipe'
            ]
        });
    
        audioStream.pipe(ffmpegProcess.stdio[3]);
        videoStream.pipe(ffmpegProcess.stdio[4]);
        ffmpegProcess.stdio[5].pipe(result);
    
    });
    return result;
    };



//let's create a function for downloading our compressed fie:
const downloadVideo = async (request, response, next) => {
  const {filename,loc} = request.headers;
  
  console.log(loc);
  if (!filename) {
    return response
      .status(404)
      .json({ status: "error", message: "please provide a valid filename" });
  }
  const filePath = path.join(__dirname, "..", `${loc}`, filename);

  return response.download(filePath);
};

//let's create a function for compressing the UHD file to HD?!:
const compressVideo = async (request, response, next) => {

  //let's create unique name for our files
  let i = 0;
  //lets extract the extension from our file
  const ext = String(request.files.video.name.split(".")[1]);
  //let's set the file destination :
  const folder = String(path.join(__dirname, "..", "/videos"));
  //let's extract the file name:
  const fileName = `${v4()}.${ext}`;
  const compressedFileName = `${v4()}.mp4`;
  console.log(folder);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  const video = request.files.video;
  if (!video) {
    return response
      .status(404)
      .json({ status: "error", message: "cannot find video " });
  }
  const uploadPath = path.join(__dirname, "..", "/videos/", fileName);

  const move = video.mv(uploadPath, function (error) {
    if (error) {
      return response.status(400).json({ status: "error", message: error });
    } else {
      console.log(uploadPath);
      let command = ffmpeg(uploadPath)
        .output(
          path.join(__dirname, "..", "/videos/compression/", compressedFileName)
        )
        .videoCodec("libx264")
        .audioCodec("libmp3lame")
        .format("mp4")
        .setSize("1280x720")
        .on("error", function (error) {
          return response
            .status(400)
            .json({ status: "error", message: error + "ffmpeg error" });
        })
        .on("progress", function (progress) {
          console.log(progress.frames);
        })
        .on("end", function () {
          console.log("finished");
          return response.status(200).json({
            status: "success",
            message: "file compressed",
            file: compressedFileName,
          });
        })
        .run();
    }
  });
};


//let's download video from youtube
const youtubeDownloader=(request,response,next)=>{
    const url = request.body.url;
    const filename = `${v4()}.mp4`;
    if(!url){
        return response.status(404).json({status:"error",message:"please provide a valid youtube link"});
    }

    const result = youtubeMuxer(url)
    .on("error",(error)=>{
        return response.status(404).json({status:"error",message:error});
    })
    .on("finish",()=>{
        console.log("musxing is finished now let's do compression");
        const filePath = path.join(__dirname,"..","/videos/youtube/",filename);
        const compressedFileName = `${v4()}.mp4`;
        let command = ffmpeg(filePath)
        .output(
          path.join(__dirname, "..", "/videos/youtube/compressed/", compressedFileName)
        )
        .videoCodec("libx264")
        .audioCodec("libmp3lame")
        .format("mp4")
        .setSize("1280x720")
        .on("error", function (error) {
          return response
            .status(400)
            .json({ status: "error", message: error + "ffmpeg error" });
        })
        .on("progress", function (progress) {
          console.log(progress.frames);
        })
        .on("end", function () {
          console.log("finished");
          return response.status(200).json({
            status: "success",
            message: "file compressed",
            file: compressedFileName,
          });
        })
        .run();
    })
    .pipe(fs.WriteStream(path.join(__dirname,"..","/videos/youtube/",filename)));



    
}

//let's export out endpoints
module.exports = { downloadVideo, compressVideo,youtubeDownloader };
