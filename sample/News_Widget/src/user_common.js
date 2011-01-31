//
// Riff js - User Common Script File.
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

$( function (){
	// Global setting
	$.globalSetting ({
		"softkeyType" : "rf-type-softkey-1",
		"softkeyData" : softKeyData,
		"widgetName" : "News Feed Widget"
	});

	$.settingList( "refreshSetting", refreshSettingData );

	// Ajax processing at Tabmenu Component (#feedtab)
	$("#feedTab").feed( feedTabData );

	// Idle
	$(".rf-component-idle").setFeedComponent("#feedTab");

});