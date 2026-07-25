# Security Policy

<!--
  In simple words: this page just explains what to do if someone finds a
  "broken lock" somewhere on this website — instead of shouting about it
  where everyone (including anyone who might misuse it) can see, tell the
  owner quietly first, so it can get fixed safely.
-->

This is a small, static fan site (HTML/CSS/vanilla JS) with a Firestore-backed
guestbook feature. There's no server-side code and no user accounts beyond
Firebase Anonymous Authentication, but if you find something — an XSS vector,
a Firestore security-rules gap, a way to bypass the guestbook's
appreciation/profanity filter, exposed credentials, etc. — please report it
responsibly.

## Supported Versions

This repo has no version branches; only the code on `main` (which is what's
deployed to the live site) is supported.

| Branch | Supported |
| ------ | --------- |
| main   | ✅        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use one of these private channels:

1. **GitHub Private Vulnerability Reporting** (preferred): go to the
   [Security tab](../../security/advisories/new) of this repository and
   click "Report a vulnerability."
2. **Email**: saksham2696@gmail.com

Please include:
- A description of the issue and its potential impact
- Steps to reproduce (a minimal repro is very helpful)
- Any suggested fix, if you have one

You should expect an initial response within a few days. Since this is a
personal/hobby project maintained by one person, fixes are best-effort but
prioritized based on severity.
