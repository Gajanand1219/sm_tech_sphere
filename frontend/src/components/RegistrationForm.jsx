import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

import API from '../services/api'

import './RegistrationForm.css'



/* =========================================================

   FIELD DEFINITIONS

   Format: [key, label, type, required]

   ========================================================= */



const buyerFields = [

  ['company_name', 'Company Name', 'text', true],

  ['director_email', 'Permanent Email', 'email', true],

  ['industry', 'Industry Type', 'text', true],

  ['gst_number', 'GST Number', 'text', false],

  ['website', 'Website', 'url', true],

  ['head_office_contact', 'Head Office Contact', 'tel', false],

  ['ehs_contact', 'EHS Head Contact', 'tel', false],

  ['registered_address', 'Head Office Address', 'text', true],

  ['plant_location', 'Plant Address', 'text', true],



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



/* =========================================================

   STRUCTURED ADDRESS (Buyer + Vendor)

   UI madhe 5 separate input, pan backend la ek string jate.

   ========================================================= */



const buyerAddressKeys = ['registered_address', 'plant_location']

const vendorAddressKeys = ['address']



const addressLabels = {

  registered_address: 'Head Office Address',

  plant_location: 'Plant Address',

  address: 'Address',

}



// [part, label, placeholder]

const addressParts = [

  ['at', 'At', 'Village / Area'],

  ['subdist', 'Sub-District', 'Taluka / Mandal'],

  ['district', 'District', 'District'],

  ['state', 'State', 'State'],

  ['pincode', 'Pincode', '6-digit'],

]



const addressPartKey = (key, part) => `${key}__${part}`



const buildAddressString = (form, key) =>

  addressParts

    .map(([part, label]) => `${label}: ${(form[addressPartKey(key, part)] || '').trim()}`)

    .join(', ')



const domains = [

  'Water & Wastewater Treatment',

  'SOLID AND HAZARDOUS WASTE',

  'SOLAR AND RENEWABLE ENERGY',

  'CARBON AND ESG',

  'Air Pollution & Environmental Legal Services',

]



const geographicalTerritories = [

  'Pan India',



  // 28 States

  'Andhra Pradesh',

  'Arunachal Pradesh',

  'Assam',

  'Bihar',

  'Chhattisgarh',

  'Goa',

  'Gujarat',

  'Haryana',

  'Himachal Pradesh',

  'Jharkhand',

  'Karnataka',

  'Kerala',

  'Madhya Pradesh',

  'Maharashtra',

  'Manipur',

  'Meghalaya',

  'Mizoram',

  'Nagaland',

  'Odisha',

  'Punjab',

  'Rajasthan',

  'Sikkim',

  'Tamil Nadu',

  'Telangana',

  'Tripura',

  'Uttar Pradesh',

  'Uttarakhand',

  'West Bengal',



  // 8 Union Territories

  'Andaman and Nicobar Islands',

  'Chandigarh',

  'Dadra and Nagar Haveli and Daman and Diu',

  'Delhi (NCT)',

  'Jammu and Kashmir',

  'Ladakh',

  'Lakshadweep',

  'Puducherry',



  // International

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

]



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

]



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

        return t('regInvalidData')

      })

      .join(', ')

  }



  if (typeof detail === 'string') return detail

  if (typeof error?.response?.data?.message === 'string')

    return error.response.data.message

  if (typeof error?.message === 'string') return error.message



  return t('regFail')

}



/* =========================================================

   REGISTRATION FORM

   ========================================================= */



