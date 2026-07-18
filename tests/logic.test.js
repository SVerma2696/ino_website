// ============================================
// logic.test.js — automated tests for logic.js
// ELI5: this file is like a checklist. For each pure function in
// logic.js, we hand it a known input and check the answer is
// exactly what we expect — no real website, no clicking, no
// browser needed at all, since these functions never touch the
// page, just plain numbers and words.
//
// Run it with: npm install, then npm test
// ============================================
import { describe, it, expect } from 'vitest';
import {
  twoDigits, computeCountdownParts, formatCountdownText, isValidEra,
  isAppreciationMessage
} from '../logic.js';

describe('twoDigits', () => {
  it('pads a single digit with a leading zero', () => {
    expect(twoDigits(5)).toBe('05');
  });

  it('leaves a two-digit number alone', () => {
    expect(twoDigits(42)).toBe('42');
  });

  it('treats 0 as needing a leading zero', () => {
    expect(twoDigits(0)).toBe('00');
  });
});

describe('computeCountdownParts', () => {
  it('splits a known number of milliseconds into weeks/days/hours/minutes/seconds', () => {
    // 2 weeks + 3 days + 4 hours + 5 minutes + 6 seconds, in ms.
    const ms = (2 * 604800000) + (3 * 86400000) + (4 * 3600000) + (5 * 60000) + (6 * 1000);
    expect(computeCountdownParts(ms)).toEqual({ weeks: 2, days: 3, hours: 4, minutes: 5, seconds: 6 });
  });

  it('returns all zeros for zero milliseconds remaining', () => {
    expect(computeCountdownParts(0)).toEqual({ weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('never lets a smaller unit "borrow" — each unit is the correct leftover remainder', () => {
    // Exactly 90 minutes should be 1 hour 30 minutes, not "0 hours 90 minutes".
    const ms = 90 * 60000;
    const parts = computeCountdownParts(ms);
    expect(parts.hours).toBe(1);
    expect(parts.minutes).toBe(30);
  });
});

describe('formatCountdownText', () => {
  it('formats a real countdown with zero-padded hours/minutes/seconds', () => {
    const ms = (1 * 604800000) + (2 * 86400000) + (3 * 3600000) + (4 * 60000) + (5 * 1000);
    expect(formatCountdownText(ms)).toBe('1w 2d 03h 04m 05s');
  });

  it('shows the "today!" message once time is up', () => {
    expect(formatCountdownText(0)).toBe('today! 🖤');
  });

  it('shows the "today!" message for a target date already in the past', () => {
    expect(formatCountdownText(-5000)).toBe('today! 🖤');
  });
});

describe('isValidEra', () => {
  const knownEras = ['dalla-dalla', 'icy', 'wannabe', 'loco', 'motto'];

  it('returns the era back when it is a real, known era', () => {
    expect(isValidEra('loco', knownEras)).toBe('loco');
  });

  it('returns null for an era that does not exist', () => {
    expect(isValidEra('not-a-real-era', knownEras)).toBeNull();
  });

  it('returns null for an empty or missing candidate', () => {
    expect(isValidEra('', knownEras)).toBeNull();
    expect(isValidEra(null, knownEras)).toBeNull();
  });

  it('is case-sensitive, matching how the real <option> values are written', () => {
    expect(isValidEra('LOCO', knownEras)).toBeNull();
  });
});

describe('isAppreciationMessage', () => {
  it('accepts a genuine appreciation message', () => {
    expect(isAppreciationMessage('I love your daily content, thank you INO!')).toBe(true);
  });

  it('accepts a short message that is just an appreciative emoji', () => {
    expect(isAppreciationMessage('🖤')).toBe(true);
  });

  it('rejects an empty or whitespace-only message', () => {
    expect(isAppreciationMessage('')).toBe(false);
    expect(isAppreciationMessage('   ')).toBe(false);
  });

  it('rejects a message with no appreciative word at all', () => {
    expect(isAppreciationMessage('when is the next livestream')).toBe(false);
  });

  it('rejects a message containing a blocked/negative word, even if it also sounds nice', () => {
    expect(isAppreciationMessage('I love everything except you are so stupid')).toBe(false);
  });

  it('is not case-sensitive', () => {
    expect(isAppreciationMessage('THANK YOU SO MUCH')).toBe(true);
  });
});
