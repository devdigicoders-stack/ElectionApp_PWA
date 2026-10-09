/**
 * Utility to support search in both Hindi (Devanagari) and English (Romanized/Hinglish)
 */

const CONSONANTS = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh',
  'ष': 'sh', 'स': 's', 'ह': 'h', 'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy',
  'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'ड़': 'd', 'ढ़': 'dh', 'फ़': 'f'
};

const VOWELS = {
  'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
};

const MATRAS = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
};

const MODIFIERS = {
  'ं': 'n', 'ँ': 'n', 'ः': 'h'
};

export function transliterateDevanagariToEnglish(text) {
  if (!text) return '';
  const str = String(text);
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const nextCh = str[i + 1] || '';

    // Handle Nukta characters combined (e.g. ड़)
    const twoChars = str.substr(i, 2);
    if (CONSONANTS[twoChars]) {
      const cEng = CONSONANTS[twoChars];
      i++;
      const afterNukta = str[i + 1] || '';
      if (afterNukta === '्') {
        result += cEng;
        i++;
      } else if (MATRAS[afterNukta]) {
        result += cEng + MATRAS[afterNukta];
        i++;
      } else {
        result += cEng + 'a';
      }
      continue;
    }

    // 1. Independent Vowel
    if (VOWELS[ch]) {
      result += VOWELS[ch];
      continue;
    }

    // 2. Consonants
    if (CONSONANTS[ch]) {
      const cEng = CONSONANTS[ch];
      if (nextCh === '्') {
        result += cEng;
        i++; // skip halant
      } else if (MATRAS[nextCh]) {
        result += cEng + MATRAS[nextCh];
        i++; // skip matra
      } else {
        result += cEng + 'a';
      }
      continue;
    }

    // 3. Modifiers (anusvara, chandrabindu)
    if (MODIFIERS[ch]) {
      result += MODIFIERS[ch];
      continue;
    }

    if (ch === '़') continue; // standalone nukta skip

    // 4. Any other latin/numeric character
    result += ch;
  }

  return result.toLowerCase();
}

function normalizePhonetic(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/w/g, 'v')
    .replace(/ph/g, 'f')
    .replace(/ri/g, 'r')
    .replace(/sh/g, 's')
    .replace(/ch/g, 'c')
    .replace(/dh/g, 'd')
    .replace(/th/g, 't')
    .replace(/gh/g, 'g')
    .replace(/bh/g, 'b')
    .replace(/kh/g, 'k')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if targetText matches searchQuery in Hindi or English (phonetic)
 * @param {string} targetText - The text to search in (can be Hindi or English)
 * @param {string} searchQuery - The search input entered by user
 * @returns {boolean}
 */
export function matchHindiEnglish(targetText, searchQuery) {
  if (!targetText) return false;
  if (!searchQuery || !searchQuery.trim()) return true;

  const target = String(targetText).trim();
  const query = String(searchQuery).trim().toLowerCase();

  // 1. Direct case-insensitive match (Hindi query in Hindi text, or English in English)
  if (target.toLowerCase().includes(query)) return true;

  // 2. Transliterated English comparison
  const transliterated = transliterateDevanagariToEnglish(target);
  if (transliterated.includes(query)) return true;

  // 3. Normalized phonetic comparison
  const normTrans = normalizePhonetic(transliterated);
  const normQuery = normalizePhonetic(query);
  if (normTrans && normQuery && normTrans.includes(normQuery)) return true;

  // 4. Vowel-less consonant backbone comparison (for short/approximate typing)
  if (normQuery.length >= 3) {
    const vowellessTrans = normTrans.replace(/[aeiou]/g, '');
    const vowellessQuery = normQuery.replace(/[aeiou]/g, '');
    if (vowellessQuery && vowellessTrans.includes(vowellessQuery)) {
      return true;
    }
  }

  return false;
}
