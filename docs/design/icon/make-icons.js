// Generates the app icons into assets/ (Midnight Glass ring + "G").
// Usage (needs @resvg/resvg-js, e.g. in a temp dir):
//   node make-icons.js ../../../assets ../../../node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const FONT = process.argv[3]; // Inter_700Bold.ttf

const out = process.argv[2];
const BG = '#0B0D17';

// Background: the app's dark base with its three soft color blobs.
const background = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="v"><stop offset="0" stop-color="#5B4BFF" stop-opacity="0.85"/><stop offset="0.45" stop-color="#5B4BFF" stop-opacity="0.45"/><stop offset="1" stop-color="#5B4BFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="t"><stop offset="0" stop-color="#0FB5A0" stop-opacity="0.7"/><stop offset="0.45" stop-color="#0FB5A0" stop-opacity="0.35"/><stop offset="1" stop-color="#0FB5A0" stop-opacity="0"/></radialGradient>
    <radialGradient id="p"><stop offset="0" stop-color="#E0458B" stop-opacity="0.65"/><stop offset="0.45" stop-color="#E0458B" stop-opacity="0.3"/><stop offset="1" stop-color="#E0458B" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="${BG}"/>
  <circle cx="200" cy="170" r="620" fill="url(#v)"/>
  <circle cx="960" cy="620" r="520" fill="url(#t)"/>
  <circle cx="300" cy="1010" r="500" fill="url(#p)"/>
</svg>`;

// Ring of three category-colored segments, like the dashboard's spending split.
// `r` = ring radius, `w` = stroke width, in a 1024 viewBox centered at 512.
function ring({ r, w, colors }) {
  const c = 2 * Math.PI * r;
  const shares = [0.52, 0.27, 0.21];
  const gap = w * 1.05; // visible gap between rounded caps
  let offset = 0;
  return shares
    .map((share, i) => {
      const len = share * c;
      const dash = Math.max(len - gap, 0);
      const el = `<circle cx="512" cy="512" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="${w}"
        stroke-linecap="round" stroke-dasharray="${dash} ${c}" stroke-dashoffset="${-offset - gap / 2}"
        transform="rotate(-90 512 512)"/>`;
      offset += len;
      return el;
    })
    .join('');
}

// Bold "G" (Geldmeister) centered in the ring; size relative to the ring radius.
const letter = (r, fill = '#F4F5FA') =>
  `<text x="512" y="${512 + r * 0.43}" text-anchor="middle" font-family="Inter" font-weight="700"
    font-size="${r * 1.2}" letter-spacing="-4" fill="${fill}">G</text>`;

const color = ['#8E9BFF', '#3DDCC5', '#FFB547'];
const white = ['#FFFFFF', '#FFFFFF', '#FFFFFF'];

// Subtle glass disc behind the ring.
const glass = (r) => `
  <circle cx="512" cy="512" r="${r}" fill="#FFFFFF" fill-opacity="0.07"/>
  <circle cx="512" cy="512" r="${r}" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="4"/>`;

const svg = (size, body, bg = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${bg}${body}</svg>`;

// Adaptive icon content must sit inside the 66/108 safe zone (~626px of 1024).
const adaptiveRing = { r: 205, w: 92 };
// Full-bleed icon (iOS / legacy launchers): a bit larger.
const fullRing = { r: 250, w: 110 };

const files = {
  'android-icon-background.png': [512, background(512)],
  'android-icon-foreground.png': [512, svg(512, glass(290) + ring({ ...adaptiveRing, colors: color }) + letter(adaptiveRing.r))],
  'android-icon-monochrome.png': [432, svg(432, ring({ ...adaptiveRing, colors: white }) + letter(adaptiveRing.r, '#FFFFFF'))],
  'icon.png': [
    1024,
    background(1024).replace('</svg>', glass(350) + ring({ ...fullRing, colors: color }) + letter(fullRing.r) + '</svg>'),
  ],
  'splash-icon.png': [1024, svg(1024, ring({ r: 300, w: 130, colors: color }) + letter(300))],
  'favicon.png': [
    48,
    background(48).replace('</svg>', ring({ r: 300, w: 150, colors: color }) + '</svg>'),
  ],
};

for (const [name, [size, markup]] of Object.entries(files)) {
  const png = new Resvg(markup, {
    fitTo: { mode: 'width', value: size },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
    .render()
    .asPng();
  fs.writeFileSync(path.join(out, name), png);
  console.log(name, size);
}
