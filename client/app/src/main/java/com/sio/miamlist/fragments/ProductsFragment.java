package com.sio.miamlist.fragments;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.textfield.MaterialAutoCompleteTextView;
import com.google.android.material.textfield.TextInputEditText;
import com.sio.miamlist.R;
import com.sio.miamlist.activities.BaseActivity;
import com.sio.miamlist.adapters.ProductsAdapter;
import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;
import com.sio.miamlist.utils.OrderManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Response;

public class ProductsFragment extends Fragment {

    private static final String TAG      = "ProductsFragment";
    private static final String ARG_ID   = "listId";
    private static final String ARG_NAME = "listName";

    private int    listId;
    private String listName;
    private String token;

    private final List<ProductsAdapter.ProductItem> items = new ArrayList<>();
    private ProductsAdapter adapter;

    private TextView tvProductCount;
    private View     layoutEmpty;

    public static ProductsFragment newInstance(int listId, String listName) {
        ProductsFragment f = new ProductsFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_ID, listId);
        args.putString(ARG_NAME, listName);
        f.setArguments(args);
        return f;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            listId   = getArguments().getInt(ARG_ID, 0);
            listName = getArguments().getString(ARG_NAME, "Produits");
        }
        token = SessionManager.getToken(getContext());
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_products, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TextView tvListName = view.findViewById(R.id.tvRecipeName);
        tvProductCount = view.findViewById(R.id.tvProductCount);
        layoutEmpty    = view.findViewById(R.id.layoutEmpty);

        tvListName.setText(listName);

        RecyclerView recycler = view.findViewById(R.id.recyclerRecipes);
        recycler.setLayoutManager(new LinearLayoutManager(requireContext()));

        adapter = new ProductsAdapter(items, new ProductsAdapter.OnProductActionListener() {
            @Override
            public void onEdit(ProductsAdapter.ProductItem item) {
                showAddEditDialog(item);
            }
            @Override
            public void onDelete(ProductsAdapter.ProductItem item) {
                showDeleteConfirmDialog(item);
            }
            @Override
            public void onCheckedChanged(ProductsAdapter.ProductItem item, boolean checked) {
                checkProduct(item.listItemId, checked);
            }
        });

        // Drag & drop
        ItemTouchHelper.Callback callback = new ItemTouchHelper.SimpleCallback(
                ItemTouchHelper.UP | ItemTouchHelper.DOWN, 0) {
            @Override
            public boolean onMove(@NonNull RecyclerView rv,
                                  @NonNull RecyclerView.ViewHolder from,
                                  @NonNull RecyclerView.ViewHolder to) {
                adapter.onItemMoved(from.getAdapterPosition(), to.getAdapterPosition());
                // Sauvegarde de l'ordre après chaque déplacement
                List<Integer> ids = new ArrayList<>();
                for (ProductsAdapter.ProductItem item : items) ids.add(item.listItemId);
                OrderManager.saveOrder(requireContext(), OrderManager.keyProducts(listId), ids);
                return true;
            }
            @Override
            public void onSwiped(@NonNull RecyclerView.ViewHolder vh, int dir) {}
            @Override
            public boolean isLongPressDragEnabled() { return false; }
        };
        ItemTouchHelper touchHelper = new ItemTouchHelper(callback);
        touchHelper.attachToRecyclerView(recycler);
        adapter.setDragListener(touchHelper::startDrag);

        recycler.setAdapter(adapter);

        // FAB ajouter un produit
        ExtendedFloatingActionButton fabProduct = view.findViewById(R.id.fabAddProduct);
        fabProduct.setOnClickListener(v -> showAddEditDialog(null));

        // FAB ajouter depuis une recette
        ExtendedFloatingActionButton fabRecipe = view.findViewById(R.id.fabAddFromRecipe);
        if (fabRecipe != null) {
            fabRecipe.setOnClickListener(v -> showAddFromRecipeDialog());
        }

        loadProducts();
    }

    //  Chargement 

    private void loadProducts() {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance()
                        .getData("/api/shopping-lists/" + listId + "/item-lists", token);
                int code = response.code();
                String body = response.body().string();

                requireActivity().runOnUiThread(() -> {
                    if (!checkAuth401(code)) return;
                    try {
                        JSONArray array = new JSONArray(body);
                        int oldSize = items.size();
                        items.clear();
                        if (oldSize > 0) adapter.notifyItemRangeRemoved(0, oldSize);

                        for (int i = 0; i < array.length(); i++) {
                            JSONObject obj     = array.getJSONObject(i);
                            JSONObject product = obj.getJSONObject("product");
                            items.add(new ProductsAdapter.ProductItem(
                                    obj.optInt("id", 0),
                                    product.optInt("id", 0),
                                    product.getString("label"),
                                    (float) obj.optDouble("quantity", 1),
                                    product.optString("unit", ""),
                                    obj.optBoolean("checked", false)
                            ));
                        }
                        // Restaurer l'ordre sauvegardé
                        OrderManager.applyOrder(items,
                                OrderManager.getSavedOrder(requireContext(), OrderManager.keyProducts(listId)),
                                item -> item.listItemId);
                        if (!items.isEmpty()) adapter.notifyItemRangeInserted(0, items.size());
                        updateEmptyState();
                    } catch (Exception e) {
                        Log.e(TAG, "Parsing: " + e.getMessage());
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Réseau: " + e.getMessage());
            }
        }).start();
    }

    //  Dialogue ajout/édition produit 

    private void showAddEditDialog(@Nullable ProductsAdapter.ProductItem editItem) {
        BottomSheetDialog dialog = new BottomSheetDialog(requireContext(), R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_add_edit_product,
                requireActivity().findViewById(android.R.id.content), false);
        dialog.setContentView(view);
        if (dialog.getWindow() != null)
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        MaterialAutoCompleteTextView editLabel = view.findViewById(R.id.editProductLabel);
        TextInputEditText editQty              = view.findViewById(R.id.editProductQuantity);
        TextInputEditText editUnit             = view.findViewById(R.id.editProductUnit);
        MaterialButton btnSave                 = view.findViewById(R.id.btnSaveProduct);
        MaterialButton btnCancel               = view.findViewById(R.id.btnCancelProduct);

        ArrayAdapter<String> suggestionAdapter =
                new ArrayAdapter<>(requireContext(), android.R.layout.simple_dropdown_item_1line);
        editLabel.setAdapter(suggestionAdapter);
        editLabel.setThreshold(1);
        editLabel.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int st, int c, int a) {}
            @Override public void onTextChanged(CharSequence s, int st, int b, int c) {
                if (s.length() >= 1) fetchSuggestions(s.toString(), suggestionAdapter);
            }
            @Override public void afterTextChanged(android.text.Editable s) {}
        });

        if (editItem != null) {
            editLabel.setText(editItem.label);
            editQty.setText(editItem.quantity > 0
                    ? (editItem.quantity == (int) editItem.quantity
                       ? String.valueOf((int) editItem.quantity)
                       : String.valueOf(editItem.quantity))
                    : "");
            editUnit.setText(editItem.unit);
        }

        btnCancel.setOnClickListener(v -> dialog.dismiss());
        btnSave.setOnClickListener(v -> {
            String label = editLabel.getText() != null ? editLabel.getText().toString().trim() : "";
            if (label.isEmpty()) { editLabel.setError("Veuillez saisir un nom"); return; }

            String qtyStr = editQty.getText() != null ? editQty.getText().toString().trim() : "";
            String unit   = editUnit.getText() != null ? editUnit.getText().toString().trim() : "";
            Float qty = qtyStr.isEmpty() ? null : Float.parseFloat(qtyStr);
            boolean checked = (editItem != null) && editItem.checked;

            if (editItem == null) {
                createProductThenAdd(label, unit, qty, checked);
            } else {
                updateProduct(editItem, label, unit, qty == null ? editItem.quantity : qty, checked);
            }
            dialog.dismiss();
        });

        editUnit.setOnEditorActionListener((tv, a, e) -> { btnSave.performClick(); return true; });
        dialog.show();
    }

    private void createProductThenAdd(String label, String unit, Float quantity, boolean checked) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("label", label);
                if (unit != null && !unit.isEmpty()) body.put("unit", unit);

                Response response = ApiLinker.getInstance().postData("/api/products", body, token);
                if (!checkAuth401(response.code())) return;

                if (response.isSuccessful()) {
                    JSONObject json = new JSONObject(response.body().string());
                    addProduct(json.getInt("id"), quantity, checked);
                }
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void addProduct(int productId, Float quantity, boolean checked) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("quantity", quantity != null ? quantity : 1);
                body.put("checked", checked);
                body.put("productId", productId);

                Response response = ApiLinker.getInstance()
                        .postData("/api/shopping-lists/" + listId + "/item-lists", body, token);
                if (!checkAuth401(response.code())) return;

                requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void updateProduct(ProductsAdapter.ProductItem item, String label, String unit,
                               float quantity, boolean checked) {
        new Thread(() -> {
            try {
                // Mise à jour du produit (label + unit)
                JSONObject bodyProduct = new JSONObject();
                bodyProduct.put("label", label);
                bodyProduct.put("unit", unit);
                Response r1 = ApiLinker.getInstance()
                        .putData("/api/products/" + item.productId, bodyProduct, token);
                if (!checkAuth401(r1.code())) return;

                // Mise à jour de la quantité et du statut
                JSONObject bodyItem = new JSONObject();
                bodyItem.put("quantity", quantity);
                bodyItem.put("checked", checked);
                Response r2 = ApiLinker.getInstance()
                        .patchData("/api/item-lists/" + item.listItemId, bodyItem, token);
                if (!checkAuth401(r2.code())) return;

                requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void checkProduct(int listItemId, boolean checked) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("checked", checked);
                Response response = ApiLinker.getInstance()
                        .patchData("/api/item-lists/" + listItemId, body, token);
                if (!checkAuth401(response.code())) return;
                if (response.isSuccessful())
                    requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    //  Dialogue ajout depuis recette 

    /** Bottom sheet de sélection multiple de recettes à ajouter à la liste. */
    private void showAddFromRecipeDialog() {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance().getData("/api/recipes", token);
                if (!checkAuth401(response.code())) return;
                String bodyStr = response.body().string();
                JSONArray recipesArray = new JSONArray(bodyStr);

                List<JSONObject> recipes = new ArrayList<>();
                for (int i = 0; i < recipesArray.length(); i++)
                    recipes.add(recipesArray.getJSONObject(i));

                requireActivity().runOnUiThread(() -> {
                    if (recipes.isEmpty()) return;

                    BottomSheetDialog dialog = new BottomSheetDialog(
                            requireContext(), R.style.Theme_MiamList_BottomSheet);
                    View view = getLayoutInflater().inflate(R.layout.dialog_add_recipes_to_list,
                            requireActivity().findViewById(android.R.id.content), false);
                    dialog.setContentView(view);
                    if (dialog.getWindow() != null)
                        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

                    LinearLayout listContainer = view.findViewById(R.id.recipeListContainer);
                    MaterialButton btnAdd    = view.findViewById(R.id.btnAddRecipes);
                    MaterialButton btnCancel = view.findViewById(R.id.btnCancel);

                    List<Integer> selectedIds = new ArrayList<>();

                    for (JSONObject recipe : recipes) {
                        try {
                            int    rid  = recipe.getInt("id");
                            String name = recipe.getString("name");

                            CheckBox cb = new CheckBox(requireContext());
                            cb.setText(name);
                            cb.setTextSize(15f);
                            cb.setPadding(16, 20, 16, 20);
                            cb.setTextColor(0xFF1A1A1A);
                            cb.setOnCheckedChangeListener((btn, checked) -> {
                                if (checked) selectedIds.add(rid);
                                else selectedIds.remove(Integer.valueOf(rid));
                            });
                            listContainer.addView(cb);
                        } catch (Exception ignored) {}
                    }

                    btnCancel.setOnClickListener(v -> dialog.dismiss());
                    btnAdd.setOnClickListener(v -> {
                        if (!selectedIds.isEmpty()) {
                            addRecipesToList(selectedIds);
                        }
                        dialog.dismiss();
                    });

                    dialog.show();
                });
            } catch (Exception e) {
                Log.e(TAG, "Recettes: " + e.getMessage());
            }
        }).start();
    }

    private void addRecipesToList(List<Integer> recipeIds) {
        new Thread(() -> {
            try {
                for (int recipeId : recipeIds) {
                    JSONObject body = new JSONObject();
                    body.put("recipeId", recipeId);
                    body.put("quantity", 1);
                    body.put("checked", false);
                    Response r = ApiLinker.getInstance()
                            .postData("/api/shopping-lists/" + listId + "/item-lists", body, token);
                    if (!checkAuth401(r.code())) return;
                }
                requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) {
                Log.e(TAG, "addRecipes: " + e.getMessage());
            }
        }).start();
    }

    //  Suppression 

    private void showDeleteConfirmDialog(ProductsAdapter.ProductItem item) {
        BottomSheetDialog dialog = new BottomSheetDialog(requireContext(), R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_delete_confirm,
                requireActivity().findViewById(android.R.id.content), false);
        dialog.setContentView(view);
        if (dialog.getWindow() != null)
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        ((TextView) view.findViewById(R.id.tvDeleteMessage))
                .setText("Supprimer \"" + item.label + "\" ?");
        view.findViewById(R.id.btnCancelDelete).setOnClickListener(v -> dialog.dismiss());
        view.findViewById(R.id.btnConfirmDelete).setOnClickListener(v -> {
            deleteProduct(item);
            dialog.dismiss();
        });
        dialog.show();
    }

    private void deleteProduct(ProductsAdapter.ProductItem item) {
        new Thread(() -> {
            try {
                Response r = ApiLinker.getInstance()
                        .deleteData("/api/item-lists/" + item.listItemId, token);
                if (!checkAuth401(r.code())) return;
                if (r.isSuccessful())
                    requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    //  Autocomplétion 

    private void fetchSuggestions(String query, ArrayAdapter<String> suggestionAdapter) {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance()
                        .getData("/api/products?label=" + query, token);
                if (response.isSuccessful()) {
                    JSONArray array = new JSONArray(response.body().string());
                    List<String> labels = new ArrayList<>();
                    for (int i = 0; i < array.length(); i++)
                        labels.add(array.getJSONObject(i).getString("label"));

                    requireActivity().runOnUiThread(() -> {
                        suggestionAdapter.clear();
                        suggestionAdapter.addAll(labels);
                        if (!labels.isEmpty()) suggestionAdapter.notifyDataSetChanged();
                    });
                }
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    //  Utilitaires 

    private void updateEmptyState() {
        tvProductCount.setText(String.valueOf(items.size()));
        layoutEmpty.setVisibility(items.isEmpty() ? View.VISIBLE : View.GONE);
    }

    /** Délègue la vérification 401 à la BaseActivity parente. */
    private boolean checkAuth401(int code) {
        if (getActivity() instanceof BaseActivity) {
            return ((BaseActivity) getActivity()).checkAuth(code);
        }
        return true;
    }
}
