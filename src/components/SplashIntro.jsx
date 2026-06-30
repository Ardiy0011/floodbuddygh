import { useState, useEffect } from 'react';

// Fast, paced intro shown every time the app opens. One phrase + one small
// multicolor illustration per frame, so a first-time user instantly grasps what
// FloodBuddy is for. Tap anywhere to skip.
const FRAMES = [
  { text: 'See water rising?', ms: 1600 },
  { text: 'Snap it.', ms: 1150 },
  { text: 'Pin it.', ms: 1150 },
  { text: 'Send it.', ms: 1500 },
];

// Time the splash spends fading out before the sign-in page is revealed.
const EXIT_MS = 750;

// Small, friendly, multicolor line/flat illustrations — one per phrase.
function SplashArt({ index }) {
  switch (index) {
    case 0: // rising water + droplet
      return (
        <svg viewBox="0 0 96 96" width="96" height="96" fill="none" aria-hidden="true">
          <path d="M48 14c9 12 15 19 15 27a15 15 0 1 1-30 0c0-8 6-15 15-27z" fill="#48cae4" />
          <path d="M41 41a8 8 0 0 0-1 9" stroke="#e6f7ff" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M14 66c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke="#80ed99" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M14 78c6-6 12-6 18 0s12 6 18 0 12-6 18 0" stroke="#ffd166" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 1: // camera
      return (
        <svg viewBox="0 0 96 96" width="96" height="96" fill="none" aria-hidden="true">
          <rect x="13" y="34" width="70" height="44" rx="10" fill="#ffffff" />
          <rect x="33" y="24" width="22" height="13" rx="3.5" fill="#ffffff" />
          <circle cx="48" cy="56" r="15" fill="#ff6b6b" />
          <circle cx="48" cy="56" r="10.5" fill="#48cae4" />
          <circle cx="48" cy="56" r="4.5" fill="#ffffff" />
          <circle cx="71" cy="45" r="3.5" fill="#ffd166" />
        </svg>
      );
    case 2: // map pin
      return (
        <svg viewBox="0 0 96 96" width="96" height="96" fill="none" aria-hidden="true">
          <ellipse cx="48" cy="83" rx="13" ry="3.6" fill="#3d0c1c" opacity="0.18" />
          <circle cx="23" cy="70" r="3.2" fill="#48cae4" />
          <circle cx="74" cy="64" r="3.2" fill="#80ed99" />
          <path d="M48 16c12 0 21 9 21 21 0 15-21 40-21 40S27 52 27 37c0-12 9-21 21-21z" fill="#ff6b6b" />
          <circle cx="48" cy="37" r="8.5" fill="#ffffff" />
        </svg>
      );
    case 3: // paper plane
      return (
        <svg viewBox="0 0 96 96" width="96" height="96" fill="none" aria-hidden="true">
          <path d="M12 70 82 20 58 82 46 60Z" fill="#48cae4" />
          <path d="M12 70 46 60 82 20Z" fill="#90e0ef" />
          <path d="M46 60 58 82 49 64Z" fill="#0077b6" />
          <path d="M10 78l11-3" stroke="#ffd166" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M9 86l9-3" stroke="#ff6b6b" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SplashIntro({ onDone }) {
  const [i, setI] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Advance through the frames; after the last, begin the exit fade.
  useEffect(() => {
    if (exiting) return undefined;
    const t = setTimeout(() => {
      if (i < FRAMES.length - 1) setI(i + 1);
      else setExiting(true);
    }, FRAMES[i].ms);
    return () => clearTimeout(t);
  }, [i, exiting]);

  // Once fading, reveal the page after the fade completes.
  useEffect(() => {
    if (!exiting) return undefined;
    const t = setTimeout(onDone, EXIT_MS);
    return () => clearTimeout(t);
  }, [exiting, onDone]);

  const skip = () => {
    if (!exiting) onDone();
  };

  return (
    <div
      className={`splash${exiting ? ' splash--exit' : ''}`}
      onClick={skip}
      role="button"
      tabIndex={-1}
    >
      <div className="brand brand--light splash__brand">
        Flood<span className="brand__accent">Buddy</span>
      </div>

      {/* key forces a remount so the entrance animation replays each frame */}
      <div className="splash__frame" key={i}>
        <div className="splash__art">
          <SplashArt index={i} />
        </div>
        <p className="splash__phrase">{FRAMES[i].text}</p>
      </div>

      <div className="splash__dots">
        {FRAMES.map((f, n) => (
          <span key={f.text} className={n === i ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}
