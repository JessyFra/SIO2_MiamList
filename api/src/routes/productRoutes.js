const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupération des produits de l'Utilisateur
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *         description: Le label à rechercher (recherche partielle)
 *         example: Fromage
 *     responses:
 *       200:
 *         description: Tous les produits de l'Utilisateur récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/products", authMiddleware, productController.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupération d'un produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id du produit
 *     responses:
 *       200:
 *         description: Produit récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only see his own product
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 */
router.get("/products/:id", authMiddleware, productController.get);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Création d'un produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 example: Lait
 *               unit:
 *                 type: string
 *                 example: Litre
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter 'label' is required
 *       409:
 *         description: Conflit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already used
 */
router.post("/products", authMiddleware, productController.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Mise à jour d'un produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - unit
 *             properties:
 *               label:
 *                 type: string
 *                 example: Lait
 *               unit:
 *                 type: string
 *                 example: Litre
 *     responses:
 *       200:
 *         description: Produit modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameters 'label', 'quantity' and 'unit' are required
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only modify his own product
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 */
router.put("/products/:id", authMiddleware, productController.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Suppression d'un produit
 *     tags: [Produit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id du produit
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only delete his own product
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 */
router.delete("/products/:id", authMiddleware, productController.delete);

module.exports = router;
