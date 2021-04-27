import { default as englishDictionary } from 'configs/dictionaries/english.json';
import CyrillicToTranslit from 'cyrillic-to-translit-js';

const cyrillicToTranslit = new CyrillicToTranslit();

export function translate(key, locale) {
  if (locale === 'en') {
    if (englishDictionary[key]) 
      return englishDictionary[key];
    return cyrillicToTranslit.transform(String(key));
  }
  return key;
}
