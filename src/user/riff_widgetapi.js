//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


riff.widget= {
    sysInfo_network_getIsNetworkAvailable : function()
    {
        try{
            return widget.sysInfo.network.getIsNetworkAvailable();
        } 
        catch(e) {
            
            return true;
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
		try
		{
			return widget.widgetMode;
		}
		catch (e)
		{
			return null;
		}
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
            widget.window.error.notify(_param);
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
			window.location.href = _url;
            return true;
        }    
    },
    window_resizeWindow : function( _width, _height)
    {
        try {
            widget.window.resizeWindow(_width, _height);
            return true;
        }
        catch(e){
			window.resizeTo(_width, _height);
            return true;
        }
    },
    setPreferenceForKey : function(_key, _value)
    {
        try {
            widget.setPreferenceForKey( _value, _key );
			return true;
        }
        catch(e){
			return riff.storage.localStorage( _key, _value );
        }	  
    },
    preferenceForKey : function(_key)
    {
        try {
			return widget.preferenceForKey( _key );
        }
        catch(e){
			return riff.storage.localStorage( _key );
        }	    
    }   
}; 


