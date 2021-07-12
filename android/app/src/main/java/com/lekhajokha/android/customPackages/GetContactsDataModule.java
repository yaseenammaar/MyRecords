package com.lekhajokha.android.customPackages;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.lekhajokha.android.customPackages.Repository.FetchContacts;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


public class GetContactsDataModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext ctx;
    private FetchContacts contactsRepository = new FetchContacts ();

    public GetContactsDataModule(@NonNull ReactApplicationContext reactContext) {
        super (reactContext);
        this.ctx = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "getAllContacts";
    }

    @ReactMethod
    public void get( Callback successCallback, Callback failureCallback ) {
        ExecutorService executorService = Executors.newFixedThreadPool(1);

        try {

            executorService.execute (() -> {
                WritableMap data = contactsRepository.getPhoneNumbers (ctx);

                successCallback.invoke(data);
            });

        } catch (Exception e) {

            failureCallback.invoke (e);

        }
    }
}
