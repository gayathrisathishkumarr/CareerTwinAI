import db from '../config/database.js';

class ResumeModel {
  /**
   * Initializes the resumes table with extracted_text column in SQLite
   */
  static initTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        filesize INTEGER NOT NULL,
        extracted_text TEXT DEFAULT '',
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    db.run(sql, (err) => {
      if (err) {
        console.error('❌ Error initializing resumes table:', err.message);
      } else {
        // Attempt to add extracted_text column if upgrading from earlier schema version
        db.run("ALTER TABLE resumes ADD COLUMN extracted_text TEXT DEFAULT ''", () => {
          // Ignore error if column already exists
        });
        console.log('✅ Resumes table initialized with extracted_text column');
      }
    });
  }

  /**
   * Inserts a new resume record with extracted_text into SQLite
   */
  static create({ filename, originalFilename, filepath, filesize, extractedText = '' }) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO resumes (filename, original_filename, filepath, filesize, extracted_text)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(sql, [filename, originalFilename, filepath, filesize, extractedText], function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          filename,
          original_filename: originalFilename,
          filepath,
          filesize,
          extracted_text: extractedText,
          uploaded_at: new Date().toISOString()
        });
      });
    });
  }

  /**
   * Fetches the latest uploaded resume record including extracted_text
   */
  static getLatest() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM resumes ORDER BY uploaded_at DESC, id DESC LIMIT 1`;
      db.get(sql, [], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  /**
   * Deletes all uploaded resume records from SQLite
   */
  static deleteAll() {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM resumes`;
      db.run(sql, [], function (err) {
        if (err) return reject(err);
        resolve({ deletedCount: this.changes });
      });
    });
  }
}

// Auto-initialize table on import
ResumeModel.initTable();

export default ResumeModel;
