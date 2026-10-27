import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const company = 'ENVIQUO SM PVT. LTD.'
const email = 'smtechsphere2910@gmail.com'
const phone = '+91 91127 67997'

const policies = {
  '/privacy-policy': {
    no: '01',
    title: 'Privacy Policy',
    label: 'PRIVACY & DATA',
    icon: 'shield',
    intro:
      'How ENVIQUO handles information when you visit our website or use our industrial B2B platform.',
    sections: [
      ['Information you provide', 'Depending on how you use the platform, you may provide your name, email, phone number, company name, industry, business address, GST or MSME details, website, technical requirements, enquiries, quotations and profile information. Only provide information you are authorised to share.'],
      ['How information is used', 'Information may be used to create and manage accounts, support buyer and vendor registration, structure industrial enquiries, facilitate relevant matching, support quotations and mutual-handshake workflows, respond to messages, maintain platform security and improve the service.'],
      ['Business information and sharing', 'ENVIQUO is designed to connect industrial buyers with relevant solution providers. Information may be shared with relevant participants as permitted by the platform workflow, your choices and applicable law. Do not assume every enquiry will result in a match or quotation.'],
      ['Security and retention', 'We use reasonable measures intended to protect information, but no internet service can promise absolute security. Information may be retained for the purposes described, legitimate business needs, dispute handling or legal requirements. Actual retention periods should reflect company practice.'],
      ['Your choices and requests', 'For questions or requests about personal information, contact us using the details below. We may need to verify your identity. Applicable rights and procedures depend on the law in force and the circumstances of the request.'],
      ['Third parties and updates', 'The website may rely on hosting, communications or other service providers, whose own policies may apply. We may update this policy; check the updated date shown on this page.'],
    ],
  },
  '/terms-and-conditions': {
    no: '02',
    title: 'Terms & Conditions',
    label: 'PLATFORM TERMS',
    icon: 'document',
    intro:
      'General rules for accessing and using ENVIQUO registration, enquiry, matching and quotation features.',
    sections: [
      ['About ENVIQUO', 'ENVIQUO is an industrial B2B CleanTech network and technical matching platform operated under the company name ' + company + '. It is designed to structure industrial requirements and connect buyers with relevant engineering, EPC and CleanTech solution providers.'],
      ['Accounts and accurate information', 'Provide information that is accurate to the best of your knowledge, keep account credentials confidential and use only accounts you are authorised to access.'],
      ['Acceptable use', 'Do not submit misleading, unlawful, fraudulent, infringing or unauthorised material; access another account; interfere with platform security; misuse contact information; or use the platform to spam or harass participants.'],
      ['Matching, quotations and decisions', 'ENVIQUO supports requirements, relevant opportunities, quotations and mutual acceptance. A match, quotation, project award, contract, payment, regulatory approval or project outcome is not guaranteed. Participants should independently evaluate technical, commercial, legal and compliance matters.'],
      ['Availability and changes', 'Features and workflows may change as the platform develops. Access may be restricted where reasonably necessary for security, maintenance, suspected misuse or legal compliance. Uninterrupted availability is not promised.'],
      ['Legal review', 'Nothing here excludes rights or liabilities that cannot legally be excluded. Governing law, dispute forum, limitation clauses and formal contracting details should be reviewed and approved by qualified counsel before publication.'],
    ],
  },
  '/buyer-vendor-policy': {
    no: '03',
    title: 'Buyer & Vendor Policy',
    label: 'NETWORK PARTICIPATION',
    icon: 'users',
    intro:
      'Responsibilities for buyers and vendors participating in ENVIQUO’s structured industrial workflow.',
    sections: [
      ['For buyers', 'Provide a genuine industrial requirement, complete relevant technical questions accurately and avoid sharing confidential or third-party information without permission. An enquiry does not guarantee a match, quotation, vendor selection or project execution.'],
      ['For vendors', 'Provide accurate company, capability, experience, specialization and contact information. Review opportunity details carefully and submit quotations or proposals you are authorised and able to offer. Registration alone does not guarantee projects.'],
      ['Technical information and documents', 'Each participant is responsible for the accuracy and lawful sharing of drawings, specifications, reports and other documents. Do not upload restricted or third-party material unless you have permission.'],
      ['Matching and opportunities', 'Matching supports discovery; it is not a certification of a participant, technical recommendation or guarantee of suitability unless expressly confirmed by an official platform record.'],
      ['Quotations and negotiations', 'Vendors determine their quotation details. Buyers should review scope, assumptions, price, taxes, delivery, warranty, safety, compliance and other terms before proceeding. ENVIQUO has no universal quotation price.'],
      ['Mutual handshake', 'The mutual-handshake concept is a mutual-acceptance step. Contact details may be unlocked according to the platform workflow after required acceptance. A handshake does not guarantee a contract, payment, project award or completion.'],
      ['Misuse and complaints', 'Participants must not impersonate a business, submit deceptive claims, misuse another participant’s data or circumvent safeguards. Report concerns to ' + email + ' or ' + phone + '.'],
    ],
  },
  '/disclaimer': {
    no: '04',
    title: 'Disclaimer',
    label: 'IMPORTANT INFORMATION',
    icon: 'alert',
    intro:
      'Important limitations concerning information and features available through ENVIQUO.',
    sections: [
      ['Informational platform', 'ENVIQUO structures industrial requirements and supports connections with relevant engineering, EPC and CleanTech providers. Website content is general information, not a substitute for project-specific professional advice.'],
      ['No guaranteed outcome', 'The platform does not guarantee every enquiry will receive a match, every matched vendor will quote, every quotation will be accepted, or any project will be awarded or completed.'],
      ['Independent verification', 'Participants should independently assess identity, capabilities, qualifications, references, permits, certifications, safety practices, pricing and contractual commitments. A listing or match is not a blanket endorsement.'],
      ['Technical and regulatory decisions', 'Industrial, environmental, engineering and regulatory requirements depend on the project and location. Obtain advice from qualified professionals and relevant authorities. ENVIQUO does not guarantee regulatory approval.'],
      ['External links', 'The website may link to third-party services or content. ENVIQUO does not control all external sites or their separate policies.'],
      ['Applicable law', 'The platform is subject to applicable law and the terms governing its use. Nothing in this disclaimer limits a right or obligation that cannot lawfully be limited.'],
    ],
  },
  '/copyright': {
    no: '05',
    title: 'Copyright & Intellectual Property',
    label: 'CONTENT & OWNERSHIP',
    icon: 'copyright',
    intro:
      'How ENVIQUO website materials and participant-submitted content should be treated.',
    sections: [
      ['Website materials', 'Unless otherwise stated, the ENVIQUO name, visual identity, website layout, original text, graphics and software may be protected by intellectual-property laws. Website access does not grant permission to copy, modify, distribute or commercially exploit them.'],
      ['Permitted use', 'Use the website for its intended business purpose. Do not republish substantial content, remove ownership notices, use branding misleadingly or misuse website components except where applicable law permits.'],
      ['User-submitted content', 'You retain whatever rights you hold in material you submit and should only provide material you are authorised to share. The platform may need permission to host, display and process that material for account operation, enquiries, matching and quotations. Define the final licence in the platform terms.'],
      ['Third-party material', 'Logos, names, documents and other third-party materials remain subject to their respective rights. Their appearance does not imply ownership by ENVIQUO or endorsement unless explicitly confirmed.'],
      ['Copyright concerns', 'If you believe content infringes your rights, contact ' + email + '. Include the material location, an explanation of your rights and a way to contact you. Additional information may be requested.'],
    ],
  },
  '/contact-grievance': {
    no: '06',
    title: 'Contact & Grievance',
    label: 'SUPPORT & COMPLAINTS',
    icon: 'mail',
    intro:
      'Contact the ENVIQUO team about platform questions, policy concerns, account issues or complaints.',
    sections: [
      ['Contact the team', 'For general enquiries or platform support, use the contact details below. You may also use the Contact section on the website to send your name, mobile number, email and message.'],
      ['What to include', 'Include the relevant page or feature, a short description, approximate date and any reference number. Do not email passwords, OTPs or unnecessary sensitive information.'],
      ['Privacy requests', 'If your request concerns personal information, explain it clearly and provide only what is needed to locate the relevant account or record. We may ask for reasonable verification.'],
      ['Complaints and escalation', 'Complaints can be sent to the email below. Before publishing, the company should add details of any formally appointed grievance officer and legally required acknowledgement or resolution timelines. Do not treat this draft as a substitute for mandatory disclosures.'],
      ['Business contact', 'Phone: ' + phone + '. Email: ' + email + '. Company: ' + company + '.'],
    ],
  },
}

