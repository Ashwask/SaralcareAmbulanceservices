/**
 * UI string translations.
 *
 * IMPORTANT: Hindi (hi) and Kannada (kn) strings here are *machine-generated
 * starters*. They have NOT been reviewed by a native speaker. They are
 * shipped to demonstrate the i18n scaffolding works — they MUST be reviewed
 * before they're publicly trusted, especially for emergency-context copy.
 *
 * Native speakers: open a PR with corrections. We will mark a language
 * "reviewed" only after at least one native review PR has been merged.
 *
 * Tamil (ta), Telugu (te), Marathi (mr), Bengali (bn), Malayalam (ml) are
 * stubs — we surface the language code in the switcher but fall back to
 * English until translations are contributed.
 */

export type Lang = "en" | "hi" | "kn" | "ta" | "te" | "mr" | "bn" | "ml";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  kn: "ಕನ್ನಡ",
  ta: "தமிழ்",
  te: "తెలుగు",
  mr: "मराठी",
  bn: "বাংলা",
  ml: "മലയാളം",
};

export const LANG_REVIEWED: Record<Lang, "native-reviewed" | "machine-only" | "stub"> = {
  en: "native-reviewed",
  hi: "machine-only",
  kn: "machine-only",
  ta: "stub",
  te: "stub",
  mr: "stub",
  bn: "stub",
  ml: "stub",
};

type Strings = {
  [key: string]: string;
};

