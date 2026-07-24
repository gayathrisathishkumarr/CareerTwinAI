import db from '../config/database.js';

class DashboardModel {
  /**
   * Helper utility to wrap SQLite get query in a Promise
   */
  static getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  /**
   * Helper utility to wrap SQLite all query in a Promise
   */
  static allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  /**
   * Fetches professional identity profile
   */
  static async getProfessionalProfile() {
    try {
      const row = await this.getQuery('SELECT * FROM professionals ORDER BY id ASC LIMIT 1');
      if (!row) return null;
      return {
        id: row.id,
        name: row.name || 'Anonymous',
        initials: row.initials || 'A',
        role: row.role || 'Professional',
        location: row.location || 'Remote',
        years: row.years || 0,
        twinIQ: row.twin_iq || 0,
        readiness: row.readiness || 0,
        targetRole: row.target_role || 'Target Role',
        verified: Boolean(row.verified)
      };
    } catch (error) {
      console.warn('⚠️ Warning: Failed to query professionals table:', error.message);
      return null;
    }
  }

  /**
   * Fetches metric KPIs from metrics table
   */
  static async getMetrics(professionalId = 1) {
    try {
      const rows = await this.allQuery('SELECT * FROM metrics WHERE professional_id = ?', [professionalId]);
      return rows;
    } catch (error) {
      console.warn('⚠️ Warning: Failed to query metrics table:', error.message);
      return [];
    }
  }

  /**
   * Fetches recommended growth steps
   */
  static async getRecommendations(professionalId = 1) {
    try {
      const rows = await this.allQuery(
        'SELECT id, title, description, state, ordinal FROM growth_steps WHERE professional_id = ? ORDER BY ordinal ASC',
        [professionalId]
      );
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        state: r.state,
        ordinal: r.ordinal
      }));
    } catch (error) {
      console.warn('⚠️ Warning: Failed to query growth_steps table:', error.message);
      return [];
    }
  }
}

export default DashboardModel;
