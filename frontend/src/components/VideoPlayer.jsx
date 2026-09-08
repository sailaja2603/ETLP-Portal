import { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";

function VideoPlayer({ video }, ref) {
  // video can be a string URL (embed) or an object { streamUrl, embedUrl }
  const isObject = typeof video === "object" && video !== null;
  const streamUrl = isObject ? video.streamUrl : null;
  const embedUrl = isObject ? video.embedUrl : video;

  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);

  // Attempt autoplay when the video source changes (useful after selecting a module)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // If using a stream URL, try to autoplay. Some browsers require muted autoplay.
    if (streamUrl) {
      const tryPlay = async () => {
        try {
          const wasMuted = v.muted;
          v.muted = true;
          await v.play();
          v.muted = wasMuted;
        } catch (e) {
          // autoplay failed; leave paused and show controls
          console.debug("Autoplay failed:", e?.message);
        }
      };
      // reset time to start and attempt play
      try { v.currentTime = 0; } catch (e) {}
      tryPlay();
    }
  }, [streamUrl, embedUrl]);

  useImperativeHandle(ref, () => ({
    getCurrentTime: () => {
      const v = videoRef.current;
      return v ? v.currentTime || 0 : 0;
    },
    getDuration: () => {
      const v = videoRef.current;
      return v ? v.duration || 0 : 0;
    }
  }));

  // If we have a stream URL (raw video bytes from backend), use native player.
  if (streamUrl) {
    return (
      <div className="video-player">
        <div className="video-viewport">
          <video
            ref={videoRef}
            src={streamUrl}
            controls={true}
            poster={isObject ? video.thumbnail : undefined}
            onError={() => setError(true)}
            onLoadedMetadata={() => setError(false)}
            style={{ width: "100%", height: "100%", background: "#000" }}
          />
        </div>

        {error && (
          <div className="video-error">
            <div>Playback error. Try opening the file directly.</div>
            <a href={embedUrl} target="_blank" rel="noreferrer">Open in Drive</a>
          </div>
        )}

      </div>
    );
  }

  // Fallback: embed via iframe (Google Drive preview)
  // For embeds, defer loading the iframe until the user clicks play (avoids cross-origin autoplay issues)
  const posterStyle = isObject && video.thumbnail ? { backgroundImage: `url(${video.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: '#000' };

  return (
    <div className="embed-player ratio ratio-16x9" style={{ position: 'relative', minHeight: '560px' }}>
      {!embedLoaded ? (
        <div className="embed-poster" style={{ ...posterStyle, width: '100%', height: '100%', minHeight: '560px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button className="embed-play" onClick={() => setEmbedLoaded(true)} style={{ padding: '16px 32px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 6px 20px rgba(56, 189, 248, 0.4)', cursor: 'pointer' }}>▶ Play Video</button>
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title="Course Video"
          allowFullScreen
          style={{ border: 0, width: "100%", height: "100%", minHeight: "560px" }}
        ></iframe>
      )}

      <div style={{ position: 'absolute', right: 14, bottom: 14, zIndex: 10 }}>
        <a href={embedUrl} target="_blank" rel="noreferrer" style={{ color: '#fff', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid #38bdf8', padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600' }}>Open in Drive ↗</a>
      </div>
    </div>
  );
}

export default forwardRef(VideoPlayer);
