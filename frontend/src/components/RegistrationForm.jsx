import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import './RegistrationForm.css'

/* =========================================================
   FIELD DEFINITIONS
   Format: [key, label, type, required]
   ========================================================= */

const buyerFields = [
  ['company_name', 'Company Name', 'text', true],
  ['director_email', 'Director Email', 'email', true],
  ['industry', 'Industry Type', 'text', true],
  ['gst_number', 'GST Number', 'text', false],
  ['website', 'Website', 'url', true],
  ['head_office_contact', 'Head Office Contact', 'tel', false],
  ['ehs_contact', 'EHS/EHS Head Contact', 'tel', false],
  ['registered_address', 'Registered Address', 'text', true],
  ['plant_location', 'Plant Location', 'text', true],

  ['full_name', 'Full Name', 'text', true],
  ['email', 'Business Email', 'email', true],
  ['phone', 'Phone Number', 'tel', true],
  ['password', 'Password', 'password', true],
  ['confirm_password', 'Re-enter Password', 'password', true],
]

const vendorFields = [
  ['company_name', 'Company Name', 'text', true],

  ['area_of_work', 'Geographical Territories', 'text', true],

  ['industrial_verticals', 'Industrial Verticals', 'text', true],

  ['industry_type', 'Vendor Type', 'text', true],

  ['experience_years', 'Experience (Years)', 'number', true],
  ['capacity', 'Capacity', 'text', false],
  ['specialization', 'Specialization', 'text', true],
  ['gst_number', 'GST Number', 'text', false],
  ['msme_number', 'MSME Number', 'text', false],
  ['website', 'Website', 'url', true],
  ['contact_2', 'Contact Number', 'tel', true],
  ['director_email', 'Director Email', 'email', true],
  ['address', 'Address', 'text', true],

  // Account Information
  ['full_name', 'Full Name', 'text', true],
  ['email', 'Business Email', 'email', true],
  ['phone', 'Mobile Number', 'tel', true],
  ['password', 'Password', 'password', true],
  ['confirm_password', 'Re-enter Password', 'password', true],
]

const domains = [
  'Water & Wastewater Treatment',
  'Solid & Hazardous Waste',
  'Solar & Renewables',
  'Carbon & ESG',
  'SPCB Consents & Air Pollution'
]

const geographicalTerritories = [
  'Pan India',
  'Maharashtra',
  'Telangana',
  'Karnataka',
  'Gujarat',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Rajasthan',
  'Delhi NCR',
  'Uttar Pradesh',
  'West Bengal',
  'Kerala',
  'Haryana',
  'Punjab',
  'Other States / Union Territories',
  'International',
]

const industrialVerticalOptions = [
  'Pharmaceuticals & Healthcare',
  'API & Bulk Drug Manufacturing',
  'Biotechnology & Life Sciences',
  'Chemicals & Specialty Chemicals',
  'Petrochemicals, Oil & Gas',
  'Fertilizers & Agrochemicals',
  'Food & Beverages',
  'Dairy & Milk Processing',
  'Sugar & Distilleries',
  'Textile & Garments',
  'Automobile & Automotive Components',
  'Electric Vehicles (EV) & Batteries',
  'Semiconductor & Electronics',
  'Electrical Equipment Manufacturing',
  'Steel & Iron Industries',
  'Metal Processing & Fabrication',
  'Engineering & Industrial Manufacturing',
  'Cement & Building Materials',
  'Glass & Ceramics',
  'Paper, Pulp & Packaging',
  'Plastic, Polymer & Rubber',
  'Paints, Dyes & Pigments',
  'Cosmetics & Personal Care',
  'FMCG & Consumer Goods',
  'Agriculture & Agro-Processing',
  'Pulp, Paper & Wood Processing',
  'Mining & Mineral Processing',
  'Power Generation & Utilities',
  'Renewable Energy & Solar',
  'Aerospace & Defence',
  'Shipbuilding & Marine Industries',
  'Railways & Metro Infrastructure',
  'IT Parks & Data Centres',
  'Commercial Buildings & Shopping Malls',
  'Hotels, Resorts & Hospitality',
  'Hospitals & Healthcare Facilities',
  'Educational Institutions & Universities',
  'Warehousing & Logistics',
  'Ports & Airports',
  'Municipal Corporations & Government Facilities',
  'Water & Wastewater Treatment Facilities',
  'Waste Management & Recycling',
  'Environmental Services & Consulting',
  'Construction & Infrastructure',
  'Printing & Packaging',
  'Leather & Tanning',
  'Biotechnology & Fermentation',
  'Semiconductor & Advanced Materials',
  'Cold Storage & Food Warehousing',
  'Other Industries',
];


