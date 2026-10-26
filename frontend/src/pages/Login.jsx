import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Login.css'
import API from '../services/api'

/* =========================================================
   CAPTCHA GENERATOR — 6 chars
   ========================================================= */

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return out
}

/* =========================================================
   LOGIN PAGE
   ========================================================= */

export default function Login() {
  const { t } = useLanguage()

  /* ================= ERROR MESSAGE HELPER ================= */

  const getErrorMessage = (error) => {
    const detail = error?.response?.data?.detail

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === 'string') return item
          if (item?.msg) {
            const location = Array.isArray(item.loc)
              ? item.loc.filter((part) => part !== 'body').join(' → ')
              : ''
            return location ? `${location}: ${item.msg}` : item.msg
          }
          return t('invalidRequestErr')
        })
        .join(', ')
    }

    if (typeof detail === 'string') return detail
    if (typeof error?.response?.data?.message === 'string')
      return error.response.data.message
    if (typeof error?.message === 'string') return error.message

    return t('loginFailErr')
  }

  /* ================= STATE ================= */

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotError, setForgotError] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [captchaText, setCaptchaText] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState('')

  const [showRegisterChoice, setShowRegisterChoice] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  /* ================= FORGOT PASSWORD ================= */

  const handleForgotPassword = async () => {
    setForgotError('')
    setForgotMessage('')

    if (!forgotEmail.trim()) {
      setForgotError(t('forgotEmptyErr'))
      return
    }

    setForgotLoading(true)

    try {
      const response = await API.post('/auth/forgot-password', {
        email: forgotEmail.trim(),
      })

      setForgotMessage(
        response.data?.message || t('forgotSuccessMsg')
      )
    } catch (error) {
      setForgotError(
        error?.response?.data?.detail ||
          error?.message ||
          t('forgotFailMsg')
      )
    } finally {
      setForgotLoading(false)
    }
  }

  /* ================= REFRESH CAPTCHA ================= */

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha())
    setCaptchaInput('')
    setCaptchaError('')
  }

  /* ================= GO TO REGISTER ================= */

  const goToRegister = (type) => {
    setShowRegisterChoice(false)
    navigate(`/register/${type}`)
  }

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setCaptchaError('')

    if (!captchaInput.trim()) {
      setCaptchaError(t('captchaEmptyErr'))
      return
    }

    if (captchaInput.trim().toUpperCase() !== captchaText.toUpperCase()) {
      setCaptchaError(t('captchaWrongErr'))
      refreshCaptcha()
      return
    }

    setLoading(true)

    try {
      const data = await login({
        email: email.trim(),
        password,
      })

      if (data.role === 'admin') navigate('/admin', { replace: true })
      else if (data.role === 'buyer') navigate('/buyer', { replace: true })
      else if (data.role === 'vendor') navigate('/vendor', { replace: true })
      else setError(t('unknownRoleErr'))
    } catch (err) {
      setError(getErrorMessage(err))
      refreshCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg login-bg--one" />
      <div className="login-bg login-bg--two" />

      {/* ================= TOP BAR ================= */}

      <div className="login-topbar">
        <div className="login-brand">
          <div className="login-brand-logo">
            <img src="/image.png" alt={t('loginBrandName')} />
          </div>
          <div>
            <strong>{t('loginBrandName')}</strong>
            <span>{t('loginBrandSub')}</span>
          </div>
        </div>

        <button
          type="button"
          className="back-home"
          onClick={() => navigate('/')}
        >
          <span>←</span>
          {t('backBtn')}
        </button>
      </div>

      {/* ================= MAIN ================= */}

      <main className="login-main">
        <section className="login-card">
          <div className="login-card-header">
            <div>
              <span className="form-kicker">{t('secureAccessLabel')}</span>
              <h2>{t('welcomeBack')}</h2>
              <p>{t('signInSub')}</p>
            </div>

            <div className="role-icon">🔐</div>
          </div>

          <form onSubmit={submit} className="modern-login-form" noValidate>
            {/* EMAIL */}

            <div className="field-group">
              <label>
                <span className="field-icon">✉️</span>
                {t('emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD */}

            <div className="field-group">
              <label>
                <span className="field-icon">🔐</span>
                {t('passwordLabel')}
              </label>
              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? t('hidePassword') : t('showPassword')
                  }
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* CAPTCHA */}

            <div className="field-group captcha-group">
              <label>
                <span className="field-icon">🛡️</span>
                {t('captchaLabel')}
              </label>

              <div className="captcha-row">
                <div className="captcha-box">
                  <span className="captcha-text">{captchaText}</span>
                  <button
                    type="button"
                    className="captcha-refresh"
                    onClick={refreshCaptcha}
                    aria-label={t('captchaRefresh')}
                    title={t('captchaRefresh')}
                  >
                    ↻
                  </button>
                </div>

                <input
                  type="text"
                  className="captcha-input"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value.toUpperCase())
                    setCaptchaError('')
                  }}
                  placeholder={t('captchaPlaceholder')}
                  maxLength={6}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {captchaError && (
                <div className="captcha-error">{captchaError}</div>
              )}
            </div>

            {/* REMEMBER + FORGOT */}

            <div className="login-row">
              <label className="remember">
                <input type="checkbox" />
                <span>{t('rememberMe')}</span>
              </label>

              <label className="Forgat_link">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email)
                    setForgotError('')
                    setForgotMessage('')
                    setShowForgotPassword(true)
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    color: '#16a34a',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {t('forgotPassword')}
                </button>
              </label>
            </div>

            {/* ERROR */}

            {error && (
              <div className="login-message login-message--error">
                <span className="message-icon">!</span>
                <span>{error}</span>
                <button type="button" onClick={() => setError('')}>
                  ×
                </button>
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  {t('signingIn')}
                </>
              ) : (
                <>
                  {t('loginBtn')}
                  <span>→</span>
                </>
              )}
            </button>

            {/* FOOTER */}

            <div className="login-footer">
              <span>{t('newToPlatform')} </span>
              <button
                type="button"
                onClick={() => setShowRegisterChoice(true)}
              >
                {t('createAccount')}
              </button>
            </div>

            <div className="secure-note">{t('secureNote')}</div>
          </form>

          {/* DEMO BOX */}

          {/* <div className="demo-box">
            <span className="demo-dot" />
            <div>
              <strong>{t('demoAdminLabel')}</strong>
              <span>admin@smcleantech.com · Admin@12345</span>
            </div>
          </div> */}
        </section>
      </main>

      {/* =========================================================
         REGISTER CHOICE POPUP
         ========================================================= */}

      {showRegisterChoice && (
        <div
          className="register-modal-overlay"
          onClick={() => setShowRegisterChoice(false)}
        >
          <div
            className="register-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="register-modal__close"
              onClick={() => setShowRegisterChoice(false)}
              aria-label="Close"
            >
              ×
            </button>

            <span className="register-modal__label">
              {t('joinNetworkLabel')}
            </span>
            <h2>{t('createYourAccount')}</h2>
            <p>{t('chooseRegister')}</p>

            <div className="register-modal__options">
              <button
                type="button"
                className="register-option register-option--buyer"
                onClick={() => goToRegister('buyer')}
              >
                <div className="register-option__icon">🏢</div>
                <div className="register-option__text">
                  <strong>{t('registerAsBuyer')}</strong>
                  <span>{t('registerAsBuyerSub')}</span>
                </div>
                <div className="register-option__arrow">→</div>
              </button>

              <button
                type="button"
                className="register-option register-option--vendor"
                onClick={() => goToRegister('vendor')}
              >
                <div className="register-option__icon">⚙️</div>
                <div className="register-option__text">
                  <strong>{t('registerAsVendor')}</strong>
                  <span>{t('registerAsVendorSub')}</span>
                </div>
                <div className="register-option__arrow">→</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}

      {showForgotPassword && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              background: '#ffffff',
              borderRadius: '22px',
              padding: '30px',
              boxShadow: '0 25px 70px rgba(0,0,0,0.22)',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '15px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '18px',
              }}
            >
              🔐
            </div>

            <h2
              style={{
                margin: '0 0 8px',
                color: '#0f172a',
                fontSize: '24px',
                fontWeight: 800,
              }}
            >
              {t('forgotTitle')}
            </h2>

            <p
              style={{
                margin: '0 0 22px',
                color: '#64748b',
                fontSize: '13px',
                lineHeight: 1.6,
              }}
            >
              {t('forgotDesc')}
            </p>

            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 14px',
                border: '1px solid #dbe2ea',
                borderRadius: '11px',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />

            {forgotError && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '9px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {forgotError}
              </div>
            )}

            {forgotMessage && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '9px',
                  background: '#ecfdf5',
                  color: '#15803d',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {forgotMessage}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotError('')
                  setForgotMessage('')
                }}
                style={{
                  flex: 1,
                  height: '46px',
                  border: '1px solid #dbe2ea',
                  borderRadius: '11px',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t('forgotCancel')}
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                style={{
                  flex: 1,
                  height: '46px',
                  border: 'none',
                  borderRadius: '11px',
                  background:
                    'linear-gradient(135deg,#15803d,#22c55e)',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: forgotLoading ? 'not-allowed' : 'pointer',
                  opacity: forgotLoading ? 0.7 : 1,
                }}
              >
                {forgotLoading ? t('forgotSending') : t('forgotSend')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
