import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Home.css'
import API from '../services/api'
import { useEffect, useState, useRef } from 'react'
import '../styles/ScrollAnimations.css'
import { useLanguage } from '../context/LanguageContext'

/* =========================================================
   SOLUTIONS — keyed for i18n
   ========================================================= */

const solutionsList = [
  {
    id: 'water',
    nameKey: 'homeDomainWater',
    image:
      'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=900&q=80',
    pointKeys: [
      'waterPoint1',
      'waterPoint2',
      'waterPoint3',
      'waterPoint4',
      'waterPoint5',
    ],
  },
  {
    id: 'solid',
    nameKey: 'homeDomainSolid',
    image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80',
    pointKeys: [
      'solidPoint1',
      'solidPoint2',
      'solidPoint3',
      'solidPoint4',
      'solidPoint5',
    ],
  },
  {
    id: 'solar',
    nameKey: 'homeDomainSolar',
    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    pointKeys: [
      'solarPoint1',
      'solarPoint2',
      'solarPoint3',
      'solarPoint4',
      'solarPoint5',
    ],
  },
  {
    id: 'carbon',
    nameKey: 'homeDomainCarbon',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    pointKeys: [
      'carbonPoint1',
      'carbonPoint2',
      'carbonPoint3',
      'carbonPoint4',
      'carbonPoint5',
    ],
  },
  {
    id: 'air',
    nameKey: 'homeDomainAir',
    image:
      'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=900&q=80',
    pointKeys: [
      'airPoint1',
      'airPoint2',
      'airPoint3',
      'airPoint4',
      'airPoint5',
    ],
  },
]

/* =========================================================
   WORKFLOW STEPS — keyed for i18n
   ========================================================= */

const workflowStepKeys = [
  'workflowStep1Title', // Buyer Requirement
  'workflowStep2Title', // Technical Dossier
  'workflowStep3Title', // Verified Vendor Match
  // NOTE: These keys are already used on About page.
  // For Home, we need shorter step labels.
  // Using dedicated keys below ↓
]

/* =========================================================
   SCROLL REVEAL HOOK
   ========================================================= */

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

/* =========================================================
   ANIMATED COUNTER
   ========================================================= */

function Counter({ end, suffix = '', duration = 3500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true

            const startTime = performance.now()

            const tick = (now) => {
              const progress = Math.min(
                (now - startTime) / duration,
                1
              )
              const eased = 1 - Math.pow(1 - progress, 3)
              setCount(Math.floor(eased * end))

              if (progress < 1) requestAnimationFrame(tick)
              else setCount(end)
            }

            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.8 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {String(count).padStart(2, '0')}
      {suffix}
    </span>
  )
}

/* =========================================================
   HOME PAGE
   ========================================================= */

