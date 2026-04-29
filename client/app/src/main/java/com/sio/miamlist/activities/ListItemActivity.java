package com.sio.miamlist.activities;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.sio.miamlist.R;
import com.sio.miamlist.fragments.ProductsFragment;

public class ListItemActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_item);

        int    listId   = getIntent().getIntExtra("id", 0);
        String listName = getIntent().getStringExtra("name");
        if (listName == null) listName = "Produits";

        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragmentContainer,
                            ProductsFragment.newInstance(listId, listName))
                    .commit();
        }
    }

    // Permet au Fragment d'appeler onBackPressed()
    @Override
    public void onBackPressed() {
        super.onBackPressed();
    }
}