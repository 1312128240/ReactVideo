package com.reactvideo.Module;

import android.content.Intent;
import com.reactvideo.MainApplication;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.app.Activity;
import java.util.Map;
import java.util.Objects;

import android.widget.Toast;

public class LiveModule extends ReactContextBaseJavaModule {

    private ReactContext reactContext;

    public LiveModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    public void pushLive(ReadableMap params) {

    }



    @ReactMethod
    public void pushLiveViewController(String name) {
        Activity currentActivity = getCurrentActivity();
        currentActivity.moveTaskToBack(true);
        Toast.makeText(MainApplication.mContext, "原生返回", Toast.LENGTH_SHORT).show();
    }




    public void sendEvent(String eventName, @Nullable WritableMap params) {
        this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }




    /**
     * @return the name of this module. This will be the name used to {@code require()} this module
     * from javascript.
     */
    @NonNull
    @Override
    public String getName() {
        return "LiveModule";
    }


    /**
     *optional
     * @return a map of constants this module exports to JS. Supports JSON types.
     */
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }
}
