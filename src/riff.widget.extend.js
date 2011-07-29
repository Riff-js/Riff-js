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
	}
});

window.$w = riff.widget;

