const dotEnv = require('dotenv');
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');

const app = express()

dotEnv.config();
app.use(cors())

app.use(express.json())

// Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


mongoose.connect(process.env.MONGO_URL)
.then(() => {
    const PORT = process.env.PORT | 5000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})
.catch((error) => {
    console.log(error);
})
