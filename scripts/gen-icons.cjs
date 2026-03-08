/**
 * Generates PWA icons for the Italian Flashcards app.
 * Creates icon-192.png and icon-512.png using an Italian flag design.
 * No external dependencies — pure Node.js with zlib.
 */
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// CRC32 table (PNG checksum standard)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type);
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, d])));
  return Buffer.concat([len, t, d, crcBuf]);
}

/**
 * Builds a PNG with an Italian flag design (green | white | red stripes)
 * plus a centered purple accent band for the "P" of Parole.
 */
function buildIcon(size) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB

  // Raw scanline data: 1 filter byte + size*3 bytes per row
  const rowLen = 1 + size * 3;
  const raw = Buffer.alloc(size * rowLen);

  const t1 = Math.floor(size / 3);
  const t2 = Math.floor(2 * size / 3);

  // Padding around the central badge
  const pad = Math.floor(size * 0.15);
  const badgeTop    = pad;
  const badgeBottom = size - pad;
  const badgeLeft   = t1 + Math.floor((t2 - t1) * 0.1);
  const badgeRight  = t2 - Math.floor((t2 - t1) * 0.1);

  for (let y = 0; y < size; y++) {
    const rowOff = y * rowLen;
    raw[rowOff] = 0; // filter: None

    for (let x = 0; x < size; x++) {
      const px = rowOff + 1 + x * 3;

      // Italian flag stripes
      let r, g, b;
      if (x < t1)      { r = 0;   g = 150; b = 72;  }  // green  #009648
      else if (x < t2) { r = 255; g = 255; b = 255; }  // white
      else             { r = 206; g = 43;  b = 55;  }  // red    #CE2B37

      // App-accent badge in the white stripe center
      if (x >= badgeLeft && x < badgeRight && y >= badgeTop && y < badgeBottom) {
        r = 108; g = 99; b = 255; // #6c63ff
      }

      raw[px] = r; raw[px + 1] = g; raw[px + 2] = b;
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    PNG_SIG,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buildIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), buildIcon(512));
console.log('Icons written to public/icon-192.png and public/icon-512.png');
