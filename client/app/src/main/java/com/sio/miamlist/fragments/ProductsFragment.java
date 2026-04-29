package com.sio.miamlist.fragments;

import android.content.SharedPreferences;
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
import com.sio.miamlist.adapters.ProductsAdapter;
import com.sio.miamlist.services.ApiLinker;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Response;

import static android.content.Context.MODE_PRIVATE;

public class ProductsFragment extends Fragment {

    private static final String TAG      = "ProductsFragment";
    private static final String ARG_ID   = "listId";
    private static final String ARG_NAME = "listName";

    private int    listId;
    private String listName;
    private String token;

    private final List<ProductsAdapter.ProductItem> items = new ArrayList<>();
    private ProductsAdapter adapter;

    private TextView tvListName;
    private TextView tvProductCount;
    private View     layoutEmpty;

    //  Factory 

    public static ProductsFragment newInstance(int listId, String listName) {
        ProductsFragment f = new ProductsFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_ID, listId);
        args.putString(ARG_NAME, listName);
        f.setArguments(args);
        return f;
    }

    //  Lifecycle 

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            listId   = getArguments().getInt(ARG_ID, 0);
            listName = getArguments().getString(ARG_NAME, "Produits");
        }
        SharedPreferences prefs = requireActivity()
                .getSharedPreferences("miamlist", MODE_PRIVATE);
        token = prefs.getString("token", null);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_products, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        tvListName     = view.findViewById(R.id.tvListName);
        tvProductCount = view.findViewById(R.id.tvProductCount);
        layoutEmpty    = view.findViewById(R.id.layoutEmpty);

        tvListName.setText(listName);

        //  RecyclerView 
        RecyclerView recycler = view.findViewById(R.id.recyclerProducts);
        recycler.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new ProductsAdapter(items, new ProductsAdapter.OnProductActionListener() {
            @Override public void onEdit(ProductsAdapter.ProductItem item)   { showAddEditDialog(item); }
            @Override public void onDelete(ProductsAdapter.ProductItem item) { showDeleteConfirmDialog(item); }
            @Override public void onCheckedChanged(ProductsAdapter.ProductItem item, boolean checked) {
                patchChecked(item, checked);
            }
        });
        recycler.setAdapter(adapter);

        //  FAB 
        ExtendedFloatingActionButton fab = view.findViewById(R.id.fabAddProduct);
        fab.setOnClickListener(v -> showAddEditDialog(null));

        loadProducts();
    }

    //  GET /api/lists/{id}/items 

    private void loadProducts() {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance()
                        .getData("/api/lists/" + listId + "/items", token);
                String body = response.body().string();

                requireActivity().runOnUiThread(() -> {
                    try {
                        JSONArray array = new JSONArray(body);
                        int oldSize = items.size();
                        items.clear();
                        if (oldSize > 0) adapter.notifyItemRangeRemoved(0, oldSize);

                        for (int i = 0; i < array.length(); i++) {
                            JSONObject obj     = array.getJSONObject(i);
                            JSONObject product = obj.getJSONObject("product");
                            items.add(new ProductsAdapter.ProductItem(
                                    obj.getInt("id"),
                                    product.getInt("id"),
                                    product.getString("label"),
                                    (float) obj.optDouble("quantity", 1),
                                    product.optString("unit", ""),
                                    obj.optBoolean("checked", false)
                            ));
                        }

                        if (!items.isEmpty()) adapter.notifyItemRangeInserted(0, items.size());
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

    //  Dialog Ajout / Modification 

    private void showAddEditDialog(@Nullable ProductsAdapter.ProductItem editItem) {
        BottomSheetDialog dialog = new BottomSheetDialog(
                requireContext(), R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_add_edit_product,
                requireActivity().findViewById(android.R.id.content), false);
        dialog.setContentView(view);
        if (dialog.getWindow() != null)
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        TextView          tvTitle   = view.findViewById(R.id.tvDialogTitle);
        TextInputEditText editLabel = view.findViewById(R.id.editProductLabel);
        TextInputEditText editQty   = view.findViewById(R.id.editProductQuantity);
        TextInputEditText editUnit  = view.findViewById(R.id.editProductUnit);
        MaterialButton    btnCancel = view.findViewById(R.id.btnCancelProduct);
        MaterialButton    btnSave   = view.findViewById(R.id.btnSaveProduct);

        if (editItem != null) {
            tvTitle.setText("Modifier le produit");
            editLabel.setText(editItem.label);
            if (editItem.quantity > 0)
                editQty.setText(editItem.quantity == (int) editItem.quantity
                        ? String.valueOf((int) editItem.quantity)
                        : String.valueOf(editItem.quantity));
            if (editItem.unit != null && !editItem.unit.isEmpty())
                editUnit.setText(editItem.unit);
        }

        btnCancel.setOnClickListener(v -> dialog.dismiss());
        btnSave.setOnClickListener(v -> {
            String label = editLabel.getText() != null ? editLabel.getText().toString().trim() : "";
            if (label.isEmpty()) { editLabel.setError("Veuillez saisir un nom"); return; }
            String qtyStr  = editQty.getText()  != null ? editQty.getText().toString().trim()  : "";
            String unitStr = editUnit.getText() != null ? editUnit.getText().toString().trim() : "";
            float  qty     = qtyStr.isEmpty() ? 1f : Float.parseFloat(qtyStr);
            if (editItem == null) createProduct(label, qty, unitStr);
            else                  updateProduct(editItem, label, qty, unitStr);
            dialog.dismiss();
        });
        editUnit.setOnEditorActionListener((tv, a, e) -> { btnSave.performClick(); return true; });
        dialog.show();
    }

    //  POST /api/lists/{id}/items 

    private void createProduct(String label, float quantity, String unit) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("label", label);
                body.put("quantity", quantity);
                if (!unit.isEmpty()) body.put("unit", unit);
                Response r = ApiLinker.getInstance()
                        .postData("/api/lists/" + listId + "/items", body, token);
                if (r.isSuccessful()) requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) { Log.e(TAG, e.getMessage()); }
        }).start();
    }

    //  PUT /api/list-items/{id} 

    private void updateProduct(ProductsAdapter.ProductItem item,
                               String label, float quantity, String unit) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("label", label);
                body.put("quantity", quantity);
                body.put("unit", unit);
                Response r = ApiLinker.getInstance()
                        .putData("/api/list-items/" + item.listItemId, body, token);
                if (r.isSuccessful()) requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) { Log.e(TAG, e.getMessage()); }
        }).start();
    }

    //  Dialog suppression 

    private void showDeleteConfirmDialog(ProductsAdapter.ProductItem item) {
        BottomSheetDialog dialog = new BottomSheetDialog(
                requireContext(), R.style.Theme_MiamList_BottomSheet);
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

    //  DELETE /api/list-items/{id} 

    private void deleteProduct(ProductsAdapter.ProductItem item) {
        new Thread(() -> {
            try {
                Response r = ApiLinker.getInstance()
                        .deleteData("/api/list-items/" + item.listItemId, token);
                if (r.isSuccessful()) requireActivity().runOnUiThread(this::loadProducts);
            } catch (Exception e) { Log.e(TAG, e.getMessage()); }
        }).start();
    }

    //  PATCH /api/list-items/{id} 

    private void patchChecked(ProductsAdapter.ProductItem item, boolean checked) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("checked", checked);
                Response r = ApiLinker.getInstance()
                        .patchData("/api/list-items/" + item.listItemId, body, token);
                if (!r.isSuccessful()) {
                    requireActivity().runOnUiThread(() -> {
                        item.checked = !checked;
                        int idx = items.indexOf(item);
                        if (idx >= 0) adapter.notifyItemChanged(idx);
                    });
                }
            } catch (Exception e) { Log.e(TAG, e.getMessage()); }
        }).start();
    }

    //  UI 

    private void updateEmptyState() {
        tvProductCount.setText(String.valueOf(items.size()));
        layoutEmpty.setVisibility(items.isEmpty() ? View.VISIBLE : View.GONE);
    }
}