/* ---------------- Inline SVG Icons ---------------- */
function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  const paths = {
    shield: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    document: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M21 19c0-2.5-1.7-4.5-4-5" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3l9 16H3z" />
        <path d="M12 9v5" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" />
      </>
    ),
    copyright: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9.5a3.5 3.5 0 1 0 0 5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.7 2 2 0 0 1 4.1 1.5h2.6a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.7 9.2a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
    ),
    arrow: (
      <>
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </>
    ),
    chevron: <path d="M9 6l6 6-6 6" />,
    check: <path d="M5 12l4 4 10-10" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    layers: (
      <>
        <path d="M12 3l9 5-9 5-9-5 9-5z" />
        <path d="M3 13l9 5 9-5" />
      </>
    ),
  }
  return <svg {...common}>{paths[name] || paths.document}</svg>
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ pathname }) {
  return (
    <aside className="lp-sidebar">
      <div className="lp-side-head">
        <span className="lp-side-kicker">POLICY CENTRE</span>
        <h3>Legal &amp; Compliance</h3>
        <p>Official documents governing the ENVIQUO platform.</p>
      </div>

      <nav className="lp-side-nav">
        {Object.entries(policies).map(([path, p]) => (
          <Link
            key={path}
            to={path}
            className={path === pathname ? 'active' : ''}
          >
            <span className="lp-side-ico">
              <Icon name={p.icon} size={16} />
            </span>
            <span className="lp-side-txt">
              <b>{p.title}</b>
              <small>{p.label}</small>
            </span>
            <span className="lp-side-no">{p.no}</span>
          </Link>
        ))}
      </nav>

      <div className="lp-side-help">
        <div className="lp-side-help-ico">
          <Icon name="mail" size={18} />
        </div>
        <b>Need assistance?</b>
        <p>Reach the ENVIQUO team for policy or platform questions.</p>
        <a href={'mailto:' + email}>Contact support</a>
      </div>
    </aside>
  )
}

