import CryptoJS from 'crypto-js';

// Алфавит Base62
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Перевод hex в Base62
export function toBase62(hex) {
  let num = BigInt('0x' + hex);
  let result = '';
  while (num > 0) {
    const rem = num % 62n;
    result = BASE62[rem] + result;
    num = num / 62n;
  }
  return result || '0';
}

// Перевод Base62 обратно в hex (для дешифровки)
export function fromBase62(str) {
  let num = 0n;
  for (const char of str) {
    const idx = BASE62.indexOf(char);
    if (idx === -1) throw new Error('Invalid Base62 character');
    num = num * 62n + BigInt(idx);
  }
  let hex = num.toString(16);
  if (hex.length % 2) hex = '0' + hex; // длина должна быть чётной
  return hex;
}

// AES encrypt + Base62
export function encryptBase62(str, keyStr) {
  const key = CryptoJS.enc.Utf8.parse(keyStr.padEnd(16, '0').slice(0,16));
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

  const encrypted = CryptoJS.AES.encrypt(str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).ciphertext.toString(CryptoJS.enc.Hex);

  return toBase62(encrypted);
}

// AES decrypt + Base62
export function decryptBase62(base62str, keyStr) {
  const key = CryptoJS.enc.Utf8.parse(keyStr.padEnd(16, '0').slice(0,16));
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

  const hex = fromBase62(base62str);

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(hex)
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}