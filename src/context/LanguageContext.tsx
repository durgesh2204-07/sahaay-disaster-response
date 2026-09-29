import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  tagline: string;
  selectRoleHeading: string;
  selectRoleSubheading: string;
  role1Title: string;
  role1Desc: string;
  role1Btn: string;
  role2Title: string;
  role2Desc: string;
  role2Btn: string;
  role3Title: string;
  role3Desc: string;
  role3Btn: string;
  signInTab: string;
  registerTab: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  adminPasscodeLabel: string;
  adminPasscodePlaceholder: string;
  adminPasscodeHint: string;
  signInSubmitCitizen: string;
  signInSubmitVolunteer: string;
  signInSubmitAdmin: string;
  registerSubmitCitizen: string;
  registerSubmitVolunteer: string;
  haveAccount: string;
  noAccount: string;
  adminBadge: string;
  adminNoticeTitle: string;
  adminNoticeDesc: string;
  authorizing: string;
  authSuccess: string;
  languageName: string;
  languageLabel: string;
  [key: string]: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    tagline: '“SAHAAY — Connecting Help When Every Second Matters.”',
    selectRoleHeading: 'Select Your Access Role',
    selectRoleSubheading: 'Choose your authorized capacity to proceed to the Sahaay Emergency Response Portal.',
    role1Title: 'Citizen',
    role1Desc: 'Report emergencies, request help, find shelters and receive disaster alerts.',
    role1Btn: 'Continue as Citizen',
    role2Title: 'Volunteer',
    role2Desc: 'Respond to emergency tasks, assist citizens and manage field operations.',
    role2Btn: 'Continue as Volunteer',
    role3Title: 'Admin',
    role3Desc: 'Manage emergencies, volunteers, shelters, resources and response operations.',
    role3Btn: 'Continue as Admin',
    signInTab: 'Sign In',
    registerTab: 'Register',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Rahul Sharma',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@domain.com',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+91 98765 43210',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',
    adminPasscodeLabel: 'Admin Security Passcode',
    adminPasscodePlaceholder: 'Enter authorized admin passcode',
    adminPasscodeHint: 'Restricted to designated crisis coordinators.',
    signInSubmitCitizen: 'Sign In as Citizen',
    signInSubmitVolunteer: 'Sign In as Volunteer',
    signInSubmitAdmin: 'Authorize Admin Console',
    registerSubmitCitizen: 'Register as Citizen',
    registerSubmitVolunteer: 'Register as Volunteer',
    haveAccount: 'Already have an account? Sign In',
    noAccount: "Don't have an account? Register",
    adminBadge: 'Admin Security Verification',
    adminNoticeTitle: 'Admin Authorization Required',
    adminNoticeDesc: 'Authorized access is required to verify SOS alerts, coordinate rescue teams, and oversee shelter logistics.',
    authorizing: 'Verifying credentials...',
    authSuccess: 'Success! Loading dashboard...',
    languageName: 'English',
    languageLabel: 'Language:',
  },
  hi: {
    tagline: '“SAHAAY — आपदा के समय जब हर एक सेकंड कीमती हो, तुरंत मदद का सहारा।”',
    selectRoleHeading: 'अपनी भूमिका चुनें',
    selectRoleSubheading: 'सहाय आपदा प्रतिक्रिया पोर्टल में प्रवेश करने के लिए अपनी अधिकृत भूमिका चुनें।',
    role1Title: 'नागरिक',
    role1Desc: 'आपातकालीन सहायता मांगें, भोजन-पानी की राहत मांगें, सुरक्षित आश्रय खोजें और आपदा चेतावनी पाएं।',
    role1Btn: 'नागरिक के रूप में जारी रखें',
    role2Title: 'स्वयंसेवक',
    role2Desc: 'मैदानी बचाव कार्य, राहत वितरण, नागरिक सहायता और वास्तविक समय प्रतिक्रिया में भाग लें।',
    role2Btn: 'स्वयंसेवक के रूप में जारी रखें',
    role3Title: 'प्रशासक',
    role3Desc: 'आपदा नियंत्रण कक्ष, स्वयंसेवक प्रबंधन, आश्रय स्थल और समग्र आपातकालीन अभियानों का संचालन करें।',
    role3Btn: 'एडमिन कंसोल में जाएं',
    signInTab: 'साइन इन / लॉगिन',
    registerTab: 'नया पंजीकरण',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'उदा. अमित शर्मा',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'name@domain.com',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: '+91 98765 43210',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'न्यूनतम 6 अक्षर व अंक',
    adminPasscodeLabel: 'एडमिन सुरक्षा पासकोड',
    adminPasscodePlaceholder: 'अधिकृत एडमिन पासकोड दर्ज करें',
    adminPasscodeHint: 'केवल अधिकृत जिला एवं आपदा समन्वयकों के लिए।',
    signInSubmitCitizen: 'नागरिक के रूप में लॉगिन करें',
    signInSubmitVolunteer: 'स्वयंसेवक के रूप में लॉगिन करें',
    signInSubmitAdmin: 'एडमिन कंसोल अधिकृत करें',
    registerSubmitCitizen: 'नागरिक खाता बनाएं',
    registerSubmitVolunteer: 'स्वयंसेवक खाता बनाएं',
    haveAccount: 'पहले से खाता है? लॉगिन करें',
    noAccount: 'नया खाता बनाना चाहते हैं? पंजीकरण करें',
    adminBadge: 'एडमिन सुरक्षा प्रमाणीकरण',
    adminNoticeTitle: 'एडमिन विशेषाधिकार आवश्यक',
    adminNoticeDesc: 'आपातकालीन रिपोर्टों को सत्यापित करने, स्वयंसेवकों को तैनात करने और आपदा क्षेत्रों का प्रबंधन करने के लिए पासकोड आवश्यक है।',
    authorizing: 'प्रमाणीकरण की जांच हो रही है...',
    authSuccess: 'सफल! डैशबोर्ड खोला जा रहा है...',
    languageName: 'हिंदी',
    languageLabel: 'भाषा:',
  },
  mr: {
    tagline: '“SAHAAY — आपत्कालीन प्रसंगी प्रत्येक सेकंद महत्त्वाचा असतो तेव्हा मदतीचा हात.”',
    selectRoleHeading: 'आपली भूमिका निवडा',
    selectRoleSubheading: 'सहाया आपत्ती प्रतिसाद पोर्टलवर पुढे जाण्यासाठी आपली अधिकृत भूमिका निवडा.',
    role1Title: 'नागरिक',
    role1Desc: 'तातडीची मदत मागा, अन्न-पाणी-औषधांची विनंती करा, सुरक्षित निवारे शोधा आणि आपत्ती अलर्ट मिळवा.',
    role1Btn: 'नागरिक म्हणून पुढे जा',
    role2Title: 'स्वयंसेवक',
    role2Desc: 'फील्ड बचाव कार्य, मदत समन्वय, सामग्री वाटप आणि आपत्ती निवारण पथकात सामील व्हा.',
    role2Btn: 'स्वयंसेवक म्हणून पुढे जा',
    role3Title: 'प्रशासक',
    role3Desc: 'आपत्कालीन प्रतिसाद, स्वयंसेवक वाटप, निवारा व्यवस्थापन आणि नियंत्रण कक्ष संचालन करा.',
    role3Btn: 'प्रशासक कन्सोल उघडा',
    signInTab: 'साइन इन / लॉगिन',
    registerTab: 'नवीन नोंदणी',
    nameLabel: 'पूर्ण नाव',
    namePlaceholder: 'उदा. राजेश पाटील',
    emailLabel: 'ईमेल पत्ता',
    emailPlaceholder: 'name@domain.com',
    phoneLabel: 'मोबाईल नंबर',
    phonePlaceholder: '+91 98765 43210',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'किमान ६ अक्षरे व अंक',
    adminPasscodeLabel: 'प्रशासक सुरक्षा पासकोड',
    adminPasscodePlaceholder: 'अधिकृत प्रशासक पासकोड टाका',
    adminPasscodeHint: 'केवळ अधिकृत जिल्हा व आपत्कालीन समन्वयकांसाठी.',
    signInSubmitCitizen: 'नागरिक म्हणून लॉगिन करा',
    signInSubmitVolunteer: 'स्वयंसेवक म्हणून लॉगिन करा',
    signInSubmitAdmin: 'प्रशासक कन्सोल अधिकृत करा',
    registerSubmitCitizen: 'नागरिक खाते तयार करा',
    registerSubmitVolunteer: 'स्वयंसेवक खाते तयार करा',
    haveAccount: 'आधीच खाते आहे? लॉगिन करा',
    noAccount: 'नवीन खाते तयार करायचे आहे? नोंदणी करा',
    adminBadge: 'प्रशासक सुरक्षा प्रमाणीकरण',
    adminNoticeTitle: 'प्रशासक अधिकृतता आवश्यक',
    adminNoticeDesc: 'आपत्कालीन अहवाल तपासण्यासाठी, मदत पथके पाठवण्यासाठी आणि नियंत्रण कक्ष चालवण्यासाठी योग्य पासकोड आवश्यक आहे.',
    authorizing: 'प्रमाणीकरण तपासत आहे...',
    authSuccess: 'यशस्वी! डॅशबोर्डवर नेले जात आहे...',
    languageName: 'मराठी',
    languageLabel: 'भाषा:',
  },
};

