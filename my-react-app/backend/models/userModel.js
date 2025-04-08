class User {
    static async findByEmail(email) {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );
      return rows[0];
    }
  
    static async createUser(userData) {
      const { email, password_hash, full_name } = userData;
      const [result] = await db.query(
        'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
        [email, password_hash, full_name]
      );
      return result.insertId;
    }
  }
  
  export default User;