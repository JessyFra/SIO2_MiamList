const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const itemListController = require("../controllers/itemListController");

/**
 * @swagger
 * /shopping-lists/{id}/item-lists:
 *   post:
 *     summary: Création d'une liste de produit dans une liste de course
 *     tags: [Liste des Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de la liste de course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - checked
 *               - productId
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 1.5
 *               checked:
 *                 type: boolean
 *                 example: 0
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Quantité du produit modifié de la liste de course avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemList'
 *       201:
 *         description: Liste de produit de la liste de course créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemList'
 *       400:
 *         description: Mauvaise requête
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               parametersRequiered:
 *                 summary: Manque de paramètre
 *                 value:
 *                   error: Parameters 'quantity', 'checked' and 'productId' required
 *               quantityError:
 *                 summary: Ajoute une quantité nulle
 *                 value:
 *                   error: Quantity cannot be < 0
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only add an item in his own shopping list
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               shoppingListNotFound:
 *                 summary: Référence à une recette inexistante
 *                 value:
 *                   error: Shopping list not found
 *               productNotFound:
 *                 summary: Référence à un produit inexistant
 *                 value:
 *                   error: Product not found
 */
router.post(
    "/shopping-lists/:id/item-lists",
    authMiddleware,
    itemListController.createByShoppingListId,
);

/**
 * @swagger
 * /shopping-lists/{id}/item-lists:
 *   get:
 *     summary: Récupérer la liste de produit d'une liste de course
 *     tags: [Liste des Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           required: true
 *           description: Id de la liste de course
 *     responses:
 *       200:
 *         description: Récupérer liste des produits de la liste de course avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemListFull'
 *       403:
 *         description: Erreur d'appartenance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An user can only see his own products list
 *       404:
 *         description: Non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Shopping list not found
 */
router.get(
    "/shopping-lists/:id/item-lists",
    authMiddleware,
    itemListController.getAllByShoppingListId,
);

module.exports = router;
