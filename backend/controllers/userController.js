import User from "../models/user.js";

// GET ALL USERS (Admin/Manager)
export const getUsers = async (req, res) => {
  try {
    // Query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const role = req.query.role;
    const status = req.query.status;

    // Build filter object
    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Count total users
    const total = await User.countDocuments(query);

    // Fetch paginated users
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  CREATE USER (Admin only)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER (Admin only)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;
    user.updatedBy = req.user._id;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE (SOFT DELETE → deactivate)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "inactive";
    user.updatedBy = req.user._id;

    await user.save();

    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE OWN PROFILE (For regular users)
export const updateOwnProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Only allow updating name and password
    user.name = req.body.name || user.name;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    user.updatedBy = req.user._id;
    await user.save();
    
    // Return user without password
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};