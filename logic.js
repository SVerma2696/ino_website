// ============================================
// logic.js — the PURE, TESTABLE math and rules 🧮
// ELI5: "pure" just means "a function that only cares about the
// numbers/words you HAND it, and never peeks at (or touches)
// anything else on the page." Because these functions never look
// at buttons, timers, or the DOM, a test can call them directly
// and check the answer, without needing a real web browser at all.
//
// This file is loaded TWO different ways at once, on purpose:
//   1. In the actual website, index.html loads it with a plain
//      <script src="logic.js"></script> tag — that just defines a
//      few ordinary global functions, exactly like any other
//      classic (non-module) script.
//   2. In the automated tests (see tests/logic.test.js), Node/
//      Vitest loads this same file with require() — which only
//      works because of the small "if (typeof module...)" block
//      at the very bottom, which is invisible/harmless to a real
//      browser (browsers don't have a "module" variable at all).
// Either way, it's the exact same code being tested that the real
// site actually runs — not a separate copy that could drift out of
// sync with it.
// ============================================

// Turns a plain number into a 2-digit string ("5" -> "05") so a
// countdown reads "05s" instead of jumping between "5s" and "05s"
// as it ticks — keeps the whole line from jittering side to side.
function twoDigits(number) {
  return number < 10 ? '0' + number : String(number);
}

// Breaks one big "milliseconds remaining" number into weeks, days,
// hours, minutes, and seconds. Each step's "%" (remainder) is what
// stops the units from double-counting — without it, "days" would
// include the time already counted in "weeks" too.
function computeCountdownParts(msRemaining) {
  var weeks = Math.floor(msRemaining / 604800000);
  var days = Math.floor((msRemaining % 604800000) / 86400000);
  var hours = Math.floor((msRemaining % 86400000) / 3600000);
  var minutes = Math.floor((msRemaining % 3600000) / 60000);
  var seconds = Math.floor((msRemaining % 60000) / 1000);
  return { weeks: weeks, days: days, hours: hours, minutes: minutes, seconds: seconds };
}

// Turns "how many milliseconds are left" into the exact readable
// string the countdown banner shows, like "2w 3d 14h 22m 05s". Once
// there's no time left at all, it returns the "today!" message
// instead of a countdown made of zeros.
function formatCountdownText(msRemaining) {
  if (msRemaining <= 0) {
    return 'today! 🖤';
  }
  var parts = computeCountdownParts(msRemaining);
  return parts.weeks + 'w ' + parts.days + 'd ' + twoDigits(parts.hours) + 'h ' +
    twoDigits(parts.minutes) + 'm ' + twoDigits(parts.seconds) + 's';
}

// Checks whether a candidate era value (like one that came from a
// shared "?era=loco" link) is actually one of the site's REAL,
// known eras — instead of trusting whatever a visitor (or a
// hand-edited URL) claims. Returns the matching era back if it's
// valid, or null if it isn't, so the caller can just check
// "did I get an era back?" instead of writing its own search loop.
function isValidEra(candidate, knownEras) {
  if (!candidate) { return null; }
  for (var i = 0; i < knownEras.length; i++) {
    if (knownEras[i] === candidate) { return candidate; }
  }
  return null;
}

// ============================================
// GUESTBOOK APPRECIATION FILTER 🖤
// ELI5: the guestbook is only for saying something NICE about INO
// or ITZY, not for random chat, requests, or mean comments. This
// is a best-effort bouncer at the door, checking two things before
// letting a message in: (1) it doesn't contain an obviously mean
// or inappropriate word, and (2) it DOES contain at least one
// clearly appreciative word or emoji, so a totally unrelated
// message (or an empty-feeling one) gets turned away too.
//
// Being honest about its limits: this is simple keyword matching,
// not real language understanding — it can't read tone or
// sarcasm, and it's real, plain JavaScript running in a visitor's
// OWN browser, so a determined person could still work around it
// by calling the database directly instead of using this form.
// It's a genuine best-effort filter for ordinary visitors typing
// into the real form, not a security wall — the same honest
// limitation every purely client-side filter on a backend-free
// static site has. Firestore's own rules (see the big comment
// above setUpGuestbook() in index.html) add a second, small check
// for the worst profanity server-side, and INO can always delete
// anything that slips through by hand, directly in the Firebase
// console — the "no delete" rule only blocks the public form, not
// the project's actual owner.
// ============================================
var GUESTBOOK_APPRECIATION_WORDS = [
  'love', 'thank', 'thankful', 'appreciate', 'grateful', 'proud',
  'amazing', 'awesome', 'talented', 'favorite', 'favourite', 'best',
  'incredible', 'inspir', 'admire', 'respect', 'hero', 'legend',
  'wonderful', 'beautiful', 'iconic', 'congrat', 'support', 'blessed',
  'happy', 'joy', 'smile', 'sweet', 'kind', 'great job', 'well done',
  'keep it up', 'keep going', 'slay', 'goat', 'queen', 'king',
  '🖤', '❤', '💕', '💖', '🥹', '😊', '👏', '🎉', '✨'
];

var GUESTBOOK_BLOCKED_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'slut', 'whore',
  'cunt', 'nigger', 'faggot', 'retard', 'kys', 'kill yourself',
  'hate you', 'i hate', 'stupid', 'idiot', 'ugly', 'trash', 'worst',
  'sucks', 'loser', 'scam', 'fake', 'cringe'
];

// A tiny helper: does "text" contain ANY word/phrase from "list"
// (checked in lowercase, so "LOVE" and "love" match the same
// way)? Used for both the appreciation check and the blocklist
// check below, so there's only one place that does the actual
// searching.
function containsAnyKeyword(text, list) {
  var lowerText = text.toLowerCase();
  for (var i = 0; i < list.length; i++) {
    if (lowerText.indexOf(list[i].toLowerCase()) !== -1) { return true; }
  }
  return false;
}

// The actual gate the guestbook form calls before ever trying to
// save a message: true only if the message has real content, has
// none of the blocked words, AND has at least one clearly
// appreciative word or emoji in it.
function isAppreciationMessage(message) {
  var trimmed = (message || '').trim();
  if (!trimmed) { return false; }
  if (containsAnyKeyword(trimmed, GUESTBOOK_BLOCKED_WORDS)) { return false; }
  return containsAnyKeyword(trimmed, GUESTBOOK_APPRECIATION_WORDS);
}

// ELI5: this last bit is like a secret door that only Node (the
// testing tool) knows how to open — a real web browser walks right
// past it without ever noticing it's there, because browsers don't
// have a "module" variable at all.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    twoDigits: twoDigits,
    computeCountdownParts: computeCountdownParts,
    formatCountdownText: formatCountdownText,
    isValidEra: isValidEra,
    containsAnyKeyword: containsAnyKeyword,
    isAppreciationMessage: isAppreciationMessage
  };
}
