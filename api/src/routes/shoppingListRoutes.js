const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const shoppingListController = require("../controllers/shoppingListController");

/**
 * @swagger
 * tags:
 *   name: Liste de courses
 *   description: Gestion des listes de courses
 */

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Récupérer toutes les listes de l'utilisateur connecté
 *     tags: [Liste de courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listes de courses récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingList'
 *       401:
 *         description: Non authentifié
 */
router.get("/lists", auth, shoppingListController.getAll);

/**
 * @swagger
 * /lists/{id}:
 *   get:
 *     summary: Récupérer une liste par son ID
 *     tags: [Liste de courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste de courses récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       404:
 *         description: Liste introuvable
 */
router.get("/lists/:id", auth, shoppingListController.getOne);

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Créer une nouvelle liste de courses
 *     tags: [Liste de courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Courses du weekend"
 *     responses:
 *       201:
 *         description: Liste de courses créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       400:
 *         description: Paramètre manquant
 */
router.post("/lists", auth, shoppingListController.create);

/**
 * @swagger
 * /lists/{id}:
 *   put:
 *     summary: Mettre à jour une liste de courses
 *     tags: [Liste de courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Courses de la semaine"
 *     responses:
 *       200:
 *         description: Liste de courses modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       404:
 *         description: Liste introuvable
 */
router.put("/lists/:id", auth, shoppingListController.update);

/**
 * @swagger
 * /lists/{id}:
 *   delete:
 *     summary: Supprimer une liste de courses
 *     tags: [Liste de courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Liste de courses supprimée avec succès
 *       404:
 *         description: Liste introuvable
 */
router.delete("/lists/:id", auth, shoppingListController.remove);

module.exports = router;
