package com.lekhajokha.android.customPackages.Repository;

import android.database.Cursor;
import android.provider.ContactsContract;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;

public class FetchContacts {
    private static final String TAG = "FetchContacts";

//    private ArrayList<Map<String, String>> contactsArrayList = new ArrayList<> ();
    private ArrayList<ArrayList<Integer>> indexingMapArrayList = new ArrayList<> ();

    private WritableArray contactsArray = new WritableNativeArray ();
    private WritableArray indexingMap = new WritableNativeArray ();


    public WritableMap getPhoneNumbers(ReactApplicationContext ctx) {

        Cursor phones = ctx.getContentResolver ().query (ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null, null, null, null);

        for (int k = 0; k < 26; k ++)
        {
            indexingMapArrayList.add (new ArrayList<> ());
        }

        // Loop Through All The Numbers
        while (phones.moveToNext ()) {
            String id = phones.getString (phones.getColumnIndex (ContactsContract.Contacts._ID));
            String name = phones.getString (phones.getColumnIndex (ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME));
            String phoneNumber = phones.getString (phones.getColumnIndex (ContactsContract.CommonDataKinds.Phone.NUMBER));

            // Cleanup the phone number
            phoneNumber = phoneNumber.replaceAll ("[()\\s-]+", "");
            WritableMap namePhoneMap = new WritableNativeMap ();

            // Enter Into Hash Map
            namePhoneMap.putString ("name", name);
            namePhoneMap.putString ("phoneNumber", phoneNumber);
            namePhoneMap.putString ("id", id);

            contactsArray.pushMap (namePhoneMap);

            // get the first character of the name and then set its indexing number according to its position in english alphabetical order
            int asciiOfNameFirstChar = (int) name.toUpperCase ().charAt (0);
            ArrayList<Integer> currIndexingData = indexingMapArrayList.get (asciiOfNameFirstChar - 65);
            currIndexingData.add (contactsArray.size () - 1);

            indexingMapArrayList.set (asciiOfNameFirstChar - 65, currIndexingData);

        }

        // convert ArrayList to writable Array
        for(int i = 0; i < indexingMapArrayList.size (); i++)
        {
            WritableArray eachIndex = new WritableNativeArray ();
            for (int j = 0; j < indexingMapArrayList.get (i).size (); j++)
            {
                eachIndex.pushInt (indexingMapArrayList.get (i).get (j));
            }

            indexingMap.pushArray (eachIndex);
        }

        phones.close ();

        WritableMap mapData = new WritableNativeMap ();
        mapData.putArray ("data", contactsArray);
        mapData.putArray ("indexingArray", indexingMap);

        Log.i (TAG, "getPhoneNumbers: data Fetched: " + mapData.toString ());


        return mapData;

    }
}
