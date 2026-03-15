// src/pages/ParentVerifyPage.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function ParentVerifyPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action"); // "approved" or "rejected"

  const videoRef   = useRef(null);
  const mediaRef   = useRef(null);
  const [photo, setPhoto]   = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [step, setStep]     = useState("photo"); // "photo" | "video" | "review" | "done"
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Start camera
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => { videoRef.current.srcObject = stream; })
      .catch(() => setError("Camera/microphone access denied. Please allow and refresh."));
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => { setPhoto(blob); setStep("video"); });
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => setVideoBlob(new Blob(chunks, { type: "video/webm" }));
    recorder.start();
    mediaRef.current = recorder;
    setRecording(true);
    setCountdown(10);

    // Auto-stop after 10 seconds
    let t = 10;
    const interval = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 0) {
        clearInterval(interval);
        recorder.stop();
        setRecording(false);
        setStep("review");
      }
    }, 1000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("decision", action);
    fd.append("photo", photo, "photo.jpg");
    fd.append("video", videoBlob, "video.webm");

    try {
      const res = await fetch(`/api/outpass/verify/${id}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") return (
    <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{action === "approved" ? "✅" : "❌"}</div>
      <h2 style={{ fontWeight: 700 }}>Verification Complete</h2>
      <p style={{ color: "#666", marginTop: 8 }}>
        You have <strong>{action}</strong> the outpass request.
        The hostel admin will review your response and make the final decision.
      </p>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: "0 24px", fontFamily: "sans-serif" }}>
      <div style={{ background: action === "approved" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${action === "approved" ? "#bbf7d0" : "#fecaca"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 14 }}>
        You are <strong>{action === "approved" ? "APPROVING" : "REJECTING"}</strong> this outpass request.
        Please capture your photo and a short video statement to verify.
      </div>

      {error && <p style={{ color: "red", marginBottom: 12, fontSize: 14 }}>{error}</p>}

      {/* Live camera preview */}
      <video ref={videoRef} autoPlay muted playsInline
        style={{ width: "100%", borderRadius: 12, background: "#000", aspectRatio: "4/3", marginBottom: 16 }} />

      {step === "photo" && (
        <button onClick={capturePhoto}
          style={{ width: "100%", padding: "12px", background: "#8B1A1A", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          📸 Take Photo
        </button>
      )}

      {step === "video" && (
        <div>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
            ✅ Photo captured. Now record a 10-second video saying whether you approve or reject this outpass.
          </p>
          {recording ? (
            <div style={{ textAlign: "center", padding: 16, background: "#fee2e2", borderRadius: 10 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#dc2626" }}>{countdown}s</div>
              <div style={{ fontSize: 14, color: "#555" }}>Recording… speak clearly</div>
            </div>
          ) : (
            <button onClick={startRecording}
              style={{ width: "100%", padding: "12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              🎥 Start 10-Second Recording
            </button>
          )}
        </div>
      )}

      {step === "review" && (
        <div>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>✅ Photo + video captured. Submit to complete verification.</p>
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#8B1A1A", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Submitting…" : "Submit Verification"}
          </button>
        </div>
      )}
    </div>
  );
}