/* ---------------- Hero (index) ---------------- */
function IndexHero() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-copy">
        <span className="lp-eyebrow">
          <i /> ENVIQUO · POLICY CENTRE
        </span>
        <h1>
          Policies built for
          <br />
          <em>business clarity.</em>
        </h1>
        <p>
          Everything you need to understand how the ENVIQUO platform operates —
          from data privacy to buyer–vendor participation, in one organised place.
        </p>
        <div className="lp-hero-meta">
          <span>
            <Icon name="layers" size={14} /> 6 Official Documents
          </span>
          <span>
            <Icon name="clock" size={14} /> Updated 27 Oct 2026
          </span>
        </div>
      </div>
      <div className="lp-hero-art">
        <div className="lp-ring r1" />
        <div className="lp-ring r2" />
        <div className="lp-ring r3" />
        <div className="lp-hero-badge">
          <span>EN</span>
          <small>QUO</small>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Hero (detail) ---------------- */
function DetailHero({ page }) {
  return (
    <section className="lp-hero lp-hero-detail">
      <div className="lp-hero-copy">
        <span className="lp-eyebrow">
          <span className="lp-dot">
            <Icon name={page.icon} size={13} />
          </span>
          {page.label}
        </span>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
        <div className="lp-hero-meta">
          <span>
            <Icon name="clock" size={14} /> Last updated: 27 October 2026
          </span>
          <span>
            <Icon name="layers" size={14} /> {page.sections.length} sections
          </span>
          <span>
            <Icon name="shield" size={14} /> {company}
          </span>
        </div>
      </div>
      <div className="lp-hero-art">
        <div className="lp-ring r1" />
        <div className="lp-ring r2" />
        <div className="lp-ring r3" />
        <div className="lp-hero-badge">
          <span>EN</span>
          <small>QUO</small>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Policy Index ---------------- */
function PolicyIndex() {
  return (
    <>
      <IndexHero />
      <section className="lp-index">
        <div className="lp-index-head">
          <span className="lp-eyebrow plain">ALL DOCUMENTS</span>
          <h2>Browse the policy centre</h2>
        </div>
        <div className="lp-index-grid">
          {Object.entries(policies).map(([path, p], i) => (
            <Link className="lp-card" to={path} key={path}>
              <div className="lp-card-top">
                <span className="lp-card-ico">
                  <Icon name={p.icon} size={20} />
                </span>
                <span className="lp-card-no">{p.no}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.intro}</p>
              <span className="lp-card-link">
                Read policy <Icon name="arrow" size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

/* ---------------- Policy Detail ---------------- */
function PolicyDetail({ page, pathname }) {
  const [active, setActive] = useState(0)

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll('.lp-section')
      let current = 0
      sections.forEach((el, i) => {
        if (el.getBoundingClientRect().top < 140) current = i
      })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <>
      <DetailHero page={page} />

      <div className="lp-layout">
        <Sidebar pathname={pathname} />

        <div className="lp-main">
          {/* On this page */}
          <div className="lp-toc">
            <span className="lp-toc-title">On this page</span>
            <div className="lp-toc-list">
              {page.sections.map(([h], i) => (
                <a
                  key={h}
                  href={`#sec-${i}`}
                  className={active === i ? 'active' : ''}
                >
                  <span className="lp-toc-num">{String(i + 1).padStart(2, '0')}</span>
                  {h}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <article className="lp-content">
            {page.sections.map(([h, body], i) => (
              <section className="lp-section" id={`sec-${i}`} key={h}>
                <div className="lp-section-head">
                  <span className="lp-section-num">{String(i + 1).padStart(2, '0')}</span>
                  <h2>{h}</h2>
                </div>
                <p>{body}</p>
              </section>
            ))}

            {/* Contact block */}
            <div className="lp-contact">
              <div>
                <span className="lp-eyebrow plain">HAVE QUESTIONS?</span>
                <h3>Talk to the ENVIQUO team.</h3>
                <p>Reach us by email or phone for assistance with this policy.</p>
              </div>
              <div className="lp-contact-actions">
                <a className="lp-btn primary" href={'mailto:' + email}>
                  <Icon name="mail" size={15} /> Email us
                </a>
                <a className="lp-btn ghost" href={'tel:' + phone.replace(/\s/g, '')}>
                  <Icon name="phone" size={15} /> {phone}
                </a>
              </div>
            </div>

            <p className="lp-draft">
              <b>Draft notice:</b> This page is a practical draft, not legal advice.
              Confirm actual data practices, statutory disclosures and applicable
              legal requirements with qualified counsel before publishing.
            </p>
          </article>

          {/* Other policies */}
          <section className="lp-related">
            <div className="lp-related-head">
              <span className="lp-eyebrow plain">EXPLORE MORE</span>
              <h2>Other official policies</h2>
            </div>
            <div className="lp-related-grid">
              {Object.entries(policies)
                .filter(([p]) => p !== pathname)
                .slice(0, 3)
                .map(([path, p]) => (
                  <Link className="lp-card sm" to={path} key={path}>
                    <div className="lp-card-top">
                      <span className="lp-card-ico sm">
                        <Icon name={p.icon} size={16} />
                      </span>
                      <span className="lp-card-no">{p.no}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <span className="lp-card-link">
                      Read <Icon name="chevron" size={13} />
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

/* ---------------- Footer ---------------- */
function LegalFooter() {
  return (
    
<footer className="footer">
  <div className="section-container">
    <div className="footer-main">

      {/* Brand */}
      <div className="footer-brand">
        <Link to="/" className="footer-brand__logo">
          <img
            src="/image.png"
            alt="ENVIQUO"
            className="footer__logo-image"
          />
          <span>ENVIQUO</span>
        </Link>

        <p className="footer-brand__tagline">
          Diagnose. Match. Solution.
        </p>
      </div>

      {/* Platform */}
      <div className="footer-column">
        <h4>Platform</h4>
        <Link to="/">Home</Link>
        <Link to="/solutions">Domains</Link>
        <Link to="/how-it-works">About Us</Link>
        <Link to="/#contact">Contact Us</Link>
      </div>

      {/* Join Network */}
      <div className="footer-column">
        <h4>Join Our Network</h4>
        <Link to="/register/buyer">Register as Buyer</Link>
        <Link to="/register/vendor">Register as Vendor</Link>
        <Link to="/login">Login</Link>
      </div>

      {/* Legal Policies */}
      <div className="footer-column footer-legal">
        <h4>Legal & Policies</h4>

        {Object.entries(policies).map(([path, policy]) => (
          <Link key={path} to={path}>
            {policy.title}
          </Link>
        ))}
      </div>

      {/* Contact */}
      <div className="footer-column footer-contact">
        <h4>Contact Us</h4>

        <p className="footer-contact__company">
          {company}
        </p>

        <a
          className="footer-contact__email"
          href={'mailto:' + email}
        >
          <Icon name="mail" size={15} />
          <span>{email}</span>
        </a>

        <a
          className="footer-contact__email"
          href={'tel:' + phone.replace(/\s/g, '')}
        >
          <Icon name="phone" size={15} />
          <span>{phone}</span>
        </a>

        <p className="footer-contact__country">
          India
        </p>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="footer-bottom">
      <span>
        © {new Date().getFullYear()} {company}. All rights reserved.
      </span>
      <span>Policy Centre · ENVIQUO</span>
    </div>
  </div>
</footer>

  )
}

/* ---------------- Main ---------------- */
export default function LegalPages() {
  const { pathname } = useLocation()
  const page = policies[pathname]

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <Navbar />
      <main className="lp-page">
        <div className="lp-bg">
          <span className="lp-blob a" />
          <span className="lp-blob b" />
          <span className="lp-grid-bg" />
        </div>

        <div className="lp-wrap">
          <div className="lp-crumb">
            <Link to="/">Home</Link>
            <Icon name="chevron" size={12} />
            <Link to="/privacy-policy">Policy Centre</Link>
            {page && (
              <>
                <Icon name="chevron" size={12} />
                <b>{page.title}</b>
              </>
            )}
          </div>

          {!page ? <PolicyIndex /> : <PolicyDetail page={page} pathname={pathname} />}
        </div>
      </main>
      <LegalFooter />
      <style>{styles}</style>
    </>
  )
}

/* ---------------- STYLES ---------------- */
const styles = `
/* ===== BASE ===== */
.lp-page{
  position:relative;isolation:isolate;overflow:hidden;
  background:#f4f7fb;color:#0f2438;min-height:80vh;
  padding:26px 22px 90px;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
}
.lp-page *{box-sizing:border-box}
.lp-wrap{max-width:1200px;margin:0 auto;position:relative;z-index:1}

/* ===== BACKGROUND ===== */
.lp-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.lp-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55}
.lp-blob.a{width:520px;height:520px;right:-160px;top:-80px;background:radial-gradient(circle,#2bb7a0 0%,transparent 70%)}
.lp-blob.b{width:480px;height:480px;left:-200px;top:520px;background:radial-gradient(circle,#2499cc 0%,transparent 70%)}
.lp-grid-bg{
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(15,36,56,.035) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(15,36,56,.035) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%);
}

/* ===== CRUMB ===== */
.lp-crumb{
  display:flex;align-items:center;gap:6px;flex-wrap:wrap;
  font-size:12px;color:#8496a8;margin:6px 0 26px;
}
.lp-crumb a{color:#4b6b82;text-decoration:none;transition:color .18s}
.lp-crumb a:hover{color:#0f8a7c}
.lp-crumb b{color:#1b3348;font-weight:600}

/* ===== HERO ===== */
.lp-hero{
  display:flex;align-items:center;justify-content:space-between;
  gap:40px;padding:52px 52px;min-height:280px;
  border:1px solid #dbe7ee;border-radius:28px;
  background:linear-gradient(125deg,#ffffff 0%,#f9fcff 52%,#eaf9f5 100%);
  box-shadow:0 24px 60px -20px rgba(20,54,80,.16),0 0 0 1px rgba(255,255,255,.6) inset;
  overflow:hidden;position:relative;
}
.lp-hero-copy{max-width:720px;position:relative;z-index:2}
.lp-eyebrow{
  display:inline-flex;align-items:center;gap:9px;
  color:#0f9488;font-size:11px;font-weight:800;
  letter-spacing:1.8px;text-transform:uppercase;
}
.lp-eyebrow.plain{color:#5b7488;font-size:10px;letter-spacing:1.6px}
.lp-eyebrow i{
  width:7px;height:7px;border-radius:50%;background:#20b99b;
  box-shadow:0 0 0 5px rgba(32,185,155,.14);
}
.lp-dot{
  display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;border-radius:7px;
  background:rgba(20,150,132,.1);color:#0f9488;
}
.lp-hero h1{
  font-size:clamp(34px,4.4vw,56px);
  letter-spacing:-1.9px;line-height:1.06;
  margin:18px 0 16px;color:#0d2237;font-weight:850;
}
.lp-hero h1 em{font-style:normal;color:#0f9c8a}
.lp-hero p{
  max-width:660px;color:#5f7488;font-size:14.5px;
  line-height:1.85;margin:0;
}
.lp-hero-meta{
  display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:26px;
  font-size:11.5px;color:#6f8496;
}
.lp-hero-meta span{display:inline-flex;align-items:center;gap:6px}

/* hero art */
.lp-hero-art{
  width:220px;height:220px;flex:0 0 220px;position:relative;
  display:grid;place-items:center;
}
.lp-ring{
  position:absolute;border-radius:50%;
  border:1px dashed rgba(30,155,201,.32);
}
.lp-ring.r1{inset:0;animation:lp-spin 40s linear infinite}
.lp-ring.r2{
  inset:26px;border-style:solid;border-color:rgba(31,169,113,.28);
  box-shadow:0 0 0 12px rgba(31,169,113,.03),0 0 0 26px rgba(30,155,201,.025);
}
.lp-ring.r3{inset:52px;border-color:rgba(20,150,132,.22);border-style:dotted}
.lp-hero-badge{
  width:112px;height:112px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;border-radius:30px;
  background:linear-gradient(150deg,#12739b,#20b99b);
  box-shadow:0 24px 48px -12px rgba(21,139,149,.5),
             0 0 0 1px rgba(255,255,255,.2) inset;
  color:#fff;font-size:26px;font-weight:900;letter-spacing:2px;
  transform:rotate(-7deg);position:relative;z-index:2;
}
.lp-hero-badge small{font-size:9px;letter-spacing:5px;margin-left:6px;opacity:.9}

@keyframes lp-spin{to{transform:rotate(360deg)}}

/* ===== INDEX SECTION ===== */
.lp-index{margin-top:52px}
.lp-index-head h2{
  font-size:clamp(22px,2.4vw,30px);letter-spacing:-.8px;
  color:#0f263c;margin:10px 0 0;font-weight:800;
}
.lp-index-grid{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:16px;margin-top:26px;
}

/* ===== CARD ===== */
.lp-card{
  display:flex;flex-direction:column;
  background:#fff;border:1px solid #e2eaf1;border-radius:18px;
  padding:24px;text-decoration:none;color:inherit;
  transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;
  position:relative;overflow:hidden;
}
.lp-card::after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:3px;
  background:linear-gradient(90deg,#20b99b,#2499cc);
  opacity:0;transition:opacity .22s;
}
.lp-card:hover{
  transform:translateY(-4px);
  border-color:#b9e4d9;
  box-shadow:0 20px 40px -18px rgba(20,54,80,.22);
}
.lp-card:hover::after{opacity:1}
.lp-card-top{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:18px;
}
.lp-card-ico{
  width:44px;height:44px;display:grid;place-items:center;
  border-radius:12px;background:linear-gradient(135deg,#eaf8f5,#e6f2fa);
  color:#128a7d;border:1px solid rgba(20,150,132,.15);
}
.lp-card-ico.sm{width:34px;height:34px;border-radius:10px}
.lp-card-no{
  font-size:11px;font-weight:900;letter-spacing:2px;
  color:#b2c2d0;
}
.lp-card h3{
  font-size:17px;line-height:1.35;margin:0 0 10px;
  color:#0f263c;font-weight:750;letter-spacing:-.3px;
}
.lp-card p{
  font-size:12.5px;line-height:1.75;color:#677a8e;
  margin:0 0 18px;flex:1;
}
.lp-card-link{
  display:inline-flex;align-items:center;gap:7px;
  font-size:11.5px;font-weight:800;color:#0f9488;
  letter-spacing:.3px;
}
.lp-card-link svg{transition:transform .2s}
.lp-card:hover .lp-card-link svg{transform:translate(2px,-2px)}
.lp-card.sm{padding:20px}
.lp-card.sm h3{font-size:14.5px;margin-top:6px}

/* ===== LAYOUT (detail) ===== */
.lp-layout{
  display:grid;grid-template-columns:280px minmax(0,1fr);
  gap:26px;align-items:start;margin-top:30px;
}

/* ===== SIDEBAR ===== */
.lp-sidebar{
  background:#fff;border:1px solid #e4ebf2;border-radius:20px;
  padding:20px;position:sticky;top:96px;
  box-shadow:0 14px 36px -20px rgba(20,54,80,.15);
}
.lp-side-head{padding:4px 6px 16px;border-bottom:1px solid #eef2f6}
.lp-side-kicker{
  font-size:9.5px;font-weight:900;letter-spacing:1.8px;
  color:#92a3b4;text-transform:uppercase;
}
.lp-side-head h3{
  font-size:15px;margin:8px 0 6px;color:#0f263c;
  font-weight:800;letter-spacing:-.3px;
}
.lp-side-head p{font-size:11px;line-height:1.6;color:#7e90a2;margin:0}

.lp-side-nav{margin-top:12px}
.lp-side-nav a{
  display:grid;
  grid-template-columns:34px 1fr auto;
  align-items:center;gap:10px;
  text-decoration:none;color:#4b6274;
  padding:11px 10px;border-radius:11px;
  margin:2px 0;transition:all .18s;
  position:relative;
}
.lp-side-ico{
  width:34px;height:34px;display:grid;place-items:center;
  border-radius:9px;background:#f2f7fa;color:#6a8296;
  transition:all .18s;
}
.lp-side-txt{min-width:0}
.lp-side-txt b{
  display:block;font-size:12px;font-weight:700;color:#1b3348;
  line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  transition:color .18s;
}
.lp-side-txt small{
  display:block;font-size:9.5px;letter-spacing:.8px;
  color:#9aacba;margin-top:2px;font-weight:600;
}
.lp-side-no{
  font-size:9px;font-weight:900;color:#b3c1cf;letter-spacing:1px;
}
.lp-side-nav a:hover{background:#f5fafb}
.lp-side-nav a:hover .lp-side-ico{background:#e3f4ef;color:#118a7d}
.lp-side-nav a.active{
  background:linear-gradient(90deg,#eaf8f5,#f5fbfa);
  box-shadow:inset 3px 0 #1ab79b;
}
.lp-side-nav a.active .lp-side-ico{background:#1ab79b;color:#fff}
.lp-side-nav a.active .lp-side-txt b{color:#087e73}
.lp-side-nav a.active .lp-side-no{color:#118a7d}

.lp-side-help{
  margin-top:18px;padding:16px 14px;border-radius:13px;
  background:linear-gradient(140deg,#0f2a3e,#123d4f);color:#fff;
}
.lp-side-help-ico{
  width:34px;height:34px;border-radius:9px;
  display:grid;place-items:center;margin-bottom:10px;
  background:rgba(94,224,194,.15);color:#5ee0c2;
}
.lp-side-help b{font-size:12.5px;display:block}
.lp-side-help p{font-size:10.5px;line-height:1.6;color:#b4c8d6;margin:5px 0 10px}
.lp-side-help a{
  display:inline-block;font-size:11px;font-weight:800;
  color:#5ee0c2;text-decoration:none;letter-spacing:.3px;
}

/* ===== MAIN ===== */
.lp-main{min-width:0;display:flex;flex-direction:column;gap:24px}

/* TOC */
.lp-toc{
  background:#fff;border:1px solid #e4ebf2;border-radius:16px;
  padding:16px 18px;box-shadow:0 10px 26px -18px rgba(20,54,80,.16);
}
.lp-toc-title{
  display:block;font-size:9.5px;font-weight:900;letter-spacing:1.6px;
  color:#92a3b4;text-transform:uppercase;margin-bottom:10px;
}
.lp-toc-list{
  display:flex;flex-wrap:wrap;gap:8px;
}
.lp-toc-list a{
  display:inline-flex;align-items:center;gap:7px;
  font-size:11px;font-weight:600;color:#5b7288;
  text-decoration:none;padding:6px 10px;border-radius:8px;
  background:#f4f8fa;transition:all .18s;
}
.lp-toc-num{
  font-size:9px;font-weight:900;color:#a2b3c1;letter-spacing:.5px;
}
.lp-toc-list a:hover{background:#e8f6f2;color:#0f9488}
.lp-toc-list a.active{background:#1ab79b;color:#fff}
.lp-toc-list a.active .lp-toc-num{color:rgba(255,255,255,.8)}

/* Content */
.lp-content{
  background:#fff;border:1px solid #e4ebf2;border-radius:20px;
  padding:34px 38px 30px;
  box-shadow:0 16px 40px -22px rgba(20,54,80,.16);
}
.lp-section{padding:24px 0;border-bottom:1px solid #eef2f6}
.lp-section:last-of-type{border-bottom:none}
.lp-section-head{
  display:flex;align-items:center;gap:14px;margin-bottom:12px;
}
.lp-section-num{
  flex-shrink:0;width:36px;height:36px;border-radius:10px;
  display:grid;place-items:center;
  background:linear-gradient(135deg,#eaf8f5,#e6f2fa);
  color:#128a7d;font-size:11px;font-weight:900;letter-spacing:1px;
  border:1px solid rgba(20,150,132,.14);
}
.lp-section h2{
  font-size:16.5px;line-height:1.4;color:#0f263c;
  margin:0;font-weight:750;letter-spacing:-.2px;
}
.lp-section p{
  font-size:13px;line-height:1.9;color:#5f7488;
  margin:0;padding-left:50px;
}

/* Contact */
.lp-contact{
  display:flex;align-items:center;justify-content:space-between;
  gap:24px;flex-wrap:wrap;
  margin-top:28px;padding:26px 28px;border-radius:16px;
  background:linear-gradient(125deg,#0f2a3e 0%,#163c52 55%,#16515a 100%);
  color:#fff;position:relative;overflow:hidden;
}
.lp-contact::before{
  content:"";position:absolute;right:-60px;top:-60px;
  width:200px;height:200px;border-radius:50%;
  background:radial-gradient(circle,rgba(94,224,194,.2),transparent 70%);
}
.lp-contact h3{font-size:19px;margin:6px 0 6px;color:#fff;letter-spacing:-.3px}
.lp-contact p{font-size:11.5px;line-height:1.6;color:#b6cbda;margin:0}
.lp-contact .lp-eyebrow.plain{color:#5ee0c2}
.lp-contact-actions{
  display:flex;gap:10px;flex-wrap:wrap;flex-shrink:0;position:relative;z-index:1;
}
.lp-btn{
  display:inline-flex;align-items:center;gap:7px;
  font-size:11.5px;font-weight:800;text-decoration:none;
  padding:11px 16px;border-radius:10px;transition:all .2s;
  letter-spacing:.2px;white-space:nowrap;
}
.lp-btn.primary{background:#1ab99b;color:#062c35}
.lp-btn.primary:hover{background:#1ecaa9;transform:translateY(-1px)}
.lp-btn.ghost{
  background:rgba(255,255,255,.08);color:#fff;
  border:1px solid rgba(255,255,255,.16);
}
.lp-btn.ghost:hover{background:rgba(255,255,255,.14)}

/* Draft notice */
.lp-draft{
  font-size:11px;line-height:1.75;color:#8fa0b1;
  margin:22px 0 0;padding:14px 16px;border-radius:10px;
  background:#f8fafc;border:1px solid #edf1f5;
}
.lp-draft b{color:#5f7488}

/* Related */
.lp-related-head h2{
  font-size:20px;letter-spacing:-.5px;color:#0f263c;
  margin:8px 0 0;font-weight:800;
}
.lp-related-grid{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:14px;margin-top:18px;
}

/* ===== FOOTER ===== */
.lp-footer{
  background:#0b1c2a;color:#dbe6ed;
  padding:38px max(22px,calc((100% - 1200px)/2)) 28px;
  position:relative;z-index:1;
}
.lp-footer-inner{max-width:1200px;margin:0 auto}
.lp-footer-brand{display:flex;align-items:center;gap:12px}
.lp-mark{
  display:grid;place-items:center;width:46px;height:46px;
  border-radius:13px;background:linear-gradient(145deg,#1685a8,#20b99b);
  font-size:22px;font-weight:900;color:#fff;
  box-shadow:0 10px 24px -8px rgba(32,185,155,.5);
}
.lp-footer-brand b{
  display:block;font-size:16px;letter-spacing:2.5px;color:#fff;
}
.lp-footer-brand small{
  display:block;margin-top:4px;font-size:10.5px;color:#9fb3c1;
  letter-spacing:.5px;
}
.lp-footer-links{
  display:flex;gap:12px 22px;flex-wrap:wrap;
  margin:26px 0 20px;padding:20px 0;
  border-top:1px solid #263b4b;border-bottom:1px solid #263b4b;
}
.lp-footer-links a{
  font-size:11px;text-decoration:none;color:#b8c9d4;
  transition:color .18s;font-weight:600;
}
.lp-footer-links a:hover{color:#5ee0c2}
.lp-footer-meta{
  display:flex;gap:10px 22px;flex-wrap:wrap;margin-bottom:20px;
}
.lp-footer-meta a{
  display:inline-flex;align-items:center;gap:6px;
  font-size:11px;color:#9fb3c1;text-decoration:none;
  transition:color .18s;
}
.lp-footer-meta a:hover{color:#5ee0c2}
.lp-footer-bottom{
  display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;
  font-size:10.5px;color:#7f95a6;padding-top:20px;
  border-top:1px solid #263b4b;
}

/* ===== RESPONSIVE ===== */
@media (max-width:980px){
  .lp-layout{grid-template-columns:1fr}
  .lp-sidebar{position:static}
  .lp-side-nav{
    display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;
  }
  .lp-side-help{grid-column:1/-1}
  .lp-index-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lp-related-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lp-hero{padding:40px}
  .lp-hero-art{width:170px;height:170px;flex-basis:170px}
  .lp-hero-badge{width:92px;height:92px;font-size:22px;border-radius:26px}
  .lp-section p{padding-left:0}
}

@media (max-width:640px){
  .lp-page{padding:16px 13px 60px}
  .lp-crumb{margin:2px 0 16px;font-size:11px}
  .lp-hero{padding:26px 22px;border-radius:22px;min-height:0}
  .lp-hero-art{display:none}
  .lp-hero h1{font-size:32px;letter-spacing:-1.1px;margin-top:14px}
  .lp-hero p{font-size:13px;line-height:1.75}
  .lp-hero-meta{font-size:10.5px;gap:8px 16px;margin-top:20px}
  .lp-index{margin-top:34px}
  .lp-index-grid{grid-template-columns:1fr;gap:12px}
  .lp-card{padding:20px}
  .lp-layout{margin-top:20px;gap:16px}
  .lp-sidebar{padding:14px}
  .lp-side-nav{grid-template-columns:1fr}
  .lp-content{padding:22px 18px;border-radius:16px}
  .lp-section{padding:20px 0}
  .lp-section-head{gap:12px;margin-bottom:10px}
  .lp-section-num{width:32px;height:32px;border-radius:9px}
  .lp-section h2{font-size:14.5px}
  .lp-section p{font-size:12px;line-height:1.85}
  .lp-contact{padding:20px;flex-direction:column;align-items:flex-start}
  .lp-contact h3{font-size:17px}
  .lp-contact-actions{width:100%}
  .lp-btn{flex:1;justify-content:center}
  .lp-related-grid{grid-template-columns:1fr}
  .lp-related-head h2{font-size:18px}
  .lp-toc-list a{font-size:10.5px;padding:5px 9px}
  .lp-footer{padding:28px 16px 22px}
  .lp-footer-links{gap:12px 16px;margin:22px 0 16px;padding:16px 0}
  .lp-footer-bottom{flex-direction:column;line-height:1.6}
}

@media (prefers-reduced-motion:reduce){
  .lp-ring{animation:none}
  .lp-card,.lp-side-nav a{transition:none}
}
`