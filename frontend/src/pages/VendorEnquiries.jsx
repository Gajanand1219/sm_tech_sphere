import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import API from '../services/api'
import '../styles/BuyerDashboard.css'

import { useAuth } from '../context/AuthContext'

const PAGE_INFO = {
  new: { title: 'New Enquiries', description: 'Enquiries sent to you, not yet opened.' },
  current: { title: 'Current Enquiries', description: 'Opened by you, quote not yet submitted.' },
  quoted: { title: 'Quoted', description: 'Quotes waiting for the buyer.' },
  accepted: { title: 'Accepted', description: 'Accepted quotes with buyer details.' },
  rejected: { title: 'Rejected', description: 'Rejected or auto-rejected quotes.' },
  win: { title: 'Win', description: 'Enquiries the buyer gave to you.' },
  loss: { title: 'Loss', description: 'Enquiries the buyer gave to someone else.' },
  history: { title: 'History', description: 'Win, Loss, Expired and Declined.' },
}

const initials = (name = '') => {
  const words = String(name).trim().split(/\s+/)
  return ((words[0] || '?').charAt(0) + (words[1] ? words[1].charAt(0) : '')).toUpperCase()
}

const normStatus = (v) => String(v || '').toUpperCase().split('.').pop()

/* =========================================================
   TAB FILTER
   ========================================================= */

