require('dotenv').config();
const express = require('express');
const cors = require ('cors');
const connectDB = require ('./config/db');

const app = express();


app.use(express.json());
app.use(cors({origin:process.env.CORS_ORIGIN ||'*'}));


connectDB(process.env.MONGO_URI);
app.use('/auth', require('./routes/authRoutes'));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/appointments", require("./routes/appointmentRoutes"));
app.use("/services", require("./routes/serviceRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));


const PORT=process.env.PORT||5000;
app.listen(PORT, ()=>console.log(`server running on ${PORT}`));
