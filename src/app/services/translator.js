/**
 * Translator Service Module (translator.js)
 * ----------------------------------------
 * Translates German text input to English.
 * 
 * Beginners Guide:
 * Multi-tier translation pipeline:
 * Tier 1: Official Google Translate API (if user configures a Google API key).
 * Tier 2: Free MyMemory Translation API endpoint (`https://api.mymemory.translated.net`).
 * Tier 3: Local offline dictionary fallback (`DICTIONARY` object) for common German words and phrases.
 */

let USER_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';

/**
 * Updates Google Translate API key dynamically
 */
export const setApiKey = (key) => {
  USER_API_KEY = key;
};

// Built-in German-to-English dictionary for offline use
const DICTIONARY = {
  // Common Words
  'haus': 'House',
  'hallo': 'Hello',
  'danke': 'Thank you',
  'bitte': 'Please / You are welcome',
  'ja': 'Yes',
  'nein': 'No',
  'gut': 'Good',
  'morgen': 'Morning',
  'nacht': 'Night',
  'tag': 'Day',
  'abend': 'Evening',
  'freund': 'Friend',
  'familie': 'Family',
  'wasser': 'Water',
  'brot': 'Bread',
  'kaffee': 'Coffee',
  'bier': 'Beer',
  'wein': 'Wine',
  'buch': 'Book',
  'schule': 'School',
  'universität': 'University',
  'arbeit': 'Work',
  'zeit': 'Time',
  'geld': 'Money',
  'stadt': 'City',
  'land': 'Country',
  'auto': 'Car',
  'zug': 'Train',
  'flugzeug': 'Airplane',
  'katze': 'Cat',
  'hund': 'Dog',

  // Common Phrases
  'guten morgen': 'Good morning',
  'guten tag': 'Good day',
  'guten abend': 'Good evening',
  'gute nacht': 'Good night',
  'wie geht es dir': 'How are you?',
  'wie gehts': 'How are you?',
  'danke schön': 'Thank you very much',
  'auf wiedersehen': 'Goodbye',
  'ich liebe dich': 'I love you',
  'entschuldigung': 'Excuse me / Sorry',
  'sprechen sie englisch': 'Do you speak English?',
  'ich spreche kein deutsch': 'I do not speak German',
  'ich verstehe nicht': 'I do not understand',
  'hilfe': 'Help',
  'wo ist die toilette': 'Where is the bathroom?',
  'wie viel kostet das': 'How much does this cost?',
  'ich gehe heute zur universität': 'I am going to the university today',
  'ich gehe zur schule': 'I am going to school',
};

/**
 * Primary translation function
 * @param {string} text - German text input
 * @returns {Promise<string>} English translated string
 */
export const translateText = async (text) => {
  if (!text || !text.trim()) {
    return '';
  }

  const cleanText = text.trim();

  // Tier 1: Official Google Translate REST API
  if (USER_API_KEY && USER_API_KEY !== 'YOUR_API_KEY') {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${USER_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: cleanText,
            source: 'de',
            target: 'en',
            format: 'text',
          }),
        }
      );
      const data = await response.json();
      if (data.data?.translations?.[0]?.translatedText) {
        return data.data.translations[0].translatedText;
      }
    } catch (err) {
      console.warn('Google Translate API error, falling back:', err);
    }
  }

  // Tier 2: Free MyMemory Translation API endpoint
  try {
    const encodedText = encodeURIComponent(cleanText);
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=de|en`
    );
    const data = await response.json();
    if (data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (err) {
    console.warn('Free API offline or failed, using dictionary fallback:', err);
  }

  // Tier 3: Local dictionary lookup fallback
  return localDictionaryTranslate(cleanText);
};

/**
 * Fallback translator using local lookup object
 */
const localDictionaryTranslate = (text) => {
  const lower = text.toLowerCase().trim();
  
  if (DICTIONARY[lower]) {
    return DICTIONARY[lower];
  }

  // Word-by-word translation fallback if input is a sentence
  const words = text.split(/\s+/);
  if (words.length > 1) {
    const translatedWords = words.map(w => {
      const cleanW = w.toLowerCase().replace(/[^a-zäöüß]/g, '');
      return DICTIONARY[cleanW] || w;
    });
    return translatedWords.join(' ');
  }

  return `[EN] ${text}`;
};