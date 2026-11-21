// Create an admin account, or make an existing account admin and reset its password.
//
// Usage (from the server folder):
//   node scripts/createAdmin.js <email> <password> [firstname] [mobile]
//
// Examples:
//   node scripts/createAdmin.js admin@tajalli.co.in "MyStr0ngPass!"                  (existing user -> admin + new password)
//   node scripts/createAdmin.js admin@tajalli.co.in "MyStr0ngPass!" Admin 9999999999 (new user)
//
// Uses MONGODB_URL from server/.env, so it changes whichever database that points to.

require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const User = require('../models/userModel');

const [email, password, firstname = 'Admin', mobile] = process.argv.slice(2);

const fail = (message) => {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
};

if (!email || !password) {
  fail('Usage: node scripts/createAdmin.js <email> <password> [firstname] [mobile]');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('That email address does not look valid.');
if (password.length < 8) fail('Use a password of at least 8 characters.');

(async () => {
  await mongoose.connect(process.env.MONGODB_URL, { ssl: true });
  const normalizedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    user.role = 'admin';
    user.password = password; // hashed by the model's pre-save hook
    user.Isblocked = false;
    await user.save({ validateModifiedOnly: true });
    console.log(`\n✓ Existing account ${normalizedEmail} is now an admin and its password was reset.\n`);
  } else {
    if (!mobile) fail('No account with that email yet. To create one, also pass a firstname and a 10-digit mobile number.');
    const code = `admin${Math.random().toString(36).slice(2, 8)}`;
    user = new User({
      firstname,
      lastname: '',
      email: normalizedEmail,
      mobile,
      password, // hashed by the model's pre-save hook
      role: 'admin',
      referralCode: code,
      referralLink: `${process.env.RESET_LINK || 'https://www.tajalli.co.in'}/share/${code}`,
    });
    await user.save();
    console.log(`\n✓ Created admin account ${normalizedEmail}.\n`);
  }

  console.log('Log in to the admin panel with this email and the password you just set.\n');
  await mongoose.disconnect();
})().catch(async (error) => {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    console.error(`\n✗ Another account already uses this ${field}. Pick a different ${field}.\n`);
  } else {
    console.error('\n✗ Failed:', error.message, '\n');
  }
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