const industryTypeOptions = [
  'Original Equipment Manufacturer (OEM)',
  'Equipment Manufacturer',
  'Technology Provider',
  'Turnkey Project Executor (EPC Contractor)',
  'Engineering & Design Service Provider',
  'Equipment Supplier',
  'Chemical Supplier',
  'Raw Material Supplier',
  'Distributor / Dealer',
  'Trading Company',
  'Importer / Exporter',
  'System Integrator',
  'Installation & Erection Contractor',
  'Commissioning Service Provider',
  'Operation & Maintenance (O&M) Service Provider',
  'Repair & Maintenance Service Provider',
  'Consultant',
  'Environmental Consultant',
  'Regulatory Compliance Service Provider',
  'Testing & Laboratory Service Provider',
  'Inspection & Audit Service Provider',
  'Monitoring & Measurement Service Provider',
  'Waste Collection & Transportation Provider',
  'Waste Treatment & Disposal Service Provider',
  'Waste Recycling & Recovery Provider',
  'Renewable Energy Project Developer',
  'Carbon Credit Service Provider',
  'ESG & Sustainability Service Provider',
  'Software / SaaS Provider',
  'Industrial Automation & IoT Provider',
  'Rental / Leasing Service Provider',
  'Project Management Consultant (PMC)',
  'Research & Development (R&D) Provider',
  'Other',
];

/* =========================================================
   ERROR HELPER
   ========================================================= */

function getErrorMessage(error) {
  const detail = error?.response?.data?.detail

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item?.msg) {
          const location = Array.isArray(item.loc)
            ? item.loc.filter((part) => part !== 'body').join(' → ')
            : ''
          return location ? `${location}: ${item.msg}` : item.msg
        }
        return 'Invalid registration data'
      })
      .join(', ')
  }

  if (typeof detail === 'string') return detail
  if (typeof error?.response?.data?.message === 'string')
    return error.response.data.message
  if (typeof error?.message === 'string') return error.message

  return 'Registration failed. Please check your details.'
}

/* =========================================================
   REGISTRATION FORM
   ========================================================= */

