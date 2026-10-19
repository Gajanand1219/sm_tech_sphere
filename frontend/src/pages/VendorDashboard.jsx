import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import '../styles/BuyerDashboard.css'


const MENU = [
  { id: 'new', l: 'New enquiry', i: '📥', d: 'Enquiries sent to you, not yet opened', to: '/vendor/enquiries?view=new', countKey: 'new' },
  { id: 'current', l: 'Current enquiry', i: '📝', d: 'Opened by you, quote not yet submitted', to: '/vendor/enquiries?view=current', countKey: 'current' },
  { id: 'quoted', l: 'Quoted', i: '📤', d: 'Quotes waiting for the buyer', to: '/vendor/enquiries?view=quoted', countKey: 'quoted' },
  { id: 'accepted', l: 'Accepted', i: '✅', d: 'Accepted quotes with buyer details', to: '/vendor/enquiries?view=accepted', countKey: 'accepted' },
  { id: 'rejected', l: 'Rejected', i: '❌', d: 'Rejected or auto-rejected quotes', to: '/vendor/enquiries?view=rejected', countKey: 'rejected' },
  { id: 'win', l: 'Win', i: '🏆', d: 'Enquiries the buyer gave to you', to: '/vendor/enquiries?view=win', countKey: 'win' },
  { id: 'loss', l: 'Loss', i: '📉', d: 'Enquiries the buyer gave to someone else', to: '/vendor/enquiries?view=loss', countKey: 'loss' },
  { id: 'history', l: 'History', i: '🕒', d: 'Win, Loss, Expired and Declined', to: '/vendor/enquiries?view=history', countKey: 'history' },
]

const initials = (name = '') => {
  const words = String(name).trim().split(/\s+/)
  return ((words[0] || '?').charAt(0) + (words[1] ? words[1].charAt(0) : '')).toUpperCase()
}

const normStatus = (v) => String(v || '').toUpperCase().split('.').pop()

/* ---------------------------------------------------------
   Tab filter
   --------------------------------------------------------- */
