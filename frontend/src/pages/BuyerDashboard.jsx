import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import API from '../services/api'
import '../styles/BuyerDashboard.css'
import { useAuth } from '../context/AuthContext'
/* =========================================================
   DOMAIN DATA
   ========================================================= */

const DOMAINS = [
  {
    n: 'WATER AND WASTEWATER',
    i: '💧',
    cats: [
      { n: 'Water treatment (WTP)', s: ['Raw water treatment', 'DM and RO plant', 'Softener and filters'] },
      { n: 'Effluent treatment (ETP)', s: ['Textile effluent', 'Pharma effluent', 'Food processing effluent'] },
      { n: 'Sewage treatment (STP)', s: ['Up to 50 KLD', '50 to 200 KLD', 'Above 200 KLD'] },
      { n: 'Zero liquid discharge (ZLD)', s: ['New ZLD plant', 'ZLD upgrade', 'Evaporator and dryer'] },
    ],
  },
  {
    n: 'SOLID AND HAZARDOUS WASTE',
    i: '🗑️',
    cats: [
      { n: 'Hazardous waste disposal', s: ['Collection and transport', 'Incineration', 'Co-processing'] },
      { n: 'Solid waste management', s: ['Segregation', 'Composting', 'Recycling'] },
      { n: 'Authorisation and audit', s: ['Hazardous waste authorisation', 'Waste audit', 'Records and returns'] },
    ],
  },
  
  
  {
    n: 'SOLAR AND RENEWABLE ENERGY',
    i: '☀️',
    cats: [
      { n: 'Rooftop solar', s: ['Up to 100 kW', '100 kW to 1 MW', 'Above 1 MW'] },
      { n: 'Open access and captive', s: ['Captive solar', 'Open access PPA', 'Wheeling'] },
      { n: 'Storage and hybrid', s: ['Battery storage', 'Solar plus wind hybrid', 'Biogas'] },
    ],
  },
  {
    n: 'CARBON AND ESG',
    i: '🌿',
    cats: [
      { n: 'Carbon footprint', s: ['GHG inventory', 'Carbon audit', 'Reduction roadmap'] },
      { n: 'ESG reporting', s: ['BRSR', 'ESG gap study', 'Sustainability report'] },
      { n: 'Energy and efficiency', s: ['Energy audit', 'Efficiency retrofit', 'Carbon credits'] },
    ],
  },
  {
    n: 'AIR POLLUTION & ENVIRONMENTAL LEGAL SERVICES',
    i: '💨',
    cats: [
      { n: 'Consent and compliance', s: ['Consent to establish', 'Consent to operate', 'Renewal and amendment'] },
      { n: 'Air pollution control', s: ['Dust collector', 'Scrubber', 'Stack monitoring'] },
      { n: 'Environmental reports', s: ['Environmental statement (Form V)', 'Environmental audit', 'Compliance report'] },
    ],
  },
]

/* =========================================================
   MENU ITEMS
   ========================================================= */

const MENU = [
  { id: 'create', l: 'Create enquiry', i: '➕', d: 'Start a new enquiry in one of the 5 domains', to: '/buyer/enquiries/new' },
  { id: 'current', l: 'Current enquiry', i: '📋', d: 'Enquiries in progress and quotes received', to: '/buyer/enquiries?view=current', countKey: 'current' },
  { id: 'quote', l: 'View quote', i: '📄', d: 'Compare quotes, then accept or reject', to: '/buyer/enquiries?view=quotes', countKey: 'quotes' },
  { id: 'accepted', l: 'Accepted', i: '✅', d: 'Accepted quotes with vendor details', to: '/buyer/enquiries?view=accepted', countKey: 'accepted' },
  { id: 'rejected', l: 'Rejected', i: '❌', d: 'Quotes you rejected', to: '/buyer/enquiries?view=rejected', countKey: 'rejected' },
  { id: 'closed', l: 'Closed', i: '🔒', d: 'Update the final outcome of an enquiry', to: '/buyer/enquiries?view=closed', countKey: 'closed' },
  { id: 'history', l: 'History', i: '🕒', d: 'Record of all closed enquiries', to: '/buyer/enquiries?view=history', countKey: 'history' },
]

const STATUS_GROUPS = {
  current: ['APPROVED', 'MATCHED', 'QUOTATION', 'SUBMITTED'],
  closed: ['CLOSED'],
}

