export const requiredKeys = [
  'ecl',
  'pid',
  'eyr',
  'hcl',
  'byr',
  'iyr',
  'hgt',
] as const;

export type RequiredKey = (typeof requiredKeys)[number];
export type ValidKey = RequiredKey | 'cid';

export type Passport = Partial<Record<ValidKey, string>>;
