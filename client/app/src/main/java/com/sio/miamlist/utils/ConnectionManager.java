package com.sio.miamlist.utils;

import android.content.Context;

import com.sio.miamlist.services.ApiLinker;

public class ConnectionManager {

    public static boolean checkTransport(Context context) {
        android.net.ConnectivityManager $manager = (android.net.ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        android.net.NetworkCapabilities capabilities = $manager.getNetworkCapabilities($manager.getActiveNetwork());

        return capabilities != null && (
            capabilities.hasTransport(android.net.NetworkCapabilities.TRANSPORT_WIFI) || capabilities.hasTransport(android.net.NetworkCapabilities.TRANSPORT_CELLULAR)
        );
    }

    public static boolean checkApiService() {
        try {
            ApiLinker.getInstance().getData("/api/me", null);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean checkAll(Context context) {
        return checkTransport(context) && checkApiService();
    }

}
