/**
 * Translator Service Module (translator.ts)
 * -----------------------------------------
 * Multi-tier translation pipeline:
 * Tier 1: Official Google Translate API (if user provides key)
 * Tier 2: Free MyMemory API endpoint
 * Tier 3: Comprehensive local dictionary fallback
 */

let USER_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';

export const setApiKey = (key: string): void => {
  USER_API_KEY = key;
};

// Built-in German-to-English offline dictionary
const DICTIONARY: Record<string, string> = {
  // Greetings & Basics
  'hallo': 'Hello',
  'guten morgen': 'Good morning',
  'guten tag': 'Good day',
  'guten abend': 'Good evening',
  'gute nacht': 'Good night',
  'tschüss': 'Bye / Goodbye',
  'auf wiedersehen': 'Goodbye',
  'danke': 'Thank you',
  'danke schön': 'Thank you very much',
  'vielen dank': 'Thank you very much',
  'bitte': 'Please / You are welcome',
  'ja': 'Yes',
  'nein': 'No',
  'vielleicht': 'Maybe',
  'entschuldigung': 'Excuse me / Sorry',
  'hilfe': 'Help',
  'gut': 'Good',
  'schlecht': 'Bad',

  // Common Objects & Nouns
  'haus': 'House',
  'freund': 'Friend',
  'freundin': 'Friend (female) / Girlfriend',
  'familie': 'Family',
  'mutter': 'Mother',
  'vater': 'Father',
  'bruder': 'Brother',
  'schwester': 'Sister',
  'kind': 'Child',
  'wasser': 'Water',
  'brot': 'Bread',
  'kaffee': 'Coffee',
  'tee': 'Tea',
  'bier': 'Beer',
  'wein': 'Wine',
  'essen': 'Food / To eat',
  'trinken': 'Drink / To drink',
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
  'bus': 'Bus',
  'flugzeug': 'Airplane',
  'bahnhof': 'Train station',
  'flughafen': 'Airport',
  'hotel': 'Hotel',
  'restaurant': 'Restaurant',
  'katze': 'Cat',
  'hund': 'Dog',
  'sonne': 'Sun',
  'mond': 'Moon',
  'tag': 'Day',
  'nacht': 'Night',
  'morgen': 'Morning',
  'abend': 'Evening',
  'heute': 'Today',
  'morgen (zeit)': 'Tomorrow',
  'gestern': 'Yesterday',

  // Common Sentences & Questions
  'wie geht es dir': 'How are you?',
  'wie gehts': 'How are you?',
  'wie geht\'s': 'How are you?',
  'wie heißen sie': 'What is your name?',
  'wie heißt du': 'What is your name?',
  'ich heiße': 'My name is',
  'woher kommst du': 'Where are you from?',
  'ich komme aus': 'I am from',
  'ich liebe dich': 'I love you',
  'sprechen sie englisch': 'Do you speak English?',
  'sprichst du englisch': 'Do you speak English?',
  'ich spreche kein deutsch': 'I do not speak German',
  'ich verstehe nicht': 'I do not understand',
  'wo ist die toilette': 'Where is the bathroom?',
  'wie viel kostet das': 'How much does this cost?',
  'ich gehe heute zur universität': 'I am going to the university today',
  'ich gehe zur schule': 'I am going to school',
  'haben sie eine reservierung': 'Do you have a reservation?',
  'ich hätte gerne ein bier': 'I would like a beer, please',
};

// Build reverse dictionary once (English -> German)
const REVERSE_DICTIONARY: Record<string, string> = Object.entries(DICTIONARY).reduce(
  (acc, [de, en]) => {
    const key = en.toLowerCase();
    if (!acc[key]) {
      acc[key] = de.charAt(0).toUpperCase() + de.slice(1);
    }
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Primary translation function
 */
export const translateText = async (
  text: string,
  sourceLang: 'de' | 'en' = 'de',
  targetLang: 'de' | 'en' = 'en'
): Promise<string> => {
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
            source: sourceLang,
            target: targetLang,
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
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    if (data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      // Filter out raw error strings from API response if any
      if (!translated.toUpperCase().includes('MYMEMORY WARNING')) {
        return translated;
      }
    }
  } catch (err) {
    console.warn('Free API offline or failed, using dictionary fallback:', err);
  }

  // Tier 3: Local dictionary lookup fallback
  return localDictionaryTranslate(cleanText, sourceLang);
};

/**
 * Fallback translator using local dictionary
 */
const localDictionaryTranslate = (text: string, sourceLang: 'de' | 'en' = 'de'): string => {
  const dict = sourceLang === 'de' ? DICTIONARY : REVERSE_DICTIONARY;
  const lower = text.toLowerCase().trim();

  if (dict[lower]) {
    return dict[lower];
  }

  // Word-by-word translation fallback if sentence
  const words = text.split(/\s+/);
  if (words.length > 1) {
    const translatedWords = words.map((w) => {
      const cleanW = w.toLowerCase().replace(/[^a-zäöüß]/g, '');
      return dict[cleanW] || w;
    });
    return translatedWords.join(' ');
  }

  return sourceLang === 'de' ? `[EN] ${text}` : `[DE] ${text}`;
};
