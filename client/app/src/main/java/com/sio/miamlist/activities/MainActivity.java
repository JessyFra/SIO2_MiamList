package com.sio.miamlist.activities;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;

import okhttp3.Response;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());

        new Thread(() -> {
            String token = SessionManager.getToken(getApplicationContext());

            Response response = ApiLinker.getInstance().getData("/api/me", token);
            Intent intent;

            if (response.isSuccessful()) {
                intent = new Intent(this, ShoppingListsActivity.class);
            } else {
                intent = new Intent(this, LoginActivity.class);
            }

            runOnUiThread(() -> {
                startActivity(intent);
                finish();
            });
        }).start();
    }
}
