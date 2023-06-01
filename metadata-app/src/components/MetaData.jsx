import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [fileType, setFileType] = useState("");

  const handleFileChange = (event) => {
    setLoader(true);
    if (event.target.files[0].type === "video/mp4") {
      const fileData = [
        {
          name: "形式",
          value: "動画",
        },
      ];
      setFile(event.target.files[0]);
      setFileType("video");
      var video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(event.target.files[0]);
      video.onloadedmetadata = async () => {
        const tracks = video.captureStream().getTracks();
        const hasAudio = tracks.some(track => track.kind === 'audio');
        if (hasAudio) {
          fileData.push({
            name: "オーディオ",
            value: "あり",
          });
        } else {
          fileData.push({
            name: "オーディオ",
            value: "いいえ",
          });
        }
      };
      setTimeout(() => {
        fileData.push({
          name: "再生時間",
          value: Math.floor(video.duration) + " 秒",
        });
        const resulotion = gcd(video.videoWidth, video.videoHeight);
        fileData.push({
          name: "アスペクト比",
          value:
            video.videoWidth / resulotion +
            ":" +
            video.videoHeight / resulotion,
        });
        fileData.push({
          name: "解像度",
          value: video.videoWidth + "X" + video.videoHeight,
        });
        

        setLoader(false);
        setMetaData(fileData);
      }, 1000);
    } else {
      setFileType("image");
      getWidthFromFile(event.target.files[0], execImage);
      setFile(event.target.files[0]);
    }
  };

  const execImage = (THIS) => {
    const resulotion = gcd(THIS.width, THIS.height);
    const fileData = [
      {
        name: "形式",
        value: "Image",
      }
    ];

  
    fileData.push({
      name: "アスペクト比",
      value: THIS.width / resulotion + ":" + THIS.height / resulotion,
    });
    fileData.push({
      name: "解像度",
      value: THIS.width + "X" + THIS.height,
    });
    setMetaData(fileData);
    setLoader(false);
  };

  const gcd = (a, b) => {
    return b == 0 ? a : gcd(b, a % b);
  };

  const getWidthFromFile = (file, callback) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const dataUrl = event.target.result;
      const image = new Image();
      image.onload = function () {
        callback(this);
      };
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="file-upload file-upload-wrapper">
        <h4 className="file-title">
          <span>
            <img src="movie-icon.png" />
          </span>
          焼き芋できたて
        </h4>
        <div className="metaData-table-wrapper">
          <>
            <table>
              <tbody>
                {!loader &&
                  metaData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <th>{item.name}</th>
                        <td>{item.value}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </>
        </div>

        <form>

          <div className="file-input-preview">
            {loader && <div className="loader"></div>}
            {!loader && fileType == "image" && (
              <div className="file-preview">
                <img className="previewElement" src={URL.createObjectURL(file)} alt="Preview" />
              </div>
            )}
            {!loader && fileType == "video" && (
              <div className="file-preview">
                <video
                  src={URL.createObjectURL(file)}
                  id="video"
                  className="previewElement"
                  width="400"
                  controls
                  autoPlay
                  muted={true}
                >
                  Your browser does not support HTML video.
                </video>
     
              </div>
            )}
          </div>
          <div className="upload-button-wrapper">
            <label htmlFor="file-input" className="file-label">
            アップロード
            </label>
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              className="file-upload"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default FileUpload;
