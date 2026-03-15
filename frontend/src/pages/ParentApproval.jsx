// src/pages/ParentApproval.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Shield, User, MapPin, Calendar, MessageSquare, CheckCircle,
  XCircle, Camera, Upload, AlertTriangle, Clock,
} from "lucide-react";
import { parentAPI } from "../services/api";

export default function ParentApproval() {
  const { token } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("view"); // view | otp | media | done | error
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [response, setResponse] = useState("");
  const [file, setFile] = useState(null);
  const [decision, setDecision] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    parentAPI.getRequestByToken(token)
      .then((data) => setRequest(data.request || data))
      .catch(() => setErrorMsg("This link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleOtpChange = (val, i) => {
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleDecisionClick = (d) => {
    setDecision(d);
    setStep("otp");
  };

  const handleOtpSubmit = async () => {
    setActionLoading(true);
    try {
      await parentAPI.verifyOTP(token, otp.join(""));
      setStep("media");
    } catch (err) {
      setErrorMsg(err.message || "Invalid OTP");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("decision", decision);
      formData.append("response", response);
      if (file) formData.append("media", file);
      await parentAPI.submitApproval(token, formData);
      setStep("done");
    } catch (err) {
      setErrorMsg(err.message || "Submission failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-burgundy/20 border-t-burgundy rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-burgundy/60 font-medium">Loading request details...</p>
      </div>
    </div>
  );

  if (errorMsg && !request) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h2 className="font-display font-bold text-xl text-burgundy mb-2">Link Invalid</h2>
        <p className="text-burgundy/50 text-sm">{errorMsg}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-6">
        <div className="flex items-center gap-3 justify-center">
          <div className="w-10 h-10 bg-burgundy rounded-xl flex items-center justify-center shadow-burgundy">
            <Shield size={20} className="text-cream" />
          </div>
          <div>
            <p className="font-display font-bold text-burgundy text-xl">OutpassAI</p>
            <p className="text-xs text-burgundy/40">Parent Approval Portal</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Done state */}
        {step === "done" && (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center animate-scale-in">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 ${decision === "approve" ? "bg-green-50" : "bg-red-50"}`}>
              {decision === "approve"
                ? <CheckCircle size={36} className="text-green-500" />
                : <XCircle size={36} className="text-red-500" />}
            </div>
            <h2 className="font-display text-2xl font-bold text-burgundy mb-3">
              Response Recorded!
            </h2>
            <p className="text-burgundy/60 mb-2">
              You have <strong>{decision === "approve" ? "approved" : "rejected"}</strong> the outpass request for{" "}
              <strong>{request?.studentName}</strong>.
            </p>
            <p className="text-sm text-burgundy/40 bg-cream-50 rounded-xl px-4 py-3 border border-cream-100">
              The college admin has been notified. This decision has been logged for security.
            </p>
          </div>
        )}

        {/* View state */}
        {step === "view" && request && (
          <div className="space-y-4 animate-slide-up">
            {/* Request Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-burgundy/8 rounded-xl flex items-center justify-center text-burgundy font-bold">
                  {request.studentName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-burgundy">Outpass Request</h2>
                  <p className="text-xs text-burgundy/40">from {request.studentName}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <User size={14} />, label: "Student", val: `${request.studentName} (${request.collegeId})` },
                  { icon: <MapPin size={14} />, label: "Destination", val: request.destination },
                  { icon: <Calendar size={14} />, label: "Dates", val: `${new Date(request.outpassDate).toLocaleDateString("en-IN")} → ${new Date(request.returnDate).toLocaleDateString("en-IN")}` },
                  { icon: <MessageSquare size={14} />, label: "Reason", val: request.reason },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-3 bg-cream-50 rounded-xl px-4 py-3 border border-cream-100">
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-burgundy/60 flex-shrink-0 mt-0.5 shadow-sm">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-burgundy/40 font-semibold uppercase tracking-wide">{info.label}</p>
                      <p className="text-sm font-medium text-burgundy">{info.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <p className="text-sm font-semibold text-burgundy mb-4 text-center">
                Do you approve this outpass request?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleDecisionClick("approve")}
                  className="flex flex-col items-center gap-2 py-4 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 hover:border-green-400 transition-all group"
                >
                  <CheckCircle size={28} className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-green-700 text-sm">Approve</span>
                </button>
                <button
                  onClick={() => handleDecisionClick("reject")}
                  className="flex flex-col items-center gap-2 py-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 hover:border-red-400 transition-all group"
                >
                  <XCircle size={28} className="text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-red-700 text-sm">Reject</span>
                </button>
              </div>
              <p className="text-[11px] text-burgundy/30 text-center mt-4 flex items-center justify-center gap-1">
                <Shield size={10} /> Your response will be verified with OTP for security.
              </p>
            </div>
          </div>
        )}

        {/* OTP State */}
        {step === "otp" && (
          <div className="bg-white rounded-2xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-burgundy/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-burgundy" />
              </div>
              <h3 className="font-display font-bold text-xl text-burgundy mb-2">OTP Verification</h3>
              <p className="text-sm text-burgundy/50">
                Enter the 6-digit OTP sent to your WhatsApp / SMS to confirm your {decision === "approve" ? "approval" : "rejection"}.
              </p>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              {otp.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:border-burgundy focus:outline-none transition-all text-burgundy"
                />
              ))}
            </div>

            {errorMsg && <p className="text-center text-sm text-red-500 mb-4">{errorMsg}</p>}

            <button
              onClick={handleOtpSubmit}
              disabled={otp.join("").length < 6 || actionLoading}
              className="w-full py-3 bg-burgundy text-cream rounded-xl font-semibold hover:bg-burgundy-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-burgundy"
            >
              {actionLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Media State */}
        {step === "media" && (
          <div className="bg-white rounded-2xl shadow-card p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${decision === "approve" ? "bg-green-50" : "bg-red-50"}`}>
                <Camera size={28} className={decision === "approve" ? "text-green-600" : "text-red-500"} />
              </div>
              <h3 className="font-display font-bold text-xl text-burgundy mb-2">Identity Verification</h3>
              <p className="text-sm text-burgundy/50">
                Upload a live photo or short video to confirm your identity. This prevents unauthorized approvals.
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-burgundy/60 uppercase tracking-wide mb-2">Your Response (Optional)</label>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={decision === "approve" ? "e.g. I approve this request. My child has informed me." : "e.g. I do not approve this trip."}
                rows={3}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-burgundy/40 resize-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-burgundy/60 uppercase tracking-wide mb-2">Live Photo / Video</label>
              <label className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-cream-200 rounded-xl cursor-pointer hover:border-burgundy/30 hover:bg-cream-50 transition-all">
                <Upload size={24} className="text-burgundy/30" />
                <div className="text-center">
                  <p className="text-sm font-medium text-burgundy/60">{file ? file.name : "Click to upload"}</p>
                  <p className="text-xs text-burgundy/30">JPG, PNG, MP4 up to 50MB</p>
                </div>
                <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
              </label>
            </div>

            {errorMsg && <p className="text-center text-sm text-red-500 mb-4">{errorMsg}</p>}

            <button
              onClick={handleFinalSubmit}
              disabled={actionLoading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-md disabled:opacity-60 ${decision === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {actionLoading ? "Submitting..." : `Confirm ${decision === "approve" ? "Approval" : "Rejection"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}