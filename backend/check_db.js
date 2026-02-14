const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        const User = mongoose.model('User', new mongoose.Schema({ adharCardNumber: String, name: String }));
        const users = await User.find({});
        console.log("Total Users:", users.length);
        console.log("Users:", users.map(u => ({ name: u.name, adhar: u.adharCardNumber })));
        process.exit(0);
    } catch (err) {
        console.error("DB Check Failed:", err);
        process.exit(1);
    }
}

checkDB();
