import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import '../styles/PanelLayout.css'

const MENUS = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/admin/enquiries', label: 'Enquiries', icon: '📋' },
    { to: '/admin/registrations', label: 'Participants', icon: '👥' },
  ],

  buyer: [
    { to: '/buyer', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/buyer/enquiries/new', label: 'Create enquiry', icon: '➕' },
    { to: '/buyer/enquiries', label: 'Current enquiry', icon: '📋', countKey: 'current' },
    { to: '/buyer/enquiries', label: 'View quote', icon: '📄', countKey: 'quotes' },
    { to: '/buyer/enquiries', label: 'Accepted', icon: '✅', countKey: 'accepted' },
    { to: '/buyer/enquiries', label: 'Rejected', icon: '❌', countKey: 'rejected' },
    { to: '/buyer/enquiries', label: 'Closed', icon: '🔒', countKey: 'closed' },
    { to: '/buyer/enquiries', label: 'History', icon: '🕒', countKey: 'history' },
  ],

  vendor: [
    { to: '/vendor', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/vendor/enquiries', label: 'New enquiry', icon: '📥', countKey: 'new' },
    { to: '/vendor/enquiries', label: 'Current enquiry', icon: '📝', countKey: 'current' },
    { to: '/vendor/enquiries', label: 'Quoted', icon: '📤', countKey: 'quoted' },
    { to: '/vendor/enquiries', label: 'Accepted', icon: '✅', countKey: 'accepted' },
    { to: '/vendor/enquiries', label: 'Rejected', icon: '❌', countKey: 'rejected' },
    { to: '/vendor/enquiries', label: 'Win', icon: '🏆', countKey: 'win' },
    { to: '/vendor/enquiries', label: 'Loss', icon: '📉', countKey: 'loss' },
    { to: '/vendor/enquiries', label: 'History', icon: '🕒', countKey: 'history' },
  ],
}

const ROLE_LABEL = {
  admin: 'Administrator',
  buyer: 'Buyer',
  vendor: 'Vendor',
}

const ROLE_COMPANY = {
  admin: 'SM Techsphere',
  buyer: 'Your Company',
  vendor: 'Your Company',
}

const ROLE_DASHBOARD = {
  admin: '/admin',
  buyer: '/buyer',
  vendor: '/vendor',
}

const initials = (name = '') => {
  const words = String(name).trim().split(/\s+/)
  return (
    (words[0] || '?').charAt(0) + (words[1] ? words[1].charAt(0) : '')
  ).toUpperCase()
}

/* =========================================================
   COMPANY AVATAR
   ========================================================= */

function CompanyAvatar({ logo, name, size = 'md' }) {
  const [errored, setErrored] = useState(false)
  const hasLogo = Boolean(logo) && !errored

  return (
    <span className={`ev-av ev-av--${size} ${hasLogo ? 'ev-av--logo' : ''}`}>
      {hasLogo ? (
        <img
          src={logo}
          alt={name || 'Company'}
          className="ev-av-img"
          onError={() => setErrored(true)}
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}

export default function PanelLayout({
  role = 'admin',
  title = 'Dashboard',
  children,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [networkLogo, setNetworkLogo] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const [counts, setCounts] = useState({
    current: 0, quotes: 0, accepted: 0, rejected: 0,
    closed: 0, history: 0,
    new: 0, quoted: 0, win: 0, loss: 0,
  })

  const items = MENUS[role] || MENUS.admin
  const roleLabel = ROLE_LABEL[role] || role
  const dashboardPath = ROLE_DASHBOARD[role] || '/'

  /* ---------- Load profile + network logo ---------- */
  useEffect(() => {
    let alive = true

    const loadProfile = async () => {
      try {
        const { data } = await API.get('/auth/profile')
        if (!alive) return
        setProfile(data)

        try {
          const net = await API.get('/public/network-companies')
          const list =
            role === 'vendor'
              ? (Array.isArray(net.data?.vendors) ? net.data.vendors : [])
              : (Array.isArray(net.data?.buyers) ? net.data.buyers : [])

          const myCompany = String(
            data?.company_name || data?.company || data?.name || ''
          )
            .toLowerCase()
            .trim()

          const me =
            list.find(
              (b) =>
                b.company_name &&
                String(b.company_name).toLowerCase().trim() === myCompany
            ) ||
            list.find(
              (b) =>
                b.email &&
                data?.email &&
                String(b.email).toLowerCase().trim() ===
                  String(data.email).toLowerCase().trim()
            )

          if (alive && me?.logo) setNetworkLogo(me.logo)

          console.log(`[PanelLayout ${role} Logo] profile:`, data)
          console.log(`[PanelLayout ${role} Logo] matched:`, me)
        } catch (netErr) {
          console.debug('[PanelLayout Logo] network-companies failed:', netErr)
        }
      } catch (err) {
        console.error('[PanelLayout Logo] profile load failed:', err)
      }
    }

    loadProfile()
    return () => { alive = false }
  }, [role])

  const companyName =
    profile?.company_name ||
    profile?.company ||
    profile?.name ||
    profile?.full_name ||
    user?.company_name ||
    user?.name ||
    ROLE_COMPANY[role]

  const companyLogo =
    profile?.logo ||
    profile?.company_logo ||
    profile?.profile_image ||
    networkLogo ||
    null

  const userEmail = profile?.email || user?.email || ''

  /* ---------- Load counts (buyer) ---------- */
  useEffect(() => {
    if (role !== 'buyer') return
    let active = true

    API.get('/buyer/dashboard')
      .then(({ data }) => {
        if (!active) return
        const stats = data?.stats || {}
        const enquiries = Array.isArray(data?.enquiries) ? data.enquiries : []

        const getStat = (...keys) => {
          const k = Object.keys(stats).find((x) => keys.includes(x.toLowerCase()))
          return k !== undefined ? Number(stats[k]) || 0 : null
        }

        const byStatus = (...st) =>
          enquiries.filter((e) =>
            st.includes(String(e.status || '').toUpperCase().split('.').pop())
          ).length

        setCounts((prev) => ({
          ...prev,
          current: getStat('open_enquiries', 'current_enquiries', 'current', 'open') ??
            byStatus('APPROVED', 'MATCHED', 'QUOTATION', 'SUBMITTED'),
          quotes: getStat('quotations', 'quotes', 'total_quotations') ?? 0,
          accepted: getStat('accepted', 'accepted_quotes', 'accepted_quotations') ?? 0,
          rejected: getStat('rejected', 'rejected_quotes', 'rejected_quotations') ?? 0,
          closed: getStat('closed', 'closed_enquiries') ?? byStatus('CLOSED'),
          history: getStat('history', 'history_enquiries') ?? 0,
        }))
      })
      .catch(() => {})

    return () => { active = false }
  }, [role])

  /* ---------- Load counts (vendor) ---------- */
  useEffect(() => {
    if (role !== 'vendor') return
    let active = true

    API.get('/vendor/dashboard')
      .then(({ data }) => {
        if (!active) return
        const stats = data?.stats || {}
        const matches = Array.isArray(data?.matches) ? data.matches : []

        const isNew = (m) => !m.quotation_exists
        const isQuoted = (m) => m.quotation_exists
        const isAccepted = (m) =>
          String(m.status || '').toUpperCase() === 'ACCEPTED'
        const isRejected = (m) =>
          String(m.status || '').toUpperCase() === 'REJECTED'
        const isClosed = (m) =>
          String(m.status || '').toUpperCase() === 'CLOSED'
        const isWin = (m) => isClosed(m) && m.outcome === 'win'
        const isLoss = (m) => isClosed(m) && m.outcome === 'loss'

        setCounts((prev) => ({
          ...prev,
          new: stats.new ?? matches.filter(isNew).length,
          current: stats.current ?? matches.filter(isNew).length,
          quoted: stats.quotations ?? matches.filter(isQuoted).length,
          accepted: stats.accepted ?? matches.filter(isAccepted).length,
          rejected: stats.rejected ?? matches.filter(isRejected).length,
          win: stats.win ?? matches.filter(isWin).length,
          loss: stats.loss ?? matches.filter(isLoss).length,
          history: stats.closed ?? matches.filter(isClosed).length,
        }))
      })
      .catch(() => {})

    return () => { active = false }
  }, [role])

  const closeMobile = () => setMobileOpen(false)

  const handleLogout = () => {
    setUserMenuOpen(false)
    closeMobile()
    logout()
    navigate('/')
  }

  /* ---------- Back button → dashboard ---------- */
  const handleBack = () => {
    closeMobile()
    navigate(dashboardPath)
  }

  const isViewActive = (itemLabel) => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view') || ''
    const map = {
      'Current enquiry': 'current',
      'View quote': 'quotes',
      'Quoted': 'quoted',
      'Accepted': 'accepted',
      'Rejected': 'rejected',
      'Closed': 'closed',
      'History': 'history',
      'New enquiry': 'new',
      'Win': 'win',
      'Loss': 'loss',
    }
    return map[itemLabel] === view
  }

  return (
    <div className="enviquo-panel">
      {/* ============ SIDEBAR ============ */}
      <aside className={`ev-side ${mobileOpen ? 'open' : ''}`}>
        <div className="ev-brand">
          <div className="ev-logo">
            <img src="/logo2.jpeg" alt="ENVIQUO" />
          </div>
          <div>
            <b>ENVIQUO</b>
            <small>by SM Techsphere Pvt Ltd</small>
          </div>
        </div>

        <nav className="ev-nav">
          {/* 🏠 HOME → main site */}
          <NavLink
            to="/"
            onClick={closeMobile}
            className={({ isActive }) => `ev-nav-item ${isActive ? 'on' : ''}`}
            title="Go to Home Page"
          >
            <span>🏠</span>
            Home
          </NavLink>

          {/* ⌂ DASHBOARD */}
          <NavLink
            to={dashboardPath}
            end
            onClick={closeMobile}
            className={({ isActive }) => `ev-nav-item ${isActive ? 'on' : ''}`}
            title="Dashboard"
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <div className="ev-nav-sep" />

          {items
            .filter((item) => !item.end && item.label !== 'Dashboard')
            .map((item) => (
              <NavLink
  key={item.label}
  to={item.countKey ? `${item.to}?view=${item.countKey}` : item.to}
  onClick={closeMobile}
  style={{ marginBottom: '8px' }}
  className={({ isActive }) =>
    `ev-nav-item ${isActive || isViewActive(item.label) ? 'on' : ''}`
  }
>
  <span>{item.icon}</span>
  {item.label}
  {item.countKey && (role === 'buyer' || role === 'vendor') && (
    <span className="ev-nav-count">
      {counts[item.countKey] ?? 0}
    </span>
  )}
</NavLink>
            ))}
        </nav>

        <div className="ev-side-foot">
          <b>SM Techsphere Pvt Ltd.</b>
          {roleLabel} workspace
        </div>
      </aside>

      {mobileOpen && (
        <div className="ev-scrim" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* ============ MAIN ============ */}
      <div className="ev-main">
        <header className="ev-top">
          <button
            type="button"
            className="ev-ham"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>

          {/* ⬅️ BACK → dashboard */}
          <button
            type="button"
            className="ev-back-btn"
            onClick={handleBack}
            title={`Back to ${roleLabel} Dashboard`}
          >
            ← Back
          </button>

          <span className="ev-top-title">{title}</span>

          <span className="ev-sp" />

          <span className="ev-secure">
            <i />
            Secure workspace
          </span>

          <div className="ev-chip-wrap">
            <button
              type="button"
              className="ev-chip"
              title="My Profile"
              aria-label="Open profile menu"
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              <CompanyAvatar logo={companyLogo} name={companyName} />
              <span className="ev-chip-name">{companyName}</span>
              <span className="ev-chip-caret">▾</span>
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="ev-chip-scrim"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="ev-user-menu" role="menu">
                  <div className="ev-user-head">
                    <CompanyAvatar
                      logo={companyLogo}
                      name={companyName}
                      size="lg"
                    />
                    <div>
                      <b>{companyName}</b>
                      <small>{userEmail || roleLabel}</small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ev-user-item"
                    onClick={() => {
                      setUserMenuOpen(false)
                      navigate('/profile?mode=view')
                    }}
                  >
                    <span>👤</span>
                    View Profile
                  </button>

                  <button
                    type="button"
                    className="ev-user-item"
                    onClick={() => {
                      setUserMenuOpen(false)
                      navigate('/profile?mode=edit')
                    }}
                  >
                    <span>✏️</span>
                    Edit Profile
                  </button>

                  <div className="ev-user-sep" />

                  <button
                    type="button"
                    className="ev-user-item ev-user-item--danger"
                    onClick={handleLogout}
                  >
                    <span>↪</span>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="ev-content">{children}</main>

        <footer className="ev-footer">
          <span>
            © {new Date().getFullYear()} SM Techsphere Engineering Solutions
          </span>
          <span>SM Techsphere Pvt Ltd.</span>
        </footer>
      </div>
    </div>
  )
}
