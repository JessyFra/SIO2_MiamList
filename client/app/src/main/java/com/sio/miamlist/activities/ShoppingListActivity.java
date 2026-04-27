package com.sio.miamlist.activities;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.EditText;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shopping_list);

        SharedPreferences prefs = getSharedPreferences("miamlist", MODE_PRIVATE);
        token = prefs.getString("token", null);

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

        FloatingActionButton fab = findViewById(R.id.fabAddList);
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
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void showCreateListDialog() {
        EditText input = new EditText(this);
        input.setHint("Nom de la liste");

        new AlertDialog.Builder(this)
                .setTitle("Nouvelle liste")
                .setView(input)
                .setPositiveButton("Créer", (dialog, which) -> {
                    String name = input.getText().toString().trim();
                    if (!name.isEmpty()) createList(name);
                })
                .setNegativeButton("Annuler", null)
                .show();
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