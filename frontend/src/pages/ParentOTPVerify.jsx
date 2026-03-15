import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiShield, FiLock, FiCheckCircle } from 'react-icons/fi'

const ParentOTPVerify = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const refs = useRef([])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Please enter the complete 6-digit OTP'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setVerified(true)
      setTimeout(() => navigate(`/parent/approve/${token}`), 1500)
    }, 1200)
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center animate-slide-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="font-serif text-xl font-bold text-burgundy-800">Identity Verified!</h2>
          <p className="text-sm text-burgundy-500 mt-2">Redirecting to approval form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-burgundy-500 rounded-xl flex items-center justify-center">
            <FiShield className="text-cream-100 w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-burgundy-800 text-xl">PassWithAI</span>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-burgundy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiLock size={22} className="text-burgundy-500" />
          </div>
          <h1 className="font-serif text-xl font-bold text-burgundy-800 mb-2">OTP Verification</h1>
          <p className="text-sm text-burgundy-500 mb-2">
            A 6-digit OTP has been sent to your registered WhatsApp number.
          </p>
          <p className="text-xs text-burgundy-400 mb-8 font-mono">+91 ****3210</p>

          {/* OTP inputs */}
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => refs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-lg font-bold font-mono bg-cream-50 border-2 rounded-xl
                           focus:outline-none focus:border-burgundy-500 transition-colors
                           border-cream-300 text-burgundy-800"
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
              : 'Verify OTP'}
          </button>

          <button className="text-xs text-burgundy-400 hover:text-burgundy-600 mt-4 transition-colors">
            Didn't receive OTP? Resend
          </button>
        </div>

        <p className="text-center text-xs text-burgundy-400 mt-4">
          This verification ensures your identity before processing the approval.
        </p>
      </div>
    </div>
  )
}

export default ParentOTPVerify