export default function RegistrationForm({ type }) {
  const { t } = useLanguage()
  const isBuyer = type === 'buyer'



  const structuredAddressKeys = isBuyer ? buyerAddressKeys : vendorAddressKeys



  const [form, setForm] = useState({})

  const [selected, setSelected] = useState([])

  const [msg, setMsg] = useState('')

  const [msgType, setMsgType] = useState('')

  const [loading, setLoading] = useState(false)

  const [showSuccess, setShowSuccess] = useState(false)

  const [openMultiSelect, setOpenMultiSelect] = useState('')



  // kontya address madhe kiti fields dakhvli ahet (0 = fakt "At")

  const [addrStep, setAddrStep] = useState({})



  const [multiSearch, setMultiSearch] = useState({

    area_of_work: '',

    industrial_verticals: '',

    industry: '',

    industry_type: '',

  })



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

      'website',

    ]



    if (!isBuyer) {

      requiredFields.push(

        'industry_type',

        'area_of_work',

        'industrial_verticals',

        'experience_years',

        'specialization'

      )

    } else {

      requiredFields.push('industry')

    }



    for (const field of requiredFields) {

      if (

        ['area_of_work', 'industrial_verticals', 'industry', 'industry_type'].includes(field)

      ) {

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



    // Structured address validation (buyer + vendor)

    for (const key of structuredAddressKeys) {

      const groupLabel = addressLabels[key]



      for (const [part, partLabel] of addressParts) {

        const value = String(form[addressPartKey(key, part)] ?? '').trim()

        if (!value) {

          // sagle fields dakhva mhanje user la kay baki ahe te disel

          setAddrStep((prev) => ({ ...prev, [key]: addressParts.length - 1 }))

          return `Please enter ${t(({ at: 'addrAt', subdist: 'addrSubDistrict', district: 'addrDistrict', state: 'addrState', pincode: 'addrPincode' })[part] || '') || partLabel} in ${groupLabel}.`

        }

      }



      const pin = String(form[addressPartKey(key, 'pincode')]).trim()

      if (!/^\d{6}$/.test(pin)) return `Please enter a valid 6-digit pincode in ${groupLabel}.`

    }



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(form.email.trim())) return t('regInvalidEmail')



    const phoneRegex = /^[6-9]\d{9}$/

    if (!phoneRegex.test(form.phone.trim()))

      return t('regInvalidPhone')



    if (form.password.length < 8) return t('regPwdShort')

    if (!/[A-Z]/.test(form.password)) return t('regPwdUpper')

    if (!/[a-z]/.test(form.password)) return t('regPwdLower')

    if (!/[0-9]/.test(form.password)) return t('regPwdNumber')

    if (form.password !== form.confirm_password) return t('regPwdMismatch')



    if (!isBuyer) {

      const experience = Number(form.experience_years)

      if (!Number.isFinite(experience) || experience < 0 || experience > 100)

        return t('regInvalidExp')

      if (selected.length === 0) return t('regSelectDomain')

    }



    if (form.website?.trim()) {

      try {

        new URL(form.website.trim())

      } catch {

        return 'Please enter a valid website URL, e.g. https\://example.com'

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



      // Temporary address part keys kadha — backend la disu naye

      Object.keys(payload).forEach((k) => {

        if (k.includes('__')) delete payload[k]

      })



      if (!isBuyer) {

        payload.experience_years = Number(form.experience_years)

        payload.domains = selected



        payload.area_of_work = (form.area_of_work || []).join(', ')

        payload.industrial_verticals = (form.industrial_verticals || []).join(', ')

        payload.industry_type = (form.industry_type || []).join(', ')



        // single string, same key -> backend unchanged

        payload.address = buildAddressString(form, 'address')

      } else {

        payload.industry = (form.industry || []).join(', ')



        payload.registered_address = buildAddressString(form, 'registered_address')

        payload.plant_location = buildAddressString(form, 'plant_location')

      }



      const response = await API.post(`/auth/register/${type}`, payload)



      const successMessage =

        response.data?.message ||

        t('regSuccessApi')



      setMsg(successMessage)

      setMsgType('success')



      setShowSuccess(true)



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

      director_email: '✉️',

      phone: '📱',

      contact_2: '📱',

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

      msme_number: '📄',

    }

    return icons[key] || '•'

  }



  /* ================= RENDER FIELD ================= */



  const multiSelectOptions = {

    area_of_work: geographicalTerritories,

    industrial_verticals: industrialVerticalOptions,

    industry: industrialVerticalOptions,

    industry_type: industryTypeOptions,

  }



  const selectOptionsMap = {}



  const fieldDescriptions = {

    area_of_work: 'Select all regions where your company provides services.',

    industrial_verticals: 'Select all industries your company serves.',

    industry: 'Select all industries your company serves.',

    industry_type: 'Select your primary business category.',

  }



  /* ---------- Structured address: At -> Enter -> Sub-District -> ... ---------- */



  const renderAddressField = ([key, label, , required]) => {

    const step = addrStep[key] ?? 0 // last visible index



    return (

      <div className="field-group field-group--wide address-group" key={key}>

        <label>

          <span className="field-icon">{getIcon(key)}</span>

          {label}

          {required && <span className="required-star">*</span>}

        </label>



        <div className="address-row">

          {addressParts.map(([part, partLabel, placeholder], idx) => {

            if (idx > step) return null



            const fieldKey = addressPartKey(key, part)

            const isPin = part === 'pincode'

            const value = form[fieldKey] ?? ''



            return (

              <div className="address-cell" key={fieldKey}>

                <span className="address-cell-label">{t(({ at: 'addrAt', subdist: 'addrSubDistrict', district: 'addrDistrict', state: 'addrState', pincode: 'addrPincode' })[part] || '') || partLabel}</span>

                <input

                  id={fieldKey}

                  name={fieldKey}

                  type="text"

                  inputMode={isPin ? 'numeric' : 'text'}

                  maxLength={isPin ? 6 : undefined}

                  autoFocus={idx > 0}

                  value={value}

                  onChange={(e) =>

                    updateField(

                      fieldKey,

                      isPin ? e.target.value.replace(/\D/g, '') : e.target.value

                    )

                  }

                  onKeyDown={(e) => {

                    if (e.key !== 'Enter') return

                    e.preventDefault() // form submit hou naye

                    if (!String(value).trim()) return

                    if (idx < addressParts.length - 1) {

                      setAddrStep((prev) => ({

                        ...prev,

                        [key]: Math.max(prev[key] ?? 0, idx + 1),

                      }))

                    }

                  }}

                  placeholder={t(({ at: 'addrAtPh', subdist: 'addrSubDistrictPh', district: 'addrDistrictPh', state: 'addrStatePh', pincode: 'addrPincodePh' })[part] || '') || placeholder}

                />

              </div>

            )

          })}

        </div>



        {step < addressParts.length - 1 && (

          <small className="select-help">

            Fill the field and press Enter to add the next one.

          </small>

        )}

      </div>

    )

  }



  const renderField = (fieldDef) => {

    const [key, originalLabel, kind = 'text', required = false] = fieldDef
    const labelKeys = {
      company_name: 'regCompanyName', director_email: isBuyer ? 'regPermanentEmail' : 'regDirectorEmail',
      industry: 'regIndustryType', industry_type: 'regVendorType', gst_number: 'regGstNumber',
      website: 'regWebsite', head_office_contact: 'regHeadOfficeContact', ehs_contact: 'regEhsContact',
      registered_address: 'regHeadOfficeAddress', plant_location: 'regPlantAddress',
      area_of_work: 'regGeoTerritories', industrial_verticals: 'regIndustrialVerticals',
      experience_years: 'regExperienceYears', capacity: 'regCapacity', specialization: 'regSpecialization',
      msme_number: 'regMsmeNumber', contact_2: 'regContactNumber', address: 'regAddress',
      full_name: 'regFullName', email: 'regBusinessEmail', phone: isBuyer ? 'regPhoneNumber' : 'regMobileNumber',
      password: 'regPassword', confirm_password: 'regReenterPassword'
    }
    const label = t(labelKeys[key] || key) || originalLabel



    // Buyer: Head Office Address & Plant Address | Vendor: Address

    if (structuredAddressKeys.includes(key)) {

      return renderAddressField(fieldDef)

    }



    const isMultiSelect = Boolean(multiSelectOptions[key])

    const isSelect = Boolean(selectOptionsMap[key])

    const options = multiSelectOptions[key] || selectOptionsMap[key] || []



    const selectWhiteClass = key === 'industry_type' ? 'registration-select--white' : ''



    return (

      <div

        className={`field-group ${isMultiSelect || isSelect ? 'field-group--select' : ''}`}

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

              className={`multi-select-trigger ${openMultiSelect === key ? 'is-open' : ''}`}

              aria-expanded={openMultiSelect === key}

              onClick={() => {

                setOpenMultiSelect((prev) => (prev === key ? '' : key))

                setMultiSearch((prev) => ({ ...prev, [key]: '' }))

              }}

            >

              <span className="multi-select-trigger-content">

                {Array.isArray(form[key]) && form[key].length > 0 ? (

                  <span className="multi-select-summary">{form[key].length} {t('regSelectedCount')}</span>

                ) : (

                  <span className="multi-select-placeholder">{t('regSelectPlaceholder')} {label}</span>

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

                      option.toLowerCase().includes((multiSearch[key] || '').toLowerCase())

                    )

                    .map((option) => {

                      const checked = (form[key] || []).includes(option)



                      return (

                        <label

                          key={option}

                          className={`multi-select-option ${checked ? 'is-selected' : ''}`}

                        >

                          <input

                            type="checkbox"

                            checked={checked}

                            onChange={() => {

                              const current = form[key] || []



                              updateField(

                                key,

                                checked

                                  ? current.filter((item) => item !== option)

                                  : [...current, option]

                              )

                            }}

                          />



                          <span>{option}</span>

                          {checked && <span className="multi-select-check">✓</span>}

                        </label>

                      )

                    })}



                  {options.filter((option) =>

                    option.toLowerCase().includes((multiSearch[key] || '').toLowerCase())

                  ).length === 0 && <p className="multi-select-empty">{t('regNoOptions')}</p>}

                </div>



                <div className="multi-select-footer">

                  <span>{(form[key] || []).length} {t('regSelectedCount')}</span>

                  <button type="button" onClick={() => setOpenMultiSelect('')}>

                    {t('regDone')}

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

                {t('regSelectPlaceholder')} {label}

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

              <small className="select-help">{fieldDescriptions[key]}</small>

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

            placeholder={`${t('regEnter')} ${label}`}

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

            <img src="/logo2.jpeg" alt="SM TechSphere Pvt. Ltd." />

          </div>

          <div>

            <strong>SM TechSphere Pvt. Ltd.</strong>

          </div>

        </div>



        <button type="button" className="back-home" onClick={() => nav('/')}>

          <span>←</span>

          {t('regBack')}

        </button>

      </div>



      {/* ================= MAIN ================= */}



      <main className="registration-main registration-main--centered">

        <section className="registration-card">

          {/* HEADER */}

          <div className="registration-card-header">

            <div>

              <span className="form-kicker">

                {t(isBuyer ? 'regBuyerKicker' : 'regVendorKicker')}

              </span>

              <h2>{t(isBuyer ? 'regBuyerTitle' : 'regVendorTitle')}</h2>

              <p>{t('regSubtitle')}</p>

            </div>



            <div className={`role-icon ${isBuyer ? 'role-icon--buyer' : 'role-icon--vendor'}`}>

              {isBuyer ? '🏢' : '🌱'}

            </div>

          </div>



          <form onSubmit={submit} className="modern-registration-form" noValidate>

            {isBuyer ? (

              <>

                {/* SECTION 01 — BUSINESS INFORMATION */}

                <div className="form-section-title">

                  <span>01</span>

                  {t('regSection1')}

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

                        'ehs_contact',

                      ].includes(key)

                    )

                    .map(renderField)}

                </div>



                {/* SECTION 02 — ACCOUNT INFORMATION */}

                <div className="form-section-title">

                  <span>02</span>

                  {t('regSection2Buyer')}

                </div>



                <div className="registration-grid">

                  {buyerFields

                    .filter(([key]) =>

                      ['full_name', 'email', 'phone', 'password', 'confirm_password'].includes(key)

                    )

                    .map(renderField)}

                </div>

              </>

            ) : (

              <>

                {/* SECTION 01 — BUSINESS INFORMATION */}

                <div className="form-section-title">

                  <span>01</span>

                  {t('regSection1')}

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

                        'director_email',

                      ].includes(key)

                    )

                    .map(renderField)}

                </div>



                {/* SECTION 02 — TECHSPHERE DOMAINS */}

                <div className="domain-section">

                  <div className="form-section-title">

                    <span>02</span>

                    {t('regSection2Vendor')}

                    <span className="required-star">*</span>

                  </div>



                  <p className="domain-description">

                    {t('regDomainDesc')}

                  </p>



                  <div className="domain-grid">

                    {domains.map((domain) => {

                      const active = selected.includes(domain)



                      return (

                        <button

                          type="button"

                          key={domain}

                          className={`domain-card ${active ? 'domain-card--active' : ''}`}

                          onClick={() => toggleDomain(domain)}

                        >

                          <span className="domain-check">{active ? '✓' : '+'}</span>

                          <span>{domain}</span>

                        </button>

                      )

                    })}

                  </div>

                </div>



                {/* SECTION 03 — ACCOUNT INFORMATION */}

                <div className="form-section-title">

                  <span>03</span>

                  {t('regSection3')}

                </div>



                <div className="registration-grid">

                  {vendorFields

                    .filter(([key]) =>

                      ['full_name', 'email', 'phone', 'password', 'confirm_password'].includes(key)

                    )

                    .map(renderField)}

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

                  {t('regSubmitting')}

                </>

              ) : (

                <>

                  {t(isBuyer ? 'regSubmitBuyer' : 'regSubmitVendor')}

                  <span>→</span>

                </>

              )}

            </button>



            {/* FOOTER */}

            <div className="registration-footer">

              <span>{t('regAlreadyHave')}</span>

              <button type="button" onClick={() => nav('/login')}>

                {t('regLoginHere')}

              </button>

            </div>



            <div className="secure-note">

              {t('regSecureNote')}

            </div>

          </form>

        </section>

      </main>



      {/* ================= SUCCESS POPUP ================= */}



      {showSuccess && (

        <div className="success-modal-overlay">

          <div className="success-modal">

            <div className="success-modal__icon">✓</div>



            <span className="success-modal__label">{t('regSuccessLabel')}</span>

            <h2>{t('regSuccessTitle')}</h2>



            <p className="success-modal__text">

              {t('regSuccessMsg')}

              <br />

              <strong>{form.email}</strong>

            </p>



            <p className="success-modal__hint">{t('regSuccessHint')}</p>



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

              {t('regVerifyNow')}

              <span>→</span>

            </button>

          </div>

        </div>

      )}

    </div>

  )

}
