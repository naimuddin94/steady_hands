export const CANCELLATION_POLICY = {
    HOURS_24: '24-hour',
    HOURS_48: '48-hour',
    HOURS_72: '72-hour',
  } as const;
  
  export type TCancellationPolicy =
    (typeof CANCELLATION_POLICY)[keyof typeof CANCELLATION_POLICY];
  
  export const PREFERRED_ARTIST_TYPE = {
    TATTOO: 'Tattoo Artist',
    PIERCINGS: 'Piercings',
    BOTH: 'Both',
  } as const;
  
  export type TPreferredArtistType =
    (typeof PREFERRED_ARTIST_TYPE)[keyof typeof PREFERRED_ARTIST_TYPE];
  
  export const PREFERRED_EXPERIENCE = {
    ONE_TO_THREE: '1–3 years',
    THREE_TO_FIVE: '3–5 years',
    FIVE_PLUS: '5+ years',
  } as const;
  
  export type TPreferredExperience =
    (typeof PREFERRED_EXPERIENCE)[keyof typeof PREFERRED_EXPERIENCE];
  