
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import API from '../services/api'
// import '../styles/Welcome.css'

function EnviquoLogo({ size = 150, animated = false }) {
  return (
    <svg
      className={`welcome-logo-svg ${animated ? 'anim' : ''}`}
      width={size}
      height={size}
      viewBox="20 10 390 390"
      role="img"
      aria-label="ENVIQUO logo"
    >
      <circle
        className="lg-ring"
        cx="180"
        cy="168"
        r="126.5"
        fill="none"
        stroke="#1e9bc9"
        strokeWidth="45"
        transform="rotate(-90 180 168)"
      />

      <path
        className="lg-drop"
        d="M263 251C298 258 338 266 362 284C390 305 392 345 365 366C338 386 305 380 288 350C272 322 266 285 263 251Z"
        fill="#1fa971"
      />

      <path
        className="lg-dia"
        d="M180 135L204 168L180 201L156 168Z"
        fill="#62d6a8"
      />
    </svg>
  )
}

export default function Welcome() {
  const navigate = useNavigate()
  const location = useLocation()

  const role = location.state?.role

  const [company, setCompany] = useState(
    location.state?.companyName || ''
  )

  useEffect(() => {
    if (!['buyer', 'vendor'].includes(role)) {
      navigate('/login', { replace: true })
      return
    }

    let active = true

    API.get('/auth/profile')
      .then(({ data }) => {
        if (!active) return

        const name =
          data?.company_name ||
          data?.company ||
          data?.user?.company_name ||
          ''

        if (name) setCompany(name)
      })
      .catch((error) => {
        console.error('Unable to load company profile:', error)
      })

    return () => {
      active = false
    }
  }, [role, navigate])

  const enterDashboard = () => {
    if (role === 'buyer') {
      navigate('/buyer', { replace: true })
    } else if (role === 'vendor') {
      navigate('/vendor', { replace: true })
    }
  }

  if (!['buyer', 'vendor'].includes(role)) {
    return null
  }

  return (
    <main className="enviquo-welcome">
      <div className="welcome-glow welcome-glow--one" />
      <div className="welcome-glow welcome-glow--two" />

      <section className="welcome-card">
        <div className="welcome-mark">
          <EnviquoLogo size={150} animated />
        </div>

    <p className="welcome-small">
  Welcome,
</p>

<h1 className="welcome-company">
  {company || 'Your Company'}
</h1>

<p className="welcome-to">
  to <span>ENVIQUO</span>
</p>

<p className="welcome-tagline">
  DIAGNOSE. MATCH. SOLUTION.
</p>

        <p className="welcome-tagline">
          {role === 'buyer'
            ? 'BUYER WORKSPACE'
            : 'VENDOR WORKSPACE'}
        </p>

        <button
          type="button"
          className="welcome-enter"
          onClick={enterDashboard}
        >
          <span>Enter dashboard</span>
          <span className="welcome-enter-arrow" aria-hidden="true">
            →
          </span>
        </button>

        <footer className="welcome-footer">
          <span className="welcome-footer-line" />

          <p>
            BY <strong>SM ENVIQUO</strong>{' '}
            <span className="welcome-footer-pvt">
              Pvt. Ltd.
            </span>
          </p>

          <span className="welcome-footer-line" />
        </footer>
      </section>
    </main>
  )
}
