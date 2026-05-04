const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` Error establishing a database connection: ${error.message}`);
        // Exit the app if the database fails to connect
        process.exit(1);
    }
};

module.exports = connectDB;
