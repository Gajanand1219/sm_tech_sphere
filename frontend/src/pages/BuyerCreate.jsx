import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import '../styles/BuyerCreate.css'
import { useAuth } from '../context/AuthContext'

const STEPS = [
  'Domain',
  'Category',
  'Sub-category',
  'Questionnaire',
  'Review',
  'Submit',
]

const DOMAIN_ICONS = {
  water: '💧', wastewater: '💧', waste: '🗑️', hazardous: '🗑️',
  solar: '☀️', renewable: '☀️', carbon: '🌿', esg: '🌿',
  spcb: '💨', pollution: '💨', air: '💨',
}

const getDomainIcon = (name = '') => {
  const key = Object.keys(DOMAIN_ICONS).find((word) =>
    name.toLowerCase().includes(word)
  )
  return key ? DOMAIN_ICONS[key] : '◇'
}

const initials = (name = '') => {
  const words = String(name).trim().split(/\s+/)
  return ((words[0] || '?').charAt(0) + (words[1] ? words[1].charAt(0) : '')).toUpperCase()
}

const MENU = [
  { id: 'create', l: 'Create enquiry', i: '➕', to: '/buyer/enquiries/new' },
  { id: 'current', l: 'Current enquiry', i: '📋', to: '/buyer/enquiries?view=current', countKey: 'current' },
  { id: 'quote', l: 'View quote', i: '📄', to: '/buyer/enquiries?view=quotes', countKey: 'quotes' },
  { id: 'accepted', l: 'Accepted', i: '✅', to: '/buyer/enquiries?view=accepted', countKey: 'accepted' },
  { id: 'rejected', l: 'Rejected', i: '❌', to: '/buyer/enquiries?view=rejected', countKey: 'rejected' },
  { id: 'closed', l: 'Closed', i: '🔒', to: '/buyer/enquiries?view=closed', countKey: 'closed' },
  { id: 'history', l: 'History', i: '🕒', to: '/buyer/enquiries?view=history', countKey: 'history' },
]

function CompanyAvatar({ logo, name, size = 'md' }) {
  const [errored, setErrored] = useState(false)
  const hasLogo = Boolean(logo) && !errored
  return (
    <span className={`ev-av ev-av--${size} ${hasLogo ? 'ev-av--logo' : ''}`}>
      {hasLogo ? (
        <img src={logo} alt={name || 'Company'} className="ev-av-img" onError={() => setErrored(true)} />
      ) : (
        initials(name)
      )}
    </span>
  )
}

