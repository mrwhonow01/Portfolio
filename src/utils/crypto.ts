// Web Crypto AES-GCM (256-bit) client-side storage protection utility

const ALGORITHM = 'AES-GCM';
const DEVICE_KEY_STORAGE = 'juztin_portfolio_device_key_v2';

// In-memory cache for the device CryptoKey
let cachedKey: CryptoKey | null = null;

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
 * Returns or generates a client-side cryptographic device key for AES-GCM.
 * Never stores or relies on hardcoded passwords or static secrets.
 */
async function getDeviceKey(): Promise<CryptoKey | null> {
  if (cachedKey) return cachedKey;
  if (typeof window === 'undefined' || !window.crypto?.subtle) return null;

  try {
    const stored = localStorage.getItem(DEVICE_KEY_STORAGE);
    if (stored) {
      const raw = base64ToArrayBuffer(stored);
      cachedKey = await window.crypto.subtle.importKey(
        'raw',
        raw,
        { name: ALGORITHM, length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      return cachedKey;
    }

    // Generate brand new unique 256-bit AES-GCM device key
    const newKey = await window.crypto.subtle.generateKey(
      { name: ALGORITHM, length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await window.crypto.subtle.exportKey('raw', newKey);
    localStorage.setItem(DEVICE_KEY_STORAGE, arrayBufferToBase64(exported));

    cachedKey = newKey;
    return cachedKey;
  } catch {
    return null;
  }
}

/**
 * Encrypts arbitrary serializable data using AES-GCM (256-bit).
 * Returns an armored string format: `ENC:v2:<iv>:<ciphertext>`
 */
export async function encryptData(data: unknown): Promise<string> {
  try {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      return 'OBF:' + btoa(encodeURIComponent(JSON.stringify(data)));
    }

    const key = await getDeviceKey();
    if (!key) {
      return 'OBF:' + btoa(encodeURIComponent(JSON.stringify(data)));
    }

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

    return `ENC:v2:${ivBase64}:${cipherBase64}`;
  } catch {
    // Fallback safely to obfuscated string without throwing
    return 'OBF:' + btoa(encodeURIComponent(JSON.stringify(data)));
  }
}

/**
 * Decrypts an armored encrypted string back to the original type T.
 * Seamlessly handles legacy versions for backward compatibility.
 */
export async function decryptData<T>(raw: string): Promise<T | null> {
  try {
    if (!raw) return null;

    // Handle legacy unencrypted JSON
    if (!raw.startsWith('ENC:') && !raw.startsWith('OBF:')) {
      return JSON.parse(raw) as T;
    }

    // Handle fallback obfuscation
    if (raw.startsWith('OBF:')) {
      const decoded = decodeURIComponent(atob(raw.replace('OBF:', '')));
      return JSON.parse(decoded) as T;
    }

    // Handle Web Crypto AES-GCM
    if (raw.startsWith('ENC:')) {
      if (typeof window === 'undefined' || !window.crypto?.subtle) {
        return null;
      }

      const parts = raw.split(':');
      if (parts.length !== 4) return null;

      const iv = base64ToArrayBuffer(parts[2]);
      const ciphertext = base64ToArrayBuffer(parts[3]);

      const key = await getDeviceKey();
      if (!key) return null;

      try {
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
      } catch {
        return null;
      }
    }

    return null;
  } catch {
    return null;
  }
}
