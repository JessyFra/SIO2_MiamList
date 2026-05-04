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
 * /shopping-lists:
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
 */
router.get("/shopping-lists", auth, shoppingListController.getAll);

/**
 * @swagger
 * /shopping-lists/{id}:
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
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only see his own shoppingList
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ShoppingList not found
 */
router.get("/shopping-lists/:id", auth, shoppingListController.getOne);

/**
 * @swagger
 * /shopping-lists:
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
 *             required:
 *               - name
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
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter 'name' is required
 */
router.post("/shopping-lists", auth, shoppingListController.create);

/**
 * @swagger
 * /shopping-lists/{id}:
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
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parameter 'name' is required
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only update his own shoppingLists
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ShoppingList not found
 */
router.put("/shopping-lists/:id", auth, shoppingListController.update);

/**
 * @swagger
 * /shopping-lists/{id}:
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
 *       200:
 *         description: Liste de courses supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingList'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only delete his own shoppingLists
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ShoppingList not found
 */
router.delete("/shopping-lists/:id", auth, shoppingListController.remove);

module.exports = router;
