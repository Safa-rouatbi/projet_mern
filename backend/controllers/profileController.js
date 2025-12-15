const Profile = require("../models/profile");

// CREATE PROFILE
async function createProfile(req, res) {
  try {
    const exists = await Profile.findOne({ user: req.user.id });
    if (exists) {
      return res.status(400).json({ error: "Profil déjà créé." });
    }

    const profile = await Profile.create({
      user: req.user.id,
      ...req.body
    });
  
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET MY PROFILE
async function getMyProfile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé." });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE PROFILE
async function updateProfile(req, res) {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé." });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE PROFILE
async function deleteProfile(req, res) {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: "Profil non trouvé." });
    }

    res.json({ message: "Profil supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// EXPORTS AT THE END
module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
};
