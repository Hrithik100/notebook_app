const dotEnv = require('dotenv');
const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');

const app = express()

dotEnv.config();
app.use(cors())

app.use(express.json())

// Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


mongoose.connect(process.env.mongoUrl)
.then(() => {
    const port = process.env.PORT | 5000;
    app.listen(port, () => console.log('Server is running on port ' + port))
})
.catch((error) => {
    console.log(error);
})