export default function Home() {
  const { t } = useLanguage()

  const [buyers, setBuyers] = useState([])
  const [vendors, setVendors] = useState([])

  useScrollReveal()

  useEffect(() => {
    const loadNetworkCompanies = async () => {
      try {
        const response = await API.get('/public/network-companies')
        setBuyers(response.data?.buyers || [])
        setVendors(response.data?.vendors || [])
      } catch (error) {
        console.error('Failed to load network companies:', error)
      }
    }

    loadNetworkCompanies()
  }, [])

  const [contactForm, setContactForm] = useState({
    name: '',
    mobile: '',
    email: '',
    message: '',
  })

  const [contactLoading, setContactLoading] = useState(false)
  const [contactSuccess, setContactSuccess] = useState('')
  const [contactError, setContactError] = useState('')

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSuccess('')
    setContactError('')

    if (
      !contactForm.name.trim() ||
      !contactForm.mobile.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      setContactError(t('homeContactFillAll'))
      return
    }

    try {
      setContactLoading(true)
      const response = await API.post('/public/contact', contactForm)
      setContactSuccess(
        response.data?.message || t('homeContactSuccess')
      )
      setContactForm({
        name: '',
        mobile: '',
        email: '',
        message: '',
      })
    } catch (error) {
      setContactError(
        error.response?.data?.detail || t('homeContactFail')
      )
    } finally {
      setContactLoading(false)
    }
  }

  /* ============ WORKFLOW STEPS (translated) ============ */

  const workflowSteps = [
    t('homeFlow1'),
    t('homeFlow2'),
    t('homeFlow3'),
    t('homeFlow4'),
    t('homeFlow5'),
  ]

  return (
    <>
      <Navbar />

      <main className="home">
        {/* ================= HERO ================= */}

        <section className="hero">
          <div className="hero__decor hero__decor--1" />
          <div className="hero__decor hero__decor--2" />
          <div className="hero__decor hero__decor--3" />

          <div className="hero__container">
            <div className="hero__content">
              <span className="hero__label" data-reveal>
                {t('homeHeroLabel')}
              </span>

              {/* <h5 className="hero__title" data-reveal>
                {t('homeHeroTitle')}
              </h5> */}



                <h1 className="hero__title" data-reveal>
                  ENVIQUO
                  <span className="hero__subtitle">
                    By
                    <small>SM Techsphere Pvt. Ltd.</small>
                  </span>
                </h1>
               

              <p className="hero__tagline" data-reveal>
                {t('homeHeroTagline')}
              </p>

              <p className="hero__description" data-reveal>
                {t('homeHeroDesc')}
              </p>

              <div className="hero__buttons" data-reveal>
                <Link
                  to="/register/buyer"
                  className="home-btn home-btn--primary"
                >
                  {t('Register as Buyer')}
                </Link>

                <Link
                  to="/register/vendor"
                  className="home-btn home-btn--outline"
                >
                  {t('Register as Vendor')}
                </Link>

                <Link to="/login" className="home-btn home-btn--login">
                  {t('Login')}
                </Link>
              </div>

              <div className="hero__mini-info" data-reveal>
                <div className="hero-mini-card">
                  <div className="hero-mini-icon">🌿</div>
                  <div className="hero-mini-content">
                    <strong>
                      <Counter end={5} />
                      <span className="counter-plus">+</span>
                    </strong>
                    <span>{t('homeCoreVerticals')}</span>
                  </div>
                </div>

                <div className="hero-mini-card">
                  <div className="hero-mini-icon">⚙️</div>
                  <div className="hero-mini-content">
                    <strong>
                      <Counter end={10} />
                      <span className="counter-plus">+</span>
                    </strong>
                    <span>{t('homeTechParams')}</span>
                  </div>
                </div>

                <div className="hero-mini-card">
                  <div className="hero-mini-icon">⚡</div>
                  <div className="hero-mini-content">
                    <strong>
                      <Counter end={240} />
                      <span className="counter-unit">h</span>
                    </strong>
                    <span>{t('homeResponseWindow')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PLATFORM FLOW */}
            <div className="hero__right" data-reveal>
              <div className="platform-card">
                <div className="platform-card__header">
                  <div className="platform-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>{t('homePlatformFlow')}</span>
                </div>

                <div className="platform-flow">
                  {workflowSteps.map((step, index) => (
                    <div
                      className="platform-flow__item"
                      key={index}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="platform-flow__number">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="platform-flow__text">{step}</div>
                    </div>
                  ))}
                </div>

                <div className="platform-security">
                  <span>🔒</span>
                  <p>{t('homePlatformSecurityMsg')}</p>
                </div>
              </div>

              <div className="hero__info-cards">
                <div className="info-card">
                  <div className="info-card__icon">🔒</div>
                  <div>
                    <strong>{t('homeStrictMasking')}</strong>
                    <span>{t('homeZeroSpam')}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card__icon">⚡</div>
                  <div>
                    <strong>{t('homeTimerTitle')}</strong>
                    <span>{t('homeTimerSub')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}

        <section className="about" id="about">
          <div className="section-container">
            <div className="section-heading" data-reveal>
              <span className="section-label">{t('homeAboutLabel')}</span>
              <h2>{t('homeAboutTitle')}</h2>
              <p>{t('homeAboutDesc')}</p>
            </div>

            <div className="solutions-grid">
              {solutionsList.map((solution, index) => (
                <article
                  key={solution.id}
                  className="solution-card"
                  data-reveal
                  style={{ transitionDelay: `${index * 0.06}s` }}
                >
                  <div className="solution-card__image">
                    <img
                      src={solution.image}
                      alt={t(solution.nameKey)}
                      loading="lazy"
                    />
                    <span className="solution-card__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="solution-card__body">
                    <h2>{t(solution.nameKey)}</h2>

                    <ul className="solution-card__points">
                      {solution.pointKeys.map((pointKey, i) => (
                        <li key={pointKey}>
                          <span className="solution-card__point-num">
                            {i + 1}
                          </span>
                          <span className="solution-card__point-text">
                            {t(pointKey)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/register/buyer"
                      className="solution-card__link"
                    >
                      {t('homeStartRequirement')}
                      <span className="solution-card__arrow">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= VISION / MISSION ================= */}

        <section className="vision-mission">
          <div className="section-container">
            <div className="section-heading center" data-reveal>
              <span className="section-label">{t('homePurposeLabel')}</span>
              <h2>{t('homeVisionMission')}</h2>
            </div>

            <div className="vm-grid">
              <div className="vm-card" data-reveal>
                <div className="vm-icon">◈</div>
                <div>
                  <span className="vm-label">{t('homeVisionLabel')}</span>
                  <h3>{t('homeVisionTitle')}</h3>
                  <p>{t('homeVisionDesc')}</p>
                </div>
              </div>

              <div
                className="vm-card"
                data-reveal
                style={{ transitionDelay: '0.1s' }}
              >
                <div className="vm-icon">◎</div>
                <div>
                  <span className="vm-label">{t('homeMissionLabel')}</span>
                  <h3>{t('homeMissionTitle')}</h3>
                  <p>{t('homeMissionDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TRUSTED NETWORK ================= */}

        <section className="partners">
          <div className="section-container">
            <div className="partners-heading" data-reveal>
              <span className="section-label">{t('homeNetworkLabel')}</span>
              <h2>{t('homeNetworkTitle')}</h2>
              <p>{t('homeNetworkDesc')}</p>
            </div>

            <div className="partners-grid">
              {/* VENDORS */}
              <div className="partner-network-card" data-reveal>
                <div className="partner-network-header">
                  <div className="partner-network-icon">⚙️</div>
                  <div>
                    <span className="partner-network-kicker">
                      {t('homeTechNetworkKicker')}
                    </span>
                    <h3>{t('homeApprovedEPC')}</h3>
                  </div>
                </div>

                <div className="partner-marquee">
                  <marquee
                    behavior="scroll"
                    direction="left"
                    scrollamount="5"
                    scrolldelay="0"
                    loop="-1"
                  >
                    <div className="partner-marquee-content">
                      {vendors.length > 0 ? (
                        vendors.map((company) => (
                          <div
                            className="partner-company"
                            key={company.id}
                          >
                            <div className="partner-company-logo">
                              <img
                                src={company.logo}
                                alt={company.company_name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.parentElement.classList.add(
                                    'partner-company-logo--fallback'
                                  )
                                }}
                              />
                              <span>
                                {company.company_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>
                            </div>
                            <span className="partner-company-name">
                              {company.company_name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="partner-empty">
                          {t('homeNoVendors')}
                        </div>
                      )}
                    </div>
                  </marquee>
                </div>

                <div className="partner-network-footer">
                  <span className="network-status-dot" />
                  {t('homeVerifiedProviders')}
                </div>
              </div>

              {/* BUYERS */}
              <div
                className="partner-network-card"
                data-reveal
                style={{ transitionDelay: '0.1s' }}
              >
                <div className="partner-network-header">
                  <div className="partner-network-icon">🏢</div>
                  <div>
                    <span className="partner-network-kicker">
                      {t('homeTrustedNetworkKicker')}
                    </span>
                    <h3>{t('homeVerifiedBuyers')}</h3>
                  </div>
                </div>

                <div className="partner-marquee">
                  <marquee
                    behavior="scroll"
                    direction="right"
                    scrollamount="5"
                    scrolldelay="0"
                    loop="-1"
                  >
                    <div className="partner-marquee-content">
                      {buyers.length > 0 ? (
                        buyers.map((company) => (
                          <div
                            className="partner-company"
                            key={company.id}
                          >
                            <div className="partner-company-logo">
                              <img
                                src={company.logo}
                                alt={company.company_name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.parentElement.classList.add(
                                    'partner-company-logo--fallback'
                                  )
                                }}
                              />
                              <span>
                                {company.company_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>
                            </div>
                            <span className="partner-company-name">
                              {company.company_name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="partner-empty">
                          {t('homeNoBuyers')}
                        </div>
                      )}
                    </div>
                  </marquee>
                </div>

                <div className="partner-network-footer">
                  <span className="network-status-dot" />
                  {t('homeVerifiedBusinesses')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PLATFORM BENEFITS ================= */}

        <section className="platform-benefits">
          <div className="section-container">
            <div className="platform-benefits-heading" data-reveal>
              <span className="section-label">{t('homeWhyLabel')}</span>
              <h2>
                {t('homeWhyTitle')}
                <span>{t('homeWhyTitleHighlight')}</span>
              </h2>
              <p>{t('homeWhyDesc')}</p>
            </div>

            <div className="platform-benefits-grid">
              <article className="platform-benefit-card" data-reveal>
                <div className="platform-benefit-icon">🔍</div>
                <div className="platform-benefit-content">
                  <h3>{t('homeBenefit1Title')}</h3>
                  <p>{t('homeBenefit1Desc')}</p>
                </div>
              </article>

              <article
                className="platform-benefit-card"
                data-reveal
                style={{ transitionDelay: '0.06s' }}
              >
                <div className="platform-benefit-icon">📋</div>
                <div className="platform-benefit-content">
                  <h3>{t('homeBenefit2Title')}</h3>
                  <p>{t('homeBenefit2Desc')}</p>
                </div>
              </article>

              <article
                className="platform-benefit-card"
                data-reveal
                style={{ transitionDelay: '0.12s' }}
              >
                <div className="platform-benefit-icon">⚡</div>
                <div className="platform-benefit-content">
                  <h3>{t('homeBenefit3Title')}</h3>
                  <p>{t('homeBenefit3Desc')}</p>
                </div>
              </article>

              <article
                className="platform-benefit-card"
                data-reveal
                style={{ transitionDelay: '0.18s' }}
              >
                <div className="platform-benefit-icon">🏭</div>
                <div className="platform-benefit-content">
                  <h3>{t('homeBenefit4Title')}</h3>
                  <p>{t('homeBenefit4Desc')}</p>
                </div>
              </article>

              <article
                className="platform-benefit-card"
                data-reveal
                style={{ transitionDelay: '0.24s' }}
              >
                <div className="platform-benefit-icon">🔐</div>
                <div className="platform-benefit-content">
                  <h3>{t('homeBenefit5Title')}</h3>
                  <p>{t('homeBenefit5Desc')}</p>
                </div>
              </article>

              <article
                className="platform-benefit-card"
                data-reveal
                style={{ transitionDelay: '0.30s' }}
              >
                <div className="platform-benefit-icon">🤝</div>
                <div className="platform-benefit-content">
                  <h3>{t('homeBenefit6Title')}</h3>
                  <p>{t('homeBenefit6Desc')}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}

        <section className="contact" id="contact">
          <div className="section-container">
            <div className="contact-layout">
              <div className="contact-intro" data-reveal>
                <span className="section-label">
                  {t('homeContactLabel')}
                </span>
                <h2>{t('homeContactTitle')}</h2>
                <p>{t('homeContactDesc')}</p>

                <div className="contact-person-card" align="center">
                  <div className="contact-person-top">
                    <div className="contact-person-avatar">SM</div>
                    <div>
                      <span className="contact-person-label">
                        {t('homeDirectContact')}
                      </span>
                      <h3>{t('homeContactOurTeam')}</h3>
                    </div>
                  </div>

                  <a
                    href="mailto:smtechsphere2910@gmail.com"
                    className="contact-direct-link"
                  >
                    <div className="contact-direct-icon contact-email-icon">
                      ✉
                    </div>
                    <div className="contact-direct-content">
                      <span>{t('homeEmailLabel')}</span>
                      <strong>smtechsphere2910@gmail.com</strong>
                    </div>
                    <span className="contact-direct-arrow">→</span>
                  </a>

                  <a
                    href="tel:+919112767997"
                    className="contact-direct-link"
                  >
                    <div className="contact-direct-icon contact-phone-icon">
                      ☎
                    </div>
                    <div className="contact-direct-content">
                      <span>{t('homePhoneLabel')}</span>
                      <strong>+91 91127 67997</strong>
                    </div>
                    <span className="contact-direct-arrow">→</span>
                  </a>
                </div>

                <div className="contact-points">
                  <div>
                    <strong>01</strong>
                    <span>{t('homeContactPoint1')}</span>
                  </div>
                  <div>
                    <strong>02</strong>
                    <span>{t('homeContactPoint2')}</span>
                  </div>
                  <div>
                    <strong>03</strong>
                    <span>{t('homeContactPoint3')}</span>
                  </div>
                </div>
              </div>

              <div
                className="contact-card"
                data-reveal
                style={{ transitionDelay: '0.12s' }}
              >
                <h3>{t('homeSendEnquiry')}</h3>
                <p>{t('homeSendEnquiryDesc')}</p>

                <form
                  className="contact-form"
                  onSubmit={handleContactSubmit}
                >
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder={t('homeFormName')}
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                    />
                    <input
                      type="tel"
                      name="mobile"
                      placeholder={t('homeFormMobile')}
                      value={contactForm.mobile}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder={t('homeFormEmail')}
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                  />

                  <textarea
                    name="message"
                    placeholder={t('homeFormMessage')}
                    rows="5"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                  />

                  {contactSuccess && (
                    <div className="contact-success">
                      ✓ {contactSuccess}
                    </div>
                  )}

                  {contactError && (
                    <div className="contact-error">{contactError}</div>
                  )}

                  <button
                    type="submit"
                    className="contact-submit"
                    disabled={contactLoading}
                  >
                    {contactLoading
                      ? t('homeFormSending')
                      : t('homeFormSend')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="footer">
          <div className="section-container">
            <div className="footer-main">
              <div className="footer-brand">
                <img
                  src="/image.png"
                  alt="SM TECHSPHERE"
                  className="footer__logo-image"
                />
                <p>SM Techsphere Pvt. Ltd.</p>
                <span>{t('footerTagline')}</span>
              </div>

              <div className="footer-column">
                <h4>{t('footerPlatform')}</h4>
                <Link to="/">{t('Home')}</Link>
                <Link to="/solutions">{t('Domain')}</Link>
                <Link to="/how-it-works">{t('About Us')}</Link>
                <a href="#contact">{t('footerContactLink')}</a>
              </div>

              <div className="footer-column">
                <h4>{t('footerJoinNetwork')}</h4>
                <Link to="/register/buyer">
                  {t('Register as Buyer')}
                </Link>
                <Link to="/register/vendor">
                  {t('Register as Vendor')}
                </Link>
                <Link to="/login">{t('Login')}</Link>
              </div>

              <div className="footer-column footer-contact">
                <h4>{t('footerContact')}</h4>
                <p>SM Techsphere Pvt. Ltd.</p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:smtechsphere2910@gmail.com"
                    style={{
                      color: '#007bff',
                      textDecoration: 'underline',
                    }}
                  >
                    smtechsphere2910@gmail.com
                  </a>
                </p>
                <p>{t('footerCountry')}</p>
              </div>
            </div>

            <div className="footer-bottom">
              <span>{t('footerRights')}</span>
              <span>{t('footerDomains')}</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
