import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Camera, Video, CheckCircle, XCircle, RotateCcw,
  Upload, AlertCircle, Clock, User, Mic
} from "lucide-react";

export default function ParentVerifyPage() {
  const { id }         = useParams();
  const [searchParams] = useSearchParams();
  const action         = searchParams.get("decision");

  const videoRef = useRef(null);
  const mediaRef = useRef(null);
  const streamRef = useRef(null);

  const [photo,        setPhoto]        = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoBlob,    setVideoBlob]    = useState(null);
  const [recording,    setRecording]    = useState(false);
  const [countdown,    setCountdown]    = useState(10);
  const [step,         setStep]         = useState("starting");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [cameraReady,  setCameraReady]  = useState(false);

  const isApproved = action === "approved";
  const accent     = isApproved ? "#16a34a" : "#dc2626";
  const softBg     = isApproved ? "#f0fdf4" : "#fef2f2";
  const softBorder = isApproved ? "#bbf7d0" : "#fecaca";

  // ── Start camera ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!action) {
      setError("Invalid link — missing decision parameter.");
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width:  { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.oncanplay = () => {
            setCameraReady(true);
            setStep("photo");
          };
        }
      } catch (err) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Click the camera icon in your browser address bar, allow access, then refresh.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Could not start camera: " + err.message);
        }
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ── Capture photo ─────────────────────────────────────────────────────────
  const capturePhoto = () => {
    const video  = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;

    // Draw mirrored (so saved photo is NOT flipped)
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        setPhoto(blob);
        setPhotoPreview(URL.createObjectURL(blob));
        setStep("video");
      },
      "image/jpeg",
      0.92
    );
  };

  // ── Record video ──────────────────────────────────────────────────────────
  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;

    const mimeType = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ].find((m) => MediaRecorder.isTypeSupported(m)) || "";

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    const chunks   = [];

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      setVideoBlob(new Blob(chunks, { type: mimeType || "video/webm" }));
      setStep("review");
    };

    recorder.start(100);
    mediaRef.current = recorder;
    setRecording(true);
    setCountdown(10);

    let t = 10;
    const interval = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 0) {
        clearInterval(interval);
        if (recorder.state !== "inactive") recorder.stop();
        setRecording(false);
      }
    }, 1000);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!photo || !videoBlob) {
      setError("Missing photo or video. Please retake.");
      return;
    }
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("decision", action);
    fd.append("photo",    photo,     "photo.jpg");
    fd.append("video",    videoBlob, "video.webm");

    try {
      const res  = await fetch(`/api/outpass/verify/${id}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Server error (${res.status})`);
      setStep("done");
    } catch (err) {
      setError("Submission failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Retake ────────────────────────────────────────────────────────────────
  const handleRetake = () => {
    setStep("photo");
    setPhoto(null);
    setPhotoPreview(null);
    setVideoBlob(null);
    setError("");
  };

  // ── Step index ────────────────────────────────────────────────────────────
  const steps   = ["photo", "video", "review"];
  const stepIdx = steps.indexOf(step);

  // ── Shared styles ─────────────────────────────────────────────────────────
  const primaryBtn = (bg, disabled = false) => ({
    width: "100%",
    padding: "14px 0",
    background: disabled ? "#9ca3af" : bg,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s, transform 0.1s",
  });

  // ── Done screen ───────────────────────────────────────────────────────────
  if (step === "done") return (
    <div style={{
      minHeight: "100vh", background: "#f9fafb",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: softBg, border: `2px solid ${softBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
        }}>
          {isApproved
            ? <CheckCircle size={48} color="#16a34a" />
            : <XCircle    size={48} color="#dc2626" />}
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px", color: "#111827" }}>
          Verification Complete
        </h2>
        <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 15 }}>
          You have <strong style={{ color: accent }}>{action}</strong> this outpass request.
          The hostel admin will review your response and make the final decision.
        </p>

        <div style={{
          marginTop: 24, padding: "16px 20px",
          background: softBg, border: `1px solid ${softBorder}`,
          borderRadius: 14, fontSize: 13, color: "#374151",
          textAlign: "left", lineHeight: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14} color={accent} />
            <span>Photo uploaded to secure server</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14} color={accent} />
            <span>Video statement saved successfully</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14} color={accent} />
            <span>Admin has been notified</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontWeight: 800, fontSize: 22, margin: "0 0 4px", color: "#111827" }}>
            Parent Verification
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>
            Outpass ID:{" "}
            <code style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>
              {id}
            </code>
          </p>
        </div>

        {/* Action banner */}
        <div style={{
          background: softBg, border: `1px solid ${softBorder}`,
          borderRadius: 14, padding: "14px 18px", marginBottom: 16,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: isApproved ? "#dcfce7" : "#fee2e2",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {isApproved
              ? <CheckCircle size={18} color="#16a34a" />
              : <XCircle    size={18} color="#dc2626" />}
          </div>
          <div>
            <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 14, color: accent }}>
              {isApproved ? "Approving Outpass Request" : "Rejecting Outpass Request"}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
              Take a selfie photo, then record a short 10-second video statement.
            </p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 12, padding: "12px 16px",
            color: "#dc2626", fontSize: 13, marginBottom: 16,
            display: "flex", alignItems: "flex-start", gap: 8,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Step progress */}
        {step !== "starting" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Photo",  icon: <Camera size={13} />,       s: "photo"  },
              { label: "Video",  icon: <Video  size={13} />,       s: "video"  },
              { label: "Submit", icon: <Upload size={13} />,       s: "review" },
            ].map(({ label, icon, s }, i) => (
              <div key={s} style={{
                flex: 1, textAlign: "center", padding: "8px 4px",
                borderRadius: 10, fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                background: i < stepIdx ? "#dcfce7" : i === stepIdx ? accent : "#f3f4f6",
                color:      i < stepIdx ? "#16a34a" : i === stepIdx ? "#fff"  : "#9ca3af",
                transition: "all 0.3s",
              }}>
                {i < stepIdx ? <CheckCircle size={13} /> : icon}
                {label}
              </div>
            ))}
          </div>
        )}

        {/* ── Camera / Preview box ── */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "340px",
          borderRadius: 20,
          overflow: "hidden",
          background: "#111827",
          marginBottom: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>

          {/* LIVE CAMERA — always mounted so stream never drops */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Mirror so face looks natural (selfie view)
              transform: "scaleX(-1)",
              // Hide during review — but keep mounted so stream stays alive
              opacity: step === "review" ? 0 : 1,
            }}
          />

          {/* Photo preview overlay during review */}
          {step === "review" && photoPreview && (
            <img
              src={photoPreview}
              alt="Your captured photo"
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Starting overlay */}
          {step === "starting" && !error && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "#fff", gap: 12,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Camera size={28} color="#fff" />
              </div>
              <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>Starting camera…</p>
            </div>
          )}

          {/* Face guide circle overlay during photo step */}
          {step === "photo" && cameraReady && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                width: 180, height: 220,
                border: "3px dashed rgba(255,255,255,0.6)",
                borderRadius: "50%",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.25)",
              }} />
            </div>
          )}

          {/* Recording indicator */}
          {recording && (
            <>
              {/* Pulsing red border */}
              <div style={{
                position: "absolute", inset: 0,
                border: "3px solid #dc2626",
                borderRadius: 20,
                animation: "pulse 1s infinite",
                pointerEvents: "none",
              }} />
              {/* Countdown bubble */}
              <div style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(220,38,38,0.95)",
                borderRadius: 50, width: 56, height: 56,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column",
                boxShadow: "0 2px 12px rgba(220,38,38,0.4)",
              }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{countdown}</span>
                <span style={{ color: "#fca5a5", fontSize: 8, fontWeight: 700, letterSpacing: 1 }}>REC</span>
              </div>
            </>
          )}

          {/* Photo saved badge */}
          {step === "video" && !recording && (
            <div style={{
              position: "absolute", top: 14, left: 14,
              background: "rgba(22,163,74,0.95)",
              borderRadius: 20, padding: "5px 12px",
              fontSize: 12, color: "#fff", fontWeight: 700,
              display: "flex", alignItems: "center", gap: 5,
              boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
            }}>
              <CheckCircle size={12} />
              Photo saved
            </div>
          )}

          {/* Mic indicator during recording */}
          {recording && (
            <div style={{
              position: "absolute", bottom: 16, left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.7)",
              borderRadius: 20, padding: "6px 14px",
              fontSize: 12, color: "#fff", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Mic size={13} color="#f87171" />
              Recording… speak clearly
            </div>
          )}
        </div>

        {/* ── Controls ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Starting */}
          {step === "starting" && !error && (
            <div style={{
              textAlign: "center", color: "#9ca3af",
              fontSize: 13, padding: "8px 0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Clock size={14} />
              Waiting for camera permission…
            </div>
          )}

          {/* Take Photo */}
          {step === "photo" && (
            <>
              <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", margin: "0 0 4px" }}>
                Position your face inside the oval guide, then click below.
              </p>
              <button onClick={capturePhoto} style={primaryBtn("#8B1A1A")}>
                <Camera size={18} />
                Take Photo
              </button>
            </>
          )}

          {/* Record Video */}
          {step === "video" && (
            <>
              <div style={{
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 12, padding: "12px 16px",
                fontSize: 13, color: "#92400e",
                display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                <Mic size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  Say: <em>"I am [your name], and I <strong>{action}</strong> my child's outpass request."</em>
                </span>
              </div>
              {recording ? (
                <div style={{
                  textAlign: "center", padding: "18px",
                  background: "#fee2e2", borderRadius: 12,
                  border: "1px solid #fecaca",
                }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: "#dc2626", lineHeight: 1 }}>
                    {countdown}
                  </div>
                  <p style={{ fontSize: 13, color: "#9b1c1c", margin: "6px 0 0", fontWeight: 600 }}>
                    Recording in progress…
                  </p>
                </div>
              ) : (
                <button onClick={startRecording} style={primaryBtn("#dc2626")}>
                  <Video size={18} />
                  Start 10-Second Recording
                </button>
              )}
            </>
          )}

          {/* Review & Submit */}
          {step === "review" && (
            <>
              <div style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: 12, padding: "12px 16px",
                fontSize: 13, color: "#166534",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <CheckCircle size={15} />
                Photo and video captured. Review your photo above, then submit.
              </div>

              <button onClick={handleSubmit} disabled={loading} style={primaryBtn(accent, loading)}>
                {loading ? (
                  <>
                    <Clock size={18} />
                    Uploading… please wait
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Submit Verification
                  </>
                )}
              </button>

              <button
                onClick={handleRetake}
                style={{
                  ...primaryBtn("#6b7280"),
                  background: "transparent",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                }}
              >
                <RotateCcw size={16} />
                Retake Photo &amp; Video
              </button>
            </>
          )}
        </div>

        {/* Pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
        `}</style>

      </div>
    </div>
  );
}