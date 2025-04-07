export const expertiseTypes = {
  AMERICAN_TRADITIONAL: 'American traditional',
  NEO_TRADITIONAL: 'Neo traditional',
  PACIFIC_ISLANDER: 'Pacific Islander/Polynesian',
  BLACK_AND_GREY: 'Black & Grey',
  PORTRAIT: 'Portrait',
  REALISM: 'Realism',
  ABSTRACT: 'Abstract',
  BLACKWORK: 'Blackwork',
  HEAVY_BLACKWORK: 'Heavy Blackwork',
  BRUTAL_BLACKWORK: 'Brutal blackwork',
  WHITE_ON_BLACK: 'White on black',
  WHITE_TATTOOS: 'White tattoos',
  BLACK_TRASH: 'Black trash',
  TRASH_POLKA: 'Trash Polka',
  BLACKOUT: 'Blackout',
  SCRIPT: 'Script',
  LETTERING: 'Lettering',
  FINE_LINE: 'Fine line',
  WATERCOLOR: 'Watercolor',
  JAPANESE_STYLE: 'Japanese style',
  IREZUMI: 'Irezumi',
  TRIBAL: 'Tribal',
  NEW_SCHOOL: 'New School',
  ILLUSTRATIVE: 'Illustrative',
  MINIMALIST: 'Minimalist',
  DOTWORK: 'Dotwork',
  STICK_AND_POKE: 'Stick and poke',
  BIOMECH: 'Biomech',
  CHICANO: 'Chicano',
  THAI: 'Thai',
  COVERUPS: 'Coverups',
  SCAR_COVERUP: 'Scar coverup',
  MICROBLADING: 'Microblading',
  FRECKLES: 'Freckles',
} as const;

export type ExpertiseType =
  (typeof expertiseTypes)[keyof typeof expertiseTypes];

export const ARTIST_TYPE = {
  TATOO_ARTIST: 'Tattoo Artist',
  PIEREER: 'Piereer',
} as const;

export type ValueOf<T> = T[keyof T];
export type TArtistType = ValueOf<typeof ARTIST_TYPE>;
export type TServices = {
  hourly_rate: number;
  day_rate: number;
  consultations_fee: number;
};

export type TContact = {
  email: string;
  phone: string;
  address: string;
};
