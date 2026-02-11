# Specification

## Summary
**Goal:** Add a consistent, app-wide sparkly luxury visual layer (gold shimmer, subtle glitter, starbursts) that feels premium while staying child-friendly, readable, and accessible.

**Planned changes:**
- Create reusable sparkle styling utilities (CSS/Tailwind and/or a small React overlay component) and apply them across existing luxury surfaces (e.g., luxury backgrounds, cards, headers) for consistent sparkle treatment.
- Update Welcome, Login, Home, Games Hub, and Quiz screens to include visible premium sparkle cues (sparkle overlays, starburst accents, shimmer highlights) without obscuring text/buttons.
- Ensure sparkle effects are subtle, performance-friendly, and respect reduced-motion preferences; support both light and dark mode.
- Add new generated sparkle/glitter overlay assets under `frontend/public/assets/generated` and use them as overlay/background textures, including scene-based screens where sparkles sit above the scene background but below content.

**User-visible outcome:** The main screens now look noticeably more “rich/premium” with gentle sparkly luxury accents and overlays, while remaining playful, readable, and comfortable to use (including reduced-motion users).
