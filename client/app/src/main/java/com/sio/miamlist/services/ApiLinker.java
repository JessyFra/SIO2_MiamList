package com.sio.miamlist.services;

import org.json.JSONObject;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ApiLinker {

    private final String BASE_URL = "http://10.0.2.2:3000"; // Variable
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
            Request.Builder builder = new Request.Builder().url(BASE_URL + url);
            if (token != null) builder.header("Authorization", "Bearer " + token);
            return client.newCall(builder.build()).execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Response postData(String url, JSONObject jsonObject, String token) {
        try {
            OkHttpClient client = new OkHttpClient();
            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
            Request.Builder builder = new Request.Builder()
                    .url(BASE_URL + url)
                    .post(body);
            if (token != null) builder.header("Authorization", "Bearer " + token);
            return client.newCall(builder.build()).execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Response putData(String url, JSONObject jsonObject, String token) {
        try {
            OkHttpClient client = new OkHttpClient();
            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(jsonObject.toString(), JSON);
            Request request = new Request.Builder()
                    .url(BASE_URL + url)
                    .header("Authorization", "Bearer " + token)
                    .put(body)
                    .build();
            return client.newCall(request).execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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
            return client.newCall(request).execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Response deleteData(String url, String token) {
        try {
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url(BASE_URL + url)
                    .header("Authorization", "Bearer " + token)
                    .delete()
                    .build();
            return client.newCall(request).execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}