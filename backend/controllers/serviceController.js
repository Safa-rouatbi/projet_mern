const Service = require("../models/Service");

// CREATE SERVICE (provider only)
async function createService(req, res) {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({
        error: "Seul un provider peut créer un service"
      });
    }

    const service = await Service.create({
      provider: req.user.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET ALL SERVICES (public)
async function getAllServices(req, res) {
  try {
    const services = await Service.find()
      .populate("provider", "name email");

    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET MY SERVICES (provider)
async function getMyServices(req, res) {
  try {
    const services = await Service.find({
      provider: req.user.id
    });

    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// UPDATE SERVICE (owner only)
async function updateService(req, res) {
  try {
    const service = await Service.findOneAndUpdate(
      {
        _id: req.params.id,
        provider: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        error: "Service introuvable"
      });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// DELETE SERVICE (owner only)
async function deleteService(req, res) {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      provider: req.user.id
    });

    if (!service) {
      return res.status(404).json({
        error: "Service introuvable"
      });
    }

    res.json({ message: "Service supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createService,
  getAllServices,
  getMyServices,
  updateService,
  deleteService
};