export function matchTab(m, tab) {
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
  const hasName = String(name || '').trim().length > 0

  return (
    <span className={`ev-av ev-av--${size} ${hasLogo ? 'ev-av--logo' : ''}`}>
      {hasLogo ? (
        <img
          src={logo}
          alt={name || 'Company'}
          className="ev-av-img"
          onError={() => setErrored(true)}
        />
      ) : hasName ? (
        initials(name)
      ) : (
        <span className="ev-av-placeholder">🏢</span>
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
   VENDOR DASHBOARD
   ========================================================= */

export default function VendorDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState({ stats: {}, matches: [] })
  const [profile, setProfile] = useState(null)
  const [networkLogo, setNetworkLogo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vendor_read_notifs') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    let alive = true

    const load = async () => {
      try {
        setLoading(true)

        const [dashRes, profRes] = await Promise.allSettled([
          API.get('/vendor/dashboard'),
          API.get('/auth/profile'),
        ])
        if (!alive) return

        if (dashRes.status === 'fulfilled') {
          setData(dashRes.value.data || { stats: {}, matches: [] })
        }
        if (profRes.status === 'fulfilled') {
          const p = profRes.value.data
          setProfile(p)

          // ⭐ Fetch network logo for vendor
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

            console.log('[VendorDashboard Logo] profile:', p)
            console.log('[VendorDashboard Logo] matched:', me)
          } catch (netErr) {
            console.debug('[VendorDashboard Logo] network-companies failed:', netErr)
          }
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [])

  const matches = Array.isArray(data.matches) ? data.matches : []
  const stats = data.stats || {}

  const counts = {
    new: stats.new ?? matches.filter((m) => matchTab(m, 'new')).length,
    current: stats.current ?? matches.filter((m) => matchTab(m, 'current')).length,
    quoted: stats.quoted ?? matches.filter((m) => matchTab(m, 'quoted')).length,
    accepted: stats.accepted ?? matches.filter((m) => matchTab(m, 'accepted')).length,
    rejected: stats.rejected ?? matches.filter((m) => matchTab(m, 'rejected')).length,
    win: stats.win ?? matches.filter((m) => matchTab(m, 'win')).length,
    loss: stats.loss ?? matches.filter((m) => matchTab(m, 'loss')).length,
    history: stats.history ?? matches.filter((m) => matchTab(m, 'history')).length,
  }

  /* ⭐ No 'Your Company' fallback */
  const companyName =
    profile?.company_name ||
    profile?.company ||
    profile?.name ||
    profile?.full_name ||
    ''

  const companyLogo =
    profile?.logo ||
    profile?.company_logo ||
    profile?.profile_image ||
    networkLogo ||
    null

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

  const handleBack = () => navigate('/vendor')

  return (
    <div className="enviquo-dash">
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
          <Link to="/" className="ev-nav-item" title="Go to Home Page">
            <span>🏠</span> Home
          </Link>

          <Link to="/vendor" className="ev-nav-item on" title="Dashboard">
            <span>⌂</span> Dashboard
          </Link>

          <div className="ev-nav-sep" />

          {MENU.map((m) => (
            <Link key={m.id} to={m.to} className="ev-nav-item">
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

          <button
            type="button"
            className="ev-back-btn"
            onClick={handleBack}
            title="Back to Vendor Dashboard"
          >
            ← Back
          </button>

          <span className="ev-top-title">Dashboard</span>
          <span className="ev-sp" />

          {/* 🔔 NOTIFICATION BELL */}
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

          {/* 🖼️ COMPANY CHIP */}
          <button
            type="button"
            className="ev-chip"
            onClick={() => navigate('/profile')}
            title={companyName || 'My Profile'}
          >
            <CompanyAvatar logo={companyLogo} name={companyName} />
            {companyName && (
              <span className="ev-chip-name">{companyName}</span>
            )}
          </button>
        </header>

        <main className="ev-content">
          {/* HERO */}
          <section className="ev-hero">
            <div className="ev-hero-mark" aria-hidden="true">
              <svg width="300" height="300" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="14" />
                <circle cx="50" cy="50" r="20" fill="rgba(98,214,168,.15)" />
              </svg>
            </div>
            <div className="ev-hero-body">
              <p className="ev-hero-welcome">Welcome,</p>
              <h1 className="ev-hero-company">
                {companyName || 'Vendor'}
              </h1>
              <p className="ev-hero-to">
                to <span className="ev-wm">ENVIQUO</span>
              </p>
              <p className="ev-hero-sub">
                Matched enquiries, quotes and results in one place. Quote within 10 days of receiving an enquiry.
              </p>
              <div className="ev-hero-actions">
                <Link
                  className="ev-btn ev-btn-lite"
                  to="/vendor/enquiries?view=new"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: '1px solid #2563eb',
                  }}
                >
                  📥 Open new enquiries ({counts.new})
                </Link>

                <Link
                  className="ev-btn ev-btn-ghost"
                  to="/vendor/enquiries?view=quoted"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: '1px solid #2563eb',
                  }}
                >
                  📤 My quotes
                </Link>
              </div>
            </div>
          </section>

          {/* STATS */}
          <div className="ev-stats">
            <div className="ev-stat">
              <b>{counts.new}</b>
              <span>New enquiries</span>
            </div>
            <div className="ev-stat">
              <b>{counts.quoted}</b>
              <span>Quotes waiting for buyer</span>
            </div>
            <div className="ev-stat">
              <b>{counts.accepted}</b>
              <span>Accepted quotes</span>
            </div>
            <div className="ev-stat">
              <b>{counts.win}</b>
              <span>Wins</span>
            </div>
          </div>

          {/* WORKSPACE TILES */}
          <h2 className="ev-h2">Your workspace</h2>
          <div className="ev-mgrid">
            {MENU.map((m) => (
              <Link key={m.id} to={m.to} className="ev-mt">
                <span className="ev-mt-ico">{m.i}</span>
                <span>
                  <strong>{m.l}</strong>
                  <small>{m.d}</small>
                </span>
                <span className="ev-mt-count">{counts[m.countKey] ?? 0}</span>
              </Link>
            ))}
          </div>

          {/* RECENT MATCHES */}
          <h2 className="ev-h2">Recent matching enquiries</h2>
          {loading ? (
            <div className="ev-loading">Loading enquiries...</div>
          ) : matches.length ? (
            <div className="ev-table">
              <div className="ev-row ev-row-head">
                <span>Enquiry</span>
                <span>Domain</span>
                <span>Score</span>
                <span>Status</span>
                <span />
              </div>
              {matches.slice(0, 8).map((m) => {
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
              <h4>No matched enquiries yet</h4>
              <p>
                Matching enquiries approved by the platform admin will appear here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
