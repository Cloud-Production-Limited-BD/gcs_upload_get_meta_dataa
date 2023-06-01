import React, { useRef, useState } from 'react';

const VideoUploader = () => {
  const fileInputRef = useRef(null);
  const [videos, setVideos] = useState([]);

  const handleFileChange = () => {
    const files = fileInputRef.current.files;

    const updatedVideos = Array.from(files).map(file => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = async () => {
        const tracks = video.captureStream().getTracks();
        const hasAudio = tracks.some(track => track.kind === 'audio');

        if (hasAudio) {
          console.log(`${file.name} has audio.`);
        } else {
          console.log(`${file.name} does not have audio.`);
        }

        URL.revokeObjectURL(video.src);
        video.remove();
      };

      return { file, video };
    });

    setVideos(updatedVideos);
  };

  return (
    <div>
      <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} />

      {videos.map(({ file, video }) => (
        <div key={file.name}>
          <p>{file.name}</p>
          <video
            src={video.src}
            controls
            style={{ maxWidth: '500px' }}
          ></video>
        </div>
      ))}
    </div>
  );
};

export default VideoUploader;