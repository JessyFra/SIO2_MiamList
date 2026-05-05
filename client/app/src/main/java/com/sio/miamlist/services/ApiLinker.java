package com.sio.miamlist.services;

import android.util.Log;

import org.json.JSONObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ApiLinker {

    private final String BASE_URL = ""; // Variable
    private static ApiLinker instance = null;

    public static ApiLinker getInstance() {
        if (instance == null) {
            instance = new ApiLinker();
        }

        return instance;
    }

    public Response getData(String url, String token) {
        try {
            OkHttpClient client = new OkHttpClient();
            Request.Builder builder = new Request.Builder().url(BASE_URL + url).get();

            if (token != null) {
                builder.header("Authorization", "Bearer " + token);
            }

            Response response = client.newCall(builder.build()).execute();

            if (!response.isSuccessful()) {
                Log.e("GET", response.message());
            }

            return response;
        } catch (Exception e) {
            Log.e("GET", e.getMessage());
        }

        return null;
    }

    public Response postData(String url, JSONObject jsonObject, String token) {
        try {
            OkHttpClient client = new OkHttpClient();

            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(jsonObject.toString(), JSON);

            Request.Builder builder = new Request.Builder().url(BASE_URL + url).post(body);

            if (token != null) {
                builder.header("Authorization", "Bearer " + token);
            }

            Response response = client.newCall(builder.build()).execute();

            if (!response.isSuccessful()) {
                Log.e("GET", response.message());
            }

            return response;
        } catch (Exception e) {
            Log.e("POST", e.getMessage());
        }

        return null;
    }

    public Response putData(String url, JSONObject jsonObject, String token) {
        try {
            OkHttpClient client = new OkHttpClient();

            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(jsonObject.toString(), JSON);

            Request request = new Request.Builder().url(BASE_URL + url)
                .header("Authorization", "Bearer " + token)
                .put(body)
                .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                Log.e("PUT", response.message());
            }

            return response;
        } catch (Exception e) {
            Log.e("PUT", e.getMessage());
        }

        return null;
    }

    public Response patchData(String url, JSONObject jsonObject, String token) {
        try {
            OkHttpClient client = new OkHttpClient();

            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(jsonObject.toString(), JSON);

            Request request = new Request.Builder()
                .url(BASE_URL + url)
                .header("Authorization", "Bearer " + token)
                .patch(body)
                .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                Log.e("PATCH", response.message());
            }

            return response;
        } catch (Exception e) {
            Log.e("POST", e.getMessage());
        }

        return null;
    }

    public Response deleteData(String url, String token) {
        try {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                .url(BASE_URL + url)
                .header("Authorization", "Bearer " + token)
                .delete()
                .build();
            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                Log.e("DELETE", response.message());
            }

            return response;
        } catch (Exception e) {
            Log.e("POST", e.getMessage());
        }

        return null;
    }
}