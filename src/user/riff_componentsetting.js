//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


// The componentSetting.js will reconstruct markups that match elements found within the DOM Element className

riff(function () {

// Widget Basic Default Setting
// If the user does not use the headerSetting Component, headerSetting will be added automatically. (headerSetting Component is neccasary for the setting function)
( riff('body').find('.rf-component-header-setting').size() == 0 && riff('body').append('<div class="rf-component-header-setting">Setting</div>') );
// If the user does not use the feedReceiveTime Component, feedReceiveTime will be added automatically. (in order to visulize the data, the feedReceiveTime Component is for the RSS Feed)
( riff('body').find('.rf-component-datareceivetime').size() == 0 && riff('body').append('<div class="rf-component-datareceivetime"></div>') );

// Adds a DIV over the background when a popup appears, so the background objects will no longer be clickable
riff('body').append('<div class="rf-effect-dim-dark"></div>'); // Black Blank Element
riff('body').append('<div class="rf-effect-dim-light"></div>'); // Black Blank Element
riff('body').append("<div class='rf-component-popup' id='ajaxPopup'>AjaxPopup<div class='rf-area-btn-popup'><button class='rf-component-btn popupOff popupOK'>Ok</button></div></div>");
riff('body').prepend("<div id='idle' class='rf-component-idle'></div>");
// Adds a markup to differentiate the IDLE screen and the fullcreen that shows when the widget runs.
riff('body').contents().not( riff("#idle").dom() )
			.wrapAll('<div class="rf-wrapper-all"></div>'); // Widget Wrapping
// When applying the scene to the fullscreen, the scene is wrapped and the screen size, ect are automatically set
riff('body').find('.rf-component-scene').wrapAll('<div class="rf-wrapper-scene-all"></div>');

// inserts the busy indicator and sets it
// Busy Indicator Default Setting
riff('.rf-effect-dim-dark')
.before('<div class="rf-component-popup" id="busyIndicator"><div class="rf-component-busyindicator rf-resource-busyindicator-1"></div><div class="rf-area-txt-busyindicator">Loading, Please wait...</div></div>')
.before('<div class="rf-component-popup" id="alert"></div>');

// navigator.userAgent : returns the name of the current browser
var agent = navigator.userAgent;
if( agent.indexOf("Android") != -1) {		// Android Broswer mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.ANDROIDB );
	riff("head").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=device-dpi"/>');
} else if( agent.indexOf("WVGA") != -1) {			// BIG size mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.TOUCH );
	riff("head").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=120"/>');
} else if( agent.indexOf("WQVGA") != -1) {			// Small size mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.TOUCH );
	riff("head").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=120"/>');
} else if( riff.isEmulator() ) { // SDK mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.MOUSE );
} else if( riff.isWidget() ) { // SMASUNG BADA widget mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.TOUCH );
} else { 											// PC mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.MOUSE );
}

// Defines the softkey form, function, ect
riff.option( {
	"softkeySetListData" : {
		"OK" : function() {
			var sceneInfo = riffGlobal.sceneStack.pop();
				riffGlobal.sceneStack.push(sceneInfo);

			riff.back();
			riff(sceneInfo[0]).find(".setList").okFunc();
		}
	},
	"softkeySetListFunc" : function() {
		var sceneInfo = riffGlobal.sceneStack.pop(),
			selectData = riffGlobal.setListSelectData,
			setList = riff(sceneInfo[0]).find(".setList"),
			setListDataSet = setList.buffer("ComponentListComponentDataSet");
		riffGlobal.sceneStack.push(sceneInfo);

		for( var k in setListDataSet )
			setList.scenePartSelect(setListDataSet[k].key, "off");

		for( var k in selectData )
			setList.scenePartSelect(selectData[k], "on");

		riff.back();
	},
	"softkeyFunc" : function () { riff.back(); },
	"softkeyType" : "type1",
	"softkeyData" : {}
});

// Resets markup for scene, header, headerSetting, list, setList, tab, popup Component
riff('.rf-component-idle').makeStructs();
riff('.rf-component-scene').makeStructs();
riff('.rf-component-header').makeStructs();
riff('.rf-component-header-setting').makeStructs();
riff('.rf-component-list').makeStructs();
riff(".rf-component-tabmenu").makeStructs();
riff(".rf-component-popup").makeStructs();
riff("#ajaxPopup").setContents( { "okFunc" : function(){ $.popup.back(); } } );

// Widget end key
if( riff.isWidget() && !riff.isEmulator() )
{
	widget.addEventListener("widgetendkey",
	function()	{
		// if the widget enkey was clicked to move to idle, the value is changed to true.
		riff('.rf-component-idle').buffer("ComponentIdleGoByEndKey", true);
		$.go("#idle");
	}, false);
}


// If AutoRefresh is set, show AutoRefresh.
if ( riffGlobal.feedAutoRefreshTime > 0 )
{
	riff('.rf-component-tabmenu').autoRefresh( riffGlobal.feedAutoRefreshTime );
	riff('.rf-component-list').autoRefresh( riffGlobal.feedAutoRefreshTime );
};

// Idle Scene is shown as the first Scene.
riff.go("#idle");

}); //End Load
