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
		"softkeyData" : softKeyData,
		"widgetName" : "Riff Widget",
	});

	$(".idle").option({
		"background" : ["gradient","red"],
	})

	// Scene Navi
	$("#goComponent").tap(		function(){ $.go("#sComponent"); });
	$("#goDataProcessing").tap(	function(){ $.go("#sDataProcessing"); });

	$("#goTransition").tap( function(){ $.go("sTransition"); });
	$("#goSlideVer").tap( function(){ $.go("effectArea", {"transitionEffect" : "slideVer"}); });
	$("#goSlideHor").tap( function(){ $.go("effectArea", {"transitionEffect" : "slideHor"}); });
	$("#goFade").tap( function(){ $.go("effectArea", {"transitionEffect" : "fade"}); });
	$("#goPop").tap( function(){ $.go("effectArea", {"transitionEffect" : "popup"}); });
	$("#btnEffBack").tap( function(){ $.back(); });

	$("#goTouchEvent").tap( function(){ $.go("#sTouchEvent"); });
	$("#goTextList").tap( function(){ $.go("#sTextList"); });
	$("#goImageList").tap( function(){ $.go("#sImageList"); });
	$("#goTab").tap( function(){ $.go("#sTab"); });
	$("#goTextPage").tap( function(){ $.go("#sTextPage"); });
	$("#goTap").tap(	function(){ $.go("#sTap"); });
	$("#goFlick").tap( function(){ $.go("#sFlick"); });
	$("#goSwipe").tap( function(){ $.go("#sSwipe"); });

	$("#goFeedData").tap( function () { $.go("#sFeedData"); } );
	$("#goFeedTab").tap( function() { $.go("#sFeedTab");} );

	$("#goUserSetting").tap( function () { $.go("#sUserSettingData"); } );

	// Touch event
	$(".swipeExBox").swipe(true,50,function(){})
	$(".touchExBox").touchStart(function(){ $(this).addClass("on"); });
	$(".touchExBox").touchEnd(function(){ $(this).removeClass("on"); });
	$(".exTap").tap(function(){ $.alert("tap"); });
	$(".exLongTap").longTap(function(){ $.alert("Long Tap"); });
	$(".exDoubleTap").doubleTap(function(){ $.alert("Double Tap"); });
	$(".flickExBox").flickLeft(function(){ $.alert("Flick Left"); });
	$(".flickExBox").flickRight(function(){ $.alert("Flick Right"); });
	$(".flickExBox").flickUp(function(){ $.alert("Flick Top"); });
	$(".flickExBox").flickDown(function(){ $.alert("Flick Bottom"); });

	$("#goPopup").tap(function(){
		$.alert("This is Popup Window!");
	});

	// Data processing
	$.settingList( "sUserSettingData", settingListData );
	$.settingList( "setTrans", setTransListData );
	$.settingList( "setUserSetting", settingUserData );
	$.settingList( "setTheme", setThemeListData );

	// FeedTab
	$("#feedTab").feed( feedTestDataTabMenu );

	// Idle Component
	$(".rf-component-idle").setFeedComponent("#feedTab");
});
