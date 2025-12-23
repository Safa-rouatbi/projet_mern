const Appointment = require("../models/Appointment");
const User = require("../models/user");
const Service = require("../models/Service");

async function createAppointment(req, res) {
  try {
    // 1️⃣ seul le client peut créer
    if (req.user.role !== "client") {
      return res.status(403).json({
        error: "Seul un client peut créer un rendez-vous"
      });
    }

    // 2️⃣ vérifier provider
    const provider = await User.findById(req.body.provider);
    if (!provider || provider.role !== "provider") {
      return res.status(400).json({ error: "Provider invalide" });
    }

    // 3️⃣ vérifier service
    const service = await Service.findOne({
      _id: req.body.service,
      provider: provider._id
    });

    if (!service) {
      return res.status(400).json({
        error: "Service invalide ou n'appartient pas à ce provider"
      });
    }

    // 4️⃣ créer rendez-vous
    const appointment = await Appointment.create({
      client: req.user.id,
      provider: provider._id,
      service: service._id,
      date: req.body.date,
      notes: req.body.notes || ""
    });

    res.status(201).json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// client
async function getMyAppointments(req, res) {
  try {
    const appointments = await Appointment.find({
      client: req.user.id
    })
      .populate("provider", "name email")
      .populate("service", "title price duration");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// provider
async function getProviderAppointments(req, res) {
  try {
    const appointments = await Appointment.find({
      provider: req.user.id
    })
      .populate("client", "name email")
      .populate("service", "title price duration");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// annulation par client
async function cancelAppointment(req, res) {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        client: req.user.id
      },
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        error: "Rendez-vous introuvable"
      });
    }

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createAppointment,
  getMyAppointments,
  getProviderAppointments,
  cancelAppointment
};
