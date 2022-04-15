package com.ruubypa;

import com.facebook.react.ReactActivity;
import android.graphics.Color;
import android.view.View;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
//    @Override
//    protected String getMainComponentName() {
//        return "RuubyPA";
//    }

    @Override
    public View createSplashLayout() {
        View view = new View(this);
        return view;
    }
}
