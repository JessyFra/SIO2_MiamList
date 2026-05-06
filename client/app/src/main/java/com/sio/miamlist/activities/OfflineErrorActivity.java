package com.sio.miamlist.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.sio.miamlist.R;
import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;
import com.sio.miamlist.utils.ConnectionManager;

import okhttp3.Response;

public class OfflineErrorActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_offline_error);

        MaterialButton retryButton = findViewById(R.id.retry);

        retryButton.setOnClickListener(v -> {
            new Thread(() -> {
                boolean hasTransport = ConnectionManager.checkTransport(getApplicationContext());

                if (!hasTransport) {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Veuillez vérifier votre connexion internet", Toast.LENGTH_SHORT).show();
                    });

                    return;
                }

                String token = SessionManager.getToken(getApplicationContext());
                Intent intent;

                try {
                    Response response = ApiLinker.getInstance().getData("/api/me", token);

                    if (response.isSuccessful()) {
                        intent = new Intent(getApplicationContext(), ShoppingListsActivity.class);
                    } else {
                        intent = new Intent(getApplicationContext(), LoginActivity.class);
                    }

                    response.close();
                } catch (Exception e) {
                    runOnUiThread(() -> {
                        Toast.makeText(getApplicationContext(), "Service indisponible, veuillez réessayer plus tard", Toast.LENGTH_SHORT).show();
                    });

                    return;
                }

                runOnUiThread(() -> {
                    startActivity(intent);
                    finish();
                });
            }).start();
        });
    }

}
