import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PanelLayout from '../components/PanelLayout'
import API from '../services/api'
import '../styles/ProfilePage.css'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isEditMode = searchParams.get('mode') === 'edit'

  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotPopup, setForgotPopup] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const role = profile?.role || user?.role || 'buyer'

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await API.get('/auth/profile')

      const data = response.data

      setProfile(data)
      setForm({
        ...data,
        new_password: '',
        confirm_password: '',
        current_password: '',
        domains: Array.isArray(data.domains)
          ? data.domains
          : [],
      })
    } catch (err) {
      console.error('Profile load error:', err)

      setError(
        err?.response?.data?.detail ||
        'Unable to load profile.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // UPDATE PROFILE
  // ============================================================


  const handleForgotPassword = async () => {
  const businessEmail = form.email?.trim()

  if (!businessEmail) {
    setForgotError('Business email not found.')
    return
  }

  try {
    setForgotLoading(true)
    setForgotError('')

    await API.post('/auth/forgot-password', {
      email: businessEmail,
    })

    setForgotPopup(true)
  } catch (err) {
    setForgotError(
      err?.response?.data?.detail ||
        'Unable to submit the request. Please try again.'
    )
  } finally {
    setForgotLoading(false)
  }
}

const handleUpdate = async () => {
  const changingPassword =
    Boolean(form.current_password) ||
    Boolean(form.new_password) ||
    Boolean(form.confirm_password)

  if (changingPassword) {
    if (
      !form.current_password ||
      !form.new_password ||
      !form.confirm_password
    ) {
      setError('Fill all three password fields.')
      setSuccess('')
      return
    }

    if (form.new_password.length < 8) {
      setError('New password must be at least 8 characters.')
      setSuccess('')
      return
    }

    if (form.new_password !== form.confirm_password) {
      setError('New password and confirm password do not match.')
      setSuccess('')
      return
    }

    if (form.current_password === form.new_password) {
      setError('New password must differ from current password.')
      setSuccess('')
      return
    }
  }

  try {
    setSaving(true)
    setError('')
    setSuccess('')

    // Update profile details
    const payload = { ...form }

    delete payload.id
    delete payload.role
    delete payload.email
    delete payload.admin
    delete payload.password
    delete payload.current_password
    delete payload.new_password
    delete payload.confirm_password

    if (role === 'vendor') {
      payload.domains = Array.isArray(payload.domains)
        ? payload.domains
        : []
    }

    if (payload.experience_years !== undefined) {
      payload.experience_years =
        payload.experience_years === ''
          ? null
          : Number(payload.experience_years)
    }

    await API.put('/auth/profile', payload)

    // Change password only when password fields are filled
    if (changingPassword) {
      await API.post('/auth/change-password', {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      })
    }

    setSuccess(
      changingPassword
        ? 'Profile and password updated successfully!'
        : 'Profile updated successfully!'
    )

    await loadProfile()

    setTimeout(() => {
      navigate('/profile', { replace: true })
    }, 1200)
  } catch (err) {
    console.error('Profile update error:', err)

    setError(
      err?.response?.data?.detail ||
      'Failed to update profile or password.'
    )
  } finally {
    setSaving(false)
  }
  }

  // ============================================================
  // UPDATE FIELD
  // ============================================================

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // ============================================================
  // ADD SERVICE DOMAIN
  // ============================================================

  const addServiceDomain = () => {
    const input = document.getElementById('new-service-domain')

    if (!input) return

    const value = input.value.trim()

    if (!value) return

    const currentDomains = Array.isArray(form.domains)
      ? form.domains
      : []

    const alreadyExists = currentDomains.some(
      (domain) =>
        String(domain).toLowerCase() === value.toLowerCase()
    )

    if (!alreadyExists) {
      updateField('domains', [
        ...currentDomains,
        value,
      ])
    }

    input.value = ''
  }

  // ============================================================
  // REMOVE SERVICE DOMAIN
  // ============================================================

  const removeServiceDomain = (index) => {
    const currentDomains = Array.isArray(form.domains)
      ? form.domains
      : []

    const updatedDomains = currentDomains.filter(
      (_, i) => i !== index
    )

    updateField('domains', updatedDomains)
  }

  // ============================================================
  // SERVICE DOMAIN ENTER KEY
  // ============================================================

  const handleDomainKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addServiceDomain()
    }
  }

  // ============================================================
  // GO TO EDIT / VIEW MODE
  // ============================================================

  const goToEditMode = () => {
    navigate('/profile?mode=edit')
  }

  const goToViewMode = () => {
    navigate('/profile')
  }

  // ============================================================
  // HELPERS - RENDER READ-ONLY VALUE
  // ============================================================

  const renderViewValue = (value, options = {}) => {
    const {
      emptyText = 'Not provided',
      type = 'text',
    } = options

    const hasValue =
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''

    const valueClass =
      `profile-view-value` +
      (!hasValue ? ' profile-view-value--empty' : '') +
      (hasValue && type === 'email' ? ' profile-view-value--email' : '') +
      (hasValue && type === 'phone' ? ' profile-view-value--phone' : '') +
      (hasValue && type === 'url' ? ' profile-view-value--url' : '')

    return (
      <div className={valueClass}>
        {hasValue ? value : emptyText}
      </div>
    )
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <PanelLayout
        role={user?.role || 'buyer'}
        title="My Profile"
      >
        <div className="profile-page">
          <div className="profile-card">
            <div
              className={
                'profile-mode-banner ' +
                (isEditMode
                  ? 'profile-mode-banner--edit'
                  : 'profile-mode-banner--view')
              }
            >
              <div>
                <strong>
                  {isEditMode ? 'Edit Profile' : 'View Profile'}
                </strong>
                <p>
                  {isEditMode
                    ? 'Update your information, then save your changes.'
                    : 'Your information is read-only.'}
                </p>
              </div>
              <span
                className={
                  'profile-mode-badge ' +
                  (isEditMode
                    ? 'profile-mode-badge--edit'
                    : 'profile-mode-badge--view')
                }
              >
                {isEditMode ? 'Editing' : 'View only'}
              </span>
            </div>

            <div className="profile-loading">
              Loading profile...
            </div>
          </div>
        </div>
      </PanelLayout>
    )
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error && !profile) {
    return (
      <PanelLayout
        role={user?.role || 'buyer'}
        title="My Profile"
      >
        <div className="profile-page">
          <div className="profile-card">
            <div
              className={
                'profile-mode-banner ' +
                (isEditMode
                  ? 'profile-mode-banner--edit'
                  : 'profile-mode-banner--view')
              }
            >
              <div>
                <strong>
                  {isEditMode ? 'Edit Profile' : 'View Profile'}
                </strong>
                <p>
                  {isEditMode
                    ? 'Update your information, then save your changes.'
                    : 'Your information is read-only.'}
                </p>
              </div>
              <span
                className={
                  'profile-mode-badge ' +
                  (isEditMode
                    ? 'profile-mode-badge--edit'
                    : 'profile-mode-badge--view')
                }
              >
                {isEditMode ? 'Editing' : 'View only'}
              </span>
            </div>

            <div className="profile-error">
              <strong>Unable to load profile</strong>
              <p>{error}</p>

              <button
                type="button"
                className="profile-update-btn"
                onClick={loadProfile}
              >
                Try Again
                <span>↻</span>
              </button>
            </div>
          </div>
        </div>
      </PanelLayout>
    )
  }

  // ============================================================
  // INITIAL
  // ============================================================

  const initial = (
    form?.full_name ||
    form?.email ||
    role
  )
    .charAt(0)
    .toUpperCase()

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <PanelLayout
      role={role}
      title="My Profile"
    >
      <div className="profile-page">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="profile-header">

          <div>
            <span className="profile-kicker">
              ACCOUNT SETTINGS
            </span>

            <h2>
              {isEditMode ? 'Edit Profile' : 'My Profile'}
            </h2>

            <p>
              {isEditMode
                ? 'Update your account details and save changes.'
                : 'View and manage your account information.'}
            </p>
          </div>

          <div
            className={`profile-avatar profile-avatar--${role}`}
          >
            {initial}
          </div>

        </div>

        {/* =====================================================
            PROFILE CARD
        ====================================================== */}

        <div className="profile-card">

          {/* MODE BANNER */}

          <div
            className={
              'profile-mode-banner ' +
              (isEditMode
                ? 'profile-mode-banner--edit'
                : 'profile-mode-banner--view')
            }
          >
            <div>
              <strong>
                {isEditMode ? 'Edit Profile' : 'View Profile'}
              </strong>
              <p>
                {isEditMode
                  ? 'Update your information, then save your changes.'
                  : 'Your information is read-only.'}
              </p>
            </div>
            <span
              className={
                'profile-mode-badge ' +
                (isEditMode
                  ? 'profile-mode-badge--edit'
                  : 'profile-mode-badge--view')
              }
            >
              {isEditMode ? 'Editing' : 'View only'}
            </span>
          </div>

          <fieldset
            disabled={!isEditMode}
            className="profile-fields-wrapper"
            style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}
          >

            {/* ===================================================
                ACCOUNT INFORMATION
            ==================================================== */}

            <div className="profile-section-title">
              <span>01</span>
              Account Information
            </div>

            <div className="profile-grid">

              {/* FULL NAME */}

              <div className="profile-field">
                {isEditMode ? (
                  <>
                    <label>
                      <span>👤</span>
                      Full name
                    </label>
                    <input
                      type="text"
                      value={form.full_name || ''}
                      onChange={(e) =>
                        updateField('full_name', e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  </>
                ) : (
                  <>
                    <div className="profile-view-label">
                      <span>👤</span>
                      Full name
                    </div>
                    {renderViewValue(form.full_name)}
                  </>
                )}
              </div>

              {/* BUSINESS EMAIL */}

              <div className="profile-field">
                {isEditMode ? (
                  <>
                    <label>
                      <span>✉️</span>
                      Business Email
                    </label>
                    <input
                      type="email"
                      value={form.email || ''}
                      disabled
                      className="profile-input-disabled"
                    />
                    <small>
                      Email address cannot be changed.
                    </small>
                  </>
                ) : (
                  <>
                    <div className="profile-view-label">
                      <span>✉️</span>
                      Business Email
                    </div>
                    {renderViewValue(form.email, { type: 'email' })}
                  </>
                )}
              </div>

              {/* MOBILE NUMBER */}

              <div className="profile-field">
                {isEditMode ? (
                  <>
                    <label>
                      <span>📱</span>
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone || ''}
                      onChange={(e) =>
                        updateField('phone', e.target.value)
                      }
                      placeholder="Enter mobile number"
                    />
                  </>
                ) : (
                  <>
                    <div className="profile-view-label">
                      <span>📱</span>
                      Mobile Number
                    </div>
                    {renderViewValue(form.phone, { type: 'phone' })}
                  </>
                )}
              </div>

            </div>

            {/* ===================================================
                BUYER INFORMATION
            ==================================================== */}

            {role === 'buyer' && (
              <>
                <div className="profile-section-title">
                  <span>02</span>
                  Business Information
                </div>

                <div className="profile-grid">

                  {/* COMPANY NAME */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🏢</span>
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={form.company_name || ''}
                          onChange={(e) =>
                            updateField('company_name', e.target.value)
                          }
                          placeholder="Enter company name"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🏢</span>
                          Company Name
                        </div>
                        {renderViewValue(form.company_name)}
                      </>
                    )}
                  </div>

                  {/* DIRECTOR EMAIL */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>✉️</span>
                          Director Email
                        </label>
                        <input
                          type="email"
                          value={form.director_email || ''}
                          onChange={(e) =>
                            updateField('director_email', e.target.value)
                          }
                          placeholder="Enter director email"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>✉️</span>
                          Director Email
                        </div>
                        {renderViewValue(form.director_email, { type: 'email' })}
                      </>
                    )}
                  </div>

                  {/* INDUSTRY */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🏭</span>
                          Industry
                        </label>
                        <input
                          type="text"
                          value={form.industry || ''}
                          onChange={(e) =>
                            updateField('industry', e.target.value)
                          }
                          placeholder="Enter industry"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🏭</span>
                          Industry
                        </div>
                        {renderViewValue(form.industry)}
                      </>
                    )}
                  </div>

                  {/* GST */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📄</span>
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={form.gst_number || ''}
                          onChange={(e) =>
                            updateField('gst_number', e.target.value)
                          }
                          placeholder="Enter GST number"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📄</span>
                          GST Number
                        </div>
                        {renderViewValue(form.gst_number)}
                      </>
                    )}
                  </div>

                  {/* WEBSITE */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🌐</span>
                          Website
                        </label>
                        <input
                          type="url"
                          value={form.website || ''}
                          onChange={(e) =>
                            updateField('website', e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🌐</span>
                          Website
                        </div>
                        {renderViewValue(form.website, { type: 'url' })}
                      </>
                    )}
                  </div>

                  {/* HEAD OFFICE CONTACT */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>☎️</span>
                          Head Office Contact
                        </label>
                        <input
                          type="tel"
                          value={form.head_office_contact || ''}
                          onChange={(e) =>
                            updateField('head_office_contact', e.target.value)
                          }
                          placeholder="Enter contact number"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>☎️</span>
                          Head Office Contact
                        </div>
                        {renderViewValue(form.head_office_contact, { type: 'phone' })}
                      </>
                    )}
                  </div>

                  {/* EHS CONTACT */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🦺</span>
                          EHS Contact
                        </label>
                        <input
                          type="tel"
                          value={form.ehs_contact || ''}
                          onChange={(e) =>
                            updateField('ehs_contact', e.target.value)
                          }
                          placeholder="Enter EHS contact"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🦺</span>
                          EHS Contact
                        </div>
                        {renderViewValue(form.ehs_contact, { type: 'phone' })}
                      </>
                    )}
                  </div>

                  {/* REGISTERED ADDRESS */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📍</span>
                          Registered Address
                        </label>
                        <input
                          type="text"
                          value={form.registered_address || ''}
                          onChange={(e) =>
                            updateField('registered_address', e.target.value)
                          }
                          placeholder="Enter registered address"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📍</span>
                          Registered Address
                        </div>
                        {renderViewValue(form.registered_address)}
                      </>
                    )}
                  </div>

                  {/* PLANT LOCATION */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🏭</span>
                          Plant Location
                        </label>
                        <input
                          type="text"
                          value={form.plant_location || ''}
                          onChange={(e) =>
                            updateField('plant_location', e.target.value)
                          }
                          placeholder="Enter plant location"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🏭</span>
                          Plant Location
                        </div>
                        {renderViewValue(form.plant_location)}
                      </>
                    )}
                  </div>

                </div>
              </>
            )}

            {/* ===================================================
                VENDOR INFORMATION
            ==================================================== */}

            {role === 'vendor' && (
              <>
                <div className="profile-section-title">
                  <span>02</span>
                  Business Information
                </div>

                <div className="profile-grid">

                  {/* COMPANY NAME */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🏢</span>
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={form.company_name || ''}
                          onChange={(e) =>
                            updateField('company_name', e.target.value)
                          }
                          placeholder="Enter company name"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🏢</span>
                          Company Name
                        </div>
                        {renderViewValue(form.company_name)}
                      </>
                    )}
                  </div>

                  {/* INDUSTRY TYPE */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🏭</span>
                          Industry Type
                        </label>
                        <input
                          type="text"
                          value={form.industry_type || ''}
                          onChange={(e) =>
                            updateField('industry_type', e.target.value)
                          }
                          placeholder="Enter industry type"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🏭</span>
                          Industry Type
                        </div>
                        {renderViewValue(form.industry_type)}
                      </>
                    )}
                  </div>

                  {/* ADDRESS */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📍</span>
                          Address
                        </label>
                        <input
                          type="text"
                          value={form.address || ''}
                          onChange={(e) =>
                            updateField('address', e.target.value)
                          }
                          placeholder="Enter address"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📍</span>
                          Address
                        </div>
                        {renderViewValue(form.address)}
                      </>
                    )}
                  </div>

                  {/* GEOGRAPHICAL TERRITORIES */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🗺️</span>
                          Geographical Territories
                        </label>
                        <input
                          type="text"
                          value={form.area_of_work || ''}
                          onChange={(e) =>
                            updateField('area_of_work', e.target.value)
                          }
                          placeholder="Enter geographical territories"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🗺️</span>
                          Geographical Territories
                        </div>
                        {renderViewValue(form.area_of_work)}
                      </>
                    )}
                  </div>

                  {/* EXPERIENCE */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📅</span>
                          Experience (years)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={form.experience_years ?? ''}
                          onChange={(e) =>
                            updateField('experience_years', e.target.value)
                          }
                          placeholder="Enter experience"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📅</span>
                          Experience (years)
                        </div>
                        {renderViewValue(
                          form.experience_years !== undefined &&
                          form.experience_years !== null &&
                          form.experience_years !== ''
                            ? `${form.experience_years} years`
                            : ''
                        )}
                      </>
                    )}
                  </div>

                  {/* CAPACITY */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>⚙️</span>
                          Capacity
                        </label>
                        <input
                          type="text"
                          value={form.capacity || ''}
                          onChange={(e) =>
                            updateField('capacity', e.target.value)
                          }
                          placeholder="Enter capacity"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>⚙️</span>
                          Capacity
                        </div>
                        {renderViewValue(form.capacity)}
                      </>
                    )}
                  </div>

                  {/* SPECIALIZATION */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🎯</span>
                          Specialization
                        </label>
                        <input
                          type="text"
                          value={form.specialization || ''}
                          onChange={(e) =>
                            updateField('specialization', e.target.value)
                          }
                          placeholder="Enter specialization"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🎯</span>
                          Specialization
                        </div>
                        {renderViewValue(form.specialization)}
                      </>
                    )}
                  </div>

                  {/* GST */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📄</span>
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={form.gst_number || ''}
                          onChange={(e) =>
                            updateField('gst_number', e.target.value)
                          }
                          placeholder="Enter GST number"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📄</span>
                          GST Number
                        </div>
                        {renderViewValue(form.gst_number)}
                      </>
                    )}
                  </div>

                  {/* MSME */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📑</span>
                          MSME Number
                        </label>
                        <input
                          type="text"
                          value={form.msme_number || ''}
                          onChange={(e) =>
                            updateField('msme_number', e.target.value)
                          }
                          placeholder="Enter MSME number"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📑</span>
                          MSME Number
                        </div>
                        {renderViewValue(form.msme_number)}
                      </>
                    )}
                  </div>

                  {/* WEBSITE */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>🌐</span>
                          Website
                        </label>
                        <input
                          type="url"
                          value={form.website || ''}
                          onChange={(e) =>
                            updateField('website', e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>🌐</span>
                          Website
                        </div>
                        {renderViewValue(form.website, { type: 'url' })}
                      </>
                    )}
                  </div>

                  {/* CONTACT 2 */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>📱</span>
                          Contact No
                        </label>
                        <input
                          type="tel"
                          value={form.contact_2 || ''}
                          onChange={(e) =>
                            updateField('contact_2', e.target.value)
                          }
                          placeholder="Enter contact number"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>📱</span>
                          Contact No
                        </div>
                        {renderViewValue(form.contact_2, { type: 'phone' })}
                      </>
                    )}
                  </div>

                  {/* DIRECTOR EMAIL */}

                  <div className="profile-field">
                    {isEditMode ? (
                      <>
                        <label>
                          <span>✉️</span>
                          Director Email
                        </label>
                        <input
                          type="email"
                          value={form.director_email || ''}
                          onChange={(e) =>
                            updateField('director_email', e.target.value)
                          }
                          placeholder="Enter director email"
                        />
                      </>
                    ) : (
                      <>
                        <div className="profile-view-label">
                          <span>✉️</span>
                          Director Email
                        </div>
                        {renderViewValue(form.director_email, { type: 'email' })}
                      </>
                    )}
                  </div>

                </div>

                {/* =================================================
                    SERVICE DOMAINS
                ================================================== */}

                <div className="profile-section-title">
                  <span>03</span>
                  Service Domains
                </div>

                <div className="domain-editor">

                  <div className="domain-list">

                    {Array.isArray(form.domains) &&
                    form.domains.length > 0 ? (
                      form.domains.map(
                        (domain, index) => (
                          <span
                            key={`${domain}-${index}`}
                            className="domain-tag"
                          >
                            {domain}

                            {isEditMode && (
                              <button
                                type="button"
                                className="domain-remove-btn"
                                onClick={() =>
                                  removeServiceDomain(index)
                                }
                                title="Remove domain"
                              >
                                ×
                              </button>
                            )}
                          </span>
                        )
                      )
                    ) : (
                      <span className="no-domains">
                        No service domains selected
                      </span>
                    )}

                  </div>

                  {/* ADD DOMAIN - ONLY IN EDIT MODE */}

                  {isEditMode && (
                    <div className="domain-add-row">

                      <input
                        type="text"
                        id="new-service-domain"
                        placeholder="Enter service domain"
                        onKeyDown={handleDomainKeyDown}
                      />

                      <button
                        type="button"
                        className="domain-add-btn"
                        onClick={addServiceDomain}
                      >
                        + Add Domain
                      </button>

                    </div>
                  )}

                </div>
              </>
            )}

          </fieldset>

          {/* ===================================================
              SECURITY
          ==================================================== */}

          <div className="profile-section-title">

            <span>
              {role === 'vendor' ? '04' : '03'}
            </span>

            Security

          </div>

          {!isEditMode ? (
            <div className="profile-security-note">
              <span>🔐</span>
              <div>
                <strong>Password</strong>
                <p className="profile-password-display">
                  {form.password ? form.password : '••••••••'}
                </p>
                <small>
                  Password is hidden for security. Use Edit Profile to change it.
                </small>
              </div>
            </div>
          ) : (
            <div className="profile-grid profile-password-grid">
              <div className="profile-field">
              <label>Current Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={form.current_password || ''}
                onChange={(e) =>
                  updateField('current_password', e.target.value)
                }
                placeholder="Enter current password"
              />
            </div>
              <div className="profile-field">
                <label>New Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={form.new_password || ''}
                  onChange={(e) =>
                    updateField('new_password', e.target.value)
                  }
                  placeholder="Enter new password"
                />
              </div>
              <div className="profile-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm_password || ''}
                  onChange={(e) =>
                    updateField('confirm_password', e.target.value)
                  }
                  placeholder="Confirm new password"
                />
              </div>
              <small className="profile-password-help">
                  Enter your current password to set a new password. If you don't know
                  your current password, click{' '}

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    style={{
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      font: 'inherit',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      cursor: forgotLoading ? 'wait' : 'pointer',
                    }}
                  >
                    {forgotLoading ? 'Sending...' : 'Forgot Password?'}
                  </button>

                  {' '}to reset it.
                  <br />
                  Leave all password fields empty to update profile details only.

                  {forgotError && (
                    <span style={{ display: 'block', color: '#dc2626', marginTop: 6 }}>
                      {forgotError}
                    </span>
                  )}
                </small>
            </div>
          )}

          {/* ===================================================
              ACTIONS
          ==================================================== */}

          {!isEditMode ? (
            /* ---- VIEW MODE ACTIONS ---- */
            <div className="profile-actions">
              {/* <button
                type="button"
                className="profile-update-btn"
                onClick={goToEditMode}
              >
                Edit Profile
                <span>✎</span>
              </button> */}
            </div>
          ) : (
            /* ---- EDIT MODE ACTIONS ---- */
            <div className="profile-actions">
              {success && (
                <p className="profile-success">{success}</p>
              )}
              {error && (
                <p className="profile-error-message">{error}</p>
              )}

              <button
                type="button"
                className="profile-update-btn"
                onClick={goToViewMode}
                disabled={saving}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  boxShadow: 'none',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-update-btn"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Profile'}
                <span>→</span>
              </button>
            </div>
          )}

          {forgotPopup && (
              <div className="forgot-modal-overlay">
                <div
                  className="forgot-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="forgot-modal-title"
                >
                  <div className="forgot-modal-icon">✉️</div>

                  <h3 id="forgot-modal-title">Request Submitted!</h3>

                  <p>
                    If this business email is registered, you will receive a
                    password reset email shortly.
                  </p>

                  <p className="forgot-modal-email">
                    {form.email}
                  </p>

                  <button
                    type="button"
                    onClick={() => setForgotPopup(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}

        </div>

      </div>
    </PanelLayout>
  )
}