export const STRINGS: Record<Lang, Strings> = {
  en: {
    "site.title": "Saralcare Ambulances",
    "nav.find": "Find",
    "nav.explore": "Explore",
    "nav.for_providers": "For providers",
    "nav.about": "About",

    "home.title": "Find an ambulance in India.",
    "home.subtitle": "Tap a number. Reach a vehicle. Government 108, private, or charitable — across the country.",
    "home.geolocate": "Use my location",
    "home.geolocate_hint": "Show ambulances near me",
    "home.pincode_label": "Or enter any Indian pincode",
    "home.pincode_placeholder": "e.g. 560076 · 400050 · 110017",
    "home.find_btn": "Find",
    "home.or": "or",
    "home.call_108_title": "Call 108 — free, 24×7",
    "home.call_108_hint": "Karnataka government EMS",
    "home.nearest_title": "Nearest providers",
    "home.saved_title": "Saved by you",
    "home.city_grid_title": "Or jump to a city",

    "tile.explore_title": "Explore the data",
    "tile.explore_sub": "Map, fares, affiliations, RTI data, freshness",
    "tile.providers_title": "For ambulance providers",
    "tile.providers_sub": "Register your service, claim or correct a listing — free",
    "tile.notice_title": "How this site works",
    "tile.notice_sub": "What we do, what we don't, your rights",

    "card.call_now": "Tap to call",
    "card.fallback_108": "If you can't reach them, dial 108.",
    "card.dead": "✗ Number didn't work",
    "card.dead_reported": "✓ Reported. We'll re-verify. Dial 108 now.",

    "footer.aggregator": "an information aggregator",
    "footer.how_works": "How this works",
    "footer.disclaimer": "Disclaimer",
    "footer.corrections": "Corrections",
    "footer.license": "License",
    "footer.freshness": "Freshness",
    "footer.changes": "Recent changes",
    "footer.open_source": "Open source",
    "footer.emergency_line": "In any medical emergency, call 108. We do not operate or dispatch ambulances. Data is CC BY-NC-SA 4.0.",

    "banner.in_emergency": "In any emergency, dial 108.",

    "lang.review_warning": "This language is machine-translated and awaiting native-speaker review. Please open a PR if you spot errors.",
  },

  hi: {
    "site.title": "सरलकेयर एम्बुलेंस",
    "nav.find": "खोजें",
    "nav.explore": "देखें",
    "nav.for_providers": "एम्बुलेंस सेवा के लिए",
    "nav.about": "परिचय",

    "home.title": "भारत में एम्बुलेंस ढूंढें।",
    "home.subtitle": "एक नंबर दबाएँ। वाहन पाएँ। सरकारी 108, निजी, या धर्मार्थ — पूरे देश में।",
    "home.geolocate": "मेरी लोकेशन का उपयोग करें",
    "home.geolocate_hint": "मेरे पास की एम्बुलेंस दिखाएँ",
    "home.pincode_label": "या कोई भारतीय पिनकोड दर्ज करें",
    "home.pincode_placeholder": "जैसे 560076 · 400050 · 110017",
    "home.find_btn": "खोजें",
    "home.or": "या",
    "home.call_108_title": "108 पर कॉल करें — मुफ़्त, 24×7",
    "home.call_108_hint": "कर्नाटक सरकार की आपातकालीन सेवा",
    "home.nearest_title": "नज़दीकी सेवाएँ",
    "home.saved_title": "आपके सहेजे गए",
    "home.city_grid_title": "या किसी शहर पर जाएँ",

    "tile.explore_title": "डेटा देखें",
    "tile.explore_sub": "नक्शा, किराया, सम्बद्धता, RTI डेटा, सत्यापन",
    "tile.providers_title": "एम्बुलेंस सेवा प्रदाताओं के लिए",
    "tile.providers_sub": "अपनी सेवा पंजीकृत करें, सूची सही करें — मुफ़्त",
    "tile.notice_title": "यह साइट कैसे काम करती है",
    "tile.notice_sub": "हम क्या करते हैं, क्या नहीं, आपके अधिकार",

    "card.call_now": "कॉल करने के लिए दबाएँ",
    "card.fallback_108": "यदि वे न उठाएँ तो 108 डायल करें।",
    "card.dead": "✗ नंबर नहीं लगा",
    "card.dead_reported": "✓ रिपोर्ट हो गई। हम पुनः सत्यापन करेंगे। अभी 108 डायल करें।",

    "footer.aggregator": "एक सूचना संग्राहक",
    "footer.how_works": "यह कैसे काम करता है",
    "footer.disclaimer": "अस्वीकरण",
    "footer.corrections": "सुधार",
    "footer.license": "लाइसेंस",
    "footer.freshness": "सत्यापन",
    "footer.changes": "हाल के परिवर्तन",
    "footer.open_source": "ओपन सोर्स",
    "footer.emergency_line": "किसी भी चिकित्सीय आपातकाल में 108 पर कॉल करें। हम एम्बुलेंस नहीं चलाते। डेटा CC BY-NC-SA 4.0 के तहत है।",

    "banner.in_emergency": "किसी भी आपात स्थिति में 108 डायल करें।",

    "lang.review_warning": "यह भाषा मशीन से अनूदित है और देशी वक्ता समीक्षा की प्रतीक्षा में है। यदि आप कोई त्रुटि देखें तो कृपया PR खोलें।",
  },

  kn: {
    "site.title": "ಸರಲ್ ಕೇರ್ ಆಂಬುಲೆನ್ಸ್",
    "nav.find": "ಹುಡುಕಿ",
    "nav.explore": "ಅನ್ವೇಷಿಸಿ",
    "nav.for_providers": "ಆಂಬುಲೆನ್ಸ್ ಸೇವೆಗಳಿಗೆ",
    "nav.about": "ಬಗ್ಗೆ",

    "home.title": "ಭಾರತದಲ್ಲಿ ಆಂಬುಲೆನ್ಸ್ ಹುಡುಕಿ.",
    "home.subtitle": "ಒಂದು ಸಂಖ್ಯೆ ಒತ್ತಿ. ವಾಹನ ತಲುಪಿ. ಸರ್ಕಾರಿ 108, ಖಾಸಗಿ, ಅಥವಾ ದಾನ — ದೇಶದಾದ್ಯಂತ.",
    "home.geolocate": "ನನ್ನ ಸ್ಥಳ ಬಳಸಿ",
    "home.geolocate_hint": "ನನ್ನ ಸಮೀಪದ ಆಂಬುಲೆನ್ಸ್‌ಗಳನ್ನು ತೋರಿಸಿ",
    "home.pincode_label": "ಅಥವಾ ಯಾವುದೇ ಭಾರತೀಯ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ",
    "home.pincode_placeholder": "ಉದಾ. 560076 · 400050 · 110017",
    "home.find_btn": "ಹುಡುಕಿ",
    "home.or": "ಅಥವಾ",
    "home.call_108_title": "108 ಗೆ ಕರೆ ಮಾಡಿ — ಉಚಿತ, 24×7",
    "home.call_108_hint": "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ತುರ್ತು ಸೇವೆ",
    "home.nearest_title": "ಸಮೀಪದ ಸೇವೆಗಳು",
    "home.saved_title": "ನೀವು ಉಳಿಸಿದವು",
    "home.city_grid_title": "ಅಥವಾ ಒಂದು ನಗರಕ್ಕೆ ಜಿಗಿಯಿರಿ",

    "tile.explore_title": "ಡೇಟಾ ಅನ್ವೇಷಿಸಿ",
    "tile.explore_sub": "ನಕ್ಷೆ, ಶುಲ್ಕಗಳು, ಸಂಬಂಧಗಳು, RTI ಡೇಟಾ, ತಾಜಾತನ",
    "tile.providers_title": "ಆಂಬುಲೆನ್ಸ್ ಸೇವಾ ಪೂರೈಕೆದಾರರಿಗೆ",
    "tile.providers_sub": "ನಿಮ್ಮ ಸೇವೆ ನೋಂದಣಿ ಮಾಡಿ ಅಥವಾ ಸರಿಪಡಿಸಿ — ಉಚಿತ",
    "tile.notice_title": "ಈ ತಾಣ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    "tile.notice_sub": "ನಾವು ಏನು ಮಾಡುತ್ತೇವೆ, ಏನು ಮಾಡುವುದಿಲ್ಲ, ನಿಮ್ಮ ಹಕ್ಕುಗಳು",

    "card.call_now": "ಕರೆ ಮಾಡಲು ಒತ್ತಿ",
    "card.fallback_108": "ಅವರು ಉತ್ತರಿಸದಿದ್ದರೆ 108 ಡಯಲ್ ಮಾಡಿ.",
    "card.dead": "✗ ಸಂಖ್ಯೆ ಕೆಲಸ ಮಾಡಲಿಲ್ಲ",
    "card.dead_reported": "✓ ವರದಿಯಾಗಿದೆ. ಮರು-ಪರಿಶೀಲನೆ ಮಾಡುತ್ತೇವೆ. ಈಗ 108 ಡಯಲ್ ಮಾಡಿ.",

    "footer.aggregator": "ಮಾಹಿತಿ ಸಂಗ್ರಾಹಕ",
    "footer.how_works": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    "footer.disclaimer": "ನಿರಾಕರಣೆ",
    "footer.corrections": "ತಿದ್ದುಪಡಿಗಳು",
    "footer.license": "ಪರವಾನಗಿ",
    "footer.freshness": "ಪರಿಶೀಲನೆ",
    "footer.changes": "ಇತ್ತೀಚಿನ ಬದಲಾವಣೆಗಳು",
    "footer.open_source": "ಮುಕ್ತ ಮೂಲ",
    "footer.emergency_line": "ಯಾವುದೇ ವೈದ್ಯಕೀಯ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 108 ಗೆ ಕರೆ ಮಾಡಿ. ನಾವು ಆಂಬುಲೆನ್ಸ್‌ಗಳನ್ನು ನಡೆಸುವುದಿಲ್ಲ. ಡೇಟಾ CC BY-NC-SA 4.0 ಅಡಿಯಲ್ಲಿದೆ.",

    "banner.in_emergency": "ಯಾವುದೇ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 108 ಡಯಲ್ ಮಾಡಿ.",

    "lang.review_warning": "ಈ ಭಾಷೆಯು ಯಂತ್ರ-ಅನುವಾದಿತವಾಗಿದೆ ಮತ್ತು ಸ್ಥಳೀಯ ಭಾಷಿಗರ ಪರಿಶೀಲನೆಗೆ ಕಾಯುತ್ತಿದೆ. ದೋಷಗಳನ್ನು ಕಂಡರೆ ದಯವಿಟ್ಟು PR ತೆರೆಯಿರಿ.",
  },

  // Other languages: stubs — fall through to English at runtime
  ta: {} as Strings,
  te: {} as Strings,
  mr: {} as Strings,
  bn: {} as Strings,
  ml: {} as Strings,
};

export function t(key: string, lang: Lang): string {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}
