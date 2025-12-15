const Appointment=require("../models/Appointment");
const User = require("../models/user");

async function createAppointment(req,res){
    try{

         if (req.user.role !== "client") {
      return res.status(403).json({
        error: "Seul un client peut créer un rendez-vous"
      });
    }
        //verification si le provider est un vrai user prov 
        const provider = await User.findById(req.body.provider);
        if (!provider||provider.role !=="provider"){
            return res.status(400).json({error:"provider invalide "});
        }
        const appointment= await Appointment.create({
            client:req.user.id,
            provider:req.body.provider,
            date:req.body.date,
            notes:req.body.notes || ""
        });
        res.status(201).json(appointment);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function getMyAppointments(req,res){
    try{
        const appointments= await Appointment.find({
            client: req.user.id
        }).populate("provider","name email");
        res.json(appointments);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

async function getProviderAppointments(req, res) {
  try {
    const appointments = await Appointment.find({
      provider: req.user.id
    }).populate("client", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

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
      return res.status(404).json({ error: "Rendez-vous introuvable." });
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
