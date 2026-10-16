# Project architecture

- Keep the primary hero's high-density topographic particles on HTML5 Canvas; its pixel-buffer renderer preserves the established visual identity without making the opening screen dependent on WebGL.
- Mount the secondary interactive 3D sculpture only after hydration and suspend its continuous rendering outside the viewport; this keeps SSR safe and protects scrolling performance.
- Keep the site's mixed vertical and pinned horizontal chapters within the existing page route; their scroll progress is tied to section bounds rather than global wheel interception.
- Keep Ora as a client-side, scripted guide (brain in ora-brain.ts) with section actions, project events, lead capture and browser-local history; it avoids implying a live AI service where none exists.
- Keep Ora's cursor playground in a separate Canvas section with viewport-paused rendering and reduced-motion support; this isolates game state from chat and avoids another WebGL context.
