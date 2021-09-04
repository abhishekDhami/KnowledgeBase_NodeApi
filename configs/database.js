const mongoose = require('mongoose');

require('dotenv').config();

const connectionString = process.env.DB_STRING;

// Connect to the correct environment database
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},);

mongoose.connection.on('connected', () => {
    console.log('Database connected');
});

mongoose.connection.on('error', (err) => {
    console.log(err);
    process.exit(0);
});
