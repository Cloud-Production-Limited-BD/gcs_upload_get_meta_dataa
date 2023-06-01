import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import { FiExternalLink } from "react-icons/fi";
import Loader from "./Loader";
export default function Home() {
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<any>(null);
  const [dataloaded, setDataloaded] = useState(true);
  const [fileUploadDone, setFileUploadDone] = useState(false);
  const [error, setError] = useState(false);
  const handleSubmit = async (e: any) => {
    setDataloaded(false);
    e.preventDefault();
    const response = await fetch(`/api/fileupload?name=${file.data.name}`, {
      method: "GET"
    });
    const responseWithBody = await response.json();

    if (response.status === 200) {
      setUrl(responseWithBody.url);
    } else {
      setError(true);
      console.log("error in generating url");
    }
    const response1 = await axios.put(responseWithBody.url, file.data, {
      headers: {
        "Content-Type": `${file.data.type}`
      }
    });
    if (response1.status === 200) {
      setFileUploadDone(true);
    } else {
    }
    setDataloaded(true);
    //  console.log(response1, file.data.type);
  };
  const handleFileChange = (e: any) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    };
    setFile(img);
  };

  return (
    <>
      <Head>
        <title>File Upload to GCS using NEXTJS</title>
      </Head>
      <div className="view-all-file-container">
        <a href={`${process.env.viewAllFiles}`} target="_blank">
          View All files
        </a>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="image-preview-container">
            {file ? (
              <Image
                width={"400"}
                height={"400"}
                src={file.preview}
                alt="File to upload"
              />
            ) : (
              <Image
                width={"400"}
                height={"400"}
                src={`${process.env.fallBackImageUrl}`}
                alt="Fallback"
              />
            )}
          </div>
          <div className="file-name">
            {file && file.data.name}
            {fileUploadDone && (
              <a
                href={`${process.env.bucketImageUrl}${file.data.name}`}
                target="_blank"
                rel="noreferrer"
              >
                <FiExternalLink />
              </a>
            )}
          </div>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="custom-file-input"
          ></input>
          <button
            className="submit-button"
            type="submit"
            disabled={!file}
            onClick={handleSubmit}
          >
            Submit
          </button>
          {fileUploadDone && (
            <span style={{ marginTop: "20px" }}>
              File upload is done successfully.{" "}
              <span
                onClick={() => {
                  setFileUploadDone(false);
                  setFile(null);
                  setDataloaded(true);
                }}
              >
                Click to Upload Again
              </span>
              {error && (
                <span style={{ marginTop: "20px" }}>
                  There is some error in file uploading. Please try again later
                </span>
              )}
            </span>
          )}
          {!dataloaded && <Loader />}
        </form>
      </div>
    </>
  );
}
