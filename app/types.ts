export enum Gender {
  Male = 'M',
  Female = 'F',
}

export interface Municipality {
  name: string;
  code: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  birthPlaceCode: string; // Belfiore code (e.g., H501)
  birthPlaceName?: string; // For display
}