function matchTab(m, tab) {
  const enquiryStatus = normStatus(m.status)
  const quoteStatus = normStatus(m.quotation_status)
  const quoted = Boolean(m.quotation_exists)
  const closed = enquiryStatus === 'CLOSED'

  switch (tab) {
    case 'new':
    case 'current':
      return !quoted && !closed
    case 'quoted':
      return (
        quoted &&
        !closed &&
        quoteStatus !== 'ACCEPTED' &&
        quoteStatus !== 'REJECTED'
      )
    case 'accepted':
      return quoteStatus === 'ACCEPTED' || Boolean(m.buyer_accepted)
    case 'rejected':
      return quoteStatus === 'REJECTED'
    case 'win':
      return closed && String(m.outcome || '').toLowerCase() === 'win'
    case 'loss':
      return closed && String(m.outcome || '').toLowerCase() === 'loss'
    case 'history':
      return closed
    default:
      return true
  }
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

/* =========================================================
   NOTIFICATION BUILDER (vendor-side)
   ========================================================= */

function buildNotifications(matches) {
  const notes = []

  matches.forEach((m) => {
    const enquiryStatus = normStatus(m.status)
    const quoteStatus = normStatus(m.quotation_status)
    const closed = enquiryStatus === 'CLOSED'

    // New enquiry awaiting quote
    if (!m.quotation_exists && !closed) {
      notes.push({
        id: `new-${m.id}`,
        type: 'warning',
        title: `New enquiry · #${m.id}`,
        desc: m.title || 'Awaiting your quote',
        time: m.id,
        link: `/vendor/enquiries/${m.id}`,
        icon: '📥',
      })
    }

    // Quote submitted, waiting for buyer
    if (
      m.quotation_exists &&
      !closed &&
      quoteStatus !== 'ACCEPTED' &&
      quoteStatus !== 'REJECTED'
    ) {
      notes.push({
        id: `quoted-${m.id}`,
        type: 'info',
        title: `Quote submitted · #${m.id}`,
        desc: 'Waiting for buyer response',
        time: m.id,
        link: `/vendor/enquiries/${m.id}`,
        icon: '📤',
      })
    }

    // Buyer accepted
    if (quoteStatus === 'ACCEPTED' || m.buyer_accepted) {
      notes.push({
        id: `acc-${m.id}`,
        type: 'success',
        title: `Buyer accepted quote · #${m.id}`,
        desc: 'Contact details unlocked',
        time: m.id,
        link: `/vendor/enquiries/${m.id}`,
        icon: '✅',
      })
    }

    // Buyer rejected
    if (quoteStatus === 'REJECTED') {
      notes.push({
        id: `rej-${m.id}`,
        type: 'danger',
        title: `Quote rejected · #${m.id}`,
        desc: m.title || 'Buyer rejected your quote',
        time: m.id,
        link: `/vendor/enquiries/${m.id}`,
        icon: '❌',
      })
    }

    // Closed — won
    if (closed && String(m.outcome || '').toLowerCase() === 'win') {
      notes.push({
        id: `win-${m.id}`,
        type: 'success',
        title: `Enquiry won · #${m.id}`,
        desc: 'Buyer selected you',
        time: m.id,
        link: `/vendor/enquiries/${m.id}`,
        icon: '🏆',
      })
    }

    // Closed — lost
    if (closed && String(m.outcome || '').toLowerCase() === 'loss') {
      notes.push({
        id: `loss-${m.id}`,
        type: 'danger',
        title: `Enquiry lost · #${m.id}`,
        desc: 'Buyer selected someone else',
        time: m.id,
        link: `/vendor/enquiries/${m.id}`,
        icon: '📉',
      })
    }
  })

  return notes.sort((a, b) => (b.time || 0) - (a.time || 0)).slice(0, 15)
}

/* =========================================================
   VENDOR ENQUIRIES
   ========================================================= */

export default function VendorEnquiries() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const view = (searchParams.get('view') || 'new').toLowerCase()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [matches, setMatches] = useState([])
  const [profile, setProfile] = useState(null)
  const [networkLogo, setNetworkLogo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vendor_read_notifs') || '[]')
    } catch {
      return []
    }
  })

  const heading = PAGE_INFO[view] || PAGE_INFO.new

  /* ---------- Load data ---------- */

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        setLoading(true)
        setError('')

        // ✅ FIX: /auth/profile (NOT /auth/me)
        const [dashRes, profRes] = await Promise.allSettled([
          API.get('/vendor/dashboard'),
          API.get('/auth/profile'),
        ])
        if (!alive) return

        if (dashRes.status === 'fulfilled') {
          const list = Array.isArray(dashRes.value.data?.matches)
            ? dashRes.value.data.matches
            : []
          setMatches(list)
        } else {
          setError('Unable to load enquiries.')
        }

        if (profRes.status === 'fulfilled') {
          const p = profRes.value.data
          setProfile(p)

          // ⭐ Fetch network logo
          try {
            const net = await API.get('/public/network-companies')
            const vendors = Array.isArray(net.data?.vendors) ? net.data.vendors : []

            const myCompany = String(
              p?.company_name || p?.company || p?.name || ''
            )
              .toLowerCase()
              .trim()

            const me =
              vendors.find(
                (b) =>
                  b.company_name &&
                  String(b.company_name).toLowerCase().trim() === myCompany
              ) ||
              vendors.find(
                (b) =>
                  b.email &&
                  p?.email &&
                  String(b.email).toLowerCase().trim() ===
                    String(p.email).toLowerCase().trim()
              )

            if (alive && me?.logo) setNetworkLogo(me.logo)

            console.log('[VendorEnquiries Logo] profile:', p)
            console.log('[VendorEnquiries Logo] matched:', me)
          } catch (netErr) {
            console.debug('[VendorEnquiries Logo] network-enq failed:', netErr)
          }
        }
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  /* ---------- Filtered list ---------- */

  const filtered = matches.filter((m) => matchTab(m, view))

  const counts = {
    new: matches.filter((m) => matchTab(m, 'new')).length,
    current: matches.filter((m) => matchTab(m, 'current')).length,
    quoted: matches.filter((m) => matchTab(m, 'quoted')).length,
    accepted: matches.filter((m) => matchTab(m, 'accepted')).length,
    rejected: matches.filter((m) => matchTab(m, 'rejected')).length,
    win: matches.filter((m) => matchTab(m, 'win')).length,
    loss: matches.filter((m) => matchTab(m, 'loss')).length,
    history: matches.filter((m) => matchTab(m, 'history')).length,
  }

  /* ---------- Notifications ---------- */

  const notifications = buildNotifications(matches)
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length

  const markAllRead = () => {
    const ids = notifications.map((n) => n.id)
    setReadIds(ids)
    try {
      localStorage.setItem('vendor_read_notifs', JSON.stringify(ids))
    } catch {}
  }

  const markOneRead = (id) => {
    const next = Array.from(new Set([...readIds, id]))
    setReadIds(next)
    try {
      localStorage.setItem('vendor_read_notifs', JSON.stringify(next))
    } catch {}
  }

  /* ---------- Company info ---------- */

  const companyName =
    profile?.company_name ||
    profile?.company ||
    profile?.name ||
    profile?.full_name ||
    'Your Company'

  const companyLogo =
    profile?.logo ||
    profile?.company_logo ||
    profile?.profile_image ||
    networkLogo ||
    null

  const handleBack = () => navigate('/vendor')

  const MENU = [
    { id: 'new', l: 'New enquiry', i: '📥', to: '/vendor/enquiries?view=new', countKey: 'new' },
    { id: 'current', l: 'Current enquiry', i: '📝', to: '/vendor/enquiries?view=current', countKey: 'current' },
    { id: 'quoted', l: 'Quoted', i: '📤', to: '/vendor/enquiries?view=quoted', countKey: 'quoted' },
    { id: 'accepted', l: 'Accepted', i: '✅', to: '/vendor/enquiries?view=accepted', countKey: 'accepted' },
    { id: 'rejected', l: 'Rejected', i: '❌', to: '/vendor/enquiries?view=rejected', countKey: 'rejected' },
    { id: 'win', l: 'Win', i: '🏆', to: '/vendor/enquiries?view=win', countKey: 'win' },
    { id: 'loss', l: 'Loss', i: '📉', to: '/vendor/enquiries?view=loss', countKey: 'loss' },
    { id: 'history', l: 'History', i: '🕒', to: '/vendor/enquiries?view=history', countKey: 'history' },
  ]

  return (
    <div className="enviquo-dash">
      {/* ============ SIDEBAR ============ */}
      <aside className={`ev-side ${mobileOpen ? 'open' : ''}`}>
        <div className="ev-brand">
          <div className="ev-logo">
            <img src="/image.png" alt="ENVIQUO" />
          </div>
          <div>
            <b>ENVIQUO</b>
            <small>by SM Techsphere Pvt Ltd</small>
          </div>
        </div>

        <nav className="ev-nav">
          {/* 🏠 HOME */}
          <Link to="/" className="ev-nav-item" title="Go to Home Page">
            <span>🏠</span> Home
          </Link>

          {/* ⌂ DASHBOARD */}
          <Link to="/vendor" className="ev-nav-item" title="Dashboard">
            <span>⌂</span> Dashboard
          </Link>

          <div className="ev-nav-sep" />

          {MENU.map((m) => (
            <Link
              key={m.id}
              to={m.to}
              className={`ev-nav-item ${view === m.id ? 'on' : ''}`}
            >
              <span>{m.i}</span>
              {m.l}
              <span className="ev-nav-count">{counts[m.countKey] ?? 0}</span>
            </Link>
          ))}
        </nav>

        <div className="ev-side-foot">
          <b>SM Techsphere Pvt Ltd.</b>
          Vendor workspace
        </div>
      </aside>

      {mobileOpen && (
        <div className="ev-scrim" onClick={() => setMobileOpen(false)} />
      )}

      {/* ============ MAIN ============ */}
      <div className="ev-main">
        <header className="ev-top">
          <button
            type="button"
            className="ev-ham"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            ☰
          </button>

          {/* ← BACK */}
          <button
            type="button"
            className="ev-back-btn"
            onClick={handleBack}
            title="Back to Vendor Dashboard"
          >
            ← Back
          </button>

          <span className="ev-top-title">{heading.title}</span>
          <span className="ev-sp" />

          {/* 🔔 NOTIFICATIONS */}
          <div className="ev-bell-wrap">
            <button
              type="button"
              className="ev-bell"
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="ev-bell-badge">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div
                  className="ev-bell-scrim"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="ev-bell-panel" role="dialog" aria-label="Notifications">
                  <div className="ev-bell-head">
                    <b>Notifications</b>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="ev-bell-mark"
                        onClick={markAllRead}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="ev-bell-list">
                    {notifications.length ? (
                      notifications.map((n) => {
                        const unread = !readIds.includes(n.id)
                        return (
                          <button
                            key={n.id}
                            type="button"
                            className={`ev-bell-item ev-bell-item--${n.type} ${
                              unread ? 'is-unread' : ''
                            }`}
                            onClick={() => {
                              markOneRead(n.id)
                              setNotifOpen(false)
                              navigate(n.link)
                            }}
                          >
                            <span className="ev-bell-icon">{n.icon}</span>
                            <span className="ev-bell-body">
                              <strong>{n.title}</strong>
                              <small>{n.desc}</small>
                            </span>
                            {unread && <span className="ev-bell-dot" />}
                          </button>
                        )
                      })
                    ) : (
                      <div className="ev-bell-empty">
                        <div>🔕</div>
                        <p>No notifications yet</p>
                        <small>You'll see updates here when buyers respond</small>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* COMPANY PROFILE DROPDOWN */}
            <div className="ev-chip-wrap">
              <button
                type="button"
                className="ev-chip"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={userMenuOpen}
                title={companyName || 'My Profile'}
              >
                <CompanyAvatar logo={companyLogo} name={companyName} />
                {companyName && (
                  <span className="ev-chip-name">{companyName}</span>
                )}
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
                        <b>{companyName || 'Vendor Account'}</b>
                        <small>{profile?.email || 'Vendor Account'}</small>
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
                      <span>👤</span> View Profile
                    </button>

                    <button
                      type="button"
                      className="ev-user-item"
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate('/profile?mode=edit')
                      }}
                    >
                      <span>✏️</span> Edit Profile
                    </button>

                    <div className="ev-user-sep" />

                    <button
                      type="button"
                      className="ev-user-item ev-user-item--danger"
                     onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                        navigate('/')
                      }}
                    >
                      <span>↪</span> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
        </header>

        <main className="ev-content">
          <section className="ev-section">
            <div className="ev-heading">
              <div>
                <span className="ev-eyebrow">VENDOR WORKSPACE</span>
                <h3>{heading.title}</h3>
                <p>{heading.description}</p>
              </div>
            </div>

            {error ? (
              <div className="ev-error">{error}</div>
            ) : loading ? (
              <div className="ev-loading">Loading enquiries...</div>
            ) : filtered.length ? (
              <div className="ev-table">
                <div className="ev-row ev-row-head">
                  <span>Enquiry</span>
                  <span>Domain</span>
                  <span>Score</span>
                  <span>Status</span>
                  <span />
                </div>
                {filtered.map((m) => {
                  const status = normStatus(m.status)
                  const quoteStatus = normStatus(m.quotation_status)

                  let badgeLabel = 'New'
                  let badgeCls = 'info'
                  if (quoteStatus === 'ACCEPTED') {
                    badgeLabel = 'Accepted'
                    badgeCls = 'success'
                  } else if (quoteStatus === 'REJECTED') {
                    badgeLabel = 'Rejected'
                    badgeCls = 'danger'
                  } else if (status === 'CLOSED') {
                    badgeLabel = 'Closed'
                    badgeCls = 'success'
                  } else if (m.quotation_exists) {
                    badgeLabel = 'Quoted'
                    badgeCls = 'info'
                  }

                  return (
                    <Link
                      className="ev-row"
                      to={`/vendor/enquiries/${m.id}`}
                      key={m.id}
                    >
                      <span className="ev-enq">
                        <b>#{m.id}</b>
                        <span>
                          <strong>{m.title || `Enquiry #${m.id}`}</strong>
                          <small>
                            {m.quotation_exists
                              ? 'Quotation submitted'
                              : 'New — awaiting your quote'}
                          </small>
                        </span>
                      </span>
                      <span>{m.domain || '—'}</span>
                      <span>{Math.round(m.score || 0)}%</span>
                      <span>
                        <i className={`bd-status ${badgeCls}`}>{badgeLabel}</i>
                      </span>
                      <span className="ev-arrow">↗</span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="ev-empty">
                <div>▤</div>
                <h4>No {heading.title.toLowerCase()} found</h4>
                <p>Nothing to show in this category right now.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
