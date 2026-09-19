// Web Crypto AES-GCM (256-bit) encryption utility for client-side storage

const APP_SECRET = 'juztin-yuen-portfolio-secure-key-2026';
const ALGORITHM = 'AES-GCM';

// Cache the derived CryptoKey in memory
let cachedKey: CryptoKey | null = null;

async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;

  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(APP_SECRET),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = enc.encode('portfolio-quietframes-salt-v1');

  cachedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return cachedKey;
}

// Convert Uint8Array to Base64
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array with dedicated ArrayBuffer backing
function base64ToArrayBuffer(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypts arbitrary serializable data using AES-GCM (256-bit).
 * Returns a secure armored string format: `ENC:v1:<iv>:<ciphertext>`
 */
export async function encryptData(data: unknown): Promise<string> {
  try {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      // Fallback obfuscation if SubtleCrypto unavailable in insecure context
      return 'OBF:' + btoa(encodeURIComponent(JSON.stringify(data)));
    }

    const key = await getEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv as unknown as BufferSource,
      },
      key,
      encodedData
    );

    const ivBase64 = arrayBufferToBase64(iv);
    const cipherBase64 = arrayBufferToBase64(encryptedBuffer);

    return `ENC:v1:${ivBase64}:${cipherBase64}`;
  } catch (err) {
    console.error('Encryption error:', err);
    // Fallback safely to obfuscated string
    return 'OBF:' + btoa(encodeURIComponent(JSON.stringify(data)));
  }
}

/**
 * Decrypts an armored encrypted string back to the original type T.
 * Seamlessly handles unencrypted legacy strings for backward compatibility.
 */
export async function decryptData<T>(raw: string): Promise<T | null> {
  try {
    if (!raw) return null;

    // Handle legacy unencrypted JSON
    if (!raw.startsWith('ENC:v1:') && !raw.startsWith('OBF:')) {
      return JSON.parse(raw) as T;
    }

    // Handle fallback obfuscation
    if (raw.startsWith('OBF:')) {
      const decoded = decodeURIComponent(atob(raw.replace('OBF:', '')));
      return JSON.parse(decoded) as T;
    }

    // Handle Web Crypto AES-GCM
    if (raw.startsWith('ENC:v1:')) {
      if (typeof window === 'undefined' || !window.crypto?.subtle) {
        console.warn('SubtleCrypto unavailable for decryption.');
        return null;
      }

      const parts = raw.split(':');
      if (parts.length !== 4) return null;

      const iv = base64ToArrayBuffer(parts[2]);
      const ciphertext = base64ToArrayBuffer(parts[3]);

      const key = await getEncryptionKey();
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: ALGORITHM,
          iv: iv as unknown as BufferSource,
        },
        key,
        ciphertext as unknown as BufferSource
      );

      const decryptedText = new TextDecoder().decode(decryptedBuffer);
      return JSON.parse(decryptedText) as T;
    }

    return null;
  } catch (err) {
    console.error('Decryption error:', err);
    return null;
  }
}
