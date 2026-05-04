package com.sio.miamlist.services;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    public static void saveToken(String token, Context context) {
        SharedPreferences prefs = context.getSharedPreferences("MIAMLIST-SESSION", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("token", token);

        editor.apply();
    }

    public static String getToken(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("MIAMLIST-SESSION", MODE_PRIVATE);
        return prefs.getString("token", "");
    }

    public static void deleteToken(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("MIAMLIST-SESSION", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("token", "");

        editor.apply();
    }

}
