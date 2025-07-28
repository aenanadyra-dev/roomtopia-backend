const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    // 🌟 Debug logs
    console.log('🌌 Received body:', req.body);

    const { email, password, matricNumber, fullName } = req.body;

    console.log('📧 Email:', email);
    console.log('🔒 Password:', password);
    console.log('🎓 Matric Number:', matricNumber);
    console.log('👤 Full Name:', fullName);

    // ✅ Validate all fields
    if (!email || !password || !matricNumber || !fullName) {
      console.log('❌ One or more fields missing!');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ Email already exists!');
      return res.status(400).json({ error: 'Email already registered' });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = new User({
      email,
      password: hashedPassword,
      matricNumber,
      fullName
    });

    await user.save();

    console.log('✅ User registered successfully:', user.email);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        email: user.email,
        matricNumber: user.matricNumber,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('🔥 Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
