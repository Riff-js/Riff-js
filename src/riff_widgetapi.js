//
// Framework TrialVersion 1.0.32 
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

/* @Framework_Ver  TrialVersion 1.0.32  */


riff.widget= {
    sysInfo_network_getIsNetworkAvailable : function()
    {
        try{
            return window.widget.sysInfo.network.getIsNetworkAvailable();
        } 
        catch(e) {
            
            return null;
        }
    },

    sysInfo_getLanguage : function()
    {
        try {
            return window.widget.sysInfo.getLanguage();
        } 
        catch(e) {
            
            return null;
        }
    },
    widgetMode : function()
    {
        if(!riff.isWidget())
            return ;
        return widget.widgetMode;
    },
    onClose : function()
    {
        if(!riff.isWidget())
            return;
    }, 
    sysInfo_memory_getMemoryAvailable : function()
    {
        try{
            return widget.sysInfo.memory.getMemoryAvailable();
        }
        catch(e){
      
            return null;
        }
    },
    application_launcher_memoryStatusView : function()
    {
        try{ 
           return widget.application.launcher.memoryStatusView();
        }
        catch(e){
            return null;
        }
    },
    sysInfo_getHashedIMEI : function()
    {
        try{ 
            return widget.sysInfo.getHashedIMEI(); 
        }
        catch(e){
            return null;
        }
    },
    getFullmodeSize : function()
    {
        try {
            return widget.getFullmodeSize().split(",");
        } 
        catch (e) {
            return null;
        }
    },
    getIndicatorColor : function()
    {
        try{
            return widget.getIndicatorColor().split(",");
        } 
        catch (e){
            return null;
        }
    },
    sysInfo_getLanguageList : function()
    {
        try {
            return window.widget.sysInfo.getLanguageList();
        } 
        catch (e){ 
            return null;
        }
    },
    window_getCurrentDirection : function()
    {
        try{
            return widget.window.getCurrentDirection();
        }
        catch(e){
            return null;   
        }
    },
    error_notify : function(_param)
    {
        try{
            window.widget.error.notify(_param);
            return true;
        }catch(e){
            return false;
        }
    },
    window_setScroll : function( _isScroll )
    {
        try {
            widget.window.setScroll(_isScroll);
            return true;
        }catch(e) {
            return false;
        }
    },
    application_launcher_openDailyBriefing : function(_appMode)
    {
        try {
            widget.application.launcher.openDailyBriefing(_appMode);
            return true;
        }
        catch(e) {
            return false;
        }
    },
    application_launcher_openCalendarDetailWnd : function()
    {
        try{ 
            widget.application.launcher.openCalendarDetailWnd("DayView","");
            return true;
        } catch (e){
            return false;
        }
    },
    SNS_launchApplication : function()
    {
        try {
            widget.SNS.launchApplication('GoogleMap','','','');
            return true;
        }
        catch(e){
            return false;
        }
    },
    openURL : function( _url )
    {
		try {
            widget.openURL(_url);
            return true;
        }
        catch(e){
            return false;
        }    
    },
    window_resizeWindow : function( _width, _height)
    {
        try {
            widget.window.resizeWindow(_width, _height);
            return true;
        }
        catch(e){
            return false;
        }
    },
    setPreferenceForKey : function(_key, _value)
    {
        try {
            return widget.setPreferenceForKey( _value, _key );
        }
        catch(e){
            return null;
        }	  
    },
    preferenceForKey : function(_key)
    {
        try {
            return widget.preferenceForKey( _key );
        }
        catch(e){
            return null;
        }	    
    }   
}; 


