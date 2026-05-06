package com.sio.miamlist.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.sio.miamlist.R;
import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;

import org.json.JSONObject;

import okhttp3.Response;

public class LoginActivity extends AppCompatActivity {

    private TextInputEditText editEmail, editPassword;
    private TextView tvError;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        editEmail    = findViewById(R.id.editEmail);
        editPassword = findViewById(R.id.editPassword);
        tvError      = findViewById(R.id.tvError);
        Button btnLogin = findViewById(R.id.btnLogin);

        btnLogin.setOnClickListener(v -> login());
    }

    private void login() {
        String email    = editEmail.getText().toString().trim();
        String password = editPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            showError("Veuillez remplir tous les champs");
            return;
        }

        new Thread(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("email", email);
                body.put("password", password);

                Response response = ApiLinker.getInstance().postData("/api/login", body, null);
                String responseBody = response.body().string();

                runOnUiThread(() -> {
                    try {
                        JSONObject json = new JSONObject(responseBody);
                        if (response.isSuccessful()) {
                            String token = json.getString("access_token");
                            SessionManager.saveToken(token, this);
                            startActivity(new Intent(this, ShoppingListsActivity.class));
                            finish();
                        } else {
                            // FIX: l'API renvoie "error", pas "message"
                            String msg = json.optString("error",
                                         json.optString("message", "Erreur de connexion"));
                            showError(msg);
                        }
                    } catch (Exception e) {
                        showError("Erreur inattendue");
                    }
                });
            } catch (Exception e) {
                runOnUiThread(() -> showError("Impossible de joindre le serveur"));
            }
        }).start();
    }

    private void showError(String message) {
        runOnUiThread(() -> {
            tvError.setText(message);
            tvError.setVisibility(View.VISIBLE);
        });
    }
}
