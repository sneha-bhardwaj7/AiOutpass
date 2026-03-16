import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser, FiMapPin, FiCalendar, FiMessageSquare,
  FiPhone, FiMail, FiHome, FiCheckCircle,
  FiArrowRight, FiArrowLeft, FiAlertCircle, FiHash, FiClock,
} from "react-icons/fi";
import StudentLayout from "../components/StudentLayout";
import { useAuth } from "../context/AuthContext";

const STEPS = [
  { id: 1, label: "Personal Info",  icon: FiUser },
  { id: 2, label: "Trip Details",   icon: FiMapPin },
  { id: 3, label: "Parent Contact", icon: FiPhone },
  { id: 4, label: "Review",         icon: FiCheckCircle },
];

const Field = ({ label, icon: Icon, error, textarea, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1a0a0a] mb-1.5">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B1A1A]/50 pointer-events-none" />
      )}
      {textarea ? (
        <textarea
          {...props} rows={3}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl bg-[#FFF8F0] border text-sm resize-none focus:outline-none focus:ring-2 transition-all ${error ? "border-red-300 focus:ring-red-100" : "border-[#e8d5c4] focus:border-[#C41E3A]/50 focus:ring-[#C41E3A]/10"}`}
        />
      ) : (
        <input
          {...props}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl bg-[#FFF8F0] border text-sm focus:outline-none focus:ring-2 transition-all ${error ? "border-red-300 focus:ring-red-100" : "border-[#e8d5c4] focus:border-[#C41E3A]/50 focus:ring-[#C41E3A]/10"}`}
        />
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <FiAlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

export default function OutpassRequestForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step,           setStep]          = useState(1);
  const [loading,        setLoading]       = useState(false);
  const [submitted,      setSubmitted]     = useState(false);
  const [submittedId,    setSubmittedId]   = useState(null);
  const [errors,         setErrors]        = useState({});
  const [parentsList,    setParentsList]   = useState([]);   // ← INSIDE component
  const [selectedParent, setSelectedParent] = useState(null); // ← INSIDE component

  const [form, setForm] = useState({
    studentName:    user?.name       || "",
    studentId:      user?.studentId  || "",
    hostelRoom:     user?.hostelRoom || "",
    destination:    "",
    reason:         "",
    leaveDateFrom:  "",
    leaveDateTo:    "",
    timeFrom:       "",
    timeTo:         "",
    parentRelation: "",
    parentContact:  "",
    parentEmail:    "",
  });

  // ← INSIDE component
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/parents/list", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setParentsList(d.parents || []))
      .catch(() => setParentsList([]));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.studentName.trim()) e.studentName = "Required";
      if (!form.studentId.trim())   e.studentId   = "Required";
      if (!form.hostelRoom.trim())  e.hostelRoom  = "Required";
    }
    if (s === 2) {
      if (!form.destination.trim()) e.destination   = "Required";
      if (!form.leaveDateFrom)      e.leaveDateFrom = "Required";
      if (!form.leaveDateTo)        e.leaveDateTo   = "Required";
      if (form.leaveDateFrom && form.leaveDateTo && form.leaveDateTo < form.leaveDateFrom)
        e.leaveDateTo = "Return date must be after departure";
      if (!form.reason.trim()) e.reason = "Required";
    }
    if (s === 3) {
      if (!form.parentRelation.trim()) e.parentRelation = "Please select a parent";
      if (!form.parentContact)         e.parentContact  = "Parent phone missing";
      if (!form.parentEmail)           e.parentEmail    = "Parent email missing";
    }
    return e;
  };

  const nextStep = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const payload = {
      studentName:    form.studentName,
      studentId:      form.studentId,
      hostelRoom:     form.hostelRoom,
      destination:    form.destination,
      reason:         form.reason,
      leaveDateFrom:  form.leaveDateFrom,
      leaveDateTo:    form.leaveDateTo,
      parentRelation: form.parentRelation,
      parentContact:  form.parentContact,
      parentEmail:    form.parentEmail,
      ...(form.timeFrom ? { timeFrom: form.timeFrom } : {}),
      ...(form.timeTo   ? { timeTo:   form.timeTo   } : {}),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/outpass/apply", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          text.startsWith("<!DOCTYPE")
            ? "Backend not reachable. Is Express running on port 5000?"
            : `Unexpected response (${res.status}): ${text.slice(0, 100)}`
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);

      setSubmittedId(data?.outpass?._id || null);
      setSubmitted(true);

    } catch (err) {
      setErrors({ submit: err.message || "Submission failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (submitted) {
    return (
      <StudentLayout>
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={38} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-[#1a0a0a] font-['Playfair_Display'] mb-2">Request Submitted!</h2>
          <p className="text-[#5a3a3a]/60 mb-6">Your outpass request was saved successfully.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-left">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-3">⚡ n8n automation triggered:</p>
            {[
              { icon: "📧", text: `Approval email sent to ${form.parentEmail}` },
              { icon: "💬", text: "WhatsApp message sent to parent" },
              { icon: "📞", text: "Voice call placed to parent" },
              { icon: "🧠", text: "AI will analyze parent's response" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-amber-100 last:border-0">
                <span>{item.icon}</span>
                <span className="text-sm text-amber-700">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setSubmitted(false); setStep(1); setSelectedParent(null);
                setForm((f) => ({ ...f, destination: "", reason: "", leaveDateFrom: "", leaveDateTo: "", timeFrom: "", timeTo: "", parentRelation: "", parentContact: "", parentEmail: "" }));
              }}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#e8d5c4] rounded-xl text-sm font-semibold"
            >New Request</button>
            <button
              onClick={() => navigate(submittedId ? `/student/status/${submittedId}` : "/student/status")}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl text-sm font-semibold"
            >Track Status <FiArrowRight size={14} /></button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const StepIcon = STEPS[step - 1].icon;

  const reviewRows = [
    { icon: FiUser,          label: "Full Name",       val: form.studentName },
    { icon: FiHash,          label: "Student ID",      val: form.studentId },
    { icon: FiHome,          label: "Hostel Room",     val: form.hostelRoom },
    { icon: FiMapPin,        label: "Destination",     val: form.destination },
    { icon: FiCalendar,      label: "Departure",       val: form.leaveDateFrom ? new Date(form.leaveDateFrom).toLocaleDateString("en-IN") : "—" },
    { icon: FiCalendar,      label: "Return",          val: form.leaveDateTo   ? new Date(form.leaveDateTo).toLocaleDateString("en-IN")   : "—" },
    { icon: FiClock,         label: "Time",            val: [form.timeFrom, form.timeTo].filter(Boolean).join(" → ") || "—" },
    { icon: FiUser,          label: "Parent",          val: selectedParent ? `${selectedParent.name} (${selectedParent.relation})` : "—" },
    { icon: FiPhone,         label: "WhatsApp",        val: form.parentContact },
    { icon: FiMail,          label: "Parent Email",    val: form.parentEmail || "—" },
    { icon: FiMessageSquare, label: "Reason",          val: form.reason },
  ];

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#C41E3A] rounded-full" />
            <span className="text-[#C41E3A] text-sm font-semibold uppercase tracking-widest">Outpass Application</span>
          </div>
          <h1 className="text-3xl font-black text-[#1a0a0a] font-['Playfair_Display']">New Outpass Request</h1>
          <p className="text-[#5a3a3a]/60 text-sm mt-1">Fill all details carefully. Your parent is notified automatically on submit.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {STEPS.map(({ id, label, icon: Icon }) => (
            <div key={id} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${step === id ? "bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white shadow-md" : step > id ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#FFF8F0] text-[#5a3a3a]/70 border border-[#e8d5c4]"}`}>
              {step > id ? <FiCheckCircle size={13} /> : <Icon size={13} />}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{id}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#e8d5c4] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f0e0d0] bg-[#FFF8F0] flex items-center gap-2">
            <StepIcon size={15} className="text-[#C41E3A]" />
            <h3 className="font-bold text-[#1a0a0a]">Step {step} of {STEPS.length}: {STEPS[step - 1].label}</h3>
          </div>

          <div className="p-6 space-y-5">

            {/* ── Step 1: Personal Info ── */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name *"  icon={FiUser} placeholder="Your full name"  value={form.studentName} onChange={set("studentName")} error={errors.studentName} />
                  <Field label="Student ID *" icon={FiHash} placeholder="e.g. CS2021001" value={form.studentId}   onChange={set("studentId")}   error={errors.studentId} />
                </div>
                <Field label="Hostel Room *" icon={FiHome} placeholder="e.g. A-204" value={form.hostelRoom} onChange={set("hostelRoom")} error={errors.hostelRoom} />
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
                  ℹ️ Enter block + room together, e.g. <strong>A-204</strong>
                </div>
              </>
            )}

            {/* ── Step 2: Trip Details ── */}
            {step === 2 && (
              <>
                <Field label="Destination *" icon={FiMapPin} placeholder="City / Place you are visiting" value={form.destination} onChange={set("destination")} error={errors.destination} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Departure Date *" icon={FiCalendar} type="date" min={today} value={form.leaveDateFrom} onChange={set("leaveDateFrom")} error={errors.leaveDateFrom} />
                  <Field label="Return Date *"    icon={FiCalendar} type="date" min={form.leaveDateFrom || today} value={form.leaveDateTo} onChange={set("leaveDateTo")} error={errors.leaveDateTo} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Departure Time (optional)" icon={FiClock} type="time" value={form.timeFrom} onChange={set("timeFrom")} />
                  <Field label="Return Time (optional)"    icon={FiClock} type="time" value={form.timeTo}   onChange={set("timeTo")} />
                </div>
                <Field label="Reason *" icon={FiMessageSquare} placeholder="Purpose of travel…" value={form.reason} onChange={set("reason")} error={errors.reason} textarea />
              </>
            )}

            {/* ── Step 3: Parent Selection ── */}
            {step === 3 && (
              <>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
                  ⚡ Select your parent below. They will receive an <strong>approval email</strong> and <strong>WhatsApp</strong> message automatically.
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1a0a0a] mb-3">
                    Select Parent *
                  </label>

                  {parentsList.length === 0 ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
                      <FiAlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                      <span>No parents registered yet. Please contact your hostel admin to add your parent first.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {parentsList.map(p => (
                        <label
                          key={p._id}
                          className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                          style={{
                            border: `2px solid ${selectedParent?._id === p._id ? "#C41E3A" : "#e8d5c4"}`,
                            background: selectedParent?._id === p._id ? "#FFF0F0" : "#FFF8F0",
                          }}
                        >
                          <input
                            type="radio"
                            name="parent"
                            value={p._id}
                            checked={selectedParent?._id === p._id}
                            onChange={() => {
                              setSelectedParent(p);
                              setForm(f => ({
                                ...f,
                                parentRelation: p.relation,
                                parentContact:  p.phone,
                                parentEmail:    p.email,
                              }));
                            }}
                            style={{ accentColor: "#C41E3A", width: 16, height: 16 }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#1a0a0a]">
                              {p.name}{" "}
                              <span className="font-normal text-[#9ca3af] text-xs">({p.relation})</span>
                            </p>
                            <p className="text-xs text-[#6b7280] mt-0.5">
                              {p.phone} · {p.email}
                            </p>
                          </div>
                          {selectedParent?._id === p._id && (
                            <FiCheckCircle size={16} className="text-[#C41E3A] flex-shrink-0" />
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {errors.parentRelation && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <FiAlertCircle size={11} /> {errors.parentRelation}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* ── Step 4: Review ── */}
            {step === 4 && (
              <>
                <p className="text-sm text-[#5a3a3a]/60">Review your details before submitting.</p>
                <div className="bg-[#FFF8F0] rounded-xl border border-[#e8d5c4] divide-y divide-[#f0e0d0]">
                  {reviewRows.map((row, i) => {
                    const Icon = row.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 px-5 py-3">
                        <Icon size={14} className="text-[#C41E3A] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#5a3a3a]/50">{row.label}</p>
                          <p className="text-sm font-semibold text-[#1a0a0a] break-words">{row.val || "—"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-xs text-green-800 flex gap-2">
                  <span>🤖</span>
                  By clicking <strong>Submit Request</strong>, you confirm all details are correct.
                  An approval request will be sent to <strong>{selectedParent?.name || form.parentEmail}</strong>.
                </div>
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2 items-start">
                    <FiAlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                    <span>{errors.submit}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer buttons */}
          <div className="px-6 py-4 border-t border-[#f0e0d0] bg-[#FFF8F0] flex justify-between items-center">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#e8d5c4] rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              <FiArrowLeft size={14} /> Previous
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all"
              >
                Next <FiArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#C41E3A] text-white rounded-xl text-sm font-semibold disabled:opacity-60 hover:shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <><FiCheckCircle size={15} /> Submit Request</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}