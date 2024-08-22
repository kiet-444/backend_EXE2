const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductItem.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductItem:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - imageUrl
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         oldPrice:
 *           type: number
 *           description: The old price of the product
 *         imageUrl:
 *           type: string
 *           description: The image URL of the product
 *         rating:
 *           type: number
 *           description: The rating of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         stock:
 *           type: number
 *           description: The stock count of the product
 *         deleted:
 *           type: boolean
 *           description: Product deletion status
 *       example:
 *         name: Sample Product
 *         description: A description of the sample product
 *         price: 29.99
 *         oldPrice: 39.99
 *         imageUrl: http://example.com/image.jpg
 *         rating: 4.5
 *         category: Electronics
 *         stock: 10
 *         deleted: false
 */

/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - image_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               description:
 *                 type: string
 *                 description: The description of the product
 *               price:
 *                 type: number
 *                 description: The price of the product
 *               oldPrice:
 *                 type: number
 *                 description: The old price of the product
 *               image_id:
 *                 type: string
 *                 description: The ID of the image associated with the product
 *               category:
 *                 type: string
 *                 description: The category of the product
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product in stock
 *               code:
 *                 type: string
 *                 description: The product code
 *             example:
 *               name: Sample Product
 *               description: A description of the sample product
 *               price: 29.99
 *               oldPrice: 39.99
 *               image_id: sample_image_id
 *               category: Electronics
 *               quantity: 10
 *               code: SP001
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   $ref: '#/components/schemas/ProductItem'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of validation error messages
 *       500:
 *         description: Failed to add product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: object
 *                   description: Detailed error information
 */
router.post('/add', ProductController.addProduct);

/**
 * @swagger
 * /api/products/update/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductItem'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductItem'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product
 */
router.put('/update/:id', ProductController.updateProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products by query
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the product
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the product
 *     responses:
 *       200:
 *         description: List of products matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductItem'
 *       404:
 *         description: No products found
 *       500:
 *         description: Failed to get products
 */
router.get(ProductController.getProductByQuery);

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductItem'
 *       500:
 *         description: Failed to get products
 */
router.get('/all', ProductController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductItem'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to get product
 */
router.get('/:id', ProductController.getProductDetail);

/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product marked as deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductItem'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product
 */
router.delete('/delete/:id', ProductController.deleteProduct);



module.exports = router;
