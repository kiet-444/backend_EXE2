const express = require('express');
const router = express.Router();
const PetController = require('../controllers/Pet.controllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - sex
 *         - age
 *         - species
 *         - breed
 *         - vaccinated
 *         - healthStatus
 *         - image_id
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the pet
 *         sex:
 *           type: string
 *           description: The sex of the pet
 *         age:
 *           type: number
 *           description: The age of the pet
 *         species:
 *           type: string
 *           description: The species of the pet
 *         breed:
 *           type: string
 *           description: The breed of the pet
 *         vaccinated:
 *           type: boolean
 *           description: Whether the pet has been vaccinated
 *         healthStatus:
 *           type: string
 *           description: The health status of the pet
 *         image_id:
 *           type: string
 *           description: The image id of the pet
 *       example:
 *         name: "Fluffy"
 *         sex: "Female"
 *         breed: "Labrador"
 *         vaccinated: true
 *         healthStatus: "Healthy"
 *         image_id: "sample_image_id"
 */

/**
 * @swagger
 * /api/pets/add:
 *   post:
 *     summary: Add a new pet
 *     tags: [Pet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Pet added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Failed to add pet
 */
router.post('/add', PetController.addPet);

/**
 * @swagger
 * /api/pets/update:
 *   put:
 *     summary: Update an existing pet
 *     tags: [Pet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Pet ID is required
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Failed to update pet
 */
router.put('/update/:id', PetController.updatePet);

/**
 * @swagger
 * /api/pets/delete:
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the pet to delete
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Pet marked as deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Pet ID is required
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Failed to delete pet
 */
router.delete('/delete/:id', PetController.deletePet);

/**
 * @swagger
 * /api/pets/all:
 *   get:
 *     summary: Get all pets
 *     tags: [Pet]
 *     responses:
 *       200:
 *         description: List of all pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Failed to get pets
 */
router.get('/all', PetController.getAllPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get a pet by id
 *     tags: [Pet]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The pet id
 *     responses:
 *       200:
 *         description: Pet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Failed to get pet details
 */
router.get('/pets/:id', PetController.getPetDetail);

/**
 * @swagger
 * /api/pets/query:
 *   get:
 *     summary: Get pets by query
 *     tags: [Pet]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the pet
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *         description: The sex of the pet
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *         description: The age of the pet
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: The breed of the pet
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: The species of the pet
 *       - in: query
 *         name: vaccinated
 *         schema:
 *           type: boolean
 *         description: Whether the pet has been vaccinated
 *       - in: query
 *         name: healthStatus
 *         schema:
 *           type: string
 *         description: The health status of the pet
 *     responses:
 *       200:
 *         description: List of pets matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Failed to get pets
 */
router.get('/pets/query', PetController.getPetsByQuery);

module.exports = router;