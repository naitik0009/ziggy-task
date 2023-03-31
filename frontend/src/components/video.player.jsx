import VideoJS from "video.js";

export const VideoPlayer = (props) => {
  return (
    <>
      <div className="container">
        <h1 align="center">Video Player</h1>
        <video width="320" height="240" preload="auto" controls>
          <source src="" type="video/mp4" />
        </video>
      </div>
    </>
  );
};
