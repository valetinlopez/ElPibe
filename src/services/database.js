import { Platform } from 'react-native';

let db = null;

class WebDB {
  constructor() {
    this.data = { profiles: [], player_stats: [], player_attributes: [], media_items: [] };
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('elpibe_db');
        if (stored) this.data = JSON.parse(stored);
      }
    } catch (e) { this.data = { profiles: [], player_stats: [], player_attributes: [], media_items: [] }; }
  }

  saveToStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('elpibe_db', JSON.stringify(this.data));
      }
    } catch (e) {}
  }

  execSync(sql) {
    const tableMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
    if (tableMatch && !this.data[tableMatch[1]]) {
      this.data[tableMatch[1]] = [];
    }
  }

  runSync(sql, params = []) {
    const insertMatch = sql.match(/INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/i);
    if (insertMatch) {
      const tableName = insertMatch[1];
      const columns = insertMatch[2].split(',').map(c => c.trim());
      const row = {};
      columns.forEach((col, i) => { row[col] = params[i] !== undefined ? params[i] : null; });
      if (!this.data[tableName]) this.data[tableName] = [];
      this.data[tableName].push(row);
      this.saveToStorage();
      return;
    }

    const updateMatch = sql.match(/UPDATE (\w+) SET (.+?) WHERE (.+)/i);
    if (updateMatch) {
      const [, tableName, setClause, whereClause] = updateMatch;
      const setFields = setClause.split(',').map(s => s.trim().split('=')[0].trim());
      const whereField = whereClause.split('=')[0].trim();
      const whereValue = params[params.length - 1];
      if (!this.data[tableName]) return;
      this.data[tableName] = this.data[tableName].map(row => {
        if (row[whereField] === whereValue) {
          const newRow = { ...row };
          setFields.forEach((field, i) => { newRow[field] = params[i]; });
          return newRow;
        }
        return row;
      });
      this.saveToStorage();
      return;
    }

    const deleteMatch = sql.match(/DELETE FROM (\w+) WHERE (.+)/i);
    if (deleteMatch) {
      const [, tableName, whereClause] = deleteMatch;
      const whereField = whereClause.split('=')[0].trim();
      if (!this.data[tableName]) return;
      this.data[tableName] = this.data[tableName].filter(row => row[whereField] !== params[0]);
      this.saveToStorage();
      return;
    }
  }

  getFirstSync(sql, params = []) {
    const selectMatch = sql.match(/SELECT\s+.+?\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (!selectMatch) return null;
    const [, tableName, whereClause] = selectMatch;
    if (!this.data[tableName]) return null;

    if (whereClause && whereClause.includes('AND')) {
      const conditions = whereClause.split('AND').map(c => c.trim());
      return this.data[tableName].find(row =>
        conditions.every((cond, i) => {
          const field = cond.split('=')[0].trim();
          return row[field] === params[i];
        })
      ) || null;
    }

    if (whereClause) {
      const whereField = whereClause.split('=')[0].trim();
      return this.data[tableName].find(row => row[whereField] === params[0]) || null;
    }

    return this.data[tableName][0] || null;
  }

  getAllSync(sql, params = []) {
    const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+GROUP BY\s+(.+?))?(?:\s+ORDER BY\s+(.+))?$/i);
    if (!selectMatch) return [];
    const [, selectClause, tableName, whereClause, groupClause, orderClause] = selectMatch;
    if (!this.data[tableName]) return [];

    let results = [...this.data[tableName]];

    if (whereClause) {
      if (whereClause.includes('AND')) {
        const conditions = whereClause.split('AND').map(c => c.trim());
        results = results.filter(row =>
          conditions.every((cond, i) => {
            const field = cond.split('=')[0].trim();
            return row[field] === params[i];
          })
        );
      } else {
        const whereField = whereClause.split('=')[0].trim();
        results = results.filter(row => row[whereField] === params[0]);
      }
    }

    if (groupClause) {
      const groupField = groupClause.trim().split(',')[0].trim();
      const groups = {};
      results.forEach(row => {
        const key = row[groupField];
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      results = Object.entries(groups).map(([key, rows]) => ({
        [groupField]: key,
        dimension: key,
        average: Number((rows.reduce((sum, r) => sum + (r.score || 0), 0) / rows.length).toFixed(1)),
        score: rows[0]?.score,
      }));
    }

    if (orderClause) {
      const parts = orderClause.trim().split(' ');
      const orderField = parts[0];
      const isDesc = parts[1] && parts[1].toUpperCase() === 'DESC';
      results.sort((a, b) => {
        if (isDesc) return (b[orderField] || '') > (a[orderField] || '') ? 1 : -1;
        return (a[orderField] || '') > (b[orderField] || '') ? 1 : -1;
      });
    }

    return results;
  }
}

if (Platform.OS === 'web') {
  if (!db) db = new WebDB();
} else {
  if (!db) {
    try {
      const SQLite = require('expo-sqlite');
      db = SQLite.openDatabaseSync('elpibe.db');
    } catch (error) {
      console.error('Error inicializando SQLite:', error);
    }
  }
}

export const getDatabase = () => db;

export const initDatabase = () => {
  if (Platform.OS === 'web') {
    if (!db) db = new WebDB();
    db.execSync('CREATE TABLE IF NOT EXISTS profiles');
    db.execSync('CREATE TABLE IF NOT EXISTS player_stats');
    db.execSync('CREATE TABLE IF NOT EXISTS player_attributes');
    db.execSync('CREATE TABLE IF NOT EXISTS media_items');
    return db;
  }

  const database = getDatabase();

  database.execSync(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL DEFAULT '',
      age INTEGER,
      city TEXT DEFAULT '',
      nationality TEXT DEFAULT '',
      height_cm INTEGER,
      weight_kg INTEGER,
      foot TEXT DEFAULT 'derecha',
      position_main TEXT DEFAULT '',
      position_secondary TEXT DEFAULT '',
      club TEXT DEFAULT '',
      category TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      photo_url TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  database.execSync(`
    CREATE TABLE IF NOT EXISTS player_stats (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      season TEXT NOT NULL,
      matches INTEGER DEFAULT 0,
      minutes INTEGER DEFAULT 0,
      goals INTEGER DEFAULT 0,
      assists INTEGER DEFAULT 0,
      yellow_cards INTEGER DEFAULT 0,
      red_cards INTEGER DEFAULT 0,
      FOREIGN KEY (profile_id) REFERENCES profiles(id),
      UNIQUE(profile_id, season)
    );
  `);

  database.execSync(`
    CREATE TABLE IF NOT EXISTS player_attributes (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      dimension TEXT NOT NULL,
      attribute_name TEXT NOT NULL,
      score INTEGER DEFAULT 5,
      FOREIGN KEY (profile_id) REFERENCES profiles(id),
      UNIQUE(profile_id, dimension, attribute_name)
    );
  `);

  database.execSync(`
    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT DEFAULT '',
      subcategory TEXT DEFAULT '',
      description TEXT DEFAULT '',
      storage_path TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );
  `);

  return database;
};
