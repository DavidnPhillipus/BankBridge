export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

/**
 * Port for password hashing. Keeps the hashing algorithm (bcrypt) an
 * infrastructure detail — swappable without touching business logic.
 */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
