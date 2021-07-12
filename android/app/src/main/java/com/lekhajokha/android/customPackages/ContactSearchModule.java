package com.lekhajokha.android.customPackages;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

public class ContactSearchModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    public ContactSearchModule(@NonNull ReactApplicationContext context) {
        super (context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ContactSearch";
    }

    @ReactMethod
    public void search(ReadableArray contacts, String text, Callback successCallback, Callback failureCallback) {

        try {

            if (contacts == null || contacts.size () == 0) {
                failureCallback.invoke ("empty contact");
                return;
            }

            WritableArray returnArr = new WritableNativeArray ();

            for (int i = 0; i < contacts.size (); i++) {
                ReadableMap contact = contacts.getMap (i);

                if (contact == null) {
                    return;
                }

                String name = contact.getString ("name");
                String ph_no = null;
                if (contact.hasKey ("phoneNumbers")) {
                    ReadableArray ph_arr = contact.getArray ("phoneNumbers");
                    if (ph_arr != null && ph_arr.size () != 0) {
                        ReadableMap ph_obj = ph_arr.getMap (0);
                        if (ph_obj != null) {
                            ph_no = ph_obj.getString ("String");
                        }
                    }
                }


                if (name != null && name.length () != 0) {
                    if (name.toLowerCase ().contains (text.toLowerCase ())) {
                        returnArr.pushMap (contact);
                        continue;
                    }
                }

                if (ph_no != null && ph_no.length () != 0) {
                    if (ph_no.toLowerCase ().contains (text.toLowerCase ())) {
                        returnArr.pushMap (contact);
                    }
                }
            }

            successCallback.invoke (returnArr);
        }
        catch (Exception e) {
            failureCallback.invoke (e.getMessage ());
        }

    }
}
