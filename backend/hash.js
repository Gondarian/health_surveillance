const bcrypt = require('bcryptjs');

const password = 'admin123'; // Change this to your desired admin password

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
  }
});
