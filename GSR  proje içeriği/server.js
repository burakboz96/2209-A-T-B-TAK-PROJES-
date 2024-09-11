const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const dataSchema = new Schema({
    day: String,
    date: Date,
    time: Date,
    gsr_average: Number,
    human_resistance: Number
});

const Data = mongoose.model('Data', dataSchema);

app.use(bodyParser.json());

// POST /api/data endpoint'i
app.post('/api/data', async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        const data = await Data.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        res.json(data);
    } catch (error) {
        res.status(500).send('Veri çekme hatası');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



