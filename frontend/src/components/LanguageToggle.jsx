
import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className="sm-language-toggle"
      role="group"
      aria-label="Choose website language"
    >
      <button
        type="button"
        className={language === 'en' ? 'is-active' : ''}
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>

      <button
        type="button"
        className={language === 'hi' ? 'is-active' : ''}
        aria-pressed={language === 'hi'}
        onClick={() => setLanguage('hi')}
      >
        HI
      </button>
    </div>
  )
}
