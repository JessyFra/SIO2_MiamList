package com.sio.miamlist.activities;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.sio.miamlist.services.SessionManager;

import okhttp3.Response;

/**
 * Activité de base qui centralise :
 *  - la déconnexion (logout)
 *  - la redirection vers LoginActivity en cas de réponse 401
 */
public abstract class BaseActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * Vérifie si la réponse HTTP est un 401.
     * Si oui : efface le token, redirige vers LoginActivity et retourne false.
     * @return true si la réponse est OK (pas un 401), false si redirection déclenchée.
     */
    public boolean checkAuth(Response response) {
        if (response != null && response.code() == 401) {
            logout();
            return false;
        }
        return true;
    }

    /**
     * Surcharge pour int (utile quand le body est déjà consommé).
     */
    public boolean checkAuth(int code) {
        if (code == 401) {
            logout();
            return false;
        }
        return true;
    }

    /**
     * Efface le token de session et redirige vers LoginActivity.
     */
    public void logout() {
        SessionManager.deleteToken(getApplicationContext());
        runOnUiThread(() -> {
            Intent intent = new Intent(this, LoginActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }
}
