import { useState } from "react";
import axios from "axios";
export const UploadViode = () => {
  const [file, setFile] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("video", file);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v2/compress",
        formData
      );
      if (response.data.status === "success") {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="video">Upload your video</label>
        <input
          type="file"
          className="form-control"
          name="video"
          onChange={(event) => {
            setFile(event.target.files[0]);
          }}
        />
        <button type="submit">upload</button>
      </form>
    </>
  );
};
