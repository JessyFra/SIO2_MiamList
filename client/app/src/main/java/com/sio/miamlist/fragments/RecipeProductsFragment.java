package com.sio.miamlist.fragments;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.textfield.TextInputEditText;
import com.sio.miamlist.R;
import com.sio.miamlist.adapters.RecipeAdapter;
import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Response;

public class RecipeProductsFragment extends Fragment {

    private static final String TAG      = "RecipeProductsFragment";
    private static final String ARG_ID   = "listId";
    private static final String ARG_NAME = "listName";

    private int    listId;
    private String listName;
    private String token;

    private final List<RecipeAdapter.RecipeItem> items = new ArrayList<>();
    private RecipeAdapter adapter;

    private TextView tvListName;
    private TextView tvProductCount;
    private View     layoutEmpty;

    public static RecipeProductsFragment newInstance(int listId, String listName) {
        RecipeProductsFragment f = new RecipeProductsFragment();
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
            listName = getArguments().getString(ARG_NAME, "Recette");
        }

        token = SessionManager.getToken(getContext());
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_recipe_products, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        tvListName     = view.findViewById(R.id.tvRecipeName);
        tvProductCount = view.findViewById(R.id.tvProductCount);
        layoutEmpty    = view.findViewById(R.id.layoutEmpty);

        tvListName.setText(listName);

        RecyclerView recycler = view.findViewById(R.id.recyclerRecipes);
        recycler.setLayoutManager(new LinearLayoutManager(requireContext()));

        adapter = new RecipeAdapter(items, new RecipeAdapter.OnProductActionListener() {
            @Override
            public void onEdit(RecipeAdapter.RecipeItem item) {
                showAddEditDialog(item);
            }

            @Override
            public void onDelete(RecipeAdapter.RecipeItem item) {
                showDeleteConfirmDialog(item);
            }
        });
        recycler.setAdapter(adapter);

        ExtendedFloatingActionButton fab = view.findViewById(R.id.fabAddProduct);
        fab.setOnClickListener(v -> showAddEditDialog(null));

        loadProducts();
    }

    private void loadProducts() {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance()
                        .getData("/api/recipe/" + listId + "/recipe-products", token);
                String body = response.body().string();

                requireActivity().runOnUiThread(() -> {
                    try {
                        JSONArray array = new JSONArray(body);

                        int oldSize = items.size();
                        items.clear();
                        if (oldSize > 0)
                            adapter.notifyItemRangeRemoved(0, oldSize);

                        for (int i = 0; i < array.length(); i++) {
                            JSONObject obj     = array.getJSONObject(i);
                            JSONObject product = obj.getJSONObject("product");
                            items.add(new RecipeAdapter.RecipeItem(
                                    obj.optInt("id", 0),
                                    product.optInt("id", 0),
                                    product.getString("label"),
                                    (float) obj.optDouble("quantity", 1),
                                    product.optString("unit", "")
                            ));
                        }

                        if (!items.isEmpty())
                            adapter.notifyItemRangeInserted(0, items.size());

                        updateEmptyState();

                    } catch (Exception e) {
                        Log.e(TAG, "Parsing : " + e.getMessage());
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Réseau : " + e.getMessage());
            }
        }).start();
    }

    private void showAddEditDialog(@Nullable RecipeAdapter.RecipeItem editItem) {
        BottomSheetDialog dialog = new BottomSheetDialog(requireContext(),
                R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_add_edit_product,
                requireActivity().findViewById(android.R.id.content), false);

        dialog.setContentView(view);

        if (dialog.getWindow() != null)
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        TextView          tvTitle    = view.findViewById(R.id.tvDialogTitle);
        TextInputEditText editLabel  = view.findViewById(R.id.editProductLabel);
        TextInputEditText editQty    = view.findViewById(R.id.editProductQuantity);
        TextInputEditText editUnit   = view.findViewById(R.id.editProductUnit);
        MaterialButton    btnCancel  = view.findViewById(R.id.btnCancelProduct);
        MaterialButton    btnSave    = view.findViewById(R.id.btnSaveProduct);

        if (editItem != null) {
            tvTitle.setText("Modifier le produit");
            editLabel.setText(editItem.label);

            if (editItem.quantity > 0) {
                editQty.setText(editItem.quantity == (int) editItem.quantity
                        ? String.valueOf((int) editItem.quantity)
                        : String.valueOf(editItem.quantity));
            }
            if (editItem.unit != null && !editItem.unit.isEmpty()) {
                editUnit.setText(editItem.unit);
            }
        }

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnSave.setOnClickListener(v -> {
            String label = editLabel.getText() != null
                    ? editLabel.getText().toString().trim() : "";
            if (label.isEmpty()) {
                editLabel.setError("Veuillez saisir un nom");
                return;
            }

            String qtyStr  = editQty.getText()  != null ? editQty.getText().toString().trim()  : "";
            String unitStr = editUnit.getText() != null ? editUnit.getText().toString().trim() : "";
            float  qty     = qtyStr.isEmpty() ? 1f : Float.parseFloat(qtyStr);

            if (editItem == null) {
                createProduct(label, unitStr, qty);
            } else {
                updateProduct(editItem, label, unitStr, qty);
            }

            dialog.dismiss();
        });

        editUnit.setOnEditorActionListener((tv, a, e) -> {
            btnSave.performClick();
            return true;
        });

        dialog.show();
    }

    private void createProduct(String label, String unit, float qty) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("label", label);
                if (!unit.isEmpty()) body.put("unit", unit);

                Response response = ApiLinker.getInstance().postData("/products", body, token);

                if (response.isSuccessful()) {
                    String    respBody    = response.body().string();
                    JSONObject json       = new JSONObject(respBody);
                    int        newProductId = json.getInt("id");

                    addProduct(newProductId, qty);
                }
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void addProduct(int productId, float quantity) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("quantity", quantity);
                body.put("productId", productId);

                Response response = ApiLinker.getInstance()
                        .postData("/recipe/" + listId + "/recipe-products", body, token);

                if (response.isSuccessful())
                    requireActivity().runOnUiThread(this::loadProducts);

            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void updateProduct(RecipeAdapter.RecipeItem item, String label, String unit, float quantity) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("label", label);
                body.put("unit", unit);

                ApiLinker.getInstance().putData("/api/products/" + item.productId, body, token);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();

        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("quantity", quantity);

                Response response = ApiLinker.getInstance()
                        .patchData("/api/recipe-products/" + item.listItemId, body, token);

                if (response.isSuccessful())
                    requireActivity().runOnUiThread(this::loadProducts);

            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void showDeleteConfirmDialog(RecipeAdapter.RecipeItem item) {
        BottomSheetDialog dialog = new BottomSheetDialog(requireContext(),
                R.style.Theme_MiamList_BottomSheet);
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

    private void deleteProduct(RecipeAdapter.RecipeItem item) {
        new Thread(() -> {
            try {
                Response r = ApiLinker.getInstance()
                        .deleteData("/api/recipe-products/" + item.listItemId, token);
                if (r.isSuccessful())
                    requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) {
                Log.e(TAG, e.getMessage());
            }
        }).start();
    }

    private void updateEmptyState() {
        tvProductCount.setText(String.valueOf(items.size()));
        layoutEmpty.setVisibility(items.isEmpty() ? View.VISIBLE : View.GONE);
    }
}