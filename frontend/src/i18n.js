import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      "app_title": "JS Interview Prep",
      "search_placeholder": "Search questions...",
      "no_results": "No results found.",
      "read_more": "Read More",
      "collapse": "Collapse",
      "cat_all": "All Questions",
      "cat_storage": "Storage & Offline",
      "cat_dom": "DOM & Events",
      "cat_functions": "Functions & Closures",
      "cat_async": "Async & Promises",
      "cat_objects": "Objects & Classes",
      "cat_arrays": "Arrays & Collections",
      "cat_types": "Types & Variables",
      "cat_modern": "Modern JS (ES6+)",
      "cat_errors": "Error Handling",
      "cat_webAPI": "Web APIs",
      "cat_regex": "Regex & Math",
      "cat_fundamentals": "Core Fundamentals",
      "cat_misc": "Misc"
    }
  },
  ar: {
    translation: {
      "app_title": "التحضير لمقابلات جافا سكريبت",
      "search_placeholder": "ابحث عن الأسئلة...",
      "no_results": "لم يتم العثور على نتائج.",
      "read_more": "إقرأ المزيد",
      "collapse": "طي",
      "cat_all": "جميع الأسئلة",
      "cat_storage": "التخزين والعمل بدون انترنت",
      "cat_dom": "الدوم والأحداث (DOM & Events)",
      "cat_functions": "الدوال والانغلاق (Functions & Closures)",
      "cat_async": "التزامن والوعود (Async & Promises)",
      "cat_objects": "الكائنات والفئات (Objects & Classes)",
      "cat_arrays": "المصفوفات والمجموعات (Arrays & Collections)",
      "cat_types": "الأنواع والمتغيرات (Types & Variables)",
      "cat_modern": "جافا سكريبت الحديثة (ES6+)",
      "cat_errors": "معالجة الأخطاء (Error Handling)",
      "cat_webAPI": "واجهات الويب (Web APIs)",
      "cat_regex": "التعابير المنطقية والرياضيات",
      "cat_fundamentals": "المفاهيم الأساسية",
      "cat_misc": "متنوعة"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
