import fileDownload from "js-file-download";
import axios from "axios";
export const VideoPlayer = (props) => {
  console.log(props.videos);

  const handleDownload= async (fileName)=> {
    const config = {
      responseType: "blob",
      headers: {
        filename: fileName,
        loc: "/videos/ziggy/",
      },
    };
    const response = await axios
      .get("http://127.0.0.1:8000/api/v2/download", config)
      .then((result) => {
        if (result) {
          fileDownload(result.data, fileName);
        }
      });
  }










  return (
    <>
      <div className="container">
        <h1 align="center">Video Player</h1>
        {props.videos.map((result) => {
          return result.map((value, index) => (
            <>
            <button onClick={()=>{handleDownload(value.name)}} className="btn btn-primary">download</button>
              <video width="320" height="240" preload="auto" controls>
                <source
                  key={index}
                  src={`http://127.0.0.1:8000/${value.name}`}
                  type="video/mp4"
                />
                 
              </video><br/>
             
            </>
          ));
        })}
      </div>
    </>
  );
};
