const News = require('../models/News');

// Add a new news item
const addNews = async (req, res) => {
    try {
        const { name, date, views } = req.body;

        const newNews = new News({ name, date, views });
        const savedNews = await newNews.save();

        res.status(201).json({ message: 'News added successfully', data: savedNews });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add news', error });
    }
};

// Update a news item
const updateNews = async (req, res) => {
    try {
        const { id, ...updates } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const updatedNews = await News.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ message: 'News updated successfully', data: updatedNews });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update news', error });
    }
};

// Delete a news item
const deleteNews = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete news', error });
    }
};

// Get all news items
const getAllNews = async (req, res) => {
    try {
        const news = await News.find();
        res.status(200).json({ data: news });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get news', error });
    }
};

// Get news items by query
const getNewsByQuery = async (req, res) => {
    try {
        const { name } = req.query;
        const query = name ? { name: new RegExp(name, 'i') } : {};

        const news = await News.find(query);
        res.status(200).json({ data: news });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get news by query', error });
    }
};

// Get news details by id
const getNewsDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ data: news });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get news detail', error });
    }
};

module.exports = {
    addNews,
    updateNews,
    deleteNews,
    getAllNews,
    getNewsByQuery,
    getNewsDetail
};
