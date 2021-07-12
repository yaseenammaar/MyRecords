package com.lekhajokha.android.customPackages;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<> ();

        modules.add(new ContactSearchModule (reactContext));
        modules.add(new GetContactsDataModule (reactContext));
        modules.add(new ImagePickerModule(reactContext));

        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList ();
    }
}
