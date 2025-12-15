const mongoose = require ('mongoose');

const connectDB= async(mongoUri) =>{
    try{
        await mongoose.connect(mongoUri);
        console.log("mongodb connected");
    }
    catch(err){
        console.error('erreur de connexion', err.message);
        process.exit(1);
    }
}
module.exports = connectDB;