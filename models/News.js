const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    datePosted: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
