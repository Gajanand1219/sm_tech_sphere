// Static.jsx
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Static.css'
import '../styles/ScrollAnimations.css'
import { useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

/* =========================================================
   CLEAN TECH DOMAINS — keyed for i18n
   ========================================================= */

const solutionsList = [
  {
    id: 'water',
    nameKey: 'domainWater',
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
    nameKey: 'domainSolid',
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
    nameKey: 'domainSolar',
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
    nameKey: 'domainCarbon',
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
    nameKey: 'domainAir',
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
   COMMON FOOTER
   ========================================================= */

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-main">
          <div className="footer-brand">
            <img
              src="/logo2.jpeg"
              alt="S&M CleanTech"
              className="footer__logo-image"
            />
            <p>SM Techsphere Pvt. Ltd</p>
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
            <Link to="/register/buyer">{t('Register as Buyer')}</Link>
            <Link to="/register/vendor">{t('Register as Vendor')}</Link>
            <Link to="/login">{t('Login')}</Link>
          </div>

          <div className="footer-column footer-contact">
            <h4>{t('footerContact')}</h4>
            <p>SM Techsphere Pvt. Ltd</p>
            <p>
              Email:{' '}
              <a
                href="mailto:smteschsphere2910@gmail.com"
                style={{ color: 'blue', textDecoration: 'none' }}
              >
                smteschsphere2910@gmail.com
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
  )
}

/* =========================================================
   COMMON SCROLL REVEAL
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

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [])
}

/* =========================================================
   PAGE HEADER
   ========================================================= */

function PageHeader({ label, title, description }) {
  return (
    <section className="static-page-header">
      <div className="static-page-header__container" data-reveal>
        <span className="static-page-header__label">{label}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}

/* =========================================================
   SOLUTIONS / DOMAIN PAGE
   ========================================================= */

export function Solutions() {
  const { t } = useLanguage()
  useScrollReveal()

  return (
    <>
      <Navbar />

      <main className="static-page">
        <section className="static-content-section">
          <div className="static-container">
            <div className="domain-page-intro" data-reveal>
              <span>{t('ourDomainsLabel')}</span>
              <h2>{t('domainIntroTitle')}</h2>
              <p>{t('domainIntroDesc')}</p>
            </div>

            <div className="solutions-grid">
              {solutionsList.map((solution, index) => (
                <article key={solution.id} className="solution-card">
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
                      {t('startRequirement')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="static-cta">
          <div className="static-container">
            <div className="static-cta__inner" data-reveal>
              <div>
                <span>{t('industrialRequirementLabel')}</span>
                <h2>{t('haveCleanTechRequirement')}</h2>
                <p>{t('cleanTechRequirementDesc')}</p>
              </div>

              <div className="static-cta__buttons">
                <Link
                  to="/register/buyer"
                  className="static-btn static-btn--primary"
                >
                  {t('Register as Buyer')}
                </Link>
                <Link
                  to="/register/vendor"
                  className="static-btn static-btn--outline"
                >
                  {t('Register as Vendor')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}

/* =========================================================
   HOW IT WORKS / ABOUT US
   ========================================================= */

export function HowItWorks() {
  const { t } = useLanguage()
  useScrollReveal()

  const workflowTimeline = [
    {
      num: '01',
      title: t('workflowStep1Title'),
      icon: '📋',
      desc: t('workflowStep1Desc'),
    },
    {
      num: '02',
      title: t('workflowStep2Title'),
      icon: '🤝',
      desc: t('workflowStep2Desc'),
    },
    {
      num: '03',
      title: t('workflowStep3Title'),
      icon: '🔐',
      desc: t('workflowStep3Desc'),
    },
  ]

  return (
    <>
      <Navbar />

      <main className="static-page">
        <PageHeader
          label={t('aboutPageLabel')}
          title={t('aboutPageTitle')}
          description={t('aboutPageDesc')}
        />

        {/* ABOUT */}
        <section className="static-content-section">
          <div className="static-container">
            <div className="about-platform" data-reveal>
              <div className="about-platform__content">
                <span className="static-small-label">{t('whoWeAre')}</span>
                <h2>{t('aboutTitle')}</h2>
                <p>{t('aboutP1')}</p>
                <p>{t('aboutP2')}</p>
              </div>

              <div className="about-platform__points">
                <div>
                  <strong>01</strong>
                  <span>{t('aboutPoint1')}</span>
                </div>
                <div>
                  <strong>02</strong>
                  <span>{t('aboutPoint2')}</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>{t('aboutPoint3')}</span>
                </div>
                <div>
                  <strong>04</strong>
                  <span>{t('aboutPoint4')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="workflow-section">
          <div className="static-container">
            <div className="domain-page-intro">
              <span>{t('platformWorkflow')}</span>
              <h2>{t('workflowTitle')}</h2>
              <p>{t('workflowDesc')}</p>
            </div>

            <div className="workflow-grid">
              {workflowTimeline.map((step, index) => (
                <article
                  className="workflow-card"
                  key={step.num}
                  data-reveal
                >
                  <div className="workflow-card__top">
                    <div className="workflow-card__number">{step.num}</div>
                    <div className="workflow-card__icon">{step.icon}</div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  {index < workflowTimeline.length - 1 && (
                    <span className="workflow-card__arrow">→</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="security-section">
          <div className="static-container">
            <div className="security-grid">
              <div className="security-box" data-reveal>
                <span className="security-box__icon">🔒</span>
                <div>
                  <h3>{t('strictMasking')}</h3>
                  <p>{t('strictMaskingDesc')}</p>
                </div>
              </div>

              <div className="security-box" data-reveal>
                <span className="security-box__icon">⚡</span>
                <div>
                  <h3>{t('responseWindow')}</h3>
                  <p>{t('responseWindowDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="static-cta">
          <div className="static-container">
            <div className="static-cta__inner">
              <div>
                <span>{t('getStartedLabel')}</span>
                <h2>{t('readyToParticipate')}</h2>
                <p>{t('readyToParticipateDesc')}</p>
              </div>

              <div className="static-cta__buttons">
                <Link
                  to="/register/buyer"
                  className="static-btn static-btn--primary"
                >
                  {t('Register as Buyer')}
                </Link>
                <Link
                  to="/register/vendor"
                  className="static-btn static-btn--outline"
                >
                  {t('Register as Vendor')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
