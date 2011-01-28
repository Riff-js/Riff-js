//
// Riff js - User Common Script File.
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

$( function (){
	// Global setting1
	$.globalSetting ({
		"softkeyType" : "rf-type-softkey-1",
		"softkeyData" : softKeyData,
		"widgetName" : "News Feed Widget",
	});

	$.settingList( "transSetting", transSettingData );
	$.settingList( "refreshSetting", refreshSettingData );
	$.settingList( "themeSetting", themeSettingData );

	// feedTab
	$("#feedTab").feed( feedTabData );

	// idle
	$(".rf-component-idle").setFeedComponent("#feedTab");

	// ajaxPopup
	$("#ajaxPopup").SetContents( { "okFunc" : function(){ $.popup.back(); } } );
});
