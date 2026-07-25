import db from '../config/database.js';
import crypto from 'crypto';

class UserModel {
  static initTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        consent_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    db.run(sql, (err) => {
      if (err) {
        console.error('❌ Error initializing users table:', err.message);
      } else {
        console.log('✅ Users table initialized');
        UserModel.seedDemoUser();
      }
    });
  }

  // Demo account for hackathon presentations
  static async seedDemoUser() {
    const existing = await UserModel.findByEmail('demo@careertwin.ai').catch(() => null);
    if (!existing) {
      await UserModel.create({
        name: 'Rounith R.',
        email: 'demo@careertwin.ai',
        password: 'careertwin123'
      }).catch(() => {});
    }
  }

  static hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  static create({ name, email, password }) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = UserModel.hashPassword(password, salt);
      const consentAt = new Date().toISOString();
      const sql = `
        INSERT INTO users (name, email, password_hash, salt, consent_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(sql, [name, email.toLowerCase(), passwordHash, salt, consentAt], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, email: email.toLowerCase(), consent_at: consentAt });
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [String(email).toLowerCase()], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  static verifyPassword(user, password) {
    const candidate = Buffer.from(UserModel.hashPassword(password, user.salt), 'hex');
    const stored = Buffer.from(user.password_hash, 'hex');
    return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
  }
}

UserModel.initTable();

export default UserModel;
