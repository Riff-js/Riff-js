//
// Riff - User Data
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


var softKeyData = {
	"Transition" : function(){ $.go("setTrans")},
	"Theme" : function(){ $.go("setTheme")}
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

var setThemeListData =	[{
	"none" : ["radio", true, "None"],
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
			"World"		: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world",
			"Sports"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports",
			"Science"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science",
			"Health"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health"
	}
	, layout :
	{
			"image" : "thumbnail[url]"
	}
};

var feedTestDataTabMenu2 = {
	runs :
	{
			"World"		: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world", function( xml, idx, args ){ alert( " scenePartScreenFunction1. arg1:" + xml + " arg2:" + idx + " arg3:" + args );  }, [ "arg1", "arg2", "arg3" ] ],
			"Sports"	: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports", function(){ alert( " scenePartScreenFunction2."); } , [ "arg1", "arg2", "arg3" ] ],
			"Science"	: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science", function(){ alert( " scenePartScreenFunction3."); } , [ "arg1", "arg2", "arg3" ] ],
			"Health"	: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health", function(){ alert( " scenePartScreenFunction4."); } , [ "arg1", "arg2", "arg3" ] ]
//			"World"		: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world",
//			"Sports"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports",
//			"Science"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science",
//			"Health"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health"
	}
	, layout : { "image" : "thumbnail[url]" } 
//	, layout : [ function(){ alert(" Layout Function."); } , [ {"image" : "thumbnail[url]"}, "args2", "args2" ] ]
	, opts :
	{
		ajaxOption : { a: function(){ alert( "abort Function."); } }
	}
	, successFnAfterXML : { 
		func: function( idx, xml, argsArray ){ 
			alert( "successFnAfterXML Function. idx" + idx + " xml:" + xml + " argsArray:" + argsArray ); 
		}, 
		args:[ "arg1", "arg2", "arg3" ] 
	}
};

var feedTestDataNavigationMenu = {
	runs :
	{
			"World"		: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world",
			"Sports"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports",
			"Science"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science",
			"Health"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health"
	}
	, layout :
	{
			"image" : "thumbnail[url]"
	}
}

var feedTestDataNavigationMenu2 = {
	runs :
	{
			"World"		: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world", function( xml, idx, args ){ alert( " scenePartScreenFunction1. arg1:" + xml + " arg2:" + idx + " arg3:" + args );  }, [ "arg1", "arg2", "arg3" ] ],
			"Sports"	: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports", function(){ alert( " scenePartScreenFunction2."); } , [ "arg1", "arg2", "arg3" ] ],
			"Science"	: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science", function(){ alert( " scenePartScreenFunction3."); } , [ "arg1", "arg2", "arg3" ] ],
			"Health"	: [ "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health", function(){ alert( " scenePartScreenFunction4."); } , [ "arg1", "arg2", "arg3" ] ]
//			"World"		: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world",
//			"Sports"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/sports",
//			"Science"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/science",
//			"Health"	: "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/health"
	}
	, layout : { "image" : "thumbnail[url]" } 
//	, layout : [ function(){ alert(" Layout Function."); } , [ {"image" : "thumbnail[url]"}, "args2", "args2" ] ]
	, opts :
	{
		ajaxOption : { a: function(){ alert( "abort Function."); } }
	}
	, successFnAfterXML : { 
		func: function( idx, xml, argsArray ){ 
			alert( "successFnAfterXML Function. idx" + idx + " xml:" + xml + " argsArray:" + argsArray ); 
		}, 
		args:[ "arg1", "arg2", "arg3" ] 
	}
};

// setting value data
// "text" : ["setting type", "item1", "item2", ..., function]
var valueSetListData = {
	"Theme" : [ 
		"radio",
		{
				"none" : ["radio", "None"],
				"riff_basic" : ["radio", "Riff Basic"],
				"green" : ["radio", "Green"],
				"modern_black" : ["radio", "Modern Black"]
		},	function (item) 	{	
			$.globalSetting( { "theme" : item[0] } );
		}
	],
	"Transition" : [
		"radio",
		{
			"slideVer" : ["radio", "Slide Vertical"],
			"slideHor" : ["radio", true, "Slide Horizontal"],
			"fade" : ["radio", "Fade" ],
			"popup" : ["radio", "Popup"]
		},	function(item) 	{ 
			$.globalSetting( { "transitionEffect" : item[0] } );
		}
	]
};


var textDetailData = {
	"title" : "Supported Devices",
	"description" : "Milestone 1 : Wave , Wave2 (bada, WVGA) < Current Phase<br>"
			+ "Milestone 2 : Wave723/Wave525/Wave575/Wave533 (bada, WQVGA)<br>"
			+ "Milestone 3 : upcoming models that support WAC 2.0 (android/bada, WVGA)<br>"
			+ "Mobile Browser Support<br>"
			+ "Android<br> Wave (WVGA, WQVGA) iPhone <br>"
			+ "bq. [Tip] Some features may not supported on certain mobile devices."
}