import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'

const company = 'ENVIQUO SM PVT. LTD.'
const email = 'smtechsphere2910@gmail.com'
const phone = '+91 91127 67997'

/* =========================================================
   DATA — unchanged routes & content
   Each policy now carries a `theme` key for page-wise design
   ========================================================= */
const policies = {
  '/privacy-policy': {
    no: '01',
    title: 'Privacy Policy',
    label: 'PRIVACY & DATA',
    icon: 'shield',
    theme: 'privacy',
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
    theme: 'terms',
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
    theme: 'network',
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
    theme: 'disclaimer',
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
    theme: 'copyright',
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
    theme: 'contact',
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

/* ---------------- ICONS ---------------- */
function Icon({ name, size = 20 }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  const paths = {
    shield: <><path d="M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
    document: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.3" /><path d="M21 19c0-2.5-1.7-4.5-4-5" /></>,
    alert: <><path d="M12 3l9 16H3z" /><path d="M12 9v5" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></>,
    copyright: <><circle cx="12" cy="12" r="9" /><path d="M15 9.5a3.5 3.5 0 1 0 0 5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    phone: <path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.7 2 2 0 0 1 4.1 1.5h2.6a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.7 9.2a16 16 0 0 0 6 6l1.2-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />,
    arrow: <><path d="M7 17L17 7" /><path d="M8 7h9v9" /></>,
    chevron: <path d="M9 6l6 6-6 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    layers: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    scale: <><path d="M12 3v18" /><path d="M5 8h14" /><path d="M5 8l-3 7h6zM19 8l-3 7h6z" /></>,
    handshake: <><path d="M2 12l4-4 5 3 5-3 4 4" /><path d="M6 8v6M18 8v6M10 11l-2 4M14 11l2 4" /></>,
    ring: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
    chat: <><path d="M21 12a8 8 0 1 1-3-6.2L21 4v6a8 8 0 0 1 0 2z" /><path d="M8 11h8M8 15h5" /></>,
  }
  return <svg {...p}>{paths[name] || paths.document}</svg>
}

/* =========================================================
   SHARED SHELL
   ========================================================= */
function Crumb({ page }) {
  return (
    <div className="lg-crumb">
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
  )
}

function LegalFooter() {
  return (
    <footer className="lg-footer">
      <div className="lg-footer-in">
        <div className="lg-f-brand">
          <span className="lg-f-mark">E</span>
          <div><b>ENVIQUO</b><small>Diagnose. Match. Solution.</small></div>
        </div>
        <nav className="lg-f-links">
          {Object.entries(policies).map(([p, v]) => (
            <Link key={p} to={p}>{v.title}</Link>
          ))}
        </nav>
        <div className="lg-f-meta">
          <a href={'mailto:' + email}><Icon name="mail" size={13} /> {email}</a>
          <a href={'tel:' + phone.replace(/\s/g, '')}><Icon name="phone" size={13} /> {phone}</a>
        </div>
        <div className="lg-f-bottom">
          <span>© {new Date().getFullYear()} {company}. All rights reserved.</span>
          <span>Policy Centre · ENVIQUO</span>
        </div>
      </div>
    </footer>
  )
}

/* =========================================================
   INDEX (landing) — "Policy Centre"
   ========================================================= */
function PolicyIndex() {
  return (
    <div className="lg-index">
      <section className="lg-index-hero">
        <span className="lg-eyebrow"><i /> ENVIQUO · POLICY CENTRE</span>
        <h1>Legal clarity, <em>by design.</em></h1>
        <p>Six official documents covering privacy, terms, network participation, disclaimers, intellectual property and support.</p>
        <div className="lg-index-meta">
          <span><Icon name="layers" size={14} /> 6 Documents</span>
          <span><Icon name="clock" size={14} /> Updated 27 Oct 2026</span>
          <span><Icon name="lock" size={14} /> {company}</span>
        </div>
      </section>

      <div className="lg-index-grid">
        {Object.entries(policies).map(([path, p]) => (
          <Link key={path} to={path} className={`lg-icard theme-${p.theme}`}>
            <div className="lg-icard-top">
              <span className="lg-ico"><Icon name={p.icon} size={20} /></span>
              <span className="lg-no">{p.no}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.intro}</p>
            <span className="lg-icard-link">Open document <Icon name="arrow" size={13} /></span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   PAGE 01 — PRIVACY POLICY
   Layout: split hero + numbered vertical timeline
   Accent: teal / aqua (trust + data)
   ========================================================= */
function PrivacyLayout({ page }) {
  return (
    <div className="lg-layout theme-privacy">
      <section className="lg-split-hero">
        <div className="lg-split-copy">
          <span className="lg-eyebrow"><span className="lg-pill"><Icon name="shield" size={13} /></span>{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <div className="lg-hero-chips">
            <span><Icon name="clock" size={13} /> 27 Oct 2026</span>
            <span><Icon name="layers" size={13} /> {page.sections.length} sections</span>
          </div>
        </div>
        <div className="lg-split-art">
          <div className="lg-shield-art">
            <div className="lg-shield-ring" />
            <Icon name="shield" size={64} />
          </div>
        </div>
      </section>

      <div className="lg-timeline">
        {page.sections.map(([h, body], i) => (
          <div className="lg-tl-item" key={h}>
            <div className="lg-tl-marker">{String(i + 1).padStart(2, '0')}</div>
            <div className="lg-tl-body">
              <h2>{h}</h2>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <ContactStrip page={page} />
    </div>
  )
}

/* =========================================================
   PAGE 02 — TERMS & CONDITIONS
   Layout: banner + horizontal tab-navigated sections
   Accent: deep navy / amber (contractual)
   ========================================================= */
function TermsLayout({ page }) {
  return (
    <div className="lg-layout theme-terms">
      <section className="lg-banner">
        <div>
          <span className="lg-eyebrow"><span className="lg-pill"><Icon name="document" size={13} /></span>{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
        <div className="lg-banner-badge">
          <Icon name="scale" size={40} />
          <span>PLATFORM<br />AGREEMENT</span>
        </div>
      </section>

      <div className="lg-terms-nav">
        {page.sections.map(([h], i) => (
          <a key={h} href={`#term-${i}`} className="lg-terms-nav-item">
            <span>{String(i + 1).padStart(2, '0')}</span>
            {h}
          </a>
        ))}
      </div>

      <div className="lg-terms-body">
        {page.sections.map(([h, body], i) => (
          <section className="lg-terms-block" id={`term-${i}`} key={h}>
            <div className="lg-terms-block-head">
              <span className="lg-terms-badge">{String(i + 1).padStart(2, '0')}</span>
              <h2>{h}</h2>
            </div>
            <p>{body}</p>
          </section>
        ))}
      </div>

      <ContactStrip page={page} />
    </div>
  )
}

/* =========================================================
   PAGE 03 — BUYER & VENDOR POLICY
   Layout: two-column network diagram + paired sections
   Accent: emerald (connection + growth)
   ========================================================= */
function NetworkLayout({ page }) {
  const buyerSecs = page.sections.filter(([h]) => /buyer/i.test(h))
  const vendorSecs = page.sections.filter(([h]) => /vendor/i.test(h))
  const shared = page.sections.filter(([h]) => !/buyer|vendor/i.test(h))

  return (
    <div className="lg-layout theme-network">
      <section className="lg-net-hero">
        <span className="lg-eyebrow"><span className="lg-pill"><Icon name="users" size={13} /></span>{page.label}</span>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
        <div className="lg-net-diagram">
          <div className="lg-net-node buyer"><Icon name="users" size={22} /><b>BUYER</b></div>
          <div className="lg-net-line" />
          <div className="lg-net-node handshake"><Icon name="handshake" size={26} /></div>
          <div className="lg-net-line" />
          <div className="lg-net-node vendor"><Icon name="document" size={22} /><b>VENDOR</b></div>
        </div>
      </section>

      <div className="lg-net-split">
        <div className="lg-net-col buyer">
          <h3 className="lg-net-col-title"><Icon name="users" size={16} /> Buyer Responsibilities</h3>
          {buyerSecs.map(([h, body]) => (
            <div className="lg-net-card" key={h}>
              <h4>{h}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <div className="lg-net-col vendor">
          <h3 className="lg-net-col-title"><Icon name="document" size={16} /> Vendor Responsibilities</h3>
          {vendorSecs.map(([h, body]) => (
            <div className="lg-net-card" key={h}>
              <h4>{h}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg-net-shared">
        <h3>Shared Workflow Rules</h3>
        <div className="lg-net-shared-grid">
          {shared.map(([h, body], i) => (
            <div className="lg-net-shared-card" key={h}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div><h4>{h}</h4><p>{body}</p></div>
            </div>
          ))}
        </div>
      </div>

      <ContactStrip page={page} />
    </div>
  )
}

/* =========================================================
   PAGE 04 — DISCLAIMER
   Layout: alert-styled hero + warning card list
   Accent: amber / orange (caution)
   ========================================================= */
function DisclaimerLayout({ page }) {
  return (
    <div className="lg-layout theme-disclaimer">
      <section className="lg-alert-hero">
        <div className="lg-alert-icon"><Icon name="alert" size={38} /></div>
        <div className="lg-alert-copy">
          <span className="lg-eyebrow"><span className="lg-pill"><Icon name="alert" size={13} /></span>{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <div className="lg-alert-grid">
        {page.sections.map(([h, body], i) => (
          <div className="lg-alert-card" key={h}>
            <div className="lg-alert-card-top">
              <span className="lg-alert-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lg-alert-tag">NOTICE</span>
            </div>
            <h3>{h}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>

      <ContactStrip page={page} />
    </div>
  )
}

/* =========================================================
   PAGE 05 — COPYRIGHT & IP
   Layout: magazine / editorial list with quote-style pullouts
   Accent: violet / indigo (creative ownership)
   ========================================================= */
function CopyrightLayout({ page }) {
  return (
    <div className="lg-layout theme-copyright">
      <section className="lg-editorial-hero">
        <div>
          <span className="lg-eyebrow"><span className="lg-pill"><Icon name="copyright" size={13} /></span>{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
        <div className="lg-editorial-mark">©</div>
      </section>

      <div className="lg-editorial-list">
        {page.sections.map(([h, body], i) => (
          <article className="lg-editorial-item" key={h}>
            <div className="lg-editorial-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="lg-editorial-content">
              <h2>{h}</h2>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>

      <ContactStrip page={page} />
    </div>
  )
}

/* =========================================================
   PAGE 06 — CONTACT & GRIEVANCE
   Layout: support card grid + prominent contact block
   Accent: sky blue (communication)
   ========================================================= */
function ContactLayout({ page }) {
  return (
    <div className="lg-layout theme-contact">
      <section className="lg-contact-hero">
        <div>
          <span className="lg-eyebrow"><span className="lg-pill"><Icon name="chat" size={13} /></span>{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
        <div className="lg-contact-cards">
          <a className="lg-contact-tile" href={'mailto:' + email}>
            <span className="lg-ct-ico"><Icon name="mail" size={20} /></span>
            <div><small>EMAIL</small><b>{email}</b></div>
          </a>
          <a className="lg-contact-tile" href={'tel:' + phone.replace(/\s/g, '')}>
            <span className="lg-ct-ico"><Icon name="phone" size={20} /></span>
            <div><small>PHONE</small><b>{phone}</b></div>
          </a>
        </div>
      </section>

      <div className="lg-contact-grid">
        {page.sections.map(([h, body], i) => (
          <div className="lg-contact-card" key={h}>
            <span className="lg-contact-card-ico"><Icon name="chat" size={18} /></span>
            <span className="lg-contact-card-no">{String(i + 1).padStart(2, '0')}</span>
            <h3>{h}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>

      <ContactStrip page={page} />
    </div>
  )
}

/* ---------------- Shared contact strip ---------------- */
function ContactStrip({ page }) {
  return (
    <>
      <div className="lg-cta">
        <div>
          <span className="lg-eyebrow plain">HAVE QUESTIONS?</span>
          <h3>Talk to the ENVIQUO team.</h3>
          <p>Reach us by email or phone for assistance with this policy.</p>
        </div>
        <div className="lg-cta-actions">
          <a className="lg-btn primary" href={'mailto:' + email}><Icon name="mail" size={15} /> Email us</a>
          <a className="lg-btn ghost" href={'tel:' + phone.replace(/\s/g, '')}><Icon name="phone" size={15} /> {phone}</a>
        </div>
      </div>

      <p className="lg-draft">
        <b>Draft notice:</b> This page is a practical draft, not legal advice. Confirm actual data practices, statutory disclosures and applicable legal requirements with qualified counsel before publishing.
      </p>

      <section className="lg-more">
        <span className="lg-eyebrow plain">EXPLORE MORE</span>
        <h2>Other official policies</h2>
        <div className="lg-more-grid">
          {Object.entries(policies)
            .filter(([p]) => p !== Object.keys(policies).find(k => policies[k] === page))
            .slice(0, 3)
            .map(([p, v]) => (
              <Link key={p} to={p} className={`lg-more-card theme-${v.theme}`}>
                <div className="lg-more-top">
                  <span className="lg-ico sm"><Icon name={v.icon} size={16} /></span>
                  <span className="lg-no">{v.no}</span>
                </div>
                <h3>{v.title}</h3>
                <span className="lg-more-link">Read <Icon name="chevron" size={12} /></span>
              </Link>
            ))}
        </div>
      </section>
    </>
  )
}

/* =========================================================
   ROUTER
   ========================================================= */
export default function LegalPages() {
  const { pathname } = useLocation()
  const page = policies[pathname]

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])

  const render = () => {
    if (!page) return <PolicyIndex />
    switch (page.theme) {
      case 'privacy':    return <PrivacyLayout page={page} />
      case 'terms':      return <TermsLayout page={page} />
      case 'network':    return <NetworkLayout page={page} />
      case 'disclaimer': return <DisclaimerLayout page={page} />
      case 'copyright':  return <CopyrightLayout page={page} />
      case 'contact':    return <ContactLayout page={page} />
      default:           return <PrivacyLayout page={page} />
    }
  }

  return (
    <>
      <Navbar />
      <main className={`lg-page theme-${page?.theme || 'index'}`}>
        <div className="lg-bg" aria-hidden>
          <span className="lg-blob a" />
          <span className="lg-blob b" />
        </div>
        <div className="lg-wrap">
          <Crumb page={page} />
          {render()}
        </div>
      </main>
      <LegalFooter />
      <style>{styles}</style>
    </>
  )
}

/* =========================================================
   STYLES — one base + one theme block per page
   ========================================================= */
const styles = `
/* ============ BASE ============ */
.lg-page{
  position:relative;isolation:isolate;overflow:hidden;
  background:#f4f7fb;color:#0f2438;min-height:80vh;
  padding:26px 22px 90px;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --accent:#149987;--accent-2:#2499cc;--accent-soft:#eaf8f5;--accent-ink:#0b3a34;
}
.lg-page.theme-privacy{--accent:#149987;--accent-2:#2499cc;--accent-soft:#eaf8f5;--accent-ink:#0b3a34}
.lg-page.theme-terms{--accent:#b8730f;--accent-2:#0f2a3e;--accent-soft:#fdf3e2;--accent-ink:#3b2a10}
.lg-page.theme-network{--accent:#0e9f6e;--accent-2:#12739b;--accent-soft:#e7f8f0;--accent-ink:#0a3a2a}
.lg-page.theme-disclaimer{--accent:#d97706;--accent-2:#b45309;--accent-soft:#fef3e2;--accent-ink:#4a2a05}
.lg-page.theme-copyright{--accent:#7c5cff;--accent-2:#4a3ad6;--accent-soft:#f1edff;--accent-ink:#2a1f6e}
.lg-page.theme-contact{--accent:#0284c7;--accent-2:#0ea5e9;--accent-soft:#e6f4fb;--accent-ink:#062e44}
.lg-page *{box-sizing:border-box}
.lg-wrap{max-width:1160px;margin:0 auto;position:relative;z-index:1}

.lg-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.lg-blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.45;background:radial-gradient(circle,var(--accent) 0%,transparent 70%)}
.lg-blob.a{width:520px;height:520px;right:-160px;top:-100px}
.lg-blob.b{width:460px;height:460px;left:-200px;top:560px;opacity:.35;background:radial-gradient(circle,var(--accent-2) 0%,transparent 70%)}

/* ============ CRUMB ============ */
.lg-crumb{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;color:#8496a8;margin:6px 0 24px}
.lg-crumb a{color:#4b6b82;text-decoration:none;transition:color .18s}
.lg-crumb a:hover{color:var(--accent)}
.lg-crumb b{color:#1b3348;font-weight:600}

/* ============ SHARED UTILITIES ============ */
.lg-eyebrow{display:inline-flex;align-items:center;gap:9px;color:var(--accent);font-size:11px;font-weight:800;letter-spacing:1.7px;text-transform:uppercase}
.lg-eyebrow.plain{color:#5b7488;font-size:10px}
.lg-eyebrow i{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 18%,transparent)}
.lg-pill{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:7px;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent)}
.lg-hero-chips{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:22px;font-size:11.5px;color:#6f8496}
.lg-hero-chips span{display:inline-flex;align-items:center;gap:6px}

/* ============ INDEX ============ */
.lg-index-hero{
  background:linear-gradient(125deg,#ffffff 0%,#f7fcff 50%,#eaf9f5 100%);
  border:1px solid #dbe7ee;border-radius:26px;padding:48px 48px;
  box-shadow:0 22px 55px -22px rgba(20,54,80,.2);margin-bottom:32px;
}
.lg-index-hero h1{font-size:clamp(34px,4.3vw,52px);letter-spacing:-1.7px;line-height:1.06;margin:16px 0 14px;color:#0d2237;font-weight:850}
.lg-index-hero h1 em{font-style:normal;color:#0f9c8a}
.lg-index-hero p{max-width:620px;color:#5f7488;font-size:14px;line-height:1.85;margin:0}
.lg-index-meta{display:flex;flex-wrap:wrap;gap:10px 22px;margin-top:24px;font-size:11.5px;color:#6f8496}
.lg-index-meta span{display:inline-flex;align-items:center;gap:6px}

.lg-index-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.lg-icard{
  display:flex;flex-direction:column;background:#fff;border:1px solid #e2eaf1;border-radius:18px;
  padding:24px;text-decoration:none;color:inherit;
  transition:transform .22s,border-color .22s,box-shadow .22s;position:relative;overflow:hidden;
}
.lg-icard::before{
  content:"";position:absolute;left:0;right:0;top:0;height:4px;
  background:linear-gradient(90deg,var(--accent),var(--accent-2));
  opacity:.9;
}
.lg-icard:hover{transform:translateY(-4px);border-color:color-mix(in srgb,var(--accent) 30%,#e2eaf1);box-shadow:0 22px 44px -20px rgba(20,54,80,.25)}
.lg-icard-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.lg-ico{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:var(--accent-soft);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent)}
.lg-ico.sm{width:34px;height:34px;border-radius:10px}
.lg-no{font-size:11px;font-weight:900;letter-spacing:2px;color:#b2c2d0}
.lg-icard h3{font-size:17px;line-height:1.35;margin:0 0 10px;color:#0f263c;font-weight:750;letter-spacing:-.3px}
.lg-icard p{font-size:12.5px;line-height:1.75;color:#677a8e;margin:0 0 18px;flex:1}
.lg-icard-link{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:800;color:var(--accent);letter-spacing:.3px}
.lg-icard-link svg{transition:transform .2s}
.lg-icard:hover .lg-icard-link svg{transform:translate(2px,-2px)}

/* ============ CTA + MORE (shared on detail) ============ */
.lg-cta{
  display:flex;align-items:center;justify-content:space-between;gap:22px;flex-wrap:wrap;
  margin-top:30px;padding:26px 28px;border-radius:18px;color:#fff;position:relative;overflow:hidden;
  background:linear-gradient(125deg,#0f2a3e 0%,#163c52 55%,#16515a 100%);
}
.lg-cta::before{content:"";position:absolute;right:-60px;top:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 30%,transparent),transparent 70%)}
.lg-cta h3{font-size:19px;margin:6px 0 6px;color:#fff;letter-spacing:-.3px}
.lg-cta p{font-size:11.5px;color:#b6cbda;margin:0;line-height:1.6}
.lg-cta .lg-eyebrow.plain{color:color-mix(in srgb,var(--accent) 60%,#fff)}
.lg-cta-actions{display:flex;gap:10px;flex-wrap:wrap;flex-shrink:0;position:relative;z-index:1}
.lg-btn{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:800;text-decoration:none;padding:11px 16px;border-radius:10px;transition:all .2s;letter-spacing:.2px;white-space:nowrap}
.lg-btn.primary{background:var(--accent);color:#fff}
.lg-btn.primary:hover{transform:translateY(-1px);filter:brightness(1.08)}
.lg-btn.ghost{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.16)}
.lg-btn.ghost:hover{background:rgba(255,255,255,.14)}

.lg-draft{font-size:11px;line-height:1.75;color:#8fa0b1;margin:20px 0 0;padding:14px 16px;border-radius:10px;background:#f8fafc;border:1px solid #edf1f5}
.lg-draft b{color:#5f7488}

.lg-more{padding-top:38px}
.lg-more h2{font-size:22px;letter-spacing:-.5px;color:#0f263c;margin:8px 0 16px;font-weight:800}
.lg-more-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.lg-more-card{display:flex;flex-direction:column;background:#fff;border:1px solid #e2eaf1;border-radius:16px;padding:20px;text-decoration:none;color:inherit;transition:transform .2s,border-color .2s}
.lg-more-card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--accent) 35%,#e2eaf1)}
.lg-more-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.lg-more-card h3{font-size:14.5px;color:#0f263c;margin:0 0 12px;line-height:1.4;font-weight:750}
.lg-more-link{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;color:var(--accent)}

/* ============ PAGE 01 PRIVACY ============ */
.lg-split-hero{
  display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:36px;align-items:center;
  background:linear-gradient(125deg,#ffffff,#f5fbf9 60%,#e9f7f4);
  border:1px solid #dbe7ee;border-radius:26px;padding:48px;
  box-shadow:0 22px 55px -22px rgba(20,54,80,.18);
}
.lg-split-copy h1{font-size:clamp(32px,4vw,48px);letter-spacing:-1.6px;line-height:1.08;margin:16px 0 14px;color:#0d2237;font-weight:850}
.lg-split-copy p{color:#5f7488;font-size:14px;line-height:1.85;margin:0;max-width:560px}
.lg-split-art{display:grid;place-items:center;position:relative;min-height:220px}
.lg-shield-art{
  width:190px;height:190px;border-radius:50%;display:grid;place-items:center;
  background:radial-gradient(circle at 50% 40%,#eaf8f5,#d8f0eb);
  color:#149987;position:relative;
  box-shadow:0 20px 50px -20px rgba(20,150,132,.5),0 0 0 1px rgba(255,255,255,.8) inset;
}
.lg-shield-ring{position:absolute;inset:-16px;border-radius:50%;border:1.5px dashed rgba(20,150,132,.4);animation:lgspin 40s linear infinite}
@keyframes lgspin{to{transform:rotate(360deg)}}

.lg-timeline{position:relative;margin-top:36px;padding-left:12px}
.lg-timeline::before{
  content:"";position:absolute;left:32px;top:10px;bottom:10px;width:2px;
  background:linear-gradient(180deg,var(--accent),transparent);
}
.lg-tl-item{display:grid;grid-template-columns:64px minmax(0,1fr);gap:20px;padding:14px 0;position:relative}
.lg-tl-marker{
  width:44px;height:44px;border-radius:50%;display:grid;place-items:center;
  background:#fff;border:2px solid var(--accent);color:var(--accent);
  font-size:11px;font-weight:900;letter-spacing:.5px;position:relative;z-index:1;
  box-shadow:0 6px 16px -6px rgba(20,150,132,.4);
}
.lg-tl-body{background:#fff;border:1px solid #e4ebf2;border-radius:14px;padding:20px 22px;box-shadow:0 10px 26px -18px rgba(20,54,80,.16)}
.lg-tl-body h2{font-size:16px;color:#0f263c;margin:0 0 8px;font-weight:750}
.lg-tl-body p{font-size:12.8px;line-height:1.85;color:#5f7488;margin:0}

/* ============ PAGE 02 TERMS ============ */
.lg-banner{
  display:flex;align-items:center;justify-content:space-between;gap:30px;
  background:linear-gradient(120deg,#0f2a3e,#1a3e56 60%,#3a2a10);
  color:#fff;border-radius:26px;padding:44px 46px;position:relative;overflow:hidden;
}
.lg-banner::before{content:"";position:absolute;right:-60px;bottom:-60px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(184,115,15,.3),transparent 70%)}
.lg-banner h1{font-size:clamp(32px,4vw,48px);letter-spacing:-1.6px;line-height:1.08;margin:16px 0 14px;font-weight:850;color:#fff}
.lg-banner p{color:#c6d4df;font-size:14px;line-height:1.8;margin:0;max-width:580px}
.lg-banner .lg-eyebrow{color:#f3c47a}
.lg-banner .lg-pill{background:rgba(243,196,122,.15);color:#f3c47a}
.lg-banner-badge{
  display:flex;flex-direction:column;align-items:center;gap:10px;
  color:#f3c47a;font-size:10px;font-weight:900;letter-spacing:2px;text-align:center;
  padding:18px 22px;border-radius:16px;border:1.5px dashed rgba(243,196,122,.4);
  flex-shrink:0;background:rgba(243,196,122,.05);
}
.lg-banner-badge span{line-height:1.5}

.lg-terms-nav{display:flex;gap:8px;flex-wrap:wrap;margin:28px 0 20px}
.lg-terms-nav-item{
  display:inline-flex;align-items:center;gap:8px;
  font-size:11.5px;font-weight:700;color:#6b5a3a;text-decoration:none;
  padding:8px 12px;border-radius:9px;background:#fdf3e2;border:1px solid #f5e2c1;
  transition:all .18s;
}
.lg-terms-nav-item span{font-size:9px;font-weight:900;color:#b8730f;letter-spacing:.5px}
.lg-terms-nav-item:hover{background:#f7e6c6;border-color:#e6ce9d;transform:translateY(-1px)}

.lg-terms-body{display:grid;grid-template-columns:1fr;gap:16px}
.lg-terms-block{
  background:#fff;border:1px solid #f0e6d2;border-left:4px solid #b8730f;
  border-radius:14px;padding:22px 24px;box-shadow:0 12px 30px -22px rgba(90,60,20,.25);
  scroll-margin-top:100px;
}
.lg-terms-block-head{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.lg-terms-badge{
  display:grid;place-items:center;width:34px;height:34px;border-radius:9px;
  background:#fdf3e2;color:#b8730f;font-size:11px;font-weight:900;letter-spacing:.5px;
  border:1px solid #f0e0c2;
}
.lg-terms-block h2{font-size:16px;color:#3b2a10;margin:0;font-weight:750}
.lg-terms-block p{font-size:12.8px;line-height:1.85;color:#5d4f39;margin:0;padding-left:46px}

/* ============ PAGE 03 NETWORK ============ */
.lg-net-hero{
  background:linear-gradient(125deg,#ffffff 0%,#f4fbf7 55%,#e6f8ef 100%);
  border:1px solid #d6ebdf;border-radius:26px;padding:48px;
  box-shadow:0 22px 55px -22px rgba(10,60,40,.2);
}
.lg-net-hero h1{font-size:clamp(32px,4vw,48px);letter-spacing:-1.6px;line-height:1.08;margin:16px 0 14px;color:#0d2f24;font-weight:850;max-width:720px}
.lg-net-hero p{color:#5a7268;font-size:14px;line-height:1.85;margin:0;max-width:660px}
.lg-net-diagram{
  display:flex;align-items:center;justify-content:center;gap:0;margin-top:36px;
  padding:24px 12px;border-radius:16px;background:rgba(255,255,255,.6);
  border:1px dashed rgba(14,159,110,.35);flex-wrap:wrap;
}
.lg-net-node{
  display:flex;flex-direction:column;align-items:center;gap:8px;
  padding:16px 22px;border-radius:14px;color:#0a3a2a;font-size:11px;font-weight:900;letter-spacing:1px;
  background:#fff;border:1.5px solid rgba(14,159,110,.4);min-width:100px;
}
.lg-net-node.buyer{color:#12739b;border-color:rgba(18,115,155,.4)}
.lg-net-node.vendor{color:#0e9f6e;border-color:rgba(14,159,110,.4)}
.lg-net-node.handshake{background:linear-gradient(135deg,#0e9f6e,#12739b);color:#fff;border:none;box-shadow:0 12px 26px -12px rgba(14,159,110,.6)}
.lg-net-line{width:60px;height:2px;background:linear-gradient(90deg,#12739b,#0e9f6e);opacity:.5;flex-shrink:0}

.lg-net-split{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px}
.lg-net-col{background:#fff;border:1px solid #e4ebf2;border-radius:18px;padding:24px}
.lg-net-col.buyer{border-top:4px solid #12739b}
.lg-net-col.vendor{border-top:4px solid #0e9f6e}
.lg-net-col-title{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:900;letter-spacing:1.2px;text-transform:uppercase;margin:0 0 16px;color:#0a3a2a}
.lg-net-col.buyer .lg-net-col-title{color:#12739b}
.lg-net-col.vendor .lg-net-col-title{color:#0e9f6e}
.lg-net-card{padding:16px 0;border-top:1px solid #eef2f6}
.lg-net-card:first-of-type{border-top:none;padding-top:0}
.lg-net-card h4{font-size:14px;color:#0f263c;margin:0 0 6px;font-weight:750}
.lg-net-card p{font-size:12.3px;line-height:1.8;color:#5f7488;margin:0}

.lg-net-shared{margin-top:26px;background:#fff;border:1px solid #e4ebf2;border-radius:18px;padding:26px}
.lg-net-shared>h3{font-size:15px;color:#0f263c;margin:0 0 16px;font-weight:800;letter-spacing:-.2px}
.lg-net-shared-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.lg-net-shared-card{display:grid;grid-template-columns:36px 1fr;gap:12px;padding:14px;border-radius:12px;background:#f7fbf9;border:1px solid #e4f1ea}
.lg-net-shared-card>span{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:#0e9f6e;color:#fff;font-size:10px;font-weight:900}
.lg-net-shared-card h4{font-size:13px;color:#0f263c;margin:0 0 4px;font-weight:750}
.lg-net-shared-card p{font-size:11.5px;line-height:1.75;color:#5f7488;margin:0}

/* ============ PAGE 04 DISCLAIMER ============ */
.lg-alert-hero{
  display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;
  background:linear-gradient(125deg,#fffaf2,#fef3e2 60%,#fde9c5);
  border:1px solid #f2d9a8;border-radius:26px;padding:44px 46px;
  box-shadow:0 22px 55px -22px rgba(120,70,10,.22);
}
.lg-alert-icon{
  width:96px;height:96px;border-radius:24px;display:grid;place-items:center;
  background:linear-gradient(145deg,#f59e0b,#d97706);color:#fff;
  box-shadow:0 18px 40px -14px rgba(217,119,6,.6);
}
.lg-alert-copy h1{font-size:clamp(32px,4vw,46px);letter-spacing:-1.5px;line-height:1.08;margin:14px 0 12px;color:#3b2105;font-weight:850}
.lg-alert-copy p{color:#6b4a1f;font-size:14px;line-height:1.8;margin:0;max-width:640px}

.lg-alert-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:26px}
.lg-alert-card{
  background:#fff;border:1px solid #f0e2c8;border-radius:16px;padding:22px 24px;
  position:relative;transition:transform .2s,box-shadow .2s;
}
.lg-alert-card:hover{transform:translateY(-3px);box-shadow:0 18px 36px -22px rgba(120,70,10,.3)}
.lg-alert-card::before{content:"";position:absolute;left:0;top:18px;bottom:18px;width:3px;border-radius:2px;background:#d97706}
.lg-alert-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-left:12px}
.lg-alert-num{font-size:11px;font-weight:900;letter-spacing:1.5px;color:#d97706}
.lg-alert-tag{font-size:9px;font-weight:900;letter-spacing:1.5px;color:#b45309;padding:4px 8px;border-radius:6px;background:#fef3e2;border:1px solid #f2d9a8}
.lg-alert-card h3{font-size:15px;color:#3b2105;margin:0 0 8px;font-weight:750;padding-left:12px}
.lg-alert-card p{font-size:12.5px;line-height:1.85;color:#5d4526;margin:0;padding-left:12px}

/* ============ PAGE 05 COPYRIGHT ============ */
.lg-editorial-hero{
  display:flex;align-items:center;justify-content:space-between;gap:30px;
  background:linear-gradient(125deg,#faf8ff,#f1edff 65%,#e8e1ff);
  border:1px solid #ddd2ff;border-radius:26px;padding:48px;
  box-shadow:0 22px 55px -22px rgba(80,60,180,.22);position:relative;overflow:hidden;
}
.lg-editorial-hero h1{font-size:clamp(32px,4vw,48px);letter-spacing:-1.6px;line-height:1.08;margin:16px 0 14px;color:#1f1650;font-weight:850;max-width:720px}
.lg-editorial-hero p{color:#5f5878;font-size:14px;line-height:1.85;margin:0;max-width:640px}
.lg-editorial-mark{
  font-size:180px;line-height:1;color:#7c5cff;opacity:.18;font-weight:900;
  font-family:Georgia,serif;flex-shrink:0;transform:translateY(-8px);
}

.lg-editorial-list{margin-top:32px;background:#fff;border:1px solid #ece7ff;border-radius:20px;overflow:hidden;box-shadow:0 16px 40px -22px rgba(80,60,180,.18)}
.lg-editorial-item{display:grid;grid-template-columns:100px 1fr;gap:24px;padding:28px 34px;border-bottom:1px solid #f0ecff}
.lg-editorial-item:last-child{border-bottom:none}
.lg-editorial-num{font-size:44px;font-weight:900;color:#e4dcff;line-height:1;letter-spacing:-2px;font-family:Georgia,serif}
.lg-editorial-content h2{font-size:17px;color:#1f1650;margin:0 0 10px;font-weight:750;letter-spacing:-.2px}
.lg-editorial-content p{font-size:12.8px;line-height:1.9;color:#5b5570;margin:0}

/* ============ PAGE 06 CONTACT ============ */
.lg-contact-hero{
  background:linear-gradient(125deg,#ffffff 0%,#f2f9ff 55%,#e3f3fc 100%);
  border:1px solid #cfe6f4;border-radius:26px;padding:44px 46px;
  box-shadow:0 22px 55px -22px rgba(10,60,100,.2);
}
.lg-contact-hero h1{font-size:clamp(32px,4vw,48px);letter-spacing:-1.6px;line-height:1.08;margin:16px 0 14px;color:#062e44;font-weight:850;max-width:700px}
.lg-contact-hero p{color:#547085;font-size:14px;line-height:1.85;margin:0;max-width:640px}
.lg-contact-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:28px}
.lg-contact-tile{
  display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit;
  padding:18px 20px;border-radius:14px;background:#fff;
  border:1px solid #d6e9f4;transition:all .2s;
}
.lg-contact-tile:hover{transform:translateY(-2px);border-color:#0284c7;box-shadow:0 16px 34px -20px rgba(2,132,199,.35)}
.lg-ct-ico{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#e6f4fb;color:#0284c7;flex-shrink:0}
.lg-contact-tile small{display:block;font-size:9.5px;font-weight:900;letter-spacing:1.5px;color:#0284c7;margin-bottom:2px}
.lg-contact-tile b{font-size:12.5px;color:#062e44;word-break:break-word}

.lg-contact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:26px}
.lg-contact-card{
  background:#fff;border:1px solid #e2eaf1;border-radius:16px;padding:22px 24px;position:relative;
  transition:transform .2s,box-shadow .2s;
}
.lg-contact-card:hover{transform:translateY(-2px);box-shadow:0 16px 34px -22px rgba(10,60,100,.28)}
.lg-contact-card-ico{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:#e6f4fb;color:#0284c7;margin-bottom:12px}
.lg-contact-card-no{position:absolute;top:20px;right:22px;font-size:11px;font-weight:900;color:#b4c8d6;letter-spacing:1px}
.lg-contact-card h3{font-size:15px;color:#062e44;margin:0 0 8px;font-weight:750}
.lg-contact-card p{font-size:12.5px;line-height:1.85;color:#5f7488;margin:0}

/* ============ FOOTER ============ */
.lg-footer{background:#0b1c2a;color:#dbe6ed;padding:38px max(22px,calc((100% - 1160px)/2)) 28px;position:relative;z-index:1}
.lg-footer-in{max-width:1160px;margin:0 auto}
.lg-f-brand{display:flex;align-items:center;gap:12px}
.lg-f-mark{display:grid;place-items:center;width:46px;height:46px;border-radius:13px;background:linear-gradient(145deg,#1685a8,#20b99b);font-size:22px;font-weight:900;color:#fff;box-shadow:0 10px 24px -8px rgba(32,185,155,.5)}
.lg-f-brand b{display:block;font-size:16px;letter-spacing:2.5px;color:#fff}
.lg-f-brand small{display:block;margin-top:4px;font-size:10.5px;color:#9fb3c1}
.lg-f-links{display:flex;gap:12px 22px;flex-wrap:wrap;margin:26px 0 20px;padding:20px 0;border-top:1px solid #263b4b;border-bottom:1px solid #263b4b}
.lg-f-links a{font-size:11px;text-decoration:none;color:#b8c9d4;transition:color .18s;font-weight:600}
.lg-f-links a:hover{color:#5ee0c2}
.lg-f-meta{display:flex;gap:10px 22px;flex-wrap:wrap;margin-bottom:20px}
.lg-f-meta a{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#9fb3c1;text-decoration:none;transition:color .18s}
.lg-f-meta a:hover{color:#5ee0c2}
.lg-f-bottom{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:10.5px;color:#7f95a6;padding-top:20px;border-top:1px solid #263b4b}

/* ============ RESPONSIVE ============ */
@media (max-width:980px){
  .lg-index-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lg-split-hero{grid-template-columns:1fr}
  .lg-split-art{display:none}
  .lg-net-split{grid-template-columns:1fr}
  .lg-net-shared-grid{grid-template-columns:1fr}
  .lg-alert-grid{grid-template-columns:1fr}
  .lg-editorial-mark{font-size:120px}
  .lg-contact-cards{grid-template-columns:1fr}
  .lg-contact-grid{grid-template-columns:1fr}
  .lg-more-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .lg-banner{flex-direction:column;align-items:flex-start;padding:38px}
  .lg-editorial-hero{padding:38px}
  .lg-hero-chips{font-size:11px}
}
@media (max-width:640px){
  .lg-page{padding:16px 13px 60px}
  .lg-crumb{margin:2px 0 16px;font-size:11px}
  .lg-index-hero,.lg-split-hero,.lg-net-hero,.lg-alert-hero,.lg-editorial-hero,.lg-contact-hero,.lg-banner{padding:26px 22px;border-radius:20px}
  .lg-index-hero h1,.lg-split-copy h1,.lg-net-hero h1,.lg-alert-copy h1,.lg-editorial-hero h1,.lg-contact-hero h1,.lg-banner h1{font-size:30px;letter-spacing:-1px}
  .lg-index-grid,.lg-more-grid{grid-template-columns:1fr;gap:12px}
  .lg-timeline{padding-left:0}
  .lg-timeline::before{left:22px}
  .lg-tl-item{grid-template-columns:48px minmax(0,1fr);gap:12px}
  .lg-tl-marker{width:36px;height:36px;font-size:10px}
  .lg-tl-body{padding:16px 16px}
  .lg-tl-body h2,.lg-terms-block h2,.lg-alert-card h3,.lg-editorial-content h2,.lg-contact-card h3{font-size:14px}
  .lg-tl-body p,.lg-terms-block p,.lg-alert-card p,.lg-editorial-content p,.lg-contact-card p{font-size:12px;line-height:1.85}
  .lg-terms-block{padding:18px 16px}
  .lg-terms-block p{padding-left:0}
  .lg-terms-nav{gap:6px}
  .lg-terms-nav-item{font-size:10.5px;padding:7px 10px}
  .lg-banner-badge,.lg-alert-icon{display:none}
  .lg-net-diagram{flex-direction:column;gap:12px}
  .lg-net-line{width:2px;height:24px}
  .lg-net-node{width:100%;max-width:220px}
  .lg-net-col,.lg-net-shared{padding:18px 16px}
  .lg-editorial-item{grid-template-columns:1fr;gap:6px;padding:22px}
  .lg-editorial-num{font-size:32px}
  .lg-contact-tile{padding:14px}
  .lg-contact-tile b{font-size:11.5px}
  .lg-cta{padding:20px;flex-direction:column;align-items:flex-start}
  .lg-cta h3{font-size:17px}
  .lg-cta-actions{width:100%}
  .lg-btn{flex:1;justify-content:center}
  .lg-footer{padding:28px 16px 22px}
  .lg-f-links{gap:12px 16px;margin:22px 0 16px;padding:16px 0}
  .lg-f-bottom{flex-direction:column;line-height:1.6}
}
@media (prefers-reduced-motion:reduce){
  .lg-shield-ring{animation:none}
  .lg-icard,.lg-more-card,.lg-alert-card,.lg-contact-card,.lg-contact-tile{transition:none}
}
`
