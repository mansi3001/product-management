/* const crypto = require('crypto')
const key = crypto.randomBytes(32)
const IV = Buffer.from('0000000000000000')
const algorithm = 'aes-256-cbc'

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), IV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decrypt(encryptedText) {
    let encryptedBuffer = Buffer.from(encryptedText, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), IV);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
 */

/* const crypto = require('crypto');
const key = crypto.randomBytes(32); // AES-256 requires a 32-byte key
const algorithm = 'aes-256-cbc';

// Encryption function
function encrypt(text) {
    const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, key, iv); // Initialize cipher with random IV
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Concatenate the IV and encrypted data and return as a single string
    return iv.toString('hex') + encrypted; // IV + encrypted data combined
}

// Decryption function
function decrypt(encryptedText) {
    const iv = Buffer.from(encryptedText.substring(0, 32), 'hex'); // The first 16 bytes (32 hex characters) is the IV
    const encryptedData = Buffer.from(encryptedText.substring(32), 'hex'); // The remaining part is the encrypted data
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv); // Initialize decipher with the extracted IV
    let decrypted = decipher.update(encryptedData, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

module.exports = { encrypt, decrypt }; */

/* const crypto = require('crypto');

const key = crypto.randomBytes(32);
const algorithm = 'aes-256-cbc';

const fixedIV = Buffer.from('0000000000000000');

// Hash SKU for duplicate checks
function hashSKU(sku) {
    return crypto.createHash('sha256').update(sku).digest('hex');
}

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted;
}

function decrypt(encryptedText) {
    const iv = Buffer.from(encryptedText.substring(0, 32), 'hex');
    const encryptedData = Buffer.from(encryptedText.substring(32), 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, null, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt, hashSKU }; */


const crypto = require('crypto');

// Generate a random 32-byte key and 16-byte IV (Run this once and store it securely)
// const KEY = crypto.randomBytes(32);
// const IV = crypto.randomBytes(16);
const key = crypto.createHash('sha256').update('your-passphrase-here').digest(); // 32-byte key
const fixedIV = Buffer.from('0000000000000000');
const algorithm = 'aes-256-cbc'; 

// console.log('Key (Base64):', KEY.toString('base64'));
// console.log('IV (Base64):', IV.toString('base64'));

function encrypt(text) {
    // const cipher = crypto.createCipheriv(algorithm, key, fixedIV);
    // let encrypted = cipher.update(text, 'utf8', 'hex');
    // encrypted += cipher.final('hex');
    // return encrypted;
    const cipher = crypto.createCipheriv(algorithm, key, fixedIV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    // console.log({text});
    // const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY), Buffer.from(IV));
    // console.log('decipher',decipher);
    // let decrypted = decipher.update(text, null, 'utf8');
    // decrypted += decipher.final('utf8');
    // console.log({decrypted});
    // return decrypted;
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, fixedIV);
    let decrypted = decipher.update(encryptedBuffer, null, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
