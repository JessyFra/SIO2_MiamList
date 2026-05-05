package com.sio.miamlist.activities;

import android.content.Intent;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.textfield.TextInputEditText;
import com.sio.miamlist.R;
import com.sio.miamlist.adapters.ShoppingListsAdapter;
import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Response;

public class ShoppingListsActivity extends AppCompatActivity {

    private ShoppingListsAdapter adapter;
    private final List<ShoppingListsAdapter.ListItem> listsItem = new ArrayList<>();
    private String token;
    private TextView tvListCount;
    private View layoutEmpty;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_lists);

        token = SessionManager.getToken(getApplicationContext());

        tvListCount = findViewById(R.id.tvListCount);
        layoutEmpty = findViewById(R.id.layoutEmpty);

        RecyclerView recycler = findViewById(R.id.recyclerShoppingLists);
        recycler.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ShoppingListsAdapter(listsItem, new ShoppingListsAdapter.OnListActionListener() {
            @Override
            public void onListClick(int id, String name) {
                Intent intent = new Intent(ShoppingListsActivity.this, ListItemActivity.class);
                intent.putExtra("id", id);
                intent.putExtra("name", name);
                startActivity(intent);
            }

            @Override
            public void onListDelete(int id, String name) {
                showDeleteConfirmDialog(id, name);
            }
        });
        recycler.setAdapter(adapter);

        ExtendedFloatingActionButton fab = findViewById(R.id.fabAddList);
        fab.setOnClickListener(v -> showCreateListDialog());

        loadLists();
    }

    private void showDeleteConfirmDialog(int id, String name) {
        BottomSheetDialog dialog = new BottomSheetDialog(this, R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_delete_confirm, findViewById(android.R.id.content), false);
        dialog.setContentView(view);

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }

        TextView tvMessage       = view.findViewById(R.id.tvDeleteMessage);
        MaterialButton btnCancel = view.findViewById(R.id.btnCancelDelete);
        MaterialButton btnDelete = view.findViewById(R.id.btnConfirmDelete);

        tvMessage.setText("Voulez-vous vraiment supprimer la liste \"" + name + "\" ?");
        btnCancel.setOnClickListener(v -> dialog.dismiss());
        btnDelete.setOnClickListener(v -> {
            deleteList(id);
            dialog.dismiss();
        });

        dialog.show();
    }

    private void loadLists() {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance().getData("/api/shopping-lists", token);
                String body = response.body().string();
                runOnUiThread(() -> {
                    try {
                        JSONArray array = new JSONArray(body);
                        int oldSize = listsItem.size();
                        listsItem.clear();

                        if (oldSize > 0) {
                            adapter.notifyItemRangeRemoved(0, oldSize);
                        }

                        for (int i = 0; i < array.length(); i++) {
                            JSONObject obj = array.getJSONObject(i);
                            listsItem.add(new ShoppingListsAdapter.ListItem(
                                    obj.getInt("id"),
                                    obj.getString("name")
                            ));
                        }

                        if (!listsItem.isEmpty()) {
                            adapter.notifyItemRangeInserted(0, listsItem.size());
                        }

                        updateEmptyState();
                    } catch (Exception e) {
                        Log.e("SHOPPINGLIST", e.toString());
                    }
                });
            } catch (Exception e) {
                Log.e("SHOPPINGLIST", e.toString());
            }
        }).start();
    }

    private void updateEmptyState() {
        int count = listsItem.size();
        tvListCount.setText(String.valueOf(count));
        layoutEmpty.setVisibility(count == 0 ? View.VISIBLE : View.GONE);
    }

    private void showCreateListDialog() {
        BottomSheetDialog dialog = new BottomSheetDialog(this, R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_create_list, findViewById(android.R.id.content), false);
        dialog.setContentView(view);

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }

        TextInputEditText editName = view.findViewById(R.id.editListName);
        MaterialButton btnCreate  = view.findViewById(R.id.btnCreate);
        MaterialButton btnCancel  = view.findViewById(R.id.btnCancel);

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnCreate.setOnClickListener(v -> {
            String name = editName.getText() != null
                    ? editName.getText().toString().trim() : "";
            if (!name.isEmpty()) {
                createList(name);
                dialog.dismiss();
            } else {
                editName.setError("Veuillez saisir un nom");
            }
        });

        editName.setOnEditorActionListener((tv, actionId, event) -> {
            btnCreate.performClick();
            return true;
        });

        dialog.show();
    }

    private void createList(String name) {
        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("name", name);
                Response response = ApiLinker.getInstance().postData("/api/shopping-lists", body, token);
                if (response.isSuccessful()) loadLists();
            } catch (Exception e) {
                Log.e("SHOPPINGLIST", e.toString());
            }
        }).start();
    }

    private void deleteList(int id) {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance().deleteData("/api/shopping-lists/" + id, token);

                if (response.isSuccessful()) {
                    loadLists();
                }
            } catch (Exception e) {
                Log.e("SHOPPINGLIST", e.toString());
            }
        }).start();
    }

    public void loadRecipeList(View view) {
        Intent intent = new Intent(ShoppingListsActivity.this, RecipeActivity.class);
        startActivity(intent);
        overridePendingTransition(0, 0);
    }
}