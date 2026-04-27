package com.sio.miamlist.activities;

import android.content.SharedPreferences;
import android.os.Bundle;
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
import com.sio.miamlist.adapters.ShoppingListAdapter;
import com.sio.miamlist.services.ApiLinker;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import okhttp3.Response;

public class ShoppingListActivity extends AppCompatActivity {

    private ShoppingListAdapter adapter;
    private final List<ShoppingListAdapter.ListItem> items = new ArrayList<>();
    private String token;
    private TextView tvListCount;
    private View layoutEmpty;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_list);

        SharedPreferences prefs = getSharedPreferences("miamlist", MODE_PRIVATE);
        token = prefs.getString("token", null);

        tvListCount = findViewById(R.id.tvListCount);
        layoutEmpty = findViewById(R.id.layoutEmpty);

        RecyclerView recycler = findViewById(R.id.recyclerShoppingLists);
        recycler.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ShoppingListAdapter(items, new ShoppingListAdapter.OnListActionListener() {
            @Override
            public void onListClick(int id, String name) {
                // TODO : ouvrir le détail de la liste (issue #22)
            }

            @Override
            public void onListDelete(int id) {
                deleteList(id);
            }
        });
        recycler.setAdapter(adapter);

        ExtendedFloatingActionButton fab = findViewById(R.id.fabAddList);
        fab.setOnClickListener(v -> showCreateListDialog());

        loadLists();
    }

    private void loadLists() {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance().getData("/api/lists", token);
                String body = response.body().string();
                runOnUiThread(() -> {
                    try {
                        JSONArray array = new JSONArray(body);
                        items.clear();
                        for (int i = 0; i < array.length(); i++) {
                            JSONObject obj = array.getJSONObject(i);
                            items.add(new ShoppingListAdapter.ListItem(
                                    obj.getInt("id"),
                                    obj.getString("name")
                            ));
                        }
                        adapter.notifyDataSetChanged();
                        updateEmptyState();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void updateEmptyState() {
        int count = items.size();
        tvListCount.setText(String.valueOf(count));
        layoutEmpty.setVisibility(count == 0 ? View.VISIBLE : View.GONE);
    }

    private void showCreateListDialog() {
        BottomSheetDialog dialog = new BottomSheetDialog(this, R.style.Theme_MiamList_BottomSheet);
        View view = getLayoutInflater().inflate(R.layout.dialog_create_list, null);
        dialog.setContentView(view);

        // Fond transparent pour que bg_bottom_sheet s'applique correctement
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

        // Valider avec la touche "Entrée" du clavier
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
                Response response = ApiLinker.getInstance().postData("/api/lists", body, token);
                if (response.isSuccessful()) loadLists();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void deleteList(int id) {
        new Thread(() -> {
            try {
                Response response = ApiLinker.getInstance().deleteData("/api/lists/" + id, token);
                if (response.isSuccessful()) loadLists();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}