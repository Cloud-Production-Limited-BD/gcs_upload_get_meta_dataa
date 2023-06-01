import React, { useState } from "react";
import ReactPlayer from "react-player";


const VideoPlayer = () => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [file, setFile] = useState(null);
  const [imageMetaData, setImageMetaData] = useState(null);
  const [videoMetadata, setVideoMetadata] = React.useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [videoResolution, setVideoResolution] = useState("");
  const [loading, setLoading] = useState(false);
  const execImage = (THIS) => {
    const resolution = gcd(THIS.width, THIS.height);
    console.log(THIS);
    const fileData = [
      {
        name: "形式",
        value: "Image",
      },
    ];

    setImageMetaData({
      type: "image",
      aspectRatio: `${
        THIS.width / resolution + ":" + THIS.height / resolution
      }`,
      resolution: `${THIS.width + "X" + THIS.height}`,
    });
  };

  const getWidthFromFile = (file, callback) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const dataUrl = event.target.result;
      const image = new Image();
      image.onload = function () {
        callback(this);
        setLoading(false);
      };
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const gcd = (a, b) => {
    return b == 0 ? a : gcd(b, a % b);
  };
  const handleFileUpload = (e) => {
    setLoading(true);

    const selectedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(selectedFile);
    setFile(e.target.files[0]);

    console.log(e.target.files[0]);

    if (e.target.files[0].type.includes("video")) {
      
      setIsVideo(true);
    } else {
      getWidthFromFile(e.target.files[0], execImage);

      setIsVideo(false);
    }

    // setDataLoaded(true);

    // setMediaUrl(fileUrl);

    setTimeout(() => {
    setDataLoaded(true);
    setLoading(false);
    setMediaUrl(fileUrl);
    }, 2000);

  };

  const handleVideoDuration = (duration) => {
    setVideoMetadata((prevMetadata) => ({
      ...prevMetadata,
      duration: duration.toFixed(2),
    }));
  };

  const handleLoadedMetadata = () => {
    setLoading(false);
  };
  const handleVideoReady = () => {

    const player = document.querySelector("video");
    const resolution = `${player.videoWidth}x${player.videoHeight}`;
    setVideoResolution(resolution);

    const hasSound =
      player.mozHasAudio ||
      Boolean(player.webkitAudioDecodedByteCount) ||
      Boolean(player.audioTracks?.length);
    const { videoWidth, videoHeight } = player;
    const aspectRatio = videoWidth / videoHeight;
    console.log('hello hello')
    setVideoMetadata((prevMetadata) => ({
      ...prevMetadata,
      hasSound,
      resolution,
      aspectRatio: aspectRatio.toFixed(2),
    }));
  
  };

  React.useEffect(() => {
    if (mediaUrl) {
      const videoType = mediaUrl.split(".").pop();
      setVideoMetadata({ type: "video" });
    }
  }, [mediaUrl]);

  return (
    <div className="file-upload file-upload-wrapper">
        <h4 className="file-title">
            <span>
              <img src="movie-icon.png" alt="icon" />
            </span>
            焼き芋できたて
          </h4>
      {!loading && videoMetadata && isVideo && dataLoaded && (
        <div className="metaData-table-wrapper">
        
          <table>
            <thead>
              <tr>
                <th>Metadata</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>形式</td>
                <td>{videoMetadata.type}</td>
              </tr>
              <tr>
                <td>オーディオ</td>
                <td>{videoMetadata.hasSound ? "あり" : "いいえ"}</td>
              </tr>
              <tr>
                <td>アスペクト比</td>
                <td>{videoMetadata.aspectRatio}</td>
              </tr>
              <tr>
                <td>再生時間</td>
                <td>{videoMetadata.duration} 秒</td>
              </tr>
              <tr>
                <td>解像度</td>
                <td>{videoMetadata.resolution}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {!loading && !isVideo && dataLoaded && (
        <>
          <h4 className="file-title">
              <span>
                <img src="movie-icon.png" />
              </span>
              焼き芋できたて
            </h4>
          <div className="metaData-table-wrapper">
          
            <table>
              <thead>
                <tr>
                  <th>Metadata</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>形式</td>
                  <td>{imageMetaData?.type}</td>
                </tr>

                <tr>
                  <td>アスペクト比</td>
                  <td>{imageMetaData?.aspectRatio}</td>
                </tr>
                <tr>
                  <td>解像度</td>
                  <td>{imageMetaData?.resolution}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="file-input-preview">
        {/* {loading &&   <div className="loader">loading</div>} */}

        <div className="file-preview">

        {loading ? (
        <div className="loader"></div>
      ) : (
        <>
        {!loading && isVideo &&  (
                <ReactPlayer
                  url={mediaUrl}
                  className="previewElement"
                  width="400"
                  controls
                  onDuration={handleVideoDuration}
                  onReady={handleVideoReady}
                  onLoadedMetadata={handleLoadedMetadata}
                  autoPlay={true}
                />


     




        )}

        {!loading && !isVideo && dataLoaded && (
          <img className="previewElement" src={mediaUrl} alt="Preview" />
        )}
        </>
      )}

         
        </div>
      </div>

      <div className="upload-button-wrapper">
        <label htmlFor="file-input" className="file-label">
          アップロード
        </label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileUpload}
          className="file-upload"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
