const { encryptGCM, decryptGCM } = require('../backend/middleware/EncrytionAndDecryption');


const encrypted = encryptGCM("hello %%%%%%%%");
console.log('Encrypted:', encrypted);

const decrypted = decryptGCM(encrypted);
console.log('Decrypted:', decrypted);