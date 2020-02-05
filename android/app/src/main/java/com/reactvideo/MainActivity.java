package com.reactvideo;

import com.facebook.react.ReactActivity;

import android.widget.Toast;
import android.view.KeyEvent;

public class MainActivity extends ReactActivity {

   private long firstTime = 0;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   @Override
    protected String getMainComponentName() {
      return "ReactVideo";
    }

   //  @Override
   // public void invokeDefaultOnBackPressed() {
       //super.onBackPressed();
    //   moveTaskToBack(true);
    //}


  //    @Override
  //    public boolean onKeyDown(int keyCode, KeyEvent event) {
  //    long secondTime = System.currentTimeMillis();
  //          if (keyCode == KeyEvent.KEYCODE_BACK) {
  //        if (secondTime - firstTime < 2000) {
  //            System.exit(0);
  //        } else {
  //            Toast.makeText(getApplicationContext(), "再按一次退出应用程序", Toast.LENGTH_SHORT).show();
  //            firstTime = System.currentTimeMillis();
  //        }
  //
  //        return true;
  //    }
  //
  //          return super.onKeyDown(keyCode, event);
  //}

}
