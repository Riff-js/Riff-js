//
// Framework 0.98
//
// Copyright 2010, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

/* @Framework_Ver 0.98 */

$( function (){

	// Global setting1
	$.globalSetting ({
		"softkeyType" : "type1",
		"softkeyData" : softKeyData
	});

	$("#idlego").tap(function(){ $.move("#index"); });
	
	// Scene Navi
	$("#goComponent").tap(		function(){ $.move("#sComponent"); });
	$("#goDataProcessing").tap(	function(){ $.move("#sDataProcessing"); });

	$("#goTransition").tap( function(){ $.move("sTransition"); });
	$("#goSlideVer").tap( function(){ $.move("effectArea", {"transitionEffect" : "slideVer"}); });
	$("#goSlideHor").tap( function(){ $.move("effectArea", {"transitionEffect" : "slideHor"}); });
	$("#goFade").tap( function(){ $.move("effectArea", {"transitionEffect" : "fade"}); });
	$("#goPop").tap( function(){ $.move("effectArea", {"transitionEffect" : "popup"}); });
	$("#goSpin").tap( function(){ $.move("effectArea", {"transitionEffect" : "spin"}); });
	$("#btnEffBack").tap( function(){ $.back(); });

	$("#goTouchEvent").tap( function(){ $.move("#sTouchEvent"); });
	$("#goTextList").tap( function(){ $.move("#sTextList"); });
	$("#goImageList").tap( function(){ $.move("#sImageList"); });
	$("#goTab").tap( function(){ $.move("#sTab"); });
	$("#goTextPage").tap( function(){ $.move("#sTextPage"); });
	$("#goTap").tap(	function(){ $.move("#sTap"); });
	$("#goFlick").tap( function(){ $.move("#sFlick"); });
	$("#goSwipe").tap( function(){ $.move("#sSwipe"); });
	$("#goDnd").tap( 	function(){ $.move("#sDnd"); });

	$("#goRssData").tap( function () { $.move("#sRssData"); } );
	$("#goRssTab").tap( function() { $.move("#sRssTab");} );
	$("#goRssList").tap( function() { $.move("#sRssList");} );

	$("#goUserSetting").tap( function () { $.move("#sUserSetting"); } );

	//touch event
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

	//data processing
	$("#setting").makeContents(settingListData);
	$("#setTransList").makeContents( setTransListData );
	$("#setThemeList").makeContents( setThemeListData );
	
	// rssTab
	$("#rssTab").rss( rssTestDataTab );

	// rssList
	$("#rssList").rss( rssTestDataList );

	$(".btn").option({
		'fontSize':'small',
		'fontColor':'#eaeaea'
	});
});


