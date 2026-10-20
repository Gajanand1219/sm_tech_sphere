
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import '../styles/VerifyEmail.css'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { saveAuth } = useAuth()
  const inputsRef = useRef([])

  const [email, setEmail] = useState(params.get('email') || '')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(
    params.get('email') ? 60 : 0
  )
  const [resending, setResending] = useState(false)

  const code = digits.join('')
  const isComplete = digits.every((digit) => digit !== '')

  // Auto-focus first OTP box
  useEffect(() => {
    if (email) {
      inputsRef.current[0]?.focus()
    }
  }, [email])

  // 60-second countdown
  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Handle OTP digit input
  const handleDigit = (index, value) => {
    const cleaned = value.replace(/\D/g, '')
    const digit = cleaned.slice(-1)

    const next = [...digits]
    next[index] = digit

    setDigits(next)
    setError('')
    setMsg('')

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (index, event) => {
    if (
      event.key === 'Backspace' &&
      !digits[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }

    if (event.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  // Paste complete OTP
  const handlePaste = (event) => {
    event.preventDefault()

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)

    if (!pasted) return

    const next = ['', '', '', '', '', '']

    pasted.split('').forEach((digit, index) => {
      next[index] = digit
    })

    setDigits(next)
    setError('')
    setMsg('')

    const focusIndex = Math.min(pasted.length, 5)
    inputsRef.current[focusIndex]?.focus()
  }

  // Verify OTP
  const submit = async (event) => {
    event.preventDefault()

    setError('')
    setMsg('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!isComplete) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }

    setLoading(true)

    try {
      const { data } = await API.post('/auth/verify-email', {
        email: email.trim(),
        code,
      })

      saveAuth(data)

      setMsg('Email verified successfully. Redirecting to dashboard...')
      setMsgType('success')

      setTimeout(() => {
        if (data.role === 'admin') {
          nav('/admin')
        } else if (data.role === 'buyer') {
          nav('/buyer')
        } else if (data.role === 'vendor') {
          nav('/vendor')
        } else {
          nav('/login')
        }
      }, 900)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Verification failed. Please try again.'
      )

      setDigits(['', '', '', '', '', ''])

      setTimeout(() => {
        inputsRef.current[0]?.focus()
      }, 0)
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const resend = async () => {
    if (resendCooldown > 0 || resending || !email.trim()) {
      return
    }

    setResending(true)
    setError('')
    setMsg('')

    try {
      // Backend expects email as a query parameter
      await API.post(
        `/auth/resend-verification?email=${encodeURIComponent(
          email.trim()
        )}`
      )

      setDigits(['', '', '', '', '', ''])
      setResendCooldown(60)

      setMsg('A new OTP has been sent to your email.')
      setMsgType('success')

      setTimeout(() => {
        inputsRef.current[0]?.focus()
      }, 0)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Unable to resend OTP. Please try again.'
      )
    } finally {
      setResending(false)
    }
  }

  const formattedTime = `00:${String(resendCooldown).padStart(2, '0')}`

  return (
    <div className="ve-page">
      {/* Animated background */}
      <div className="ve-bg ve-bg--one" />
      <div className="ve-bg ve-bg--two" />

      {/* Top bar */}
      <header className="ve-topbar">
        <div className="ve-brand">
          <div className="ve-brand__logo">
            <img src="/logo2.jpeg" alt="SM TechSphere logo" />
          </div>

          <div>
            <strong>SM TechSphere Pvt. Ltd.</strong>
            {/* <span>Engineering Solutions</span> */}
          </div>
        </div>

        <button
          type="button"
          className="ve-back"
          onClick={() => nav('/')}
        >
          <span>←</span>
          Back
        </button>
      </header>

      {/* Verification card */}
      <main className="ve-main">
        <section className="ve-card">
          <div className="ve-card__header">
            <div className="ve-card__icon">✉️</div>

            <div>
              <span className="ve-kicker">Email Verification</span>
              <h2>Check your inbox</h2>

              <p className="ve-card__sub">
                We sent a 6-digit verification code to your email.
              </p>
            </div>
          </div>

          <form
            onSubmit={submit}
            className="ve-form"
            noValidate
          >
            {/* Email */}
            <div className="ve-field">
              <label htmlFor="verify-email">
                <span className="ve-field__icon">📧</span>
                Email address
              </label>

              <input
                id="verify-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>

            {/* OTP inputs */}
            <div className="ve-otp">
              <label className="ve-otp__label">
                <span className="ve-field__icon">🔐</span>
                Verification code
              </label>

              <div
                className="ve-otp__boxes"
                onPaste={handlePaste}
              >
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputsRef.current[index] = element
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={
                      index === 0 ? 'one-time-code' : 'off'
                    }
                    maxLength={6}
                    value={digit}
                    onChange={(event) =>
                      handleDigit(index, event.target.value)
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(index, event)
                    }
                    onFocus={(event) => event.target.select()}
                    className={`ve-otp__box ${
                      digit ? 'is-filled' : ''
                    }`}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              {/* OTP status and resend */}
              <div className="ve-otp__meta">
                <span className="ve-otp__hint">
                  {isComplete
                    ? '✓ Code ready'
                    : `${code.length}/6 digits`}
                </span>

                <button
                  type="button"
                  className={`ve-resend ${
                    resendCooldown === 0 && !resending
                      ? 've-resend--active'
                      : 've-resend--waiting'
                  }`}
                  onClick={resend}
                  disabled={
                    resendCooldown > 0 ||
                    resending ||
                    !email.trim()
                  }
                >
                  {resending ? (
                    <>
                      <span className="ve-resend__spinner" />
                      Sending OTP...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <span className="ve-resend__clock">◷</span>
                      Resend OTP in {formattedTime}
                    </>
                  ) : (
                    <>
                      <span className="ve-resend__icon">↻</span>
                      Resend OTP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Success message */}
            {msg && (
              <div
                className={`ve-msg ve-msg--${msgType}`}
                role="status"
              >
                <span className="ve-msg__icon">
                  {msgType === 'success' ? '✓' : '!'}
                </span>
                <span>{msg}</span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div
                className="ve-msg ve-msg--error"
                role="alert"
              >
                <span className="ve-msg__icon">!</span>
                <span>{error}</span>
              </div>
            )}

            {/* Verify button */}
            <button
              type="submit"
              className="ve-submit"
              disabled={loading || !isComplete}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Verifying...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Verify &amp; Continue
                  <span className="ve-submit__arrow">→</span>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="ve-footer">
              <span>Wrong email?</span>

              <button
                type="button"
                onClick={() => nav('/register/buyer')}
              >
                Register again
              </button>
            </div>

            <div className="ve-secure">
              🔒 Your information is protected and securely processed.
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
