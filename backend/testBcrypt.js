const bcrypt = require('bcryptjs');

// TEST 1: Verify the known hash
const test1 = bcrypt.compareSync(
  'admin123', 
  '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq8H0u3JZSAj4Z6YhLYdQTHjY8/PG2'
);
console.log('Test known hash:', test1); // MUST be true

// TEST 2: Generate and compare new hash
const testHash = bcrypt.hashSync('admin123', 10);
const test2 = bcrypt.compareSync('admin123', testHash);
console.log('Test generated hash:', test2); // MUST be true
console.log('Generated hash:', testHash);