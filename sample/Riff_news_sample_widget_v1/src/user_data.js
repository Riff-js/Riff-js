//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


var softKeyData = {
	"Transition" : function(){ $.go("transSetting")},
	"Theme" : function(){ $.go("themeSetting")},
	"Setting" : function(){ $.go("refreshSetting")}
};


// Auto Refresh Setting
var refreshSettingData =  [{
	"18000000" : ["radio",true, "AutoRefresh - 30m"],
	"36000000" : ["radio", "AutoRefresh - 60m"]
}, function( params ) {
		$('.rf-component-tabmenu').autoRefresh( params[0] );
}];


var themeSettingData =	[{
	"none" : ["radio", true, "none"],
	"riff_basic" : ["radio", "Riff Basic"],
	"green" : ["radio", "Green"],
	"modern_black" : ["radio", "Modern Black"]
}, function( params ) {
		$.globalSetting( { "theme" : params[0] } );
}];


var transSettingData  =	[{
	"slideVer" : ["radio", true, "Slide Vertical"],
	"slideHor" : ["radio", "Slide Horizontal"],
	"fade" : ["radio", "Fade" ],
	"popup" : ["radio", "Pop"]
}, function(  params ) {
	$.globalSetting( { "transitionEffect" : params[0] } );
} ];


// TabMenu Data
var feedTabData = {
	runs :
	{
		"News"		: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world",
		"Sports"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports",
		"Science"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science",
		"Health"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health"
	},
	layout :
	{
		"image" : "thumbnail[url]"
	}
}
