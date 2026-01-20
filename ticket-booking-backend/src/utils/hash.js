import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

export async function hashPassword(plainText) {
  if (!plainText) throw new Error('Password is required for hashing');
  const hash = await bcrypt.hash(plainText, SALT_ROUNDS);
  return hash;
}

export async function comparePassword(plainText, hashed) {
  if (!plainText || !hashed) return false;
  return bcrypt.compare(plainText, hashed);
}

export default { hashPassword, comparePassword };
