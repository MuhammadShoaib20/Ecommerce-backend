import User from '../models/User.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({ name, email, password });

    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = user.getJWTToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updatedData = { name, email };

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(currentPassword);

    if (!isPasswordMatched) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.markModified('password');
    await user.save();

    const token = user.getJWTToken();

    res.status(200).json({ success: true, message: 'Password updated successfully', token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dev helper: create/find a user and return a JWT (non-production only)
export const devToken = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    const { email, name = 'Dev User', role = 'user' } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    let user = await User.findOne({ email });

    if (!user) {
      // Create with a default password; pre-save will hash it
      user = await User.create({ name, email, password: 'devpass123', role });
    }

    const token = user.getJWTToken();

    res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
