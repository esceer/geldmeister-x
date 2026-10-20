// Generates the app icons into assets/: a dark glass coin edged with the three-color
// spending ring and a bold Inter "G", on the Midnight Glass background.
// Usage (needs @resvg/resvg-js, e.g. in a temp dir):
//   node make-icons.js ../../../assets ../../../node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const [OUT, FONT] = process.argv.slice(2);
const C = { violet: '#8E9BFF', teal: '#3DDCC5', amber: '#FFB547', text: '#F4F5FA' };
const WHITE = ['#FFFFFF', '#FFFFFF', '#FFFFFF'];

// Background: the app's dark base with its three soft color blobs.
const background = `
  <defs>
    <radialGradient id="bv"><stop offset="0" stop-color="#5B4BFF" stop-opacity="0.85"/><stop offset="0.45" stop-color="#5B4BFF" stop-opacity="0.45"/><stop offset="1" stop-color="#5B4BFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="bt"><stop offset="0" stop-color="#0FB5A0" stop-opacity="0.7"/><stop offset="0.45" stop-color="#0FB5A0" stop-opacity="0.35"/><stop offset="1" stop-color="#0FB5A0" stop-opacity="0"/></radialGradient>
    <radialGradient id="bp"><stop offset="0" stop-color="#E0458B" stop-opacity="0.65"/><stop offset="0.45" stop-color="#E0458B" stop-opacity="0.3"/><stop offset="1" stop-color="#E0458B" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="#0B0D17"/>
  <circle cx="200" cy="170" r="620" fill="url(#bv)"/>
  <circle cx="960" cy="620" r="520" fill="url(#bt)"/>
  <circle cx="300" cy="1010" r="500" fill="url(#bp)"/>`;

// Ring of three category-colored segments (the dashboard's spending split).
function ring(r, w, colors) {
  const c = 2 * Math.PI * r;
  const shares = [0.52, 0.27, 0.21];
  const gap = w * 1.05;
  let offset = 0;
  return shares
    .map((share, i) => {
      const len = share * c;
      const el = `<circle cx="512" cy="512" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="${w}" stroke-linecap="round"
        stroke-dasharray="${len - gap} ${c}" stroke-dashoffset="${-offset - gap / 2}" transform="rotate(-90 512 512)"/>`;
      offset += len;
      return el;
    })
    .join('');
}

const letter = (fill) =>
  `<text x="512" y="607" text-anchor="middle" font-family="Inter" font-weight="700" font-size="260" letter-spacing="-4" fill="${fill}">G</text>`;

// The coin, sized for the adaptive-icon safe zone (diameter ~51% of the canvas).
// `mono` draws the white single-color version for Android themed icons.
const coin = (mono) =>
  (mono
    ? `<circle cx="512" cy="512" r="190" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="4 26" stroke-linecap="round"/>`
    : `<circle cx="530" cy="540" r="262" fill="#000" fill-opacity="0.35"/>
       <circle cx="512" cy="512" r="262" fill="#1C1E30"/>
       <circle cx="512" cy="512" r="262" fill="#FFFFFF" fill-opacity="0.06"/>
       <circle cx="512" cy="512" r="190" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="10" stroke-dasharray="4 26" stroke-linecap="round"/>
       <path d="M345 400 A215 215 0 0 1 555 300" fill="none" stroke="#fff" stroke-opacity="0.3" stroke-width="14" stroke-linecap="round"/>`) +
  ring(228, 64, mono ? WHITE : [C.violet, C.teal, C.amber]) +
  letter(mono ? '#FFFFFF' : C.text);

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${body}</svg>`;
const scaled = (body, k) => `<g transform="translate(${512 - 512 * k} ${512 - 512 * k}) scale(${k})">${body}</g>`;

const files = {
  'android-icon-background.png': [512, svg(background)],
  'android-icon-foreground.png': [512, svg(coin(false))],
  'android-icon-monochrome.png': [432, svg(coin(true))],
  'icon.png': [1024, svg(background + scaled(coin(false), 1.2))], // full-bleed (iOS, legacy)
  'splash-icon.png': [1024, svg(scaled(coin(false), 1.2))],
  'favicon.png': [48, svg(background + scaled(coin(false), 1.5))],
};

for (const [name, [size, markup]] of Object.entries(files)) {
  const png = new Resvg(markup, {
    fitTo: { mode: 'width', value: size },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
    .render()
    .asPng();
  fs.writeFileSync(path.join(OUT, name), png);
  console.log(name, size);
}
