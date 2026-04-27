package com.sio.miamlist.services;

import org.json.JSONObject;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ApiLinker {

    private final String BASE_URL = "localhost:3000/api/";
    private static ApiLinker instance = null;

    public static ApiLinker getInstance() {
        if (instance == null) {
            instance = new ApiLinker();
        }

        return instance;
    }

    public Response getData(String url, String token) {
        OkHttpClient client;
        Response response;

        try {
            client = new OkHttpClient();
            Request request;

            if (token != null) {
                request = new Request.Builder()
                        .url(BASE_URL + url)
                        .header("Authorization", "Bearer " + token)
                        .build();
            } else {
                request = new Request.Builder()
                        .url(BASE_URL + url)
                        .build();
            }

            Call call = client.newCall(request);
            response = call.execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return response;
    }

    public Response postData(String url, JSONObject jsonObject, String token) {
        OkHttpClient client;
        Response response;

        try {
            client = new OkHttpClient();

            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(jsonObject.toString(), JSON);

            Request request;
            if (token != null) {
                request = new Request.Builder()
                        .url(BASE_URL + url)
                        .header("Authorization", "Bearer " + token)
                        .post(body)
                        .build();
            } else {
                request = new Request.Builder()
                        .url(BASE_URL + url)
                        .post(body)
                        .build();
            }

            Call call = client.newCall(request);
            response = call.execute();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return response;
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