const PAGE_INFO = {
  current: { title: 'Current Enquiries', description: 'Enquiries in progress and quotes received.' },
  quotes: { title: 'View Quotes', description: 'Enquiries that have received quotations.' },
  accepted: { title: 'Accepted Enquiries', description: 'Enquiries where you accepted a quotation or completed the handshake.' },
  rejected: { title: 'Rejected Enquiries', description: 'Enquiries containing quotations rejected by you.' },
  closed: { title: 'Closed Enquiries', description: 'Review your closed enquiries.' },
  history: { title: 'Enquiry History', description: 'Review your previous enquiries.' },
}

/* =========================================================
   HELPERS
   ========================================================= */

const normalizeStatus = (value) =>
  String(value || '').toUpperCase().split('.').pop()

const statusClass = (status = '') => {
  const s = String(status).toLowerCase()
  if (['accepted', 'closed'].includes(s)) return 'bd-status success'
  if (['matched', 'quotation', 'quoted'].includes(s)) return 'bd-status info'
  if (['rejected', 'cancelled'].includes(s)) return 'bd-status danger'
  if (['approved', 'submitted', 'pending'].includes(s)) return 'bd-status warning'
  return 'bd-status'
}

const label = (value = '') =>
  String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const initials = (name = '') => {
  const words = String(name).trim().split(/\s+/)
  return ((words[0] || '?').charAt(0) + (words[1] ? words[1].charAt(0) : '')).toUpperCase()
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
   NOTIFICATION BUILDER
   ========================================================= */

function buildNotifications(enquiries) {
  const notes = []

  enquiries.forEach((e) => {
    const status = normalizeStatus(e.status)

    e.acceptedQuotations?.forEach((q) => {
      notes.push({
        id: `acc-${e.id}-${q.id}`,
        type: 'success',
        title: `Quote accepted on #${e.id}`,
        desc: `${q.vendor_company || 'Vendor'} · ₹${Number(q.capex || 0).toLocaleString('en-IN')}`,
        time: q.id,
        link: `/buyer/enquiries/${e.id}`,
        icon: '✅',
      })
    })

    e.rejectedQuotations?.forEach((q) => {
      notes.push({
        id: `rej-${e.id}-${q.id}`,
        type: 'danger',
        title: `Quote rejected on #${e.id}`,
        desc: `${q.vendor_company || 'Vendor'}`,
        time: q.id,
        link: `/buyer/enquiries/${e.id}`,
        icon: '❌',
      })
    })

    if (e.mutualHandshake) {
      notes.push({
        id: `mut-${e.id}`,
        type: 'info',
        title: `Handshake completed · #${e.id}`,
        desc: 'Contact details unlocked',
        time: e.id,
        link: `/buyer/enquiries/${e.id}`,
        icon: '🤝',
      })
    }

    const pending = e.quotationsList?.filter(
      (q) => normalizeStatus(q.status) === 'PENDING'
    )
    if (pending && pending.length) {
      notes.push({
        id: `pend-${e.id}`,
        type: 'warning',
        title: `${pending.length} new quote${pending.length > 1 ? 's' : ''} on #${e.id}`,
        desc: 'Review and take action',
        time: e.id,
        link: `/buyer/enquiries/${e.id}`,
        icon: '📄',
      })
    }

    if (status === 'CLOSED') {
      notes.push({
        id: `closed-${e.id}`,
        type: 'info',
        title: `Enquiry #${e.id} closed`,
        desc: 'Moved to history',
        time: e.id,
        link: `/buyer/enquiries/${e.id}`,
        icon: '🔒',
      })
    }
  })

  return notes.sort((a, b) => (b.time || 0) - (a.time || 0)).slice(0, 15)
}

/* =========================================================
   BUYER DASHBOARD
   ========================================================= */

export default function BuyerDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [data, setData] = useState({ stats: {}, enquiries: [] })
  const [profile, setProfile] = useState(null)
  const [networkLogo, setNetworkLogo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { logout } = useAuth()
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('buyer_read_notifs') || '[]')
    } catch {
      return []
    }
  })

  const requestedView = (searchParams.get('view') || '').toLowerCase()
  const view = requestedView === 'quote' ? 'quotes' : requestedView
  const isListingView = Boolean(view)
  const pageInfo = PAGE_INFO[view]

  /* ---------- Load dashboard + profile + network logo ---------- */

  useEffect(() => {
    let alive = true

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const { data: result } = await API.get('/buyer/dashboard')

        const summaries = Array.isArray(result?.enquiries) ? result.enquiries : []

        const detailedEnquiries = await Promise.all(
          summaries.map(async (enquiry) => {
            try {
              const { data: detail } = await API.get(`/buyer/enquiries/${enquiry.id}`)
              const quotations = Array.isArray(detail?.quotations) ? detail.quotations : []
              const handshake = detail?.handshake || {}

              const acceptedQuotations = quotations.filter(
                (q) => normalizeStatus(q.status) === 'ACCEPTED'
              )
              const rejectedQuotations = quotations.filter(
                (q) => normalizeStatus(q.status) === 'REJECTED'
              )

              return {
                ...enquiry,
                quotationsList: quotations,
                acceptedQuotations,
                rejectedQuotations,
                buyerAccepted:
                  Boolean(handshake.buyer_accepted) || acceptedQuotations.length > 0,
                vendorAccepted: Boolean(handshake.vendor_accepted),
                mutualHandshake:
                  normalizeStatus(handshake.status) === 'MUTUAL' ||
                  Boolean(handshake.contact_unlocked),
              }
            } catch (detailError) {
              console.error(`Unable to load enquiry #${enquiry.id}:`, detailError)
              return {
                ...enquiry,
                quotationsList: [],
                acceptedQuotations: [],
                rejectedQuotations: [],
                buyerAccepted: false,
                vendorAccepted: false,
                mutualHandshake: false,
              }
            }
          })
        )

        if (!alive) return
        setData({ stats: result?.stats || {}, enquiries: detailedEnquiries })
      } catch (err) {
        if (alive) {
          setError(
            err.response?.data?.detail ||
              'Unable to load enquiries. Please try again.'
          )
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    /* ---------- Profile + Network Logo ---------- */
    const loadProfile = async () => {
      try {
        // ✅ FIX: /auth/profile (NOT /auth/me)
        const { data } = await API.get('/auth/profile')
        if (alive) setProfile(data)

        console.log('[BuyerLogo] profile loaded:', data)

        // Fetch logo from /public/network-companies (same as Home marquee)
        try {
          const net = await API.get('/public/network-companies')
          const buyers = Array.isArray(net.data?.buyers) ? net.data.buyers : []

          const myCompany = String(
            data?.company_name || data?.company || data?.name || ''
          )
            .toLowerCase()
            .trim()

          const me =
            buyers.find(
              (b) =>
                b.company_name &&
                String(b.company_name).toLowerCase().trim() === myCompany
            ) ||
            buyers.find(
              (b) =>
                b.email &&
                data?.email &&
                String(b.email).toLowerCase().trim() ===
                  String(data.email).toLowerCase().trim()
            )

          if (alive && me?.logo) {
            setNetworkLogo(me.logo)
          }

          console.log('[BuyerLogo] my company:', myCompany)
          console.log('[BuyerLogo] buyers list:', buyers)
          console.log('[BuyerLogo] matched:', me)
        } catch (netErr) {
          console.debug('[BuyerLogo] network-companies failed:', netErr)
        }
      } catch (err) {
        console.error('[BuyerLogo] profile load failed:', err)
      }
    }

    loadDashboard()
    loadProfile()

    return () => {
      alive = false
    }
  }, [])

  const enquiries = data.enquiries

  /* ---------- Notifications ---------- */

  const notifications = buildNotifications(enquiries)
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length

  const markAllRead = () => {
    const ids = notifications.map((n) => n.id)
    setReadIds(ids)
    try {
      localStorage.setItem('buyer_read_notifs', JSON.stringify(ids))
    } catch {}
  }

  const markOneRead = (id) => {
    const next = Array.from(new Set([...readIds, id]))
    setReadIds(next)
    try {
      localStorage.setItem('buyer_read_notifs', JSON.stringify(next))
    } catch {}
  }

  /* ---------- Counts ---------- */

  const counts = {
    open: enquiries.filter((e) =>
      STATUS_GROUPS.current.includes(normalizeStatus(e.status))
    ).length,
    pend: enquiries.reduce((sum, e) => sum + e.quotationsList.filter((q) => normalizeStatus(q.status) === 'PENDING').length, 0),
    acc: enquiries.reduce((sum, e) => sum + e.acceptedQuotations.length, 0),
    rej: enquiries.reduce((sum, e) => sum + e.rejectedQuotations.length, 0),
    hist: enquiries.filter((e) => STATUS_GROUPS.closed.includes(normalizeStatus(e.status))).length,
  }

  const menuCounts = {
    current: counts.open,
    quotes: counts.pend,
    accepted: counts.acc,
    rejected: counts.rej,
    closed: counts.open,
    history: counts.hist,
  }

  /* ---------- Filter by view ---------- */

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const status = normalizeStatus(enquiry.status)

    switch (view) {
      case 'current':
        return STATUS_GROUPS.current.includes(status)
      case 'quotes':
        return Number(enquiry.quotations || 0) > 0
      case 'accepted':
        return (
          enquiry.buyerAccepted ||
          enquiry.mutualHandshake ||
          enquiry.acceptedQuotations.length > 0
        )
      case 'rejected':
        return enquiry.rejectedQuotations.length > 0
      case 'closed':
        return STATUS_GROUPS.closed.includes(status)
      case 'history':
        return (
          ['CLOSED', 'ACCEPTED'].includes(status) ||
          enquiry.buyerAccepted ||
          enquiry.mutualHandshake ||
          enquiry.rejectedQuotations.length > 0
        )
      default:
        return true
    }
  })

  const heading = pageInfo || {
    title: 'All Enquiries',
    description: 'Review all your enquiries and their progress.',
  }

  const companyName =
    profile?.company_name ||
    profile?.company ||
    profile?.name ||
    profile?.full_name ||
    'Your Company'

  /* ⭐ Logo priority */
  const companyLogo =
    profile?.logo ||
    profile?.company_logo ||
    profile?.profile_image ||
    networkLogo ||
    null

  /* ---------- Render ---------- */

  return (
    <div className="enviquo-dash">
      {/* ================= SIDEBAR ================= */}

      <aside className={`ev-side ${mobileOpen ? 'open' : ''}`}>
        <div className="ev-brand">
          <div className="ev-logo">
            <img src="/image.png" alt="ENVIQUO" />
          </div>
          <div>
            <b>ENVIQUO</b>
            {/* <small>by SM Techsphere Pvt Ltd</small> */}
          </div>
        </div>

        <nav className="ev-nav">
          <Link to="/" className="ev-nav-item" title="Go to Home Page">
            <span>🏠</span>
            Home
          </Link>

          <Link
            to="/buyer"
            className={`ev-nav-item ${!isListingView ? 'on' : ''}`}
            title="Dashboard"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <div className="ev-nav-sep" />

          {MENU.map((m) => (
            <Link
              key={m.id}
              to={m.to}
              className={`ev-nav-item ${
                requestedView === m.id ? 'on' : ''
              }`}
            >
              <span>{m.i}</span>
              {m.l}
              {m.countKey != null && (
                <span className="ev-nav-count">
                  {menuCounts[m.countKey] ?? 0}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="ev-side-foot">
          <b>ENVIQUO SM Pvt. Ltd.</b>
          Buyer workspace
        </div>
      </aside>

      {mobileOpen && (
        <div className="ev-scrim" onClick={() => setMobileOpen(false)} />
      )}

      {/* ================= MAIN ================= */}

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
            onClick={() => navigate(isListingView ? '/buyer' : '/')}
            title={isListingView ? 'Back to Dashboard' : 'Back to Home'}
            >
            ← Back
            </button>

            <span className="ev-top-title">
            {isListingView ? heading.title : 'Dashboard'}
            </span>

          <span className="ev-sp" />

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
                        <small>You'll see updates here when vendors respond</small>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          
            <div className="ev-chip-wrap">
              <button
                type="button"
                className="ev-chip"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={userMenuOpen}
                title="My Profile"
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
                        <small>{profile?.email || 'Buyer Account'}</small>
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
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                        navigate('/')
                      }}
                    >
                      <span>↪</span>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

        </header>

        <main className="ev-content">
          {isListingView ? (
            <section className="ev-section">
              <div className="ev-heading">
                <div>
                  <span className="ev-eyebrow">BUYER WORKSPACE</span>
                  <h3>{heading.title}</h3>
                  <p>{heading.description}</p>
                </div>
                <Link className="ev-link" to="/buyer/enquiries/new">
                  + Create enquiry
                </Link>
              </div>

              {error ? (
                <div className="ev-error">{error}</div>
              ) : loading ? (
                <div className="ev-loading">Loading enquiries...</div>
              ) : filteredEnquiries.length > 0 ? (
                <div className="ev-table">
                  <div className="ev-row ev-row-head">
                    <span>Enquiry</span>
                    <span>Domain</span>
                    <span>Status</span>
                    <span>Activity</span>
                    <span />
                  </div>

                  {filteredEnquiries.map((enquiry) => (
                    <Link
                      className="ev-row"
                      to={`/buyer/enquiries/${enquiry.id}`}
                      key={enquiry.id}
                    >
                      <span className="ev-enq">
                        <b>#{enquiry.id}</b>
                        <span>
                          <strong>
                            {enquiry.title || `Enquiry #${enquiry.id}`}
                          </strong>
                          <small>
                            {view === 'accepted'
                              ? enquiry.mutualHandshake
                                ? 'Mutual handshake completed'
                                : 'Buyer accepted quotation'
                              : view === 'rejected'
                                ? `${enquiry.rejectedQuotations.length} rejected quotation(s)`
                                : 'Open enquiry details'}
                          </small>
                        </span>
                      </span>

                      <span>{enquiry.domain || '—'}</span>

                      <span>
                        <i className={statusClass(enquiry.status)}>
                          {label(enquiry.status || 'unknown')}
                        </i>
                      </span>

                      <span className="ev-activity">
                        {enquiry.matches ?? 0} matches · {enquiry.quotations ?? 0} quotes
                      </span>

                      <span className="ev-arrow">↗</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="ev-empty">
                  <div>▤</div>
                  <h4>No {heading.title.toLowerCase()} found</h4>
                  <p>No enquiries match this category right now.</p>
                  {(view === 'quotes' || view === 'accepted' || view === 'rejected') && (
                    <Link className="ev-btn ev-btn-pri" to="/buyer/enquiries">
                      View all enquiries
                    </Link>
                  )}
                  {view === 'current' && (
                    <Link className="ev-btn ev-btn-pri" to="/buyer/enquiries/new">
                      + Create enquiry
                    </Link>
                  )}
                </div>
              )}
            </section>
          ) : (
            <>
              <section className="ev-hero">
                <div className="ev-hero-mark" aria-hidden="true">
                  <svg width="300" height="300" viewBox="20 10 390 390">
                    <circle cx="180" cy="168" r="126.5" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="45" />
                    <path d="M263 251C298 258 338 266 362 284C390 305 392 345 365 366C338 386 305 380 288 350C272 322 266 285 263 251Z" fill="rgba(31,169,113,.3)" />
                    <path d="M180 135L204 168L180 201L156 168Z" fill="rgba(98,214,168,.4)" />
                  </svg>
                </div>

                <div className="ev-hero-body">
                  <p className="ev-hero-welcome">Welcome Back,</p>
                  <h1 className="ev-hero-company">{companyName}</h1>
                  <p className="ev-hero-to">
                    to <span className="ev-wm">ENVIQUO</span>
                  </p>
                  <p className="ev-hero-sub">
                    Raise an enquiry, compare vendor quotes and close the loop in one place.
                  </p>

                  <div
  className="ev-hero-actions"
  style={{
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  }}
>
  <Link
    to="/buyer/enquiries/new"
    style={{
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '10px 20px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      border: '1px solid #2563eb',
    }}
  >
    + Create enquiry
  </Link>

  <Link
    to="/buyer/enquiries?view=quotes"
    style={{
      backgroundColor: '#1d4ed8',
      color: '#ffffff',
      padding: '10px 20px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      border: '1px solid #1d4ed8',
    }}
  >
    📄 View quotes
  </Link>
</div>
                </div>
              </section>

              <div className="ev-stats">
                <div className="ev-stat">
                  <b>{counts.open}</b>
                  <span>Open enquiries</span>
                </div>
                <div className="ev-stat">
                  <b>{counts.pend}</b>
                  <span>Quotes waiting for you</span>
                </div>
                <div className="ev-stat">
                  <b>{counts.acc}</b>
                  <span>Accepted quotes</span>
                </div>
                <div className="ev-stat">
                  <b>{counts.hist}</b>
                  <span>Closed enquiries</span>
                </div>
              </div>

              <h2
                className="ev-h2"
                style={{ color: 'black', padding: '10px' }}
              >
                Start an enquiry
              </h2>

              <div className="ev-dgrid">
                {DOMAINS.map((d, i) => (
                  <Link
                    key={i}
                    to={`/buyer/enquiries/new?domain=${i}`}
                    className="ev-dc"
                  >
                    <span className="ev-dc-ico">{d.i}</span>
                    <strong>{d.n}</strong>
                    <span className="ev-dc-hint">Start an enquiry</span>
                  </Link>
                ))}
              </div>

              <h2 className="ev-h2" style={{ color: 'black', backgroundColor: 'transparent' }}>
  Your workspace
</h2>
              <div className="ev-mgrid">
                {MENU.map((m) => (
                  <Link key={m.id} to={m.to} className="ev-mt">
                    <span className="ev-mt-ico">{m.i}</span>
                    <span>
                      <strong>{m.l}</strong>
                      <small>{m.d}</small>
                    </span>
                    {menuCounts[m.countKey] != null && (
                      <span className="ev-mt-count">
                        {menuCounts[m.countKey]}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