export const UI_DICTIONARY: Record<string, { hi: string; mr: string }> = {
  // Navigation & General
  'Home': { hi: 'होम', mr: 'मुख्यपृष्ठ' },
  'Citizen Hub': { hi: 'नागरिक केंद्र', mr: 'नागरिक केंद्र' },
  'Volunteer Hub': { hi: 'स्वयंसेवक केंद्र', mr: 'स्वयंसेवक केंद्र' },
  'Admin Portal': { hi: 'प्रशासक पोर्टल', mr: 'प्रशासक पोर्टल' },
  'Admin Console': { hi: 'प्रशासक कन्सोल', mr: 'प्रशासक कन्सोल' },
  'Emergency SOS': { hi: 'आपातकालीन एसओएस (SOS)', mr: 'तातडीची मदत (SOS)' },
  'Relief Map': { hi: 'राहत मानचित्र', mr: 'मदत व बचाव नकाशा' },
  'Register Shelter': { hi: 'आश्रय स्थल पंजीकरण', mr: 'सुरक्षित निवारा नोंदणी' },
  'Request Help': { hi: 'सहायता अनुरोध', mr: 'मदत मागा' },
  'Helplines': { hi: 'हेल्पलाइन नंबर', mr: 'तातडीचे हेल्पलाइन' },
  'Emergency Contacts': { hi: 'आपातकालीन संपर्क', mr: 'तातडीचे संपर्क' },
  'Status': { hi: 'स्थिति ट्रैकर', mr: 'थेट स्थिती' },
  'Weather & Risk': { hi: 'मौसम व जोखिम', mr: 'हवामान व धोका अंदाज' },
  'CAP Alerts': { hi: 'सीएपी अलर्ट', mr: 'आपत्ती अलर्ट (CAP)' },
  'Preparedness': { hi: 'आपदा पूर्वतयारी', mr: 'आपत्ती पूर्वतयारी' },
  'Recovery': { hi: 'पुनर्वास व साहाय्य', mr: 'पुनर्वसन व साहाय्य' },
  'Conclusion': { hi: 'निष्कर्ष व प्रभाव', mr: 'निष्कर्ष व प्रभाव' },
  'Impact': { hi: 'प्रभाव विश्लेषण', mr: 'प्रभाव विश्लेषण' },
  'Sign Out': { hi: 'लॉग आउट', mr: 'लॉग आउट' },
  'Log Out': { hi: 'लॉग आउट', mr: 'लॉग आउट' },
  'Logout': { hi: 'लॉग आउट', mr: 'लॉग आउट' },
  'Switch to Citizen': { hi: 'नागरिक मोड पर जाएं', mr: 'नागरिक मोड निवडा' },
  'Switch to Volunteer': { hi: 'स्वयंसेवक मोड पर जाएं', mr: 'स्वयंसेवक मोड निवडा' },
  'Switch to Admin': { hi: 'प्रशासक मोड पर जाएं', mr: 'प्रशासक मोड निवडा' },
  'Citizen': { hi: 'नागरिक', mr: 'नागरिक' },
  'Volunteer': { hi: 'स्वयंसेवक', mr: 'स्वयंसेवक' },
  'Administrator': { hi: 'प्रशासक', mr: 'प्रशासक' },
  'Admin': { hi: 'प्रशासक', mr: 'प्रशासक' },
  'Language': { hi: 'भाषा', mr: 'भाषा' },
  'Language:': { hi: 'भाषा:', mr: 'भाषा:' },
  'Online': { hi: 'ऑनलाइन', mr: 'ऑनलाइन' },
  'Offline': { hi: 'ऑफलाइन', mr: 'ऑफलाइन' },
  'Go Online': { hi: 'ऑनलाइन जाएं', mr: 'ऑनलाइन व्हा' },
  'Back': { hi: 'वापस जाएं', mr: 'मागे जा' },
  'Save': { hi: 'सुरक्षित करें', mr: 'जतन करा' },
  'Cancel': { hi: 'रद्द करें', mr: 'रद्द करा' },
  'Submit': { hi: 'जमा करें', mr: 'सादर करा' },
  'Search': { hi: 'खोजें', mr: 'शोधा' },
  'Filter': { hi: 'फ़िल्टर', mr: 'फिल्टर' },
  'Close': { hi: 'बंद करें', mr: 'बंद करा' },
  'Call': { hi: 'कॉल करें', mr: 'कॉल करा' },
  'Notifications': { hi: 'सूचनाएं', mr: 'सूचना' },
  'Clear All': { hi: 'सभी हटाएं', mr: 'सर्व पुसा' },
  'Dashboard': { hi: 'डैशबोर्ड', mr: 'डॅशबोर्ड' },
  'Live Map': { hi: 'लाइव नक्शा', mr: 'थेट नकाशा' },
  'Status & Incidents': { hi: 'स्थिति व घटनाएं', mr: 'स्थिती व घटना' },
  'Weather Intelligence': { hi: 'मौसम विश्लेषण', mr: 'हवामान माहिती' },
  'Alert Protocol (CAP)': { hi: 'अलर्ट प्रोटोकॉल (CAP)', mr: 'इशारा नियमावली (CAP)' },
  'Reports': { hi: 'आपदा रिपोर्ट', mr: 'आपत्ती अहवाल' },
  'Shelters': { hi: 'सुरक्षित निवारे', mr: 'सुरक्षित निवारे' },
  'Emergency Directory': { hi: 'आपातकालीन निर्देशिका', mr: 'आपत्कालीन डिरेक्टरी' },
  'Navigation': { hi: 'नेविगेशन', mr: 'नेव्हिगेशन' },

  // Citizen Hub & Emergency SOS
  'REPORT EMERGENCY': { hi: 'आपातकालीन सूचना दें (SOS)', mr: 'तातडीची मदत मागा (SOS)' },
  'Report Emergency': { hi: 'आपातकालीन सूचना दें', mr: 'तातडीची मदत नोंदवा' },
  'EMERGENCY SOS REPORT': { hi: 'आपातकालीन एसओएस रिपोर्ट', mr: 'तातडीचा एसओएस अहवाल' },
  'Report an Emergency': { hi: 'आपातकालीन घटना दर्ज करें', mr: 'तातडीची घटना नोंदवा' },
  'Emergency SOS Incident Report': { hi: 'आपातकालीन एसओएस घटना रिपोर्ट', mr: 'तातडीचा एसओएस आपत्ती अहवाल' },
  'Verified Response': { hi: 'सत्यापित प्रतिक्रिया', mr: 'प्रमाणित प्रतिसाद' },
  'Under 5 Min Dispatch': { hi: '५ मिनट में तैनाती', mr: '५ मिनिटांत मदत पथक' },
  'Disaster Services & Resources': { hi: 'आपदा सेवाएं एवं संसाधन', mr: 'आपत्ती सेवा व साधनसामग्री' },
  'Disaster Guides': { hi: 'आपदा निर्देशिका', mr: 'आपत्ती पूर्वतयारी मार्गदर्शक' },
  'Shelter Booking': { hi: 'आश्रय बुकिंग', mr: 'निवारा आरक्षण' },
  'Request Relief': { hi: 'राहत सामग्री अनुरोध', mr: 'मदत सामग्री मागणी' },
  'Live Status Tracker': { hi: 'लाइव स्थिति ट्रैकर', mr: 'थेट स्थिती ट्रॅकर' },
  'Relief & Danger Map': { hi: 'राहत व खतरा मानचित्र', mr: 'मदत व धोका नकाशा' },
  'Community Emergency Updates': { hi: 'सामुदायिक आपदा अपडेट्स', mr: 'थेट आपत्कालीन अपडेट्स' },
  'Active Warnings in Your Area': { hi: 'आपके क्षेत्र में सक्रिय चेतावनियां', mr: 'आपल्या परिसरातील सक्रिय इशारे' },
  'All Systems Normal': { hi: 'सभी प्रणालियां सामान्य हैं', mr: 'सर्व यंत्रणा सामान्य आहेत' },
  'Emergency Category': { hi: 'आपातकाल प्रकार', mr: 'आपत्तीचा प्रकार' },
  'Severity Level': { hi: 'गंभीरता स्तर', mr: 'गंभीरता पातळी' },
  'Location Address': { hi: 'घटना स्थल का पता', mr: 'घटनास्थळाचा पत्ता' },
  'Incident Description': { hi: 'घटना का विवरण', mr: 'घटनेचे सविस्तर वर्णन' },
  'Photo Evidence': { hi: 'फोटो / प्रमाण', mr: 'फोटो / पुरावा' },
  'Submit Emergency SOS': { hi: 'आपातकालीन एसओएस भेजें', mr: 'तातडीची मदत विनंती (SOS) पाठवा' },
  'Flood': { hi: 'बाढ़ (Flood)', mr: 'पूर (Flood)' },
  'Fire': { hi: 'आग (Fire)', mr: 'आग (Fire)' },
  'Earthquake': { hi: 'भूकंप (Earthquake)', mr: 'भूकंप (Earthquake)' },
  'Landslide': { hi: 'भूस्खलन (Landslide)', mr: 'दरड कोसळणे (Landslide)' },
  'Medical Emergency': { hi: 'चिकित्सा आपातकाल', mr: 'वैद्यकीय आणीबाणी' },
  'Building Collapse': { hi: 'इमारत ढहना', mr: 'इमारत कोसळणे' },
  'Cyclone': { hi: 'चक्रवात (Cyclone)', mr: 'चक्रीवादळ (Cyclone)' },
  'CRITICAL': { hi: '🔴 अतिगंभीर (Critical)', mr: '🔴 अतिगंभीर (Critical)' },
  'HIGH': { hi: '🟠 उच्च (High)', mr: '🟠 उच्च (High)' },
  'MEDIUM': { hi: '🟡 मध्यम (Medium)', mr: '🟡 मध्यम (Medium)' },
  'LOW': { hi: '🟢 सामान्य (Low)', mr: '🟢 सामान्य (Low)' },

  // Volunteer Hub
  'ACTIVE VOLUNTEER PERSONA': { hi: 'सक्रिय स्वयंसेवक प्रोफाइल', mr: 'सक्रिय स्वयंसेवक प्रोफाइल' },
  'Live Citizen Emergencies & Requests': { hi: 'लाइव नागरिक आपातकाल एवं सहायता अनुरोध', mr: 'नागरिकांच्या थेट आपत्कालीन तक्रारी व मागण्या' },
  'My Active Tasks': { hi: 'मेरे सक्रिय कार्य', mr: 'माझी सक्रिय कामे' },
  'Volunteer Directory': { hi: 'स्वयंसेवक निर्देशिका', mr: 'स्वयंसेवक यादी' },
  'My Profile & Skills': { hi: 'मेरी प्रोफाइल व कौशल्य', mr: 'माझे प्रोफाईल व कौशल्ये' },
  'Citizen Emergency SOS Reports (Direct from Citizen Hub)': { hi: 'नागरिक आपातकालीन एसओएस (सिटिज़न हब से सीधे)', mr: 'नागरिक तातडीच्या एसओएस तक्रारी (थेट सिटिझन हबमधून)' },
  'All Incidents': { hi: 'सभी घटनाएं', mr: 'सर्व घटना' },
  'Citizen Emergencies': { hi: 'नागरिक आपातकाल', mr: 'नागरिकांच्या आपत्कालीन तक्रारी' },
  'Community Relief Needs': { hi: 'राहत सामग्री आवश्यकताएं', mr: 'मदत व साहित्याची गरज' },
  'I CAN HELP / RESPOND': { hi: '🚑 मैं मदद कर सकता हूँ / प्रतिक्रिया दें', mr: '🚑 मी मदत करू शकतो / प्रतिसाद द्या' },
  'Start Response': { hi: 'राहत कार्य शुरू करें', mr: 'मदत कार्य सुरू करा' },
  'Mark Problem Solved / Completed': { hi: 'समस्या हल हुई / कार्य पूर्ण', mr: 'समस्या सुटली / काम पूर्ण' },
  'Available for Rescue': { hi: 'बचाव कार्य के लिए उपलब्ध', mr: 'बचाव कार्यासाठी उपलब्ध' },
  'On Active Mission': { hi: 'सक्रिय अभियान पर', mr: 'सक्रिय मोहिमेवर' },
  'Standby / Rest': { hi: 'विश्राम / स्टैंडबाय', mr: 'विश्रांती / राखीव' },

  // Admin Command Center & Problem Status
  'District Disaster Operations Command Center': { hi: 'जिला आपदा संचालन नियंत्रण केंद्र', mr: 'जिल्हा आपत्ती नियंत्रण कक्ष' },
  'Integrated Crisis Response Authority': { hi: 'एकीकृत संकट प्रतिक्रिया प्राधिकरण', mr: 'एकीकृत आपत्ती व्यवस्थापन प्राधिकरण' },
  'ACTIVE ALERTS': { hi: 'सक्रिय अलर्ट', mr: 'सक्रिय इशारे' },
  'CRITICAL REPORTS': { hi: 'अतिगंभीर रिपोर्ट', mr: 'अतिगंभीर अहवाल' },
  'ACTIVE VOLUNTEERS': { hi: 'सक्रिय स्वयंसेवक', mr: 'सक्रिय स्वयंसेवक' },
  'OPEN REQUESTS': { hi: 'खुले अनुरोध', mr: 'प्रलंबित मागण्या' },
  'OPEN SHELTERS': { hi: 'खुले आश्रय स्थल', mr: 'सुरू असलेले निवारे' },
  'RESOURCE WARNINGS': { hi: 'सामग्री चेतावनी', mr: 'साठा चेतावणी' },
  'ALL CITIZEN EMERGENCIES': { hi: 'सभी नागरिक आपातकाल', mr: 'सर्व नागरिक आपत्कालीन तक्रारी' },
  'PROBLEM SOLVED': { hi: '✅ समस्या हल हो गई', mr: '✅ समस्या सुटली' },
  'HANDLED BY VOLUNTEER': { hi: '🟠 स्वयंसेवक द्वारा संभाला गया', mr: '🟠 स्वयंसेवकामार्फत मदत सुरू' },
  'AWAITING VOLUNTEER': { hi: '🔴 स्वयंसेवक की प्रतीक्षा', mr: '🔴 स्वयंसेवकाची प्रतीक्षा' },
  'Citizen Emergency Resolution & Volunteer Dispatch Oversight': { hi: 'नागरिक आपातकाल समाधान एवं स्वयंसेवक तैनाती निगरानी', mr: 'नागरिक आपत्ती निवारण व स्वयंसेवक मदत पथक नियंत्रण' },
  'PROBLEM STATUS': { hi: 'समस्या स्थिति', mr: 'समस्येची स्थिती' },
  'SOLVED': { hi: 'हल हो गई (Solved)', mr: 'सुटली (Solved)' },
  'NOT SOLVED': { hi: 'हल नहीं हुई (Not Solved)', mr: 'सुटलेली नाही (Not Solved)' },
  'VERIFIED RESOLVED': { hi: 'सत्यापित समाधान', mr: 'प्रमाणित निवारण' },
  'MARK AS SOLVED': { hi: 'हल चिह्नित करें', mr: 'समस्या सुटली म्हणून नोंदवा' },
  'REOPEN EMERGENCY': { hi: 'आपातकाल पुनः खोलें', mr: 'पुन्हा उघडा' },
  'OFFICIALLY VERIFY': { hi: 'आधिकारिक सत्यापन करें', mr: 'अधिकृत प्रमाणीकरण करा' },
  'Incident Reports Management & Dispatch Board': { hi: 'आपदा रिपोर्ट प्रबंधन एवं तैनाती बोर्ड', mr: 'आपत्ती अहवाल व्यवस्थापन व मदत वाटप' },
  'Dispatch Volunteer to this Incident...': { hi: 'इस घटना के लिए स्वयंसेवक तैनात करें...', mr: 'या घटनेसाठी स्वयंसेवक पाठवा...' },
  'Unassign / Reassign': { hi: 'हटाएं / पुनः तैनात करें', mr: 'बदला / पुन्हा नेमा' },
  'Call Volunteer': { hi: 'स्वयंसेवक को कॉल करें', mr: 'स्वयंसेवकाला कॉल करा' },
  'Handled by:': { hi: 'द्वारा संभाला गया:', mr: 'यांच्यामार्फत मदत सुरू:' },
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations & ((keyOrText: string, fallback?: string) => string);
  translate: (text: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'SAHAAY_APP_LANG';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi' || saved === 'mr') {
        return saved as Language;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang === 'mr' ? 'mr' : lang === 'hi' ? 'hi' : 'en';
    } catch {
      // ignore
    }
  };

  const translate = useMemo(() => {
    return (text: string, fallback?: string): string => {
      if (!text) return '';
      if (language === 'en') return fallback || text;

      // 1. Direct dictionary lookup
      if (UI_DICTIONARY[text]) {
        return UI_DICTIONARY[text][language] || fallback || text;
      }

      // 2. Trimmed lookup
      const trimmed = text.trim();
      if (UI_DICTIONARY[trimmed]) {
        return UI_DICTIONARY[trimmed][language] || fallback || text;
      }

      // 3. Translations auth lookup
      const authDict = TRANSLATIONS[language];
      if (authDict && authDict[trimmed]) {
        return authDict[trimmed];
      }

      // 4. Case-insensitive lookup
      const lower = trimmed.toLowerCase();
      for (const [key, val] of Object.entries(UI_DICTIONARY)) {
        if (key.toLowerCase() === lower) {
          return val[language];
        }
      }

      return fallback || text;
    };
  }, [language]);

  const t = useMemo(() => {
    const fn = ((keyOrText: string, fallback?: string) => {
      return translate(keyOrText, fallback);
    }) as unknown as Translations & ((keyOrText: string, fallback?: string) => string);

    // Merge static auth translations
    Object.assign(fn, TRANSLATIONS[language]);

    // Also attach UI dictionary keys
    for (const [key, val] of Object.entries(UI_DICTIONARY)) {
      if (!fn[key]) {
        fn[key] = val[language];
      }
    }

    return fn;
  }, [language, translate]);

  // Document language attribute synchronization
  useEffect(() => {
    document.documentElement.lang = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
