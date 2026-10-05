/**
 * Product rules quoted on the homepage.
 * Source: TZ OC-TZ-JOBS-001 v1.1 (draft, awaiting customer approval).
 * Change numbers here only — components read them from this file.
 */
export const rules = {
  presentation: { minSeconds: 20, maxSeconds: 40, targetSeconds: 30, questions: 6 }, // FR-MED-02
  photos: { face: 1, fullLength: 3 }, // FR-MED-01
  professionsPerProfile: { min: 1, max: 3 }, // 6.1
  activeApprovals: 3, // BR-01
  finalPlaces: 1, // BR-02
  offerLifetimeHours: 72, // BR-04
  offerReminderHours: 12, // BR-04
  interviewMinLeadHours: 5, // BR-05
  interviewModeLockHours: 2, // FR-INT-01
  interviewParticipants: 3, // FR-INT-01
  recordingRetentionDays: 90, // FR-INT-01
  documentReminderDays: 30, // section 8
  timezones: {
    kazakhstan: { city: 'Шымкент', utcOffset: 5 },
    turkey: { city: 'Анталья', utcOffset: 3 },
  },
} as const;

/** «20–40» that never breaks after the dash (U+2060 word joiner). */
export const range = (from: number, to: number) => `${from}–⁠${to}`;

/** Availability of a capability relative to the pilot scope (TZ 1.2). */
export type Availability = 'pilot' | 'commercial';

export const availabilityNote: Record<Availability, string | null> = {
  pilot: null,
  commercial: 'В первой коммерческой версии',
};
