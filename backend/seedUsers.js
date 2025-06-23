const bcrypt = require('bcryptjs');
const db = require('./db');

const users = [
  { username: 'admin1', password: 'adminpass', role: 'admin' },
  { username: 'worker1', password: 'workerpass', role: 'health_worker' },
  { username: 'viewer1', password: 'viewerpass', role: 'viewer' }
];

async function insertUsers() {
  for (const user of users) {
    try {
      const hash = await bcrypt.hash(user.password, 10);

      db.query(
        'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
        [user.username, hash, user.role],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.log(`User ${user.username} already exists. Skipping.`);
            } else {
              console.error(`Error inserting ${user.username}:`, err.message);
            }
          } else {
            console.log(`User ${user.username} added successfully`);
          }
        }
      );
    } catch (err) {
      console.error('Hashing error:', err.message);
    }
  }
}

insertUsers();
