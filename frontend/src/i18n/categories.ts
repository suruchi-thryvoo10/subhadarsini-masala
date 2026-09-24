import { DEFAULT_LANGUAGE } from './languages';
import { useLanguage } from './LanguageContext';

/**
 * Category names in each language, keyed by the category's slug.
 *
 * These live here rather than in the database on purpose. There are five of
 * them, the set changes rarely, and they are ordinary descriptive nouns rather
 * than brand names. Keeping them out of the API also keeps the API — and so
 * the CDN cache entry in front of it — identical for every reader, instead of
 * needing a separate cached copy of the catalogue per language.
 *
 * Product names are deliberately absent: "Subhadarshini Royal Garam Masala" is
 * what is printed on the packet, and a reader comparing the site against a
 * packet in a shop should see the same words. Product descriptions are prose
 * that belongs with the record, so those are translated per record in the
 * database when they are translated at all — see README.md.
 */
const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  'ground-spices': {
    hi: 'पिसे मसाले',
    or: 'ପେଷା ମସଲା',
    bn: 'গুঁড়ো মশলা',
    te: 'పొడి మసాలాలు',
    mr: 'दळलेले मसाले',
    ta: 'அரைத்த மசாலாக்கள்',
    gu: 'દળેલા મસાલા',
    kn: 'ಪುಡಿ ಮಸಾಲೆಗಳು',
    ml: 'പൊടിച്ച മസാലകൾ',
    pa: 'ਪੀਸੇ ਮਸਾਲੇ',
    ur: 'پسے ہوئے مصالحے'
  },
  'blended-spices': {
    hi: 'मिश्रित मसाले',
    or: 'ମିଶ୍ରିତ ମସଲା',
    bn: 'মিশ্র মশলা',
    te: 'మిశ్రమ మసాలాలు',
    mr: 'मिश्र मसाले',
    ta: 'கலவை மசாலாக்கள்',
    gu: 'મિશ્ર મસાલા',
    kn: 'ಮಿಶ್ರ ಮಸಾಲೆಗಳು',
    ml: 'മിശ്ര മസാലകൾ',
    pa: 'ਮਿਸ਼ਰਤ ਮਸਾਲੇ',
    ur: 'ملے جلے مصالحے'
  },
  'whole-spices': {
    hi: 'साबुत मसाले',
    or: 'ଗୋଟା ମସଲା',
    bn: 'গোটা মশলা',
    te: 'పూర్తి మసాలాలు',
    mr: 'अखंड मसाले',
    ta: 'முழு மசாலாக்கள்',
    gu: 'આખા મસાલા',
    kn: 'ಪೂರ್ಣ ಮಸಾಲೆಗಳು',
    ml: 'മുഴുവൻ മസാലകൾ',
    pa: 'ਸਾਬਤ ਮਸਾਲੇ',
    ur: 'ثابت مصالحے'
  },
  'gourmet-seasonings': {
    hi: 'विशेष सीज़निंग',
    or: 'ବିଶେଷ ସିଜନିଂ',
    bn: 'বিশেষ সিজনিং',
    te: 'ప్రత్యేక సీజనింగ్‌లు',
    mr: 'विशेष सीझनिंग',
    ta: 'சிறப்பு சுவையூட்டிகள்',
    gu: 'વિશેષ સીઝનિંગ',
    kn: 'ವಿಶೇಷ ಸೀಸನಿಂಗ್',
    ml: 'പ്രത്യേക സീസണിംഗ്',
    pa: 'ਖ਼ਾਸ ਸੀਜ਼ਨਿੰਗ',
    ur: 'خاص سیزننگ'
  },
  'premium-food-items': {
    hi: 'प्रीमियम खाद्य पदार्थ',
    or: 'ପ୍ରିମିୟମ୍ ଖାଦ୍ୟ ସାମଗ୍ରୀ',
    bn: 'প্রিমিয়াম খাদ্যসামগ্রী',
    te: 'ప్రీమియం ఆహార పదార్థాలు',
    mr: 'प्रीमियम खाद्यपदार्थ',
    ta: 'சிறப்பு உணவுப் பொருட்கள்',
    gu: 'પ્રીમિયમ ખાદ્ય પદાર્થો',
    kn: 'ಪ್ರೀಮಿಯಂ ಆಹಾರ ಪದಾರ್ಥಗಳು',
    ml: 'പ്രീമിയം ഭക്ഷ്യവസ്തുക്കൾ',
    pa: 'ਪ੍ਰੀਮੀਅਮ ਖਾਣ-ਪੀਣ ਦੀਆਂ ਚੀਜ਼ਾਂ',
    ur: 'پریمیم غذائی اشیاء'
  }
};

/**
 * Returns a function that localises a category name, falling back to whatever
 * the database supplied when there is no translation — a category added later
 * shows its English name rather than a blank.
 */
export const useCategoryName = () => {
  const { language } = useLanguage();
  return (slug: string | undefined, fallback: string): string => {
    if (!slug || language === DEFAULT_LANGUAGE) return fallback;
    return CATEGORY_NAMES[slug]?.[language] ?? fallback;
  };
};
