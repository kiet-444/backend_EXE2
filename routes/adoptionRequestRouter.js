const express = require('express');
const router = express.Router();
const AdoptionRequestController = require('../controllers/AdoptionRequest.controllers');
const { verifyToken, isAdmin } = require('../middleWare/auth.middleware');


// Create new adoption request
/**
 * @swagger
 * /api/request/adoption-request:
 *   post:
 *     summary: Create new adoption request
 *     tags: [AdoptionRequest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: string
 *                 description: The ID of the pet
 *               name:
 *                 type: string
 *                 description: The name of the adoption request
 *               address:
 *                 type: string
 *                 description: The address of the adoption request
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the adoption request
 *               cccd:
 *                 type: string
 *                 description: The cccd of the adoption request
 *             required:
 *               - petId
 *               - name
 *               - address
 *               - phoneNumber
 *               - cccd
*/
router.post('/adoption-request', verifyToken, AdoptionRequestController.createAdoptionRequest);

// Get adoption requests
/**
 * @swagger
 * /api/request/adoption-request:
 *   get:
 *     summary: Get adoption requests
 *     tags: [AdoptionRequest]
 *     responses:
 *       200:
 *         description: Adoption requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdoptionRequest'
 *                 message:
 *                   type: string
 *                   description: The message of the response
 *       500:
 *         description: Failed to get adoption requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The message of the response
 *                 error:
 *                   type: string
 *                   description: The error code
 */
router.get('/adoption-request', verifyToken, AdoptionRequestController.getAllAdoptionRequest);

// Update status adoption request

/**
 * @swagger
 * /api/request/adoption-request:
 *   patch:
 *     summary: Update status adoption request
 *     tags: [AdoptionRequest]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the adoption request to update
 *               status:
 *                 type: string
 *                 description: The new status of the adoption request
 *             example:
 *               id: "adoption-request-id"
 *               status: "accepted"
 *     responses:
 *       200:
 *         description: Adoption request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The message of the response
 */
router.patch('/adoption-request', verifyToken, AdoptionRequestController.updateStatusAdoptionRequest);


router.get('/count-day', AdoptionRequestController.countDay);

module.exports = router;