import React, { useState } from 'react';

function VideoAudioDetection() {
  const [videoSrc, setVideoSrc] = useState('');
  const [hasAudio, setHasAudio] = useState(false);

  function checkAudio(video) {
    return (
      video.mozHasAudio ||
      Boolean(video.webkitAudioDecodedByteCount) ||
      Boolean(video.audioTracks?.length)
    );
  }

  function hasVideoGotAudio(src) {
    const video = document.createElement('video');
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';

    return new Promise((resolve, reject) => {
      video.addEventListener('error', reject);

      video.addEventListener(
        'canplay',
        () => {
          video.currentTime = 0.99;
        },
        { once: true } // Important because 'canplay' can be fired hundreds of times.
      );

      video.addEventListener('seeked', () => resolve(checkAudio(video)), {
        once: true,
      });

      video.src = src;
    });
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const videoSrc = event.target.result;
      setVideoSrc(videoSrc);

      hasVideoGotAudio(videoSrc)
        .then((hasAudio) => {
          setHasAudio(hasAudio);
        })
        .catch((error) => {
          console.error('Error checking video audio:', error);
        });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {videoSrc && <video src={videoSrc} controls />}
      {hasAudio ? <p>Video has audio</p> : <p>Video does not have audio</p>}
    </div>
  );
}

export default VideoAudioDetection;
