package com.sio.miamlist.activities;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.sio.miamlist.services.ApiLinker;
import com.sio.miamlist.services.SessionManager;
import com.sio.miamlist.utils.ConnectionManager;

import okhttp3.Response;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        controller.hide(WindowInsetsCompat.Type.systemBars());

        new Thread(() -> {
            boolean hasTransport = ConnectionManager.checkTransport(getApplicationContext());

            if (!hasTransport) {
                startActivity(new Intent(getApplicationContext(), OfflineErrorActivity.class));
                finish();
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
                startActivity(new Intent(getApplicationContext(), OfflineErrorActivity.class));
                finish();
                return;
            }

            runOnUiThread(() -> {
                startActivity(intent);
                finish();
            });
        }).start();
    }
}
