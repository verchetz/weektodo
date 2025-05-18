import { es, enUS, fr, pt, ru, zhCN, de, it, ar, pl, zhTW, ja, tr, uk, ko, hi, vi, he } from "date-fns/locale";

const localeMap = {
  es,
  en: enUS,
  fr,
  pt,
  it,
  ar,
  pl,
  ru,
  zh_cn: zhCN,
  zh_tw: zhTW,
  de,
  ja,
  tr,
  uk,
  ko,
  hi,
  vi,
  he,
};

export default {
  getLanguagePack(lang) {
    return localeMap[lang] || null;
  },
};
