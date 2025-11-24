import { UserData, Gender } from '../types';
import {
  MONTH_CODES,
  ODD_VALUES,
  EVEN_VALUES,
  REMAINDER_TO_CHAR,
} from '@/constants';

const isVowel = (char: string): boolean => /^[AEIOU]$/i.test(char);
const isConsonant = (char: string): boolean =>
  /^[BCDFGHJKLMNPQRSTVWXYZ]$/i.test(char);

const normalizeString = (str: string): string => {
  return str.toUpperCase().replace(/[^A-Z]/g, '');
};

const getConsonants = (str: string): string => {
  return str.split('').filter(isConsonant).join('');
};

const getVowels = (str: string): string => {
  return str.split('').filter(isVowel).join('');
};

const calculateSurnameCode = (surname: string): string => {
  const normalized = normalizeString(surname);
  const consonants = getConsonants(normalized);
  const vowels = getVowels(normalized);

  let code = consonants;
  if (code.length < 3) {
    code += vowels;
  }
  if (code.length < 3) {
    code += 'X'.repeat(3 - code.length);
  }
  return code.substring(0, 3);
};

const calculateNameCode = (name: string): string => {
  const normalized = normalizeString(name);
  const consonants = getConsonants(normalized);
  const vowels = getVowels(normalized);

  if (consonants.length >= 4) {
    // Special rule for first name: 1st, 3rd, 4th consonant
    return consonants[0] + consonants[2] + consonants[3];
  }

  let code = consonants;
  if (code.length < 3) {
    code += vowels;
  }
  if (code.length < 3) {
    code += 'X'.repeat(3 - code.length);
  }
  return code.substring(0, 3);
};

const calculateDateAndGenderCode = (
  birthDate: string,
  gender: Gender
): string => {
  // birthDate format YYYY-MM-DD
  const [year, month, day] = birthDate.split('-');

  const yearCode = year.substring(2);
  const monthCode = MONTH_CODES[month];

  let dayInt = parseInt(day, 10);
  if (gender === Gender.Female) {
    dayInt += 40;
  }

  const dayCode = dayInt.toString().padStart(2, '0');

  return yearCode + monthCode + dayCode;
};

const calculateCheckDigit = (partialCode: string): string => {
  let sum = 0;
  // Odd positions are index 0, 2, 4... (1st char, 3rd char...)
  // Even positions are index 1, 3, 5... (2nd char, 4th char...)

  for (let i = 0; i < partialCode.length; i++) {
    const char = partialCode[i];
    if ((i + 1) % 2 !== 0) {
      // Odd position (1st, 3rd...) -> index 0, 2...
      sum += ODD_VALUES[char] || 0;
    } else {
      // Even position (2nd, 4th...) -> index 1, 3...
      sum += EVEN_VALUES[char] || 0;
    }
  }

  return REMAINDER_TO_CHAR[sum % 26];
};

export const generateFiscalCode = (data: UserData): string => {
  if (
    !data.firstName ||
    !data.lastName ||
    !data.birthDate ||
    !data.birthPlaceCode
  ) {
    return '';
  }

  const surnameCode = calculateSurnameCode(data.lastName);
  const nameCode = calculateNameCode(data.firstName);
  const dateGenderCode = calculateDateAndGenderCode(
    data.birthDate,
    data.gender
  );
  const placeCode = data.birthPlaceCode.toUpperCase();

  const partialCode = surnameCode + nameCode + dateGenderCode + placeCode;
  const checkDigit = calculateCheckDigit(partialCode);

  return partialCode + checkDigit;
};
