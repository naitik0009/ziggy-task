import { useState, useEffect } from "react";

import axios from "axios";


export const VideoPlayer = () => {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    
    const getallvideos= async ()=> {
      const res = await axios
        .get("http://127.0.0.1:8000/api/v2/ziggy/getAllVideos")
        .catch((error) => {
          console.log(error);
        });
          if (res.data.status === "success") {
            setVideos(res.data.videos);
            console.log("i'm succeding",videos);
          } else if (res.data.status === "error" && res.status !== 200) {
            console.log(res.data.status, res.data.message);
          }
    }
      console.log("inside use effect");
      getallvideos();
      console.log(videos.length);
    
    
  },[]);

 

  return (
    <>
      <div className="container">
        <h1 align="center">Video Player</h1>
        <video width="320" height="240" preload="auto" controls>
          <source
            src={videos.length > 0 ?`http://127.0.0.1:8000/${videos[0].name}`:"hello.mp4"}
            type="video/mp4"
          />
        </video>
      </div>
    </>
  );
};
