const db = require('./db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password } = userData;
    const [result] = await db.execute(
      'INSERT INTO user (name, email, pass) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  }
}

module.exports = User;