export default function BuyerCreate() {
  const navigate = useNavigate()

  const [domains, setDomains] = useState([])
  const [problems, setProblems] = useState([])
  const [questions, setQuestions] = useState([])
const { logout } = useAuth()
  const [domainId, setDomainId] = useState('')
  const [category, setCategory] = useState('')
  const [problemId, setProblemId] = useState('')
  const [title, setTitle] = useState('')
  const [answers, setAnswers] = useState({})
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [loadingDomains, setLoadingDomains] = useState(true)
  const [loadingProblems, setLoadingProblems] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  const [profile, setProfile] = useState(null)
  const [networkLogo, setNetworkLogo] = useState(null)
  const [counts, setCounts] = useState({
    current: 0, quotes: 0, accepted: 0,
    rejected: 0, closed: 0, history: 0,
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  // ✅ NEW: auto-advance guard so we don't double-navigate
  const advanceTimer = useRef(null)
  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  const notify = (text, type = 'error') => {
    setMessage(text)
    setMessageType(type)
  }

  /* ---------- Load profile + network logo + counts ---------- */
  useEffect(() => {
    let alive = true

    const loadProfile = async () => {
      try {
        const { data } = await API.get('/auth/profile')
        if (!alive) return
        setProfile(data)
        try {
          const net = await API.get('/public/network-companies')
          const buyers = Array.isArray(net.data?.buyers) ? net.data.buyers : []
          const myCompany = String(data?.company_name || data?.company || data?.name || '').toLowerCase().trim()
          const me =
            buyers.find((b) => b.company_name && String(b.company_name).toLowerCase().trim() === myCompany) ||
            buyers.find((b) => b.email && data?.email && String(b.email).toLowerCase().trim() === String(data.email).toLowerCase().trim())
          if (alive && me?.logo) setNetworkLogo(me.logo)
        } catch (netErr) {
          console.debug('[BuyerCreate Logo] network-companies failed:', netErr)
        }
      } catch (err) {
        console.error('[BuyerCreate Logo] profile load failed:', err)
      }
    }

    const loadCounts = async () => {
      try {
        const { data } = await API.get('/buyer/dashboard')
        if (!alive) return
        const stats = data?.stats || {}
        const enquiries = Array.isArray(data?.enquiries) ? data.enquiries : []
        const get = (...keys) => {
          const k = Object.keys(stats).find((x) => keys.includes(x.toLowerCase()))
          return k !== undefined ? Number(stats[k]) || 0 : null
        }
        const byStatus = (...st) =>
          enquiries.filter((e) => st.includes(String(e.status || '').toUpperCase().split('.').pop())).length
        setCounts({
          current: get('open_enquiries', 'current_enquiries', 'current', 'open') ?? byStatus('APPROVED', 'MATCHED', 'QUOTATION', 'SUBMITTED'),
          quotes: get('quotations', 'quotes', 'total_quotations') ?? 0,
          accepted: get('accepted', 'accepted_quotes', 'accepted_quotations') ?? 0,
          rejected: get('rejected', 'rejected_quotes', 'rejected_quotations') ?? 0,
          closed: get('closed', 'closed_enquiries') ?? byStatus('CLOSED'),
          history: get('history', 'history_enquiries') ?? 0,
        })
      } catch {}
    }

    loadProfile()
    loadCounts()
    return () => { alive = false }
  }, [])

  /* ---------- Load domains ---------- */
  useEffect(() => {
    let active = true
    API.get('/public/domains')
      .then(({ data }) => { if (active) setDomains(Array.isArray(data) ? data : []) })
      .catch(() => { if (active) notify('Unable to load domains. Please refresh the page.') })
      .finally(() => { if (active) setLoadingDomains(false) })
    return () => { active = false }
  }, [])

  /* ---------- Load problems for domain ---------- */
  useEffect(() => {
    let active = true
    setProblems([]); setCategory(''); setProblemId(''); setQuestions([]); setAnswers({})
    if (!domainId) { setLoadingProblems(false); return }
    setLoadingProblems(true)
    API.get(`/public/domains/${domainId}/problems`)
      .then(({ data }) => { if (active) setProblems(Array.isArray(data) ? data : []) })
      .catch(() => { if (active) notify('Unable to load categories for this domain.') })
      .finally(() => { if (active) setLoadingProblems(false) })
    return () => { active = false }
  }, [domainId])

  /* ---------- Load questions for problem ---------- */
  useEffect(() => {
    let active = true
    setQuestions([]); setAnswers({})
    if (!problemId) { setLoadingQuestions(false); return }
    setLoadingQuestions(true)
    API.get(`/public/problems/${problemId}/questions`)
      .then(({ data }) => { if (active) setQuestions(Array.isArray(data) ? data : []) })
      .catch(() => { if (active) notify('Unable to load the questionnaire.') })
      .finally(() => { if (active) setLoadingQuestions(false) })
    return () => { active = false }
  }, [problemId])

  const selectedDomain = useMemo(
    () => domains.find((item) => String(item.id) === String(domainId)),
    [domains, domainId]
  )

  const categories = useMemo(() => {
    const unique = new Map()
    problems.forEach((problem) => {
      const name = (problem.name || '').trim()
      if (name && !unique.has(name)) unique.set(name, name)
    })
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [problems])

  const subCategories = useMemo(
    () => problems.filter((problem) => (problem.name || '').trim() === category),
    [problems, category]
  )

  const selectedProblem = useMemo(
    () => problems.find((problem) => String(problem.id) === String(problemId)),
    [problems, problemId]
  )

  const answeredCount = questions.filter((q) => String(answers[q.field_key] || '').trim()).length
  const requiredQuestionsComplete = questions.every(
    (q) => !q.required || String(answers[q.field_key] || '').trim().length > 0
  )
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0

  const companyName =
    profile?.company_name || profile?.company || profile?.name ||
    profile?.full_name || 'Your Company'

  const companyLogo =
    profile?.logo || profile?.company_logo || profile?.profile_image ||
    networkLogo || null

  /* ---------- Navigation helpers ---------- */
  function goToStep(next) {
    setMessage('')
    setStep(Math.max(0, Math.min(next, STEPS.length - 1)))
    // scroll to top of content for better UX
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ✅ NEW: auto-advance after selection (small delay so user sees the check)
  function autoAdvance(toStep) {
    clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => {
      goToStep(toStep)
    }, 320)
  }

  function selectDomain(id) {
    setDomainId(String(id)); setCategory(''); setProblemId('')
    setQuestions([]); setAnswers({}); setMessage('')
    autoAdvance(1) // ✅ auto go to Category
  }
  function selectCategory(name) {
    setCategory(name); setProblemId(''); setQuestions([]); setAnswers({}); setMessage('')
    autoAdvance(2) // ✅ auto go to Sub-category
  }
  function selectProblem(id) {
    setProblemId(String(id)); setQuestions([]); setAnswers({}); setMessage('')
    autoAdvance(3) // ✅ auto go to Questionnaire
  }

  function validateStep() {
    if (step === 0 && !domainId) { notify('Please select a domain.'); return false }
    if (step === 1 && !category) { notify('Please select a category.'); return false }
    if (step === 2 && !problemId) { notify('Please select a sub-category.'); return false }
    if (step === 3) {
      if (!title.trim()) { notify('Please enter an enquiry title.'); return false }
      if (loadingQuestions) { notify('Please wait for the questionnaire to load.'); return false }
      if (!requiredQuestionsComplete) { notify('Please answer all required questions.'); return false }
    }
    return true
  }

  function nextStep() {
    setMessage('')
    if (!validateStep()) return
    goToStep(step + 1)
  }

  function previousStep() {
    goToStep(step - 1)
  }

  /* ---------- Download as formatted report (HTML → printable) ---------- */
  function downloadReview() {
    const rows = questions
      .map((q) => `
        <tr>
          <td class="q">${escapeHtml(q.question_text)}${q.required ? ' <span class="req">*</span>' : ''}</td>
          <td class="a">${escapeHtml(answers[q.field_key] || 'Not answered')}</td>
        </tr>`)
      .join('')

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>Enquiry Review — SM Techsphere</title>
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f2a4a;margin:0;padding:32px;background:#f3f6fa}
  .sheet{max-width:820px;margin:0 auto;background:#fff;border-radius:16px;padding:34px 38px;box-shadow:0 20px 50px -20px rgba(15,42,74,.35)}
  .brand{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1e9bc9;padding-bottom:14px;margin-bottom:22px}
  .brand h1{margin:0;font-size:20px;letter-spacing:.08em}
  .brand small{color:#5c6b80}
  .badge{background:#e8f4fa;color:#12406f;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.08em}
  h2{font-size:15px;color:#12406f;margin:24px 0 8px;text-transform:uppercase;letter-spacing:.06em}
  .meta{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 22px}
  .meta div{background:#f6f9fc;border:1px solid #e0e7f0;border-radius:10px;padding:10px 14px}
  .meta span{display:block;font-size:11.5px;color:#5c6b80;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px}
  .meta strong{font-size:14px;font-weight:600}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  td{border:1px solid #e0e7f0;padding:11px 13px;vertical-align:top;font-size:13.5px}
  td.q{background:#f6f9fc;width:55%;font-weight:600}
  td.a{color:#183958}
  .req{color:#a3200f}
  .foot{margin-top:28px;padding-top:14px;border-top:1px solid #e0e7f0;font-size:11.5px;color:#5c6b80;text-align:center}
</style></head><body>
  <div class="sheet">
    <div class="brand">
      <div>
        <h1>SM TECHSPHERE</h1>
        <small>ENVIQUO · Buyer Enquiry Report</small>
      </div>
      <span class="badge">ENQUIRY REVIEW</span>
    </div>

    <h2>Enquiry Details</h2>
    <div class="meta">
      <div><span>Domain</span><strong>${escapeHtml(selectedDomain?.name || '—')}</strong></div>
      <div><span>Category</span><strong>${escapeHtml(category || '—')}</strong></div>
      <div><span>Sub-category</span><strong>${escapeHtml(selectedProblem?.sub_domain || selectedProblem?.name || '—')}</strong></div>
      <div><span>Title</span><strong>${escapeHtml(title || '—')}</strong></div>
    </div>

    <h2>Technical Questionnaire</h2>
    <table>
      <tbody>${rows || '<tr><td colspan="2">No questions configured.</td></tr>'}</tbody>
    </table>

    <div class="foot">Generated on ${new Date().toLocaleString()} · SM Techsphere Pvt Ltd</div>
  </div>
</body></html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'SM-TECHSPHERE-Enquiry-Review.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]))
  }

  async function submitEnquiry(event) {
    event.preventDefault()
    setMessage('')
    if (!domainId || !category || !problemId || !title.trim()) {
      notify('Please complete the domain, category, sub-category and title.')
      return
    }
    if (!requiredQuestionsComplete) {
      notify('Please answer all required questions.')
      goToStep(3)
      return
    }
    setSubmitting(true)
    try {
      const response = await API.post('/buyer/enquiries', {
        domain_id: Number(domainId),
        problem_id: Number(problemId),
        title: title.trim(),
        answers,
      })
      notify('Enquiry submitted successfully.', 'success')
      const enquiryId = response.data?.enquiry_id
      window.setTimeout(() => {
        if (enquiryId) navigate(`/buyer/enquiries/${enquiryId}`)
        else navigate('/buyer')
      }, 700)
    } catch (error) {
      const detail = error.response?.data?.detail
      notify(
        typeof detail === 'string'
          ? detail
          : 'Unable to submit the enquiry. Please check the required fields and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* ======================================================
     RENDER
     ====================================================== */
  return (
    <div className="enviquo-dash">
      {/* SIDEBAR */}
      <aside className={`ev-side ${mobileOpen ? 'open' : ''}`}>
        <div className="ev-brand">
          <div className="ev-logo"><img src="/logo2.jpeg" alt="ENVIQUO" /></div>
          <div><b>ENVIQUO</b><small>by SM Techsphere Pvt Ltd</small></div>
        </div>
        <nav className="ev-nav">
          <Link to="/" className="ev-nav-item" title="Go to Home Page"><span>🏠</span> Home</Link>
          <Link to="/buyer" className="ev-nav-item"><span>⌂</span> Dashboard</Link>
          <div className="ev-nav-sep" />
          {MENU.map((m) => (
            <Link key={m.id} to={m.to} className={`ev-nav-item ${m.id === 'create' ? 'on' : ''}`}>
              <span>{m.i}</span>{m.l}
              {m.countKey != null && (<span className="ev-nav-count">{counts[m.countKey] ?? 0}</span>)}
            </Link>
          ))}
        </nav>
        <div className="ev-side-foot">
          <b>SM Techsphere Pvt Ltd.</b>
          Buyer workspace
        </div>
      </aside>

      {mobileOpen && <div className="ev-scrim" onClick={() => setMobileOpen(false)} />}

      {/* MAIN */}
      <div className="ev-main">
        <header className="ev-top">
          <button type="button" className="ev-ham" aria-label="Open menu" onClick={() => setMobileOpen((v) => !v)}>☰</button>
          <button type="button" className="ev-back-btn" onClick={() => navigate('/buyer')} title="Back to Dashboard">← Back</button>
          <span className="ev-top-title">Create Enquiry</span>
          <span className="ev-sp" />
          
          <div className="ev-chip-wrap">
              <button
                type="button"
                className="ev-chip"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={userMenuOpen}
                title={companyName}
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
          <div className="ev-page-head">
            <span className="ev-eyebrow">BUYER WORKSPACE</span>
            {/* <h6 className="ev-title-pill">Create Enquiry</h6> */}
            <p>Select your service requirement and share the technical details with matched vendors.</p>
          </div>

          {/* STEPPER */}
          <nav className="ev-steps" aria-label="Enquiry creation steps">
            {STEPS.map((label, index) => (
              <button
                key={label}
                type="button"
                className={`ev-step ${index === step ? 'on' : ''} ${index < step ? 'done' : ''}`}
                disabled={index > step || submitting}
                onClick={() => { if (index < step) goToStep(index) }}
              >
                <i>{index < step ? '✓' : index + 1}</i>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {message && <div className={`ev-msg ev-msg--${messageType}`} role="status">{message}</div>}

          <form className="ev-form" onSubmit={submitEnquiry}>
            {/* STEP 1: DOMAIN */}
            {step === 0 && (
              <section className="ev-panel">
                <div className="ev-panel-head">
                  <h2>Select Domain</h2>
                  <p>Select one of the domains configured in your database.</p>
                </div>
                {loadingDomains ? (
                  <div className="ev-loading">Loading domains...</div>
                ) : domains.length === 0 ? (
                  <div className="ev-empty-sm">No domains found in the database.</div>
                ) : (
                  <div className="ev-dgrid">
                    {domains.map((domain) => {
                      const selected = String(domain.id) === String(domainId)
                      return (
                        <button key={domain.id} type="button" className={`ev-dc ${selected ? 'on' : ''}`} onClick={() => selectDomain(domain.id)}>
                          <span className="ev-dc-ico">{getDomainIcon(domain.name)}</span>
                          <strong>{domain.name}</strong>
                          {domain.description && <span className="ev-dc-hint">{domain.description}</span>}
                          {selected && <span className="ev-dc-check">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {/* STEP 2: CATEGORY */}
            {step === 1 && (
              <section className="ev-panel">
                <div className="ev-panel-head">
                  <h2>Select Category</h2>
                  <p>Categories are grouped from the selected domain's records.</p>
                </div>
                <div className="ev-sum">
                  <span>Selected domain</span>
                  <strong>{selectedDomain?.name}</strong>
                  <button type="button" onClick={() => goToStep(0)}>Change</button>
                </div>
                {loadingProblems ? (
                  <div className="ev-loading">Loading categories...</div>
                ) : categories.length === 0 ? (
                  <div className="ev-empty-sm">No categories configured for this domain.</div>
                ) : (
                  <div className="ev-lst">
                    {categories.map((name) => {
                      const selected = category === name
                      const count = problems.filter((p) => (p.name || '').trim() === name).length
                      return (
                        <button key={name} type="button" className={`ev-opt ${selected ? 'on' : ''}`} onClick={() => selectCategory(name)}>
                          <span>{name}<small>{count} {count === 1 ? 'sub-category' : 'sub-categories'}</small></span>
                          <span className="ev-opt-check">{selected ? '✓' : ''}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {/* STEP 3: SUB-CATEGORY */}
            {step === 2 && (
              <section className="ev-panel">
                <div className="ev-panel-head">
                  <h2>Select Sub-category</h2>
                  <p>Select the problem that best describes your requirement.</p>
                </div>
                <div className="ev-sum">
                  <span>Domain</span><strong>{selectedDomain?.name}</strong>
                  <button type="button" onClick={() => goToStep(0)}>Change</button>
                </div>
                <div className="ev-sum">
                  <span>Category</span><strong>{category}</strong>
                  <button type="button" onClick={() => goToStep(1)}>Change</button>
                </div>
                {subCategories.length === 0 ? (
                  <div className="ev-empty-sm">No sub-categories available for this category.</div>
                ) : (
                  <div className="ev-lst">
                    {subCategories.map((problem) => {
                      const selected = String(problem.id) === String(problemId)
                      return (
                        <button key={problem.id} type="button" className={`ev-opt ${selected ? 'on' : ''}`} onClick={() => selectProblem(problem.id)}>
                          <span>{problem.sub_domain || problem.name}{problem.description && <small>{problem.description}</small>}</span>
                          <span className="ev-opt-check">{selected ? '✓' : ''}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {/* STEP 4: QUESTIONNAIRE */}
            {step === 3 && (
              <section className="ev-panel">
                <div className="ev-panel-head">
                  <h2>Technical Questionnaire</h2>
                  <p>Questions loaded from the database for your selection.</p>
                </div>
                <div className="ev-context">
                  <span>{selectedDomain?.name}</span>
                  <span>{category}</span>
                  <span>{selectedProblem?.sub_domain}</span>
                </div>
                <div className="ev-field">
                  <label htmlFor="ev-title">Enquiry Title <em>*</em></label>
                  <input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter A Clear Title For Your Requirement" maxLength={255} required />
                </div>
                <div className="ev-q-head">
                  <div><h3>Project Questions</h3><p>Fields marked * are required.</p></div>
                  <strong>{progress}%</strong>
                </div>
                <div className="ev-prog"><span style={{ width: `${progress}%` }} /></div>
                {loadingQuestions ? (
                  <div className="ev-loading">Loading questionnaire...</div>
                ) : questions.length === 0 ? (
                  <div className="ev-empty-sm">No questions configured for this sub-category. You can still enter the title and continue.</div>
                ) : (
                  <div className="ev-questions">
                    {questions.map((question, index) => (
                      <div className="ev-question" key={question.id}>
                        <label htmlFor={`ev-q-${question.id}`}>
                          <span className="ev-q-num">{String(index + 1).padStart(2, '0')}</span>
                          <span>{question.question_text}{question.required && <em> *</em>}</span>
                        </label>
                        <textarea id={`ev-q-${question.id}`} rows={3} required={Boolean(question.required)}
                          value={answers[question.field_key] || ''}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [question.field_key]: e.target.value }))}
                          placeholder="Enter Your Answer" />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* STEP 5: REVIEW — ✅ NEW attractive report UI */}
            {step === 4 && (
              <section className="ev-panel ev-report-panel">
                <div className="ev-panel-head">
                  <h2>Review Your Enquiry</h2>
                  <p>Verify your selections and answers before submitting.</p>
                </div>

                <div className="ev-report">
                  <div className="ev-report-head">
                    <div>
                      <span className="ev-report-eyebrow">ENVIQUO · BUYER ENQUIRY</span>
                      <h3>Enquiry Review Report</h3>
                    </div>
                    <span className="ev-report-badge">REVIEW</span>
                  </div>

                  <div className="ev-report-meta">
                    <div><span>Domain</span><strong>{selectedDomain?.name || '—'}</strong>
                      <button type="button" onClick={() => goToStep(0)}>Edit</button></div>
                    <div><span>Category</span><strong>{category || '—'}</strong>
                      <button type="button" onClick={() => goToStep(1)}>Edit</button></div>
                    <div><span>Sub-category</span><strong>{selectedProblem?.sub_domain || selectedProblem?.name || '—'}</strong>
                      <button type="button" onClick={() => goToStep(2)}>Edit</button></div>
                    <div><span>Title</span><strong>{title || '—'}</strong>
                      <button type="button" onClick={() => goToStep(3)}>Edit</button></div>
                  </div>

                  <h4 className="ev-report-sub">Technical Questionnaire</h4>
                  <table className="ev-report-table">
                    <tbody>
                      {questions.length === 0 && (
                        <tr><td colSpan={2} className="ev-report-empty">No questions configured.</td></tr>
                      )}
                      {questions.map((question) => (
                        <tr key={question.id}>
                          <td className="q">
                            {question.question_text}{question.required && <span className="req"> *</span>}
                          </td>
                          <td className="a">{answers[question.field_key] || 'Not answered'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ev-report-foot">
                    Generated on {new Date().toLocaleString()} · SM Techsphere Pvt Ltd
                  </div>
                </div>

                <div className="ev-report-actions">
                  <button className="ev-btn" type="button" onClick={downloadReview}>⬇ Download Report</button>
                  <button className="ev-btn" type="button" onClick={() => window.print()}>🖨 Print</button>
                  <button className="ev-btn ev-btn-pri" type="button" onClick={nextStep}>Continue to Submit →</button>
                </div>
              </section>
            )}

            {/* STEP 6: SUBMIT */}
            {step === 5 && (
              <section className="ev-panel ev-submit-panel">
                <span className="ev-submit-icon">✓</span>
                <h2>Ready To Submit?</h2>
                <p>Your enquiry will be created using the existing SM TECHSPHERE backend workflow.</p>
                <div className="ev-submit-summary">
                  <span>{selectedDomain?.name}</span>
                  <strong>{title}</strong>
                  <small>{category} / {selectedProblem?.sub_domain}</small>
                </div>
                <button className="ev-btn ev-btn-pri" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Enquiry →'}
                </button>
              </section>
            )}

            {/* ✅ NEW: Back / Continue footer — Back always visible from step > 0 */}
            <footer className="ev-actions">
              <button
                type="button"
                className="ev-btn"
                onClick={previousStep}
                disabled={step === 0 || submitting}
              >
                ← Back
              </button>

              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  className="ev-btn ev-btn-pri"
                  onClick={nextStep}
                  disabled={
                    submitting ||
                    (step === 0 && loadingDomains) ||
                    (step === 1 && loadingProblems) ||
                    (step === 3 && loadingQuestions)
                  }
                >
                  {step === 4 ? 'Continue To Submit →' : 'Continue →'}
                </button>
              )}
            </footer>
          </form>
        </main>
      </div>
    </div>
  )
}
