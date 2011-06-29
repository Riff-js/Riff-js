//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//



riff.extend({
	widget : {
		isNetworkAvailable : function()
		{
			try{
				return widget.sysInfo.network.getIsNetworkAvailable();
			} 
			catch(e) {
				return true;
			}
		},
		getLanguage : function() {
			try {
				return window.widget.sysInfo.getLanguage();
			} catch( e ) {
				return false;
			}
		},
		getLanguageList : function() {
			try {
				return window.widget.sysInfo.getLanguage().toLowerCase();
			} catch( e ) {
				return false;
			}
		},
		getMccMnc : function() {
			try {
				return widget.sysInfo.SIM.getMccMnc();
			} catch( e ) {
				return false;
			}
		},
		getCurrentDirection : function()		//n get the "horizontal" or "vertical"( portrait ) mode
		{
			try{
				return widget.window.getCurrentDirection();
			} catch(e){
				return null;
			}
		},
		
		error_notify : function(_param)		//e Forcefully terminates the network use by a mobile phone. 
		{
			try{
				widget.window.error.notify(_param);
				return true;
			}catch(e){
				return false;
			}
		},
		getFullmodeSize : function()		//n get full mode size( "width_On_PortraitMode, height_On_PortraitMode, width_On_horizontal_Mode, height_On_horizontal_Mode" )
		{
			try {
				return widget.getFullmodeSize().split(",");
			} catch (e) {
				return null;
			}
		}
/*		widgetMode : function()	//"fullscreen", "docked", "widget" mode. 
		{
			try	{
				return widget.widgetMode;
			} catch (e) {
				return null;
			}
		},
		sysInfo_memory_getMemoryAvailable : function()
		{
			try {
				return widget.sysInfo.memory.getMemoryAvailable();
			} catch(e){
				return null;
			}
		},
		application_launcher_memoryStatusView : function()
		{
			try{ 
				return widget.application.launcher.memoryStatusView();
			} catch(e) {
				return null;
			}
		},
		sysInfo_getHashedIMEI : function()
		{
			try{ 
				return widget.sysInfo.getHashedIMEI(); 
			} catch(e) {
				return null;
			}
		},
		window_setScroll : function( _isScroll )		// visible or invisiable the scrollbar
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
		getIndicatorColor : function()
		{
			try{
			return widget.getIndicatorColor().split(",");
			} 
			catch (e){
			return null;
			}
		},
		*/	
	}
});


