const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/News.controllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the news item
 *         name:
 *           type: string
 *           description: The title of the news item
 *         date:
 *           type: string
 *           format: date
 *           description: The date when the news item was published
 *         views:
 *           type: integer
 *           description: The number of views of the news item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the news item
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date of the news item
 *       required:
 *         - id
 *         - name
 *         - date
 *       example:
 *         id: "64d2e2b8f5e3e57e79d2c5f6"
 *         name: "Breaking News"
 *         date: "2024-08-20"
 *         views: 1500
 *         createdAt: "2024-08-20T08:49:42.855Z"
 *         updatedAt: "2024-08-20T08:49:42.855Z"
 */

/**
 * @swagger
 * /api/news/add:
 *   post:
 *     summary: Add a new news item
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       201:
 *         description: News added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       500:
 *         description: Failed to add news
 */
router.post('/add', NewsController.addNews);

/**
 * @swagger
 * /api/news/update:
 *   put:
 *     summary: Update a news item
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the news item to update
 *               name:
 *                 type: string
 *                 description: The title of the news item
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date when the news item was published
 *               views:
 *                 type: integer
 *                 description: The number of views of the news item
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: News updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       400:
 *         description: ID is required
 *       404:
 *         description: News not found
 *       500:
 *         description: Failed to update news
 */
router.put('/update', NewsController.updateNews);

/**
 * @swagger
 * /api/news/delete:
 *   delete:
 *     summary: Delete a news item
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the news item to delete
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       400:
 *         description: ID is required
 *       404:
 *         description: News not found
 *       500:
 *         description: Failed to delete news
 */
router.delete('/delete', NewsController.deleteNews);

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news items
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of all news items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 *       500:
 *         description: Failed to get news
 */
router.get('/', NewsController.getAllNews);

/**
 * @swagger
 * /api/news/query:
 *   get:
 *     summary: Get news items by query
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The title of the news item to search
 *     responses:
 *       200:
 *         description: List of news items matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 *       500:
 *         description: Failed to get news by query
 */
router.get('/query', NewsController.getNewsByQuery);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get news details by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the news item to retrieve
 *     responses:
 *       200:
 *         description: News details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: News not found
 *       500:
 *         description: Failed to get news details
 */
router.get('/:id', NewsController.getNewsDetail);

module.exports = router;
