import { useState } from "react";
import fileDownload from "js-file-download";
import axios from "axios";
import { VideoPlayer } from "./components/video.player";

function App() {
  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [enableDownload, setEnableDownload] = useState(false);
  const [fileName, setFileName] = useState("");
  const [link, setLink] = useState("");
  const [youtubeCompress, setYoutubeCompress] = useState(false);
  const [youtube, setYoutube] = useState(false);

  //let's handle the download
  async function handleDownload(event) {
    event.preventDefault();
    const config = {
      responseType: "blob",
      headers: {
        filename: fileName,
        loc: "/videos/compression/",
      },
    };
    const response = await axios
      .get("http://127.0.0.1:8000/api/v2/download", config)
      .then((result) => {
        if (result) {
          fileDownload(result.data, fileName);
          setEnableDownload(false);
          window.location.reload();
        }
      });
  }

  //let's handle youtube download
  async function handleYoutubeDownload(event) {
    event.preventDefault();
    const config = {
      responseType: "blob",
      headers: {
        filename: fileName,
        loc: "/videos/youtube/compressed/",
      },
    };

    const response = await axios
      .get("http://127.0.0.1:8000/api/v2/download", config)
      .then((result) => {
        if (result) {
          fileDownload(result.data, fileName);
          setEnableDownload(false);
          window.location.reload();
        }
      });
  }

  //let's compress the file
  async function handlesubmit(event) {
    setLoading(true);
    event.preventDefault();
    console.log(file);
    const formData = new FormData();
    formData.append("video", file);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v2/compress",
        formData
      );
      if (response.data.status === "success") {
        setTimeout(() => {
          setLoading(false);
          setFileName(response.data.file);
          setEnableDownload(true);
          console.log(response.data.message, response.data.file);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleYoutube(event) {
    setYoutube(true);
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v2/youtube-download",
        { url: link }
      );
      if (response.data.status === "success") {
        setTimeout(() => {
          setFileName(response.data.file);
          setYoutubeCompress(true);
          console.log(response.data.message, response.data.file);
        }, 4000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //let's work on the frontend now
  return (
    <>
<VideoPlayer/>

      <br />

      <div align="center" className="container">
        <h1>Let's compress some UHD videos</h1>
        {youtube ? (
          ""
        ) : (
          <>
            <div className="container">
              <form onSubmit={handlesubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    <h4> Compress Video From your local storage</h4>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="video"
                    onChange={(event) => {
                      setFile(event.target.files[0]);
                    }}
                  />{" "}
                  <br />
                  {isLoading ? (
                    "compressing........"
                  ) : (
                    <button className="btn btn-success">compress</button>
                  )}
                  {enableDownload ? (
                    <button
                      className="btn btn-primary"
                      onClick={(event) => {
                        handleDownload(event);
                      }}
                    >
                      download
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        <div className="container">
          <form onSubmit={handleYoutube}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Compress Video From Youtube Paste Your Link
              </label>
              <input
                type="text"
                className="form-control"
                name="video"
                onChange={(event) => {
                  setLink(event.target.value);
                }}
              />{" "}
              <br />
              {youtubeCompress ? (
                <>
                  <button
                    onClick={(event) => {
                      handleYoutubeDownload(event);
                    }}
                    className="btn btn-warning"
                  >
                    Download
                  </button>
                </>
              ) : (
                ""
              )}
              {<button className="btn btn-primary">compress</button>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
