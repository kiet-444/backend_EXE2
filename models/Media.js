const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    created_at: { type: Date, required: true }
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
