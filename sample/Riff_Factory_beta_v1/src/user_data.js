//
// Riff js - User Data Script File.
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


var softKeyData = {
	"Transition" : function(){ $.go("setTrans")},
	"Theme" : function(){ $.go("setTheme")},
	"Setting" : function(){ $.go("setUserSetting")}
};

var settingListData =  [
	["radio", "Radio1", [ function(str) { alert(str) }, "radio"] ],
	["radio", "Radio2", function() { alert("radio2")  } ],
	["check", "Checkbox", function() { alert("check")  } ],
	["check", "Checkbox", function() { alert("check")  } ],
	["check", "Checkbox", function() { alert("check")  } ],
	["onoff", "On/Off Toggle", function() { alert("onoff")  } ],
	["onoff", "On/Off Toggle", function() { alert("onoff")  } ]
];

var settingUserData =  [{
	"autoRefresh5m" : ["radio",true, "autoRefresh5m"],
	"autoRefresh10m" : ["radio", "autoRefresh10m"]
}, function( params ) {
		$.globalSetting( { "setting" : params[0] } );
}];

var setThemeListData =	[{
	"none" : ["radio", true, "none"],
	"riff_basic" : ["radio", "Riff Basic"],
	"green" : ["radio", "Green"],
	"modern_black" : ["radio", "Modern Black"]
}, function( params ) {
		$.globalSetting( { "theme" : params[0] } );
}];

var setTransListData  =	[{
	"slideVer" : ["radio", true, "Slide Vertical"],
	"slideHor" : ["radio", "Slide Horizontal"],
	"fade" : ["radio", "Fade" ],
	"popup" : ["radio", "Pop"]
}, function(  params ) {
	$.globalSetting( { "transitionEffect" : params[0] } );
} ];


var feedTestDataTabMenu = {
	runs :
	{
			"news"		: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world",
			"sports"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports",
			"science"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science",
			"health"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health"
	}
	, layout :
	{
			"image" : "thumbnail[url]"
	}
}
