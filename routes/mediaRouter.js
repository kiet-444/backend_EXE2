const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/Media.controllers');


/**
 * @swagger
 * components:
 *   schemas:
 *     ImageUploadResponse:
 *       type: object
 *       properties:
 *         image_id:
 *           type: string
 *           description: The ID of the uploaded image on Cloudinary
 *         name:
 *           type: string
 *           description: The original name of the uploaded image file
 *         url:
 *           type: string
 *           description: The secure URL of the uploaded image
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time when the image was uploaded
 *       example:
 *         image_id: sample_image_id
 *         name: example_image
 *         url: https://res.cloudinary.com/demo/image/upload/v1600000000/sample_image_id.jpg
 *         created_at: 2023-08-20T14:48:00.000Z
 */

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Upload an image to Cloudinary
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the uploaded image on Cloudinary
 *                 name:
 *                   type: string
 *                   description: The original name of the uploaded image file
 *                 url:
 *                   type: string
 *                   description: The secure URL of the uploaded image
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the image was uploaded
 *               example:
 *                 id: sample_image_id
 *                 name: example_image
 *                 url: https://res.cloudinary.com/demo/image/upload/v1600000000/sample_image_id.jpg
 *                 created_at: 2023-08-20T14:48:00.000Z
 *       400:
 *         description: Bad request
 *       404:   
 *         description: Image not found
 *       500:
 *         description: Failed to upload image
 */
router.post('/media', MediaController.upload);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete an image from Cloudinary
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the image to be deleted
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Image not found
 *       500:
 *         description: Failed to delete image  
 */
router.delete('/media/:id', MediaController.deleteMedia);

module.exports = router;
