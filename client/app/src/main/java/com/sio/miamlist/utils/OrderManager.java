package com.sio.miamlist.utils;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

/**
 * Sauvegarde l'ordre des éléments dans les RecyclerViews via SharedPreferences.
 * Clés utilisées :
 *   "order_shopping_lists"       → liste principale des listes de courses
 *   "order_recipes"              → liste principale des recettes
 *   "order_products_{listId}"    → produits d'une liste de courses
 *   "order_recipe_products_{id}" → produits d'une recette
 */
public class OrderManager {

    private static final String PREFS_NAME = "miamlist_order";

    public static final String KEY_SHOPPING_LISTS   = "order_shopping_lists";
    public static final String KEY_RECIPES           = "order_recipes";

    public static String keyProducts(int listId) {
        return "order_products_" + listId;
    }

    public static String keyRecipeProducts(int recipeId) {
        return "order_recipe_products_" + recipeId;
    }

    /** Sauvegarde la liste d'IDs dans l'ordre courant. */
    public static void saveOrder(Context context, String key, List<Integer> ids) {
        JSONArray array = new JSONArray();
        for (int id : ids) array.put(id);
        prefs(context).edit().putString(key, array.toString()).apply();
    }

    /** Retourne les IDs dans l'ordre sauvegardé, ou null si rien n'est sauvegardé. */
    public static List<Integer> getSavedOrder(Context context, String key) {
        String json = prefs(context).getString(key, null);
        if (json == null) return null;
        try {
            JSONArray array = new JSONArray(json);
            List<Integer> ids = new ArrayList<>();
            for (int i = 0; i < array.length(); i++) ids.add(array.getInt(i));
            return ids;
        } catch (JSONException e) {
            return null;
        }
    }

    /**
     * Réordonne la liste items selon l'ordre sauvegardé.
     * Les éléments non présents dans l'ordre sauvegardé sont ajoutés à la fin.
     */
    public static <T> void applyOrder(List<T> items, List<Integer> savedOrder,
                                       IdExtractor<T> extractor) {
        if (savedOrder == null || savedOrder.isEmpty()) return;

        List<T> ordered   = new ArrayList<>();
        List<T> remaining = new ArrayList<>(items);

        for (int savedId : savedOrder) {
            for (T item : new ArrayList<>(remaining)) {
                if (extractor.getId(item) == savedId) {
                    ordered.add(item);
                    remaining.remove(item);
                    break;
                }
            }
        }
        ordered.addAll(remaining); // nouveaux éléments non encore ordonnés

        items.clear();
        items.addAll(ordered);
    }

    public interface IdExtractor<T> {
        int getId(T item);
    }

    private static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
}