export default function RegistrationForm({ type }) {
  const isBuyer = type === 'buyer'
  const fields = isBuyer ? buyerFields : vendorFields

  const [form, setForm] = useState({})
  const [selected, setSelected] = useState([])
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [openMultiSelect, setOpenMultiSelect] = useState('');

  // ✅ multiSearch मध्ये आता तिन्ही multi-select keys
  const [multiSearch, setMultiSearch] = useState({
    area_of_work: '',
    industrial_verticals: '',
    industry: '',
  });

  const nav = useNavigate()

  /* ================= UPDATE ================= */

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setMsg('')
    setMsgType('')
  }

  const toggleDomain = (domain) => {
    setSelected((prev) =>
      prev.includes(domain)
        ? prev.filter((item) => item !== domain)
        : [...prev, domain]
    )
    setMsg('')
    setMsgType('')
  }

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const requiredFields = [
      'full_name',
      'email',
      'phone',
      'password',
      'company_name',
      'website'
    ]

    if (!isBuyer) {
      requiredFields.push(
        'industry_type',
        'address',
        'area_of_work',
        'industrial_verticals',
        'experience_years',
        'specialization'
      )
    } else {
      requiredFields.push('industry', 'registered_address', 'plant_location')
    }

    for (const field of requiredFields) {
      // ✅ multi-select fields साठी array length तपासा
      if (['area_of_work', 'industrial_verticals', 'industry'].includes(field)) {
        const value = form[field]
        if (!Array.isArray(value) || value.length === 0) {
          return `Please select at least one ${field.replaceAll('_', ' ')}.`
        }
        continue
      }

      if (!String(form[field] ?? '').trim()) {
        return `Please enter ${field.replaceAll('_', ' ')}.`
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) return 'Please enter a valid email address.'

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(form.phone.trim()))
      return 'Please enter a valid 10-digit Indian mobile number.'

    if (form.password.length < 8) return 'Password must contain at least 8 characters.'
    if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter.'
    if (!/[a-z]/.test(form.password)) return 'Password must contain at least one lowercase letter.'
    if (!/[0-9]/.test(form.password)) return 'Password must contain at least one number.'
    if (form.password !== form.confirm_password) return 'Passwords do not match.'

    if (!isBuyer) {
      const experience = Number(form.experience_years)
      if (!Number.isFinite(experience) || experience < 0 || experience > 100)
        return 'Experience must be between 0 and 100 years.'
      if (selected.length === 0) return 'Please select at least one TECHSPHERE domain.'
    }

    if (form.website?.trim()) {
      try {
        new URL(form.website.trim())
      } catch {
        return 'Please enter a valid website URL, e.g. https://example.com'
      }
    }

    return null
  }

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setMsgType('')

    const validationError = validateForm()
    if (validationError) {
      setMsg(validationError)
      setMsgType('error')
      return
    }

    setLoading(true)

    try {
      const payload = { ...form }

      if (!isBuyer) {
        payload.experience_years = Number(form.experience_years)
        payload.domains = selected

        // ✅ दोन्ही multi-select arrays ला comma-separated string करा
        payload.area_of_work = (form.area_of_work || []).join(', ')
        payload.industrial_verticals = (form.industrial_verticals || []).join(', ')
        payload.industry_type = (form.industry_type || []).join(', ')
      } else {
        // ✅ Buyer चा industry सुद्धा multi-select -> string
        payload.industry = (form.industry || []).join(', ')
      }

      const response = await API.post(`/auth/register/${type}`, payload)

      const successMessage =
        response.data?.message ||
        'Registration successful. Please verify your email.'

      setMsg(successMessage)
      setMsgType('success')

      /* SHOW SUCCESS POPUP */
      setShowSuccess(true)

      /* AUTO-REDIRECT AFTER 3 SEC */
      setTimeout(() => {
        nav(`/verify-email?email=${encodeURIComponent(form.email.trim())}`)
      }, 3000)
    } catch (error) {
      setMsg(getErrorMessage(error))
      setMsgType('error')
    } finally {
      setLoading(false)
    }
  }

  /* ================= ICONS ================= */

  const getIcon = (key) => {
    const icons = {
      full_name: '👤',
      email: '✉️',
      phone: '📱',
      password: '🔐',
      confirm_password: '🔐',
      company_name: '🏢',
      industry: '🏭',
      industry_type: '🏭',
      industrial_verticals: '🏭',
      registered_address: '📍',
      address: '📍',
      plant_location: '🏗️',
      gst_number: '🧾',
      website: '🌐',
      head_office_contact: '☎️',
      ehs_contact: '🛡️',
      area_of_work: '⚙️',
      experience_years: '📊',
      capacity: '⚡',
      specialization: '🎯',
      msme_number: '📄'
    }
    return icons[key] || '•'
  }

  /* ================= RENDER FIELD ================= */

  // ✅ आता तिन्ही keys multi-select आहेत — समान data
  const multiSelectOptions = {
    area_of_work: geographicalTerritories,
    industrial_verticals: industrialVerticalOptions, // Vendor — Industrial Verticals
    industry: industrialVerticalOptions,             // Buyer — Industry Type (same data)
    industry_type: industryTypeOptions,
  }

  // फक्त Vendor Type हा single select आहे
  const selectOptionsMap = {
    // industry_type: industryTypeOptions,
  }

  const fieldDescriptions = {
    area_of_work: 'Select all regions where your company provides services.',
    industrial_verticals: 'Select all industries your company serves.',
    industry: 'Select all industries your company serves.',
    industry_type: 'Select your primary business category.',
  }

  const renderField = ([key, label, kind = 'text', required = false]) => {
    const isMultiSelect = Boolean(multiSelectOptions[key])
    const isSelect = Boolean(selectOptionsMap[key])
    const options = multiSelectOptions[key] || selectOptionsMap[key] || []

    // Vendor Type साठी white color class
    const selectWhiteClass = key === 'industry_type' ? 'registration-select--white' : ''

    return (
      <div
        className={`field-group ${
          key === 'registered_address' ||
          key === 'plant_location' ||
          key === 'address'
            ? 'field-group--wide'
            : ''
        } ${isMultiSelect || isSelect ? 'field-group--select' : ''}`}
        key={key}
      >
        <label htmlFor={key}>
          <span className="field-icon">{getIcon(key)}</span>
          {label}
          {required && <span className="required-star">*</span>}
        </label>

        {isMultiSelect ? (
          <div className="multi-select-wrap">
            <button
              type="button"
              className={`multi-select-trigger ${
                openMultiSelect === key ? 'is-open' : ''
              }`}
              aria-expanded={openMultiSelect === key}
              onClick={() => {
                setOpenMultiSelect((prev) => (prev === key ? '' : key));
                setMultiSearch((prev) => ({ ...prev, [key]: '' }));
              }}
            >
              <span className="multi-select-trigger-content">
                {Array.isArray(form[key]) && form[key].length > 0 ? (
                  <span className="multi-select-summary">
                    {form[key].length} selected
                  </span>
                ) : (
                  <span className="multi-select-placeholder">
                    Select {label}
                  </span>
                )}
              </span>

              <span className="multi-select-chevron">
                {openMultiSelect === key ? '▴' : '▾'}
              </span>
            </button>

            {Array.isArray(form[key]) && form[key].length > 0 && (
              <div className="selected-values">
                {form[key].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="selected-value-chip"
                    onClick={() =>
                      updateField(
                        key,
                        form[key].filter((item) => item !== value)
                      )
                    }
                  >
                    {value} <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}

            {openMultiSelect === key && (
              <div className="multi-select-menu">
                <input
                  type="search"
                  className="multi-select-search"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={multiSearch[key] || ''}
                  onChange={(e) =>
                    setMultiSearch((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />

                <div className="multi-select-options">
                  {options
                    .filter((option) =>
                      option
                        .toLowerCase()
                        .includes((multiSearch[key] || '').toLowerCase())
                    )
                    .map((option) => {
                      const checked = (form[key] || []).includes(option);

                      return (
                        <label
                          key={option}
                          className={`multi-select-option ${
                            checked ? 'is-selected' : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const current = form[key] || [];

                              updateField(
                                key,
                                checked
                                  ? current.filter((item) => item !== option)
                                  : [...current, option]
                              );
                            }}
                          />

                          <span>{option}</span>
                          {checked && (
                            <span className="multi-select-check">✓</span>
                          )}
                        </label>
                      );
                    })}

                  {options.filter((option) =>
                    option
                      .toLowerCase()
                      .includes((multiSearch[key] || '').toLowerCase())
                  ).length === 0 && (
                    <p className="multi-select-empty">No options found.</p>
                  )}
                </div>

                <div className="multi-select-footer">
                  <span>{(form[key] || []).length} selected</span>
                  <button
                    type="button"
                    onClick={() => setOpenMultiSelect('')}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            <small className="select-help">{fieldDescriptions[key]}</small>
          </div>
        ) : isSelect ? (
          <>
            <select
  id={key}
  name={key}
  className={`registration-select ${selectWhiteClass}`.trim()}
  style={{
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #d1d5db',
  }}
  value={form[key] ?? ''}
  onChange={(e) => updateField(key, e.target.value)}
  required={required}
>
  <option value="" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
    Select {label}
  </option>

  {options.map((option) => (
    <option
      key={option}
      value={option}
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
    >
      {option}
    </option>
  ))}
</select>

            {fieldDescriptions[key] && (
              <small className="select-help">
                {fieldDescriptions[key]}
              </small>
            )}
          </>
        ) : (
          <input
            id={key}
            name={key}
            type={kind}
            min={key === 'experience_years' ? 0 : undefined}
            max={key === 'experience_years' ? 100 : undefined}
            step={key === 'experience_years' ? 1 : undefined}
            value={form[key] ?? ''}
            onChange={(e) => updateField(key, e.target.value)}
            placeholder={`Enter ${label}`}
            required={required}
          />
        )}
      </div>
    )
  }
  /* ================= RENDER ================= */

  return (
    <div
      className={`registration-page ${
        isBuyer ? 'registration-page--buyer' : 'registration-page--vendor'
      }`}
    >
      <div className="registration-bg registration-bg--one" />
      <div className="registration-bg registration-bg--two" />

      {/* ================= TOP BAR ================= */}

      <div className="registration-topbar">
        <div className="registration-brand">
          <div className="registration-brand-logo">
            <img src="/logo2.jpeg" alt="SM Clean Tech" />
          </div>
          <div>
            <strong>SM Clean Tech</strong>
            <span>Engineering Solutions</span>
          </div>
        </div>

        <button type="button" className="back-home" onClick={() => nav('/')}>
          <span>←</span>
          Back
        </button>
      </div>

      {/* ================= MAIN — CENTERED FORM ================= */}

      <main className="registration-main registration-main--centered">
        <section className="registration-card">
          {/* HEADER */}
          <div className="registration-card-header">
            <div>
              <span className="form-kicker">
                {isBuyer ? 'BUYER REGISTRATION' : 'VENDOR REGISTRATION'}
              </span>
              <h2>Create Your {isBuyer ? 'Buyer' : 'Vendor'} Account</h2>
              <p>                Fill In Your Business Information To Get Started.
              </p>
            </div>

            <div className={`role-icon ${isBuyer ? 'role-icon--buyer' : 'role-icon--vendor'}`}>
              {isBuyer ? '🏢' : '🌱'}
            </div>
          </div>

          <form onSubmit={submit} className="modern-registration-form" noValidate>
            {/* =====================================================
                  BUYER REGISTRATION
              ===================================================== */}

            {isBuyer ? (
              <>

                {/* SECTION 01 — BUSINESS INFORMATION */}
                <div className="form-section-title">
                  <span>01</span>
                  Business Information
                </div>

                <div className="registration-grid">
                  {buyerFields
                    .filter(([key]) =>
                      [
                        'company_name',
                        'director_email',
                        'industry',
                        'registered_address',
                        'plant_location',
                        'gst_number',
                        'website',
                        'head_office_contact',
                        'ehs_contact'
                      ].includes(key)
                    )
                    .map(renderField)}
                </div>

                {/* SECTION 02 — ACCOUNT INFORMATION */}
                <div className="form-section-title">
                  <span>02</span>
                  Account Information
                </div>

                <div className="registration-grid">
                  {buyerFields
                    .filter(([key]) =>
                      [
                        'full_name',
                        'email',
                        'phone',
                        'password',
                        'confirm_password'
                      ].includes(key)
                    )
                    .map(renderField)}
                </div>

              </>
            ) : (
              <>
                {/* =================================================
                    VENDOR REGISTRATION
                ================================================= */}

                {/* SECTION 01 — BUSINESS INFORMATION */}
                <div className="form-section-title">
                  <span>01</span>
                  Business Information
                </div>

                <div className="registration-grid">
                  {vendorFields
                    .filter(([key]) =>
                      [
                        'company_name',
                        'industry_type',
                        'address',
                        'industrial_verticals',

                        'area_of_work',
                        'experience_years',
                        'capacity',
                        'specialization',
                        'gst_number',
                        'msme_number',
                        'website',
                        'contact_2',
                        'director_email'
                      ].includes(key)
                    )
                    .map(renderField)}
                </div>

                {/* SECTION 02 — ACCOUNT INFORMATION */}
                <div className="form-section-title">
                  <span>02</span>
                  Account Information
                </div>

                <div className="registration-grid">
                  {vendorFields
                    .filter(([key]) =>
                      [
                        'full_name',
                        'email',
                        'phone',
                        'password',
                        'confirm_password'
                      ].includes(key)
                    )
                    .map(renderField)}
                </div><br />

                {/* SECTION 03 — TECHSPHERE DOMAINS */}
                <div className="domain-section">
                  <div className="form-section-title">
                    <span>03</span>
                    TECHSPHERE Domains
                    <span className="required-star">*</span>
                  </div>

                  <p className="domain-description">
                    Select the areas in which your company provides solutions.
                  </p>

                  <div className="domain-grid">
                    {domains.map((domain) => {
                      const active = selected.includes(domain)

                      return (
                        <button
                          type="button"
                          key={domain}
                          className={`domain-card ${
                            active ? 'domain-card--active' : ''
                          }`}
                          onClick={() => toggleDomain(domain)}
                        >
                          <span className="domain-check">
                            {active ? '✓' : '+'}
                          </span>

                          <span>{domain}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <br />

            {/* MESSAGES */}
            {msg && (
              <div
                className={`registration-message ${
                  msgType === 'success'
                    ? 'registration-message--success'
                    : 'registration-message--error'
                }`}
              >
                <span className="message-icon">{msgType === 'success' ? '✓' : '!'}</span>
                <span>{msg}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMsg('')
                    setMsgType('')
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className={`registration-submit ${
                isBuyer ? 'registration-submit--buyer' : 'registration-submit--vendor'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create {isBuyer ? 'Buyer' : 'Vendor'} Account
                  <span>→</span>
                </>
              )}
            </button>

            {/* FOOTER */}
            <div className="registration-footer">
              <span>Already have an account?</span>
              <button type="button" onClick={() => nav('/login')}>
                Login Here
              </button>
            </div>

            <div className="secure-note">
              🔒 Your information is protected and securely processed.
            </div>
          </form>
        </section>
      </main>

      {/* ================= SUCCESS POPUP ================= */}

      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal__icon">✓</div>

            <span className="success-modal__label">REGISTRATION COMPLETE</span>
            <h2>Account Created Successfully!</h2>

            <p className="success-modal__text">
              We've sent a verification email to
              <br />
              <strong>{form.email}</strong>
            </p>

            <p className="success-modal__hint">
              Redirecting you to verify your email...
            </p>

            <div className="success-modal__progress">
              <div className="success-modal__bar" />
            </div>

            <button
              type="button"
              className="success-modal__btn"
              onClick={() =>
                nav(`/verify-email?email=${encodeURIComponent(form.email.trim())}`)
              }
            >
              Verify Email Now
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
