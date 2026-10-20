import { useEffect, useState } from 'react'
import './LanguageToggle.css'

const STORAGE_KEY = 'sm_techsphere_language'

function applyLanguage(language) {
  const select = document.querySelector('.goog-te-combo')
  if (select) {
    select.value = language === 'hi' ? 'hi' : ''
    select.dispatchEvent(new Event('change', { bubbles: true }))
    return true
  }
  return false
}

export default function LanguageToggle() {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'hi' ? 'hi' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    // Google Translate translates rendered page text across routes without
    // requiring every React component to be rewritten.
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          autoDisplay: false,
        },
        'google_translate_element'
      )
      const saved = (() => {
        try { return localStorage.getItem(STORAGE_KEY) || 'en' } catch { return 'en' }
      })()
      const tryApply = (attempt = 0) => {
        if (applyLanguage(saved) || attempt >= 20) return
        window.setTimeout(() => tryApply(attempt + 1), 250)
      }
      tryApply()
    }

    if (!document.querySelector('script[data-sm-google-translate]')) {
      const script = document.createElement('script')
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      script.dataset.smGoogleTranslate = 'true'
      document.body.appendChild(script)
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit?.()
    }
  }, [])

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    try { localStorage.setItem(STORAGE_KEY, nextLanguage) } catch {}

    // Apply immediately when the widget is ready; otherwise the init callback
    // reads the saved language when Google Translate finishes loading.
    if (applyLanguage(nextLanguage)) return

    // Reloading lets the widget initialize in the selected language if it has
    // not finished loading yet. The choice remains saved between pages.
    if (nextLanguage === 'en') {
      document.cookie = 'googtrans=/en/en; path=/'
    } else {
      document.cookie = 'googtrans=/en/hi; path=/'
    }
    window.location.reload()
  }

  return (
    <>
      <div className="sm-language-toggle" role="group" aria-label="Choose website language">
        <span className="sm-language-icon" aria-hidden="true">文</span>
        <button
          type="button"
          className={language === 'en' ? 'is-active' : ''}
          aria-pressed={language === 'en'}
          onClick={() => changeLanguage('en')}
        >
          English
        </button>
        <span className="sm-language-divider" aria-hidden="true">|</span>
        <button
          type="button"
          className={language === 'hi' ? 'is-active' : ''}
          aria-pressed={language === 'hi'}
          onClick={() => changeLanguage('hi')}
        >
          हिंदी
        </button>
      </div>
      <div id="google_translate_element" className="sm-google-translate-host" aria-hidden="true" />
    </>
  )
}
