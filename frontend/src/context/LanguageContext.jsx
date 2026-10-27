import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'sm_techsphere_language'

const translations = {
  en: {
    // ================= Navbar =================
    Home: 'Home',
    Domain: 'Domain',
    'About Us': 'About Us',
    'Contact Us': 'Contact Us',
    Login: 'Login',
    'Register as Buyer': 'Register as Buyer',
    'Register as Vendor': 'Register as Vendor',
    Dashboard: 'Dashboard',
    Logout: 'Logout',

    // ================= Footer =================
    footerPlatform: 'Platform',
    footerJoinNetwork: 'Join Network',
    footerContact: 'Contact',
    footerContactLink: 'Contact',
    footerTagline: 'Diagnose. Match. Solution.',
    footerCountry: 'India',
    footerRights: '© 2026 Enviquo SM Pvt. Ltd.',

    footerDomains: 'Water • Waste • Solar • ESG • SPCB',

    // ================= Domain / Solutions page =================
    ourDomainsLabel: 'OUR DOMAINS',
    domainIntroTitle: 'Solutions for industrial challenges',
    domainIntroDesc:
      'Select the relevant domain to understand the type of engineering, environmental and CleanTech requirements supported by our Enviquo  platform.',
    startRequirement: 'Start Requirement →',
    industrialRequirementLabel: 'INDUSTRIAL REQUIREMENT',
    haveCleanTechRequirement: 'Have a CleanTech requirement?',
    cleanTechRequirementDesc:
      'Submit your requirement and connect with relevant engineering and solution providers.',

    domainWater: 'Water & Wastewater Treatment',
    domainSolid: 'Solid & Hazardous Waste',
    domainSolar: 'Solar & Renewables',
    domainCarbon: 'Carbon & ESG',
    domainAir: 'Air Pollution & Environmental Legal Services',

    waterPoint1: 'Primary Effluent & Sewage Treatment',
    waterPoint2: 'High Recovery Advanced Water Engineering',
    waterPoint3: 'Biological & Advanced Membrane Solutions',
    waterPoint4: 'Fine Filtration & Pre-treatment Nodes',
    waterPoint5: 'Specialized Electrochemical & Recovery Systems',

    solidPoint1: 'Collection & Pre-processing',
    solidPoint2: 'Thermal & Advanced Recovery (Waste to Energy)',
    solidPoint3: 'Biological Treatment (Organic Waste)',
    solidPoint4: 'Chemical & Stabilization Treatments',
    solidPoint5: 'Specialized Recycling & Compliance',

    solarPoint1: 'Capital Efficiency & Grid Integration',
    solarPoint2: 'Thermal Utility De-carbonization',
    solarPoint3: 'Power Quality & Micro-grid Resilience',
    solarPoint4: 'Agro Industrial Logistics & Supply Chains',
    solarPoint5: 'Asset Optimization & Digital Intelligence',

    carbonPoint1: 'Scope 1 & Direct Operational Carbon Footprint',
    carbonPoint2: 'Scope 2 & Indirect Energy Tracking',
    carbonPoint3: 'Scope 3 & Supply Chain Vulnerabilities',
    carbonPoint4: 'Global Trade & Cross-Border Compliance',
    carbonPoint5: 'ESG Disclosures & Global Frameworks',

    airPoint1: 'Industrial Air Pollution Engineering (Physical Solutions)',
    airPoint2: 'Statutory SPCB Consents & Approvals',
    airPoint3: 'SPCB Enforcement & Litigation Defense (Legal Services)',
    airPoint4: 'Factory Infrastructure & Safety Audits (Site Compliance)',
    airPoint5: 'Legacy & Supply Chain Risk Scoping',

    // ================= About Us page =================
    aboutPageLabel: 'ABOUT US',
    aboutPageTitle: 'How the ENVIQUO Platform Works',
    aboutPageDesc:
      'A structured industrial workflow connecting buyers with relevant engineering, EPC and CleanTech solution providers.',

    whoWeAre: 'WHO WE ARE',
    aboutTitle:
      'A structured connection between industrial requirements and solutions.',
      aboutP1:
       'ENVIQUO provides a structured B2B environment where industrial buyers can describe their requirements and relevant engineering, EPC and CleanTech providers can respond to matched opportunities.',
      aboutP2:
      'The platform organizes the process from requirement submission through technical matching, quotation and mutual acceptance.',

    aboutPoint1: 'Structured industrial requirements',
    aboutPoint2: 'Relevant technical matching',
    aboutPoint3: 'Controlled quotation workflow',
    aboutPoint4: 'Mutual acceptance before contact sharing',

    platformWorkflow: 'PLATFORM WORKFLOW',
    workflowTitle: 'From enquiry to mutual handshake',
    workflowDesc:
      'The complete process is divided into three structured phases.',

    workflowStep1Title: 'Buyer Enquiry',
    workflowStep1Desc:
      'Buyer registers, gets approved, selects the required domain, explains the industrial problem, completes the questionnaire and submits the technical requirement.',
    workflowStep2Title: 'Vendor Matching & Quotation',
    workflowStep2Desc:
      'Approved vendors receive relevant matched enquiries, review the masked technical dossier and submit their quotation or technical proposal.',
    workflowStep3Title: 'Two-Way Handshake',
    workflowStep3Desc:
      'The buyer reviews the quotation and accepts it. The vendor also confirms acceptance. After mutual acceptance, contact details are unlocked and the project can move forward.',

    strictMasking: 'Strict Masking',
    strictMaskingDesc:
      'Contact details remain protected until mutual acceptance.',
    responseWindow: '10 Days Response Window',
    responseWindowDesc:
      'Matched opportunities operate within the defined response period.',

    getStartedLabel: 'GET STARTED',
    readyToParticipate: 'Ready to participate in the network?',
    readyToParticipateDesc:
      'Join as an industrial buyer or an engineering and CleanTech solution provider.',

    // ================= Login page =================
    loginBrandName: 'ENVIQUO',
    // loginBrandSub: 'Engineering Solutions',
    backBtn: 'Back',
    secureAccessLabel: 'SECURE ACCESS',
    welcomeBack: 'Welcome Back',
    signInSub: 'Sign In To Access Your Dashboard.',

    emailLabel: 'Email',
    emailPlaceholder: 'Enter Your Email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter Your Password',

    showPassword: 'Show Password',
    hidePassword: 'Hide Password',

    captchaLabel: 'Captcha Verification',
    captchaPlaceholder: 'Enter Code',
    captchaRefresh: 'Refresh Captcha',
    captchaEmptyErr: 'Please Enter The Captcha Code.',
    captchaWrongErr: 'Incorrect Captcha. Please Try Again.',

    rememberMe: 'Remember Me',
    forgotPassword: 'Forgot Password?',
    loginBtn: 'Login',
    signingIn: 'Signing In...',
    newToPlatform: 'New to ENVIQUO',
    createAccount: 'Create Account',
    secureNote:
      '🔒 Your Information Is Protected And Securely Processed.',
    demoAdminLabel: 'Demo Admin',

    unknownRoleErr: 'Unknown User Role.',
    loginFailErr: 'Login Failed. Please Try Again.',
    invalidRequestErr: 'Invalid Request',

    // Register choice modal
    joinNetworkLabel: 'JOIN THE NETWORK',
    createYourAccount: 'Create Your Account',
    chooseRegister: 'Choose How You Want To Register',
    registerAsBuyer: 'Register As Buyer',
    registerAsBuyerSub: 'Post Industrial Requirements',
    registerAsVendor: 'Register As Vendor',
    registerAsVendorSub: 'Offer EPC & CleanTech Solutions',

    // Forgot password modal
    forgotTitle: 'Forgot Password?',
    forgotDesc:
      'Enter Your Registered Email Address And We Will Send You A Secure Password Reset Link.',
    forgotCancel: 'Cancel',
    forgotSend: 'Send Reset Link',
    forgotSending: 'Sending...',
    forgotEmptyErr: 'Please Enter Your Email Address.',
    forgotSuccessMsg:
      'If This Email Is Registered, A Password Reset Link Has Been Sent.',
    forgotFailMsg: 'Unable To Send Password Reset Email.',

        // ================= Verify Email page =================
    veBrandName: 'ENVIQUO',
    veBack: 'Back',

    veKicker: 'Email Verification',
    veTitle: 'Check your inbox',
    veSubtitle: 'We sent a 6-digit verification code to your email.',

    veEmailLabel: 'Email address',
    veEmailPlaceholder: 'you@company.com',

    veOtpLabel: 'Verification code',
    veOtpHint: 'Code ready',
    veOtpDigits: 'digits', // used like → `${code.length}/6 digits`

    veResendOtp: 'Resend OTP',
    veResendIn: 'Resend OTP in',
    veSendingOtp: 'Sending OTP...',

    veVerifyBtn: 'Verify & Continue',
    veVerifying: 'Verifying...',

    veWrongEmail: 'Wrong email?',
    veRegisterAgain: 'Register again',
    veSecureNote:
      '🔒 Your information is protected and securely processed.',

    // Verify Email — errors & messages
    veEmailRequiredErr: 'Please enter your email address.',
    veOtpIncompleteErr: 'Please enter the complete 6-digit OTP.',
    veVerifiedSuccess:
      'Email verified successfully. Redirecting to dashboard...',
    veVerifyFailErr: 'Verification failed. Please try again.',
    veResendSuccess: 'A new OTP has been sent to your email.',
    veResendFailErr: 'Unable to resend OTP. Please try again.',

        // ================= Registration page =================
    regBrandName: 'ENVIQUO',
    regBack: 'Back',

    regBuyerKicker: 'BUYER REGISTRATION',
    regVendorKicker: 'VENDOR REGISTRATION',
    regBuyerTitle: 'Create Your Buyer Account',
    regVendorTitle: 'Create Your Vendor Account',
    regSubtitle: 'Fill In Your Business Information To Get Started.',

    regSection1: 'Business Information',
    regSection2Buyer: 'Account Information',
    regSection2Vendor: 'TECHSPHERE Domains',
    regSection3: 'Account Information',

    regDomainDesc:
      'Select the areas in which your company provides solutions.',
    regDomainRequired: 'TECHSPHERE Domains',

    regSubmitBuyer: 'Create Buyer Account',
    regSubmitVendor: 'Create Vendor Account',
    regSubmitting: 'Creating Account...',

    regAlreadyHave: 'Already have an account?',
    regLoginHere: 'Login Here',
    regSecureNote:
      '🔒 Your information is protected and securely processed.',

    // Success popup
    regSuccessLabel: 'REGISTRATION COMPLETE',
    regSuccessTitle: 'Account Created Successfully!',
    regSuccessMsg: "We've sent a verification email to",
    regSuccessHint: 'Redirecting you to verify your email...',
    regVerifyNow: 'Verify Email Now',

    // Field labels — Buyer
    regCompanyName: 'Company Name',
    regPermanentEmail: 'Permanent Email',
    regIndustryType: 'Industry Type',
    regGstNumber: 'GST Number',
    regWebsite: 'Website',
    regHeadOfficeContact: 'Head Office Contact',
    regEhsContact: 'EHS Head Contact',
    regHeadOfficeAddress: 'Head Office Address',
    regPlantAddress: 'Plant Address',

    // Field labels — Vendor
    regGeoTerritories: 'Geographical Territories',
    regIndustrialVerticals: 'Industrial Verticals',
    regVendorType: 'Vendor Type',
    regExperienceYears: 'Experience (Years)',
    regCapacity: 'Capacity',
    regSpecialization: 'Specialization',
    regMsmeNumber: 'MSME Number',
    regContactNumber: 'Contact Number',
    regDirectorEmail: 'Director Email',
    regAddress: 'Address',

    // Field labels — Common
    regFullName: 'Full Name',
    regBusinessEmail: 'Business Email',
    regPhoneNumber: 'Phone Number',
    regMobileNumber: 'Mobile Number',
    regPassword: 'Password',
    regReenterPassword: 'Re-enter Password',

    // Address parts
    addrAt: 'At',
    addrSubDistrict: 'Sub-District',
    addrDistrict: 'District',
    addrState: 'State',
    addrPincode: 'Pincode',

    addrAtPh: 'Village / Area',
    addrSubDistrictPh: 'Taluka / Mandal',
    addrDistrictPh: 'District',
    addrStatePh: 'State',
    addrPincodePh: '6-digit',

    addrEnterHint:
      'Fill the field and press Enter to add the next one.',

    // Multi-select helpers
    regSelectedCount: 'selected',
    regSelectPlaceholder: 'Select',
    regSearchPlaceholder: 'Search',
    regNoOptions: 'No options found.',
    regDone: 'Done',

    // Field descriptions
    regAreaOfWorkHelp:
      'Select all regions where your company provides services.',
    regIndustrialVerticalsHelp:
      'Select all industries your company serves.',
    regIndustryHelp: 'Select all industries your company serves.',
    regIndustryTypeHelp: 'Select your primary business category.',

    // Placeholders (dynamic — used as `Enter ${label}`)
    regEnter: 'Enter',

    // Field validation messages
    regSelectAtLeastOne: 'Please select at least one',
    regPleaseEnter: 'Please enter',
    regInvalidPin: 'Please enter a valid 6-digit pincode in',
    regInvalidEmail: 'Please enter a valid email address.',
    regInvalidPhone:
      'Please enter a valid 10-digit Indian mobile number.',
    regPwdShort: 'Password must contain at least 8 characters.',
    regPwdUpper:
      'Password must contain at least one uppercase letter.',
    regPwdLower:
      'Password must contain at least one lowercase letter.',
    regPwdNumber: 'Password must contain at least one number.',
    regPwdMismatch: 'Passwords do not match.',
    regInvalidExp: 'Experience must be between 0 and 100 years.',
    regSelectDomain: 'Please select at least one TECHSPHERE domain.',
    regInvalidWebsite:
      'Please enter a valid website URL, e.g. https://example.com',

    // Submit messages / API errors
    regInvalidData: 'Invalid registration data',
    regFail: 'Registration failed. Please check your details.',
    regSuccessApi:
      'Registration successful. Please verify your email.',

        // ================= Home page =================
    homeHeroLabel: '⚡ Industrial B2B Techsphere Network',
    homeHeroTitle: 'ENVIQUO',
    homeHeroTagline: '// DIAGNOSE. MATCH. SOLUTION.',
    homeHeroDesc:
      'We connect genuine industrial requirements with qualified engineering, EPC, and technology service providers through a structured and transparent technical matching platform.',

    homeCoreVerticals: 'Core Verticals',
    homeTechParams: 'Technical Parameters',
    homeResponseWindow: 'Active Response Window',

    homePlatformFlow: 'Platform Flow',
    homePlatformSecurityMsg:
      'Contact details remain masked until mutual acceptance.',

    homeStrictMasking: 'Strict Masking',
    homeZeroSpam: 'Zero Vendor Spam',
    homeTimerTitle: '10 Days Timer',
    homeTimerSub: '240-Hour Response Window',

    // About
    homeAboutLabel: 'ABOUT US',
    homeAboutTitle: 'Who We Are',
   
    homeAboutDesc:
      'ENVIQUO is an industrial B2B platform designed to connect genuine project requirements with relevant engineering, EPC, and technology specialists. We structure requirements, technical information, and matching workflows to make industrial project discovery simpler and more organized.',
  

    // Domain names on home
    homeDomainWater: 'WATER AND WASTEWATER',
    homeDomainSolid: 'SOLID AND HAZARDOUS WASTE',
    homeDomainSolar: 'SOLAR AND RENEWABLES',
    homeDomainCarbon: 'CARBON AND ESG',
    homeDomainAir:
      'AIR POLLUTION & ENVIRONMENTAL LEGAL SERVICES',

    // Vision / Mission
    homePurposeLabel: 'OUR PURPOSE',
    homeVisionMission: 'VISION & MISSION',
    homeVisionLabel: 'Our Vision',
    homeVisionTitle: 'Building a Trusted Industrial Ecosystem',
    homeVisionDesc:
      'To create a trusted engineering ecosystem where genuine industrial requirements can be connected with qualified technical and technology service providers.',

    homeMissionLabel: 'Our Mission',
    homeMissionTitle: 'Simplifying Industrial Project Connections',
    homeMissionDesc:
      'To simplify requirement discovery, technical matching, and quotation workflows through structured information, verified participants, and mutual-consent processes.',

    // Trusted network
    homeNetworkLabel: 'Our Network',
    homeNetworkTitle: 'Trusted Industrial Network',
    homeNetworkDesc:
    'Connecting verified industrial buyers with approved engineering and EPC service providers through the ENVIQUO network.',

  homeTechNetworkKicker: 'Technical Network',
    homeApprovedEPC: 'Approved EPC Providers',
    homeNoVendors: 'No Approved Vendors Yet.',
   
    homeVerifiedProviders:
  'Verified ENVIQUO Service Providers',

    homeTrustedNetworkKicker: 'Trusted Network',
    homeVerifiedBuyers: 'Verified Industrial Buyers',
    homeNoBuyers: 'No Verified Buyers Yet.',
    homeVerifiedBusinesses: 'Verified Industrial Businesses',

    // Platform benefits
    homeWhyLabel: 'Why ENVIQUO?',
    homeWhyTitle: 'Smarter Connections For',
    homeWhyTitleHighlight: ' Industrial Projects',
    homeWhyDesc:
      'A structured B2B platform designed to connect genuine industrial requirements with relevant engineering, EPC, and technology solution providers.',

    homeBenefit1Title: 'Verified Vendor Matching',
    homeBenefit1Desc:
      'Connect your requirements with relevant and approved engineering, EPC, and technology solution providers.',

    homeBenefit2Title: 'Structured Technical Requirements',
    homeBenefit2Desc:
      'Capture project details, technical parameters, and business requirements in a structured format.',

    homeBenefit3Title: 'Faster Project Connections',
    homeBenefit3Desc:
      'Reduce manual vendor discovery and connect with relevant solution providers through technical matching.',

    homeBenefit4Title: 'Industrial & EPC Expertise',
    homeBenefit4Desc:
      'Access service providers across water, waste, renewable energy, carbon, ESG, and environmental engineering domains.',

    homeBenefit5Title: 'Mutual-Consent Communication',
    homeBenefit5Desc:
      'Contact information remains protected until both parties accept the opportunity and complete the handshake.',

    homeBenefit6Title: 'Trusted B2B Network',
    homeBenefit6Desc:
      'Build connections between verified industrial buyers and approved technical service providers.',

    // Contact
    homeContactLabel: 'Contact Us',
    homeContactTitle: 'Have an Industrial Requirement?',
    homeContactDesc:
      'Tell us about your requirement. Our platform is designed to structure your enquiry and connect it with relevant technical service providers.',

    homeDirectContact: 'Direct Contact',
    homeContactOurTeam: 'Contact our team',
    homeEmailLabel: 'Email',
    homePhoneLabel: 'Phone',

    homeContactPoint1: 'Share your requirement',
    homeContactPoint2: 'Technical Information',
    homeContactPoint3: 'Connect with relevant specialists',

    homeSendEnquiry: 'Send an Enquiry',
    homeSendEnquiryDesc:
      'Fill in your details and our team will get back to you.',

    homeFormName: 'Name',
    homeFormMobile: 'Mobile Number',
    homeFormEmail: 'Email ID',
    homeFormMessage: 'Tell us about your requirement...',
    homeFormSend: 'SEND ENQUIRY',
    homeFormSending: 'SENDING...',

    homeContactFillAll: 'Please fill in all fields.',
    homeContactSuccess:
      'Your enquiry has been sent successfully.',
    homeContactFail:
      'Unable to send enquiry. Please try again.',

    homeFlow1: 'Buyer Requirement',
    homeFlow2: 'Technical Dossier',
    homeFlow3: 'Verified Vendor Match',
    homeFlow4: 'Quotation',
    homeFlow5: 'Mutual Handshake',

        // ================= Chatbot page =================
    cbHeaderTitle: 'ENVIQUO Assistant',
    cbHeaderSub: 'ENVIQUO · Platform Support',
    cbBack: 'Back',
    cbOnline: 'Online',
    cbClear: 'Clear chat',

    cbWelcomeMsg:
       'Hello 👋 Welcome to ENVIQUO Assistant.\n\nAsk about ENVIQUO, buyer/vendor registration, vendor matching, or the project workflow.',
    cbClearedMsg:
      'Chat cleared. How can I help you with ENVIQUO?',

    cbYou: 'You',
    cbAssistant: 'Assistant',

    cbInputPlaceholder:
      'Ask about ENVIQUO, registration, matching…',
    cbSendTitle: 'Send message',
    cbInputHint:
      'Press Enter to send · Shift + Enter for new line',

    cbErrorReply:
      '⚠️ Sorry, I am unable to connect to the AI service right now. Please make sure the ENVIQUO backend is running.',
    cbApiFail: 'Unable to get response from AI.',
    cbEmptyAnswer: 'Sorry, I could not generate an answer.',

    // Chatbot suggestion labels
    cbSuggWater: 'Water & Wastewater Treatment',
    cbSuggSolid: 'Solid & Hazardous Waste',
    cbSuggSolar: 'Solar & Renewables',
    cbSuggCarbon: 'Carbon & ESG',
    cbSuggAir: 'Air Pollution & Environmental Legal Services',
    


  },

  hi: {
    // ================= Navbar =================
    Home: 'होम',
    Domain: 'डोमेन',
    'About Us': 'हमारे बारे में',
    'Contact Us': 'संपर्क करें',
    Login: 'लॉग इन',
    'Register as Buyer': 'खरीदार बनने के लिए निवेदन करें',
    'Register as Vendor': 'विक्रेता बनने के लिए निवेदन करें',
    Dashboard: 'डैशबोर्ड',
    Logout: 'लॉग आउट',

    // ================= Footer =================
    footerPlatform: 'प्लेटफ़ॉर्म',
    footerJoinNetwork: 'नेटवर्क से जुड़ें',
    footerContact: 'संपर्क',
    footerContactLink: 'संपर्क',
    footerTagline: 'निदान. मिलान. समाधान.',
    footerCountry: 'भारत',
    footerRights: '© 2026 Enviquo SM Pvt. Ltd..',
    footerDomains: 'जल • अपशिष्ट • सौर • ESG • SPCB',

    // ================= Domain / Solutions page =================
    ourDomainsLabel: 'हमारे डोमेन',
    domainIntroTitle: 'औद्योगिक चुनौतियों के लिए समाधान',
    domainIntroDesc:
      'ENVIQUO प्लेटफ़ॉर्म द्वारा समर्थित इंजीनियरिंग, पर्यावरणीय और CleanTech आवश्यकताओं को समझने के लिए संबंधित डोमेन चुनें।',
    startRequirement: 'आवश्यकता शुरू करें →',
    industrialRequirementLabel: 'औद्योगिक आवश्यकता',
    haveCleanTechRequirement: 'क्या आपको CleanTech आवश्यकता है?',
    cleanTechRequirementDesc:
      'अपनी आवश्यकता सबमिट करें और संबंधित इंजीनियरिंग और समाधान प्रदाताओं से जुड़ें।',

    domainWater: 'जल एवं अपशिष्ट जल उपचार',
    domainSolid: 'ठोस एवं खतरनाक अपशिष्ट',
    domainSolar: 'सौर एवं नवीकरणीय ऊर्जा',
    domainCarbon: 'कार्बन एवं ESG',
    domainAir: 'वायु प्रदूषण एवं पर्यावरणीय कानूनी सेवाएँ',

    waterPoint1: 'प्राथमिक अपशिष्ट जल एवं सीवेज उपचार',
    waterPoint2: 'उच्च पुनर्प्राप्ति उन्नत जल इंजीनियरिंग',
    waterPoint3: 'जैविक एवं उन्नत झिल्ली समाधान',
    waterPoint4: 'सूक्ष्म निस्पंदन एवं पूर्व-उपचार नोड्स',
    waterPoint5: 'विशेष इलेक्ट्रोकेमिकल एवं पुनर्प्राप्ति प्रणालियाँ',

    solidPoint1: 'संग्रह एवं पूर्व-प्रसंस्करण',
    solidPoint2: 'तापीय एवं उन्नत पुनर्प्राप्ति (अपशिष्ट से ऊर्जा)',
    solidPoint3: 'जैविक उपचार (जैविक अपशिष्ट)',
    solidPoint4: 'रासायनिक एवं स्थिरीकरण उपचार',
    solidPoint5: 'विशेष पुनर्चक्रण एवं अनुपालन',

    solarPoint1: 'पूंजी दक्षता एवं ग्रिड एकीकरण',
    solarPoint2: 'तापीय उपयोगिता डी-कार्बोनाइजेशन',
    solarPoint3: 'विद्युत गुणवत्ता एवं माइक्रो-ग्रिड लचीलापन',
    solarPoint4: 'कृषि औद्योगिक लॉजिस्टिक्स एवं आपूर्ति श्रृंखलाएँ',
    solarPoint5: 'संपत्ति अनुकूलन एवं डिजिटल इंटेलिजेंस',

    carbonPoint1: 'स्कोप 1 एवं प्रत्यक्ष परिचालन कार्बन फुटप्रिंट',
    carbonPoint2: 'स्कोप 2 एवं अप्रत्यक्ष ऊर्जा ट्रैकिंग',
    carbonPoint3: 'स्कोप 3 एवं आपूर्ति श्रृंखला कमज़ोरियाँ',
    carbonPoint4: 'वैश्विक व्यापार एवं सीमा-पार अनुपालन',
    carbonPoint5: 'ESG प्रकटीकरण एवं वैश्विक रूपरेखाएँ',

    airPoint1: 'औद्योगिक वायु प्रदूषण इंजीनियरिंग (भौतिक समाधान)',
    airPoint2: 'वैधानिक SPCB सहमति एवं अनुमोदन',
    airPoint3: 'SPCB प्रवर्तन एवं मुकदमा बचाव (कानूनी सेवाएँ)',
    airPoint4: 'कारखाना अवसंरचना एवं सुरक्षा ऑडिट (साइट अनुपालन)',
    airPoint5: 'विरासत एवं आपूर्ति श्रृंखला जोखिम स्कोपिंग',

    // ================= About Us page =================
    aboutPageLabel: 'हमारे बारे में',
    aboutPageTitle: 'ENVIQUO  प्लेटफ़ॉर्म कैसे काम करता है',
    aboutPageDesc:
      'खरीदारों को संबंधित इंजीनियरिंग, EPC और CleanTech समाधान प्रदाताओं से जोड़ने वाला एक संरचित औद्योगिक वर्कफ़्लो।',

    whoWeAre: 'हम कौन हैं',
    aboutTitle:
      'औद्योगिक आवश्यकताओं और समाधानों के बीच एक संरचित संबंध।',
    aboutP1:
      'ENVIQUO एक संरचित B2B वातावरण प्रदान करता है जहाँ औद्योगिक खरीदार अपनी आवश्यकताएँ बता सकते हैं और संबंधित इंजीनियरिंग, EPC और CleanTech प्रदाता मिलान अवसरों पर प्रतिक्रिया दे सकते हैं।',
    aboutP2:
      'प्लेटफ़ॉर्म आवश्यकता सबमिशन से लेकर तकनीकी मिलान, कोटेशन और आपसी स्वीकृति तक पूरी प्रक्रिया को व्यवस्थित करता है।',

    aboutPoint1: 'संरचित औद्योगिक आवश्यकताएँ',
    aboutPoint2: 'प्रासंगिक तकनीकी मिलान',
    aboutPoint3: 'नियंत्रित कोटेशन वर्कफ़्लो',
    aboutPoint4: 'संपर्क साझा करने से पहले आपसी स्वीकृति',

    platformWorkflow: 'प्लेटफ़ॉर्म वर्कफ़्लो',
    workflowTitle: 'पूछताछ से आपसी हैंडशेक तक',
    workflowDesc: 'पूरी प्रक्रिया तीन संरचित चरणों में विभाजित है।',

    workflowStep1Title: 'खरीदार पूछताछ',
    workflowStep1Desc:
      'खरीदार पंजीकरण करता है, अनुमोदित होता है, आवश्यक डोमेन चुनता है, औद्योगिक समस्या समझाता है, प्रश्नावली पूरी करता है और तकनीकी आवश्यकता सबमिट करता है।',
    workflowStep2Title: 'विक्रेता मिलान एवं कोटेशन',
    workflowStep2Desc:
      'अनुमोदित विक्रेता प्रासंगिक मिलान पूछताछ प्राप्त करते हैं, मास्क्ड तकनीकी दस्तावेज़ की समीक्षा करते हैं और अपना कोटेशन या तकनीकी प्रस्ताव सबमिट करते हैं।',
    workflowStep3Title: 'दो-तरफ़ा हैंडशेक',
    workflowStep3Desc:
      'खरीदार कोटेशन की समीक्षा करता है और स्वीकार करता है। विक्रेता भी स्वीकृति की पुष्टि करता है। आपसी स्वीकृति के बाद संपर्क विवरण अनलॉक होते हैं और परियोजना आगे बढ़ सकती है।',

    strictMasking: 'सख्त मास्किंग',
    strictMaskingDesc:
      'आपसी स्वीकृति तक संपर्क विवरण सुरक्षित रहते हैं।',
    responseWindow: '10 दिन की प्रतिक्रिया अवधि',
    responseWindowDesc:
      'मिलान अवसर निर्धारित प्रतिक्रिया अवधि के भीतर संचालित होते हैं।',

    getStartedLabel: 'शुरू करें',
    readyToParticipate: 'क्या आप नेटवर्क में भाग लेने के लिए तैयार हैं?',
    readyToParticipateDesc:
      'औद्योगिक खरीदार या इंजीनियरिंग और CleanTech समाधान प्रदाता के रूप में जुड़ें।',

    // ================= Login page =================
    loginBrandName: 'ENVIQUO',
    // loginBrandSub: 'इंजीनियरिंग समाधान',
    backBtn: 'वापस',
    secureAccessLabel: 'सुरक्षित पहुँच',
    welcomeBack: 'वापसी पर स्वागत है',
    signInSub: 'अपने डैशबोर्ड तक पहुँचने के लिए साइन इन करें।',

    emailLabel: 'ईमेल',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',

    showPassword: 'पासवर्ड दिखाएँ',
    hidePassword: 'पासवर्ड छिपाएँ',

    captchaLabel: 'कैप्चा सत्यापन',
    captchaPlaceholder: 'कोड दर्ज करें',
    captchaRefresh: 'कैप्चा रीफ़्रेश करें',
    captchaEmptyErr: 'कृपया कैप्चा कोड दर्ज करें।',
    captchaWrongErr: 'गलत कैप्चा। कृपया पुनः प्रयास करें।',

    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginBtn: 'लॉग इन',
    signingIn: 'साइन इन हो रहा है...',
    newToPlatform: 'ENVIQUO पर नए हैं?',
    createAccount: 'खाता बनाएं',
    secureNote:
      '🔒 आपकी जानकारी सुरक्षित है और सुरक्षित रूप से संसाधित की जाती है।',
    demoAdminLabel: 'डेमो एडमिन',

    unknownRoleErr: 'अज्ञात उपयोगकर्ता भूमिका।',
    loginFailErr: 'लॉगिन विफल। कृपया पुनः प्रयास करें।',
    invalidRequestErr: 'अमान्य अनुरोध',

    // Register choice modal
    joinNetworkLabel: 'नेटवर्क से जुड़ें',
    createYourAccount: 'अपना खाता बनाएं',
    chooseRegister: 'चुनें कि आप कैसे पंजीकरण करना चाहते हैं',
    registerAsBuyer: 'खरीदार के रूप में पंजीकरण करें',
    registerAsBuyerSub: 'औद्योगिक आवश्यकताएँ पोस्ट करें',
    registerAsVendor: 'विक्रेता के रूप में पंजीकरण करें',
    registerAsVendorSub: 'EPC और CleanTech समाधान प्रदान करें',

    // Forgot password modal
    forgotTitle: 'पासवर्ड भूल गए?',
    forgotDesc:
      'अपना पंजीकृत ईमेल पता दर्ज करें और हम आपको एक सुरक्षित पासवर्ड रीसेट लिंक भेजेंगे।',
    forgotCancel: 'रद्द करें',
    forgotSend: 'रीसेट लिंक भेजें',
    forgotSending: 'भेजा जा रहा है...',
    forgotEmptyErr: 'कृपया अपना ईमेल पता दर्ज करें।',
    forgotSuccessMsg:
      'यदि यह ईमेल पंजीकृत है, तो पासवर्ड रीसेट लिंक भेजा गया है।',
    forgotFailMsg: 'पासवर्ड रीसेट ईमेल भेजने में असमर्थ।',

        // ================= Verify Email page =================
    veBrandName: 'ENVIQUO',
    veBack: 'वापस',

    veKicker: 'ईमेल सत्यापन',
    veTitle: 'अपना इनबॉक्स देखें',
    veSubtitle: 'हमने आपके ईमेल पर 6 अंकों का सत्यापन कोड भेजा है।',

    veEmailLabel: 'ईमेल पता',
    veEmailPlaceholder: 'you@company.com',

    veOtpLabel: 'सत्यापन कोड',
    veOtpHint: 'कोड तैयार है',
    veOtpDigits: 'अंक', // used like → `${code.length}/6 अंक`

    veResendOtp: 'OTP पुनः भेजें',
    veResendIn: 'OTP पुनः भेजें',
    veSendingOtp: 'OTP भेजा जा रहा है...',

    veVerifyBtn: 'सत्यापित करें और जारी रखें',
    veVerifying: 'सत्यापित हो रहा है...',

    veWrongEmail: 'गलत ईमेल?',
    veRegisterAgain: 'पुनः पंजीकरण करें',
    veSecureNote:
      '🔒 आपकी जानकारी सुरक्षित है और सुरक्षित रूप से संसाधित की जाती है।',

    // Verify Email — errors & messages
    veEmailRequiredErr: 'कृपया अपना ईमेल पता दर्ज करें।',
    veOtpIncompleteErr: 'कृपया पूरा 6 अंकों का OTP दर्ज करें।',
    veVerifiedSuccess:
      'ईमेल सफलतापूर्वक सत्यापित हुआ। डैशबोर्ड पर रीडायरेक्ट किया जा रहा है...',
    veVerifyFailErr: 'सत्यापन विफल। कृपया पुनः प्रयास करें।',
    veResendSuccess: 'आपके ईमेल पर नया OTP भेज दिया गया है।',
    veResendFailErr: 'OTP पुनः भेजने में असमर्थ। कृपया पुनः प्रयास करें।',

        // ================= Home page =================
    homeHeroLabel: '⚡ औद्योगिक B2B टेकस्फियर नेटवर्क ',
    homeHeroTitle: 'ENVIQUO',
    homeHeroTagline: '// निदान. मिलान. समाधान.',
    homeHeroDesc:
      'हम वास्तविक औद्योगिक आवश्यकताओं को योग्य इंजीनियरिंग, EPC और प्रौद्योगिकी सेवा प्रदाताओं से जोड़ते हैं, एक संरचित और पारदर्शी तकनीकी मिलान प्लेटफ़ॉर्म के माध्यम से।',

    homeCoreVerticals: 'मुख्य क्षेत्र',
    homeTechParams: 'तकनीकी पैरामीटर',
    homeResponseWindow: 'सक्रिय प्रतिक्रिया अवधि',

    homePlatformFlow: 'प्लेटफ़ॉर्म प्रवाह',
    homePlatformSecurityMsg:
      'आपसी स्वीकृति तक संपर्क विवरण मास्क्ड रहते हैं।',

    homeStrictMasking: 'सख्त मास्किंग',
    homeZeroSpam: 'शून्य विक्रेता स्पैम',
    homeTimerTitle: '10 दिन टाइमर',
    homeTimerSub: '240 घंटे की प्रतिक्रिया अवधि',

    // About
    homeAboutLabel: 'हमारे बारे में',
    homeAboutTitle: 'हम कौन हैं',
    homeAboutDesc:
      'ENVIQUO एक औद्योगिक B2B प्लेटफ़ॉर्म है जो वास्तविक परियोजना आवश्यकताओं को संबंधित इंजीनियरिंग, EPC और प्रौद्योगिकी विशेषज्ञों से जोड़ने के लिए बनाया गया है। हम औद्योगिक परियोजना खोज को सरल और अधिक व्यवस्थित बनाने के लिए आवश्यकताओं, तकनीकी जानकारी और मिलान वर्कफ़्लो को व्यवस्थित करते हैं।',
    homeStartRequirement: 'आवश्यकता शुरू करें',

    // Domain names on home
    homeDomainWater: 'जल एवं अपशिष्ट जल',
    homeDomainSolid: 'ठोस एवं खतरनाक अपशिष्ट',
    homeDomainSolar: 'सौर एवं नवीकरणीय ऊर्जा',
    homeDomainCarbon: 'कार्बन एवं ESG',
    homeDomainAir:
      'वायु प्रदूषण एवं पर्यावरणीय कानूनी सेवाएँ',

    // Vision / Mission
    homePurposeLabel: 'हमारा उद्देश्य',
    homeVisionMission: 'दृष्टि एवं मिशन',
    homeVisionLabel: 'हमारी दृष्टि',
    homeVisionTitle: 'एक विश्वसनीय औद्योगिक पारिस्थितिकी तंत्र का निर्माण',
    homeVisionDesc:
      'एक विश्वसनीय इंजीनियरिंग पारिस्थितिकी तंत्र बनाना जहाँ वास्तविक औद्योगिक आवश्यकताओं को योग्य तकनीकी और प्रौद्योगिकी सेवा प्रदाताओं से जोड़ा जा सके।',

    homeMissionLabel: 'हमारा मिशन',
    homeMissionTitle: 'औद्योगिक परियोजना संबंधों को सरल बनाना',
    homeMissionDesc:
      'संरचित जानकारी, सत्यापित प्रतिभागियों और आपसी सहमति प्रक्रियाओं के माध्यम से आवश्यकता खोज, तकनीकी मिलान और कोटेशन वर्कफ़्लो को सरल बनाना।',

    // Trusted network
    homeNetworkLabel: 'हमारा नेटवर्क',
    homeNetworkTitle: 'विश्वसनीय औद्योगिक नेटवर्क',
    homeNetworkDesc:
      'ENVIQUO नेटवर्क के माध्यम से सत्यापित औद्योगिक खरीदारों को अनुमोदित इंजीनियरिंग और EPC सेवा प्रदाताओं से जोड़ना।',

    homeTechNetworkKicker: 'तकनीकी नेटवर्क',
    homeApprovedEPC: 'अनुमोदित EPC प्रदाता',
    homeNoVendors: 'अभी तक कोई अनुमोदित विक्रेता नहीं।',
    homeVerifiedProviders:
      'सत्यापित ENVIQUO सेवा प्रदाता',

    homeTrustedNetworkKicker: 'विश्वसनीय नेटवर्क',
    homeVerifiedBuyers: 'सत्यापित औद्योगिक खरीदार',
    homeNoBuyers: 'अभी तक कोई सत्यापित खरीदार नहीं।',
    homeVerifiedBusinesses: 'सत्यापित औद्योगिक व्यवसाय',

    // Platform benefits
    homeWhyLabel: 'ENVIQUO क्यों?',
    homeWhyTitle: 'औद्योगिक परियोजनाओं के लिए',
    homeWhyTitleHighlight: ' स्मार्ट कनेक्शन',
    homeWhyDesc:
      'एक संरचित B2B प्लेटफ़ॉर्म जो वास्तविक औद्योगिक आवश्यकताओं को संबंधित इंजीनियरिंग, EPC और प्रौद्योगिकी समाधान प्रदाताओं से जोड़ने के लिए डिज़ाइन किया गया है।',

    homeBenefit1Title: 'सत्यापित विक्रेता मिलान',
    homeBenefit1Desc:
      'अपनी आवश्यकताओं को संबंधित और अनुमोदित इंजीनियरिंग, EPC और प्रौद्योगिकी समाधान प्रदाताओं से जोड़ें।',

    homeBenefit2Title: 'संरचित तकनीकी आवश्यकताएँ',
    homeBenefit2Desc:
      'परियोजना विवरण, तकनीकी पैरामीटर और व्यावसायिक आवश्यकताओं को संरचित प्रारूप में कैप्चर करें।',

    homeBenefit3Title: 'तेज़ परियोजना संबंध',
    homeBenefit3Desc:
      'मैन्युअल विक्रेता खोज को कम करें और तकनीकी मिलान के माध्यम से संबंधित समाधान प्रदाताओं से जुड़ें।',

    homeBenefit4Title: 'औद्योगिक एवं EPC विशेषज्ञता',
    homeBenefit4Desc:
      'जल, अपशिष्ट, नवीकरणीय ऊर्जा, कार्बन, ESG और पर्यावरणीय इंजीनियरिंग डोमेन में सेवा प्रदाताओं तक पहुँचें।',

    homeBenefit5Title: 'आपसी सहमति संचार',
    homeBenefit5Desc:
      'संपर्क जानकारी तब तक सुरक्षित रहती है जब तक दोनों पक्ष अवसर स्वीकार नहीं करते और हैंडशेक पूरा नहीं करते।',

    homeBenefit6Title: 'विश्वसनीय B2B नेटवर्क',
    homeBenefit6Desc:
      'सत्यापित औद्योगिक खरीदारों और अनुमोदित तकनीकी सेवा प्रदाताओं के बीच संबंध बनाएँ।',

    // Contact
    homeContactLabel: 'संपर्क करें',
    homeContactTitle: 'क्या आपको औद्योगिक आवश्यकता है?',
    homeContactDesc:
      'हमें अपनी आवश्यकता के बारे में बताएं। हमारा प्लेटफ़ॉर्म आपकी पूछताछ को संरचित करने और इसे संबंधित तकनीकी सेवा प्रदाताओं से जोड़ने के लिए डिज़ाइन किया गया है।',

    homeDirectContact: 'सीधा संपर्क',
    homeContactOurTeam: 'हमारी टीम से संपर्क करें',
    homeEmailLabel: 'ईमेल',
    homePhoneLabel: 'फ़ोन',

    homeContactPoint1: 'अपनी आवश्यकता साझा करें',
    homeContactPoint2: 'तकनीकी जानकारी',
    homeContactPoint3: 'संबंधित विशेषज्ञों से जुड़ें',

    homeSendEnquiry: 'पूछताछ भेजें',
    homeSendEnquiryDesc:
      'अपना विवरण भरें और हमारी टीम आपसे संपर्क करेगी।',

    homeFormName: 'नाम',
    homeFormMobile: 'मोबाइल नंबर',
    homeFormEmail: 'ईमेल आईडी',
    homeFormMessage: 'हमें अपनी आवश्यकता के बारे में बताएं...',
    homeFormSend: 'पूछताछ भेजें',
    homeFormSending: 'भेजा जा रहा है...',

    homeContactFillAll: 'कृपया सभी फ़ील्ड भरें।',
    homeContactSuccess:
      'आपकी पूछताछ सफलतापूर्वक भेज दी गई है।',
    homeContactFail:
      'पूछताछ भेजने में असमर्थ। कृपया पुनः प्रयास करें।',

    homeFlow1: 'खरीदार आवश्यकता',
    homeFlow2: 'तकनीकी दस्तावेज़',
    homeFlow3: 'सत्यापित विक्रेता मिलान',
    homeFlow4: 'कोटेशन',
    homeFlow5: 'आपसी हैंडशेक',

        // ================= Chatbot page =================
    cbHeaderTitle: 'ENVIQUO सहायक',
    cbHeaderSub: 'ENVIQUO Pvt Ltd · प्लेटफ़ॉर्म सहायता',
    cbBack: 'वापस',
    cbOnline: 'ऑनलाइन',
    cbClear: 'चैट साफ़ करें',

    cbWelcomeMsg:
      'नमस्ते 👋 ENVIQUO सहायक में आपका स्वागत है।\n\nENVIQUO Pvt Ltd, खरीदार/विक्रेता पंजीकरण, विक्रेता मिलान, या परियोजना वर्कफ़्लो के बारे में पूछें।',
    cbClearedMsg:
      'चैट साफ़ हो गई। मैं ENVIQUO के बारे में आपकी कैसे सहायता कर सकता हूँ?',

    cbYou: 'आप',
    cbAssistant: 'सहायक',

    cbInputPlaceholder:
      'ENVIQUO Pvt Ltd, पंजीकरण, मिलान के बारे में पूछें…',
    cbSendTitle: 'संदेश भेजें',
    cbInputHint:
      'भेजने के लिए Enter दबाएँ · नई पंक्ति के लिए Shift + Enter',

    cbErrorReply:
      '⚠️ क्षमा करें, मैं अभी AI सेवा से कनेक्ट नहीं हो पा रहा हूँ। कृपया सुनिश्चित करें कि ENVIQUO बैकएंड चल रहा है।',
    cbApiFail: 'AI से प्रतिक्रिया प्राप्त करने में असमर्थ।',
    cbEmptyAnswer: 'क्षमा करें, मैं उत्तर उत्पन्न नहीं कर सका।',

    // Chatbot suggestion labels
    cbSuggWater: 'जल एवं अपशिष्ट जल उपचार',
    cbSuggSolid: 'ठोस एवं खतरनाक अपशिष्ट',
    cbSuggSolar: 'सौर एवं नवीकरणीय ऊर्जा',
    cbSuggCarbon: 'कार्बन एवं ESG',
    cbSuggAir: 'वायु प्रदूषण एवं पर्यावरणीय कानूनी सेवाएँ',



    
    // ================= Registration page =================
    regBrandName: 'ENVIQUO',
    regBack: 'वापस',

    regBuyerKicker: 'खरीदार पंजीकरण',
    regVendorKicker: 'विक्रेता पंजीकरण',
    regBuyerTitle: 'खरीदार खाता बनाएँ',
    regVendorTitle: 'विक्रेता खाता बनाएँ',
    regSubtitle: 'शुरू करने के लिए अपनी व्यावसायिक जानकारी भरें।',

    regSection1: 'व्यावसायिक जानकारी',
    regSection2Buyer: 'खाता जानकारी',
    regSection2Vendor: 'TECHSPHERE डोमेन',
    regSection3: 'खाता जानकारी',

    regDomainDesc:
      'उन क्षेत्रों का चयन करें जिनमें आपकी कंपनी समाधान प्रदान करती है।',
    regDomainRequired: 'TECHSPHERE डोमेन',

    regSubmitBuyer: 'खरीदार खाता बनाएँ',
    regSubmitVendor: 'विक्रेता खाता बनाएँ',
    regSubmitting: 'खाता बनाया जा रहा है...',

    regAlreadyHave: 'क्या आपका पहले से खाता है?',
    regLoginHere: 'यहाँ लॉगिन करें',
    regSecureNote:
      '🔒 आपकी जानकारी सुरक्षित है और सुरक्षित रूप से संसाधित की जाती है।',

    // Success popup
    regSuccessLabel: 'पंजीकरण पूरा हुआ',
    regSuccessTitle: 'खाता सफलतापूर्वक बनाया गया!',
    regSuccessMsg: 'हमने सत्यापन ईमेल भेजा है:',
    regSuccessHint: 'आपको ईमेल सत्यापन पृष्ठ पर भेजा जा रहा है...',
    regVerifyNow: 'अभी ईमेल सत्यापित करें',

    // Buyer field labels
    regCompanyName: 'कंपनी का नाम',
    regPermanentEmail: 'स्थायी ईमेल',
    regIndustryType: 'उद्योग का प्रकार',
    regGstNumber: 'GST नंबर',
    regWebsite: 'वेबसाइट',
    regHeadOfficeContact: 'मुख्य कार्यालय का संपर्क नंबर',
    regEhsContact: 'EHS प्रमुख का संपर्क नंबर',
    regHeadOfficeAddress: 'मुख्य कार्यालय का पता',
    regPlantAddress: 'प्लांट का पता',

    // Vendor field labels
    regGeoTerritories: 'भौगोलिक क्षेत्र',
    regIndustrialVerticals: 'औद्योगिक क्षेत्र',
    regVendorType: 'विक्रेता का प्रकार',
    regExperienceYears: 'अनुभव (वर्ष)',
    regCapacity: 'क्षमता',
    regSpecialization: 'विशेषज्ञता',
    regMsmeNumber: 'MSME नंबर',
    regContactNumber: 'संपर्क नंबर',
    regDirectorEmail: 'निदेशक का ईमेल',
    regAddress: 'पता',

    // Common field labels
    regFullName: 'पूरा नाम',
    regBusinessEmail: 'व्यावसायिक ईमेल',
    regPhoneNumber: 'फोन नंबर',
    regMobileNumber: 'मोबाइल नंबर',
    regPassword: 'पासवर्ड',
    regReenterPassword: 'पासवर्ड दोबारा दर्ज करें',

    // Address parts
    addrAt: 'गाँव / क्षेत्र',
    addrSubDistrict: 'तालुका / मंडल',
    addrDistrict: 'जिला',
    addrState: 'राज्य',
    addrPincode: 'पिनकोड',

    addrAtPh: 'गाँव / क्षेत्र दर्ज करें',
    addrSubDistrictPh: 'तालुका / मंडल दर्ज करें',
    addrDistrictPh: 'जिला दर्ज करें',
    addrStatePh: 'राज्य दर्ज करें',
    addrPincodePh: '6 अंक दर्ज करें',

    addrEnterHint:
      'अगला फ़ील्ड जोड़ने के लिए जानकारी भरें और Enter दबाएँ।',

    // Multi-select helpers
    regSelectedCount: 'चयनित',
    regSelectPlaceholder: 'चुनें',
    regSearchPlaceholder: 'खोजें',
    regNoOptions: 'कोई विकल्प नहीं मिला।',
    regDone: 'पूरा',

    // Field descriptions
    regAreaOfWorkHelp:
      'उन सभी क्षेत्रों का चयन करें जहाँ आपकी कंपनी सेवाएँ प्रदान करती है।',
    regIndustrialVerticalsHelp:
      'उन सभी उद्योगों का चयन करें जिन्हें आपकी कंपनी सेवाएँ प्रदान करती है।',
    regIndustryHelp:
      'उन सभी उद्योगों का चयन करें जिन्हें आपकी कंपनी सेवाएँ प्रदान करती है।',
    regIndustryTypeHelp:
      'अपनी मुख्य व्यावसायिक श्रेणी चुनें।',

    // Dynamic placeholders
    regEnter: 'दर्ज करें',

    // Validation messages
    regSelectAtLeastOne: 'कृपया कम से कम एक विकल्प चुनें:',
    regPleaseEnter: 'कृपया दर्ज करें:',
    regInvalidPin: 'कृपया सही 6 अंकों का पिनकोड दर्ज करें:',
    regInvalidEmail: 'कृपया सही ईमेल पता दर्ज करें।',
    regInvalidPhone:
      'कृपया भारत का सही 10 अंकों का मोबाइल नंबर दर्ज करें।',
    regPwdShort: 'पासवर्ड में कम से कम 8 अक्षर होने चाहिए।',
    regPwdUpper:
      'पासवर्ड में कम से कम एक बड़ा अंग्रेज़ी अक्षर होना चाहिए।',
    regPwdLower:
      'पासवर्ड में कम से कम एक छोटा अंग्रेज़ी अक्षर होना चाहिए।',
    regPwdNumber: 'पासवर्ड में कम से कम एक अंक होना चाहिए।',
    regPwdMismatch: 'दोनों पासवर्ड मेल नहीं खाते।',
    regInvalidExp: 'अनुभव 0 से 100 वर्ष के बीच होना चाहिए।',
    regSelectDomain:
      'कृपया कम से कम एक TECHSPHERE डोमेन चुनें।',
    regInvalidWebsite:
      'कृपया सही वेबसाइट URL दर्ज करें, जैसे https://example.com',

    // Submit messages / API errors
    regInvalidData: 'पंजीकरण की जानकारी सही नहीं है।',
    regFail:
      'पंजीकरण विफल हुआ। कृपया अपनी जानकारी जाँचें।',
    regSuccessApi:
      'पंजीकरण सफल हुआ। कृपया अपना ईमेल सत्यापित करें।',


      

  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'hi' ? 'hi' : 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = (nextLanguage) => {
    const next = nextLanguage === 'hi' ? 'hi' : 'en'
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage may be unavailable
    }
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => {
    const t = (key) => {
      return translations[language][key] ?? translations.en[key] ?? key
    }
    return { language, setLanguage, t }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
