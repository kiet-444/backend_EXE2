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
 *         - coatColor
 *         - breed
 *         - description
 *         - vaccinated
 *         - healthStatus
 *         - location
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
 *         coatColor:
 *           type: string
 *           description: The coat color of the pet
 *         species:
 *           type: string
 *           description: The species of the pet
 *         breed:
 *           type: string
 *           description: The breed of the pet
 *         description:
 *           type: string
 *           description: The description of the pet
 *         vaccinated:
 *           type: Number
 *           description: Whether the pet is vaccinated
 *         healthStatus:
 *           type: string
 *           description: The health status of the pet
 *         image_id:
 *           type: string
 *           description: The image id of the pet
 *         location:
 *           type: string
 *           description: The location of the pet
 *       example:
 *         name: "Fluffy"
 *         sex: "Female"
 *         age: 5
 *         species: "Cat"
 *         coatColor: "Black"
 *         breed: "Labrador"
 *         description: "Cute and cuddly"
 *         vaccinated: 1
 *         healthStatus: "Healthy"
 *         image_id: "sample_image_id"
 *         location: "123 Main St, Anytown USA"
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
 *         name: breed
 *         schema:
 *           type: string
 *         description: The breed of the pet
 *       - in: query
 *         name: coatColor
 *         schema:
 *           type: string
 *         description: The coat color of the pet
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string       
 *           description: The sex of the pet
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: The species of the pet
 *       - in: query
 *         name: age
 *         schema:
 *           type: number
 *         description: The age of the pet
 *       - in: query
 *         name: vaccinated
 *         schema:
 *           type: string
 *         description: Number of vaccine doses (e.g., "2" or "2-4" for a range)
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
router.get('/query', PetController.getPetsByQuery);


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
router.get('/:id', PetController.getPetDetail);




module.exports = router;
