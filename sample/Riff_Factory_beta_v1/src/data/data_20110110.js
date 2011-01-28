//
// Framework 0.98
//
// Copyright 2010, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

/* @Framework_Ver 0.98 */

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
	"none" : ["radio", true, "none"],
	"aquablue" : ["radio", "aquablue"],
	"green" : ["radio", "green"],
	"leather" : ["radio", "leather" ],
	"modern_black" : ["radio", "modern_black"],
	"note" : ["radio", "note"],
	"papercut" : ["radio", "papercut"],
	"rusty" : ["radio", "rusty"],
	"vivid" : ["radio", "vivid"]
},
function( select ) {
		$.globalSetting( { "theme" : select[0] } );
}];



var rssPageControlData = [{
		"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml"
	},
	{
		"image" : "thumbnail[url]"
	}
];


var rssTabData = 	[{
		"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml"
	}
	, {
		"image" : "thumbnail[url]"
	}
];

var rssListData = 	[
	"http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml"
	, {
	"image" : "thumbnail[url]"
	}
	];

var setTransListData  =	[{
	"slideVer" : ["radio", true, "Slide Vertical"],
	"slideHor" : ["radio", "Slide Horizontal"],
	"fade" : ["radio", "Fade" ],
	"pop" : ["radio", "Pop"],
	"spin" : ["radio", "Spin"]
},
function( select ) {
	$.globalSetting( { "transEffect" : select[0] } );
} ];



var pageControlTest = [
	"<div>test</div>",
	{
		"test1" : function(){alert("111");},
		"test2" : function(){alert("222");},
		"test3" : function(){alert("333");},
		"test4" : function(){alert("444");},						
	}
];

var pageControlTest2 = [
	"<div></div>" ,
    {	
		"test5" : function(){alert("555");} ,
		"test6" : function(){alert("666");} ,
	}
];

var popupData = 
{
	 "html" : "<div>popupTest</div>" 
};

//h 단말언어코드에 따른 데이터
var languageDataType1 = {
			"Mobile Widget" : { 
					"KR"	: "<span class='cssTest'>모바일 위젯</span>",
					"EN" : "<span class='cssTest'>Moblie Widget</span>",
					"FR"	: "<span class='cssTest'>Moblie Widget</span>" },
			"Setting List" : { 
					"KR"	: "리스트 설정", 
					"EN" : "Cheese Factory!!",
					"FR"	: "Liste des paramètres"	},
			"Component" : { 
					"KR"	: "컴포넌트", 
					"EN" : "Component",
					"FR"	: "Composante" },
			"Data Processing" : { 
					"KR"	: "<span class='cssTest'>데이터 처리</span>", 
					"EN" : "<span class='cssTest'>Data Processing</span>", 
					"FR"	: "<span class='cssTest'>Traitement des données</span>" },
			"Transition" : { 
					"KR"	: "변화", 
					"EN" : "Transition", 
					"FR"	: "Transition" },
			"Touch Event" : { 
					"KR"	: "터치 이벤트", 
					"EN" : "Touch Event", 
					"FR"	: "Touchez l'événement" },
			"Rss Data" : { 
					"KR"	: "RSS 데이터", 
					"EN" : "Rss Data", 
					"FR"	: "Rss de données" },
			"Theme"	: { 
					"KR"	: "테마", 
					"EN" : "theme",
					"FR"	: "Thème"	},
};

//h 단말 언어코드에 따른 데이터
var languageDataType2 = 	[
				[										"KR",				"EN",				"FR"			],
				["Mobile Widget",		"<span class='cssTest'>모바일 위젯</span>",	"<span class='cssTest'>Mobile Widget</span>",	"<span class='cssTest'>Moblie Widget</span>"],
				["Setting List",		"리스트 설정",		"Setting List",	"Liste des paramètres"],
				["Component",		"<span class='cssTest'>컴포넌트</span>",	"<span class='cssTest'>Component</span>",	 "<span class='cssTest'>Composante</span>"],
				["Data Processing",	 "데이터 처리",	"Data Processing",	"Traitement des données"],
				["Transition",	 "변화",		"Transition", "Transition"],
				["Touch Event",	"터치 이벤트",	"Touch Event",	"Touchez l'événement"],
				["RSS Data",	 "RSS 데이터",	"Rss Data", "Rss de données"],
				["Theme",		"테마",	"Theme",	"Thème" ],
];


//h 단말 언어에 따른 rssfeed data (pageControl)
var rssPageControlData = {
	"EN" : [{
				"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
				"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
				"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
				"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml"	
			},
			{
				"image" : "thumbnail[url]"
			}],
	"KR" : [{
			  "News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
			  "Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
			  "Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
			  "Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml"
			 },
			 {
			  "image" : "thumbnail[url]"
			 }
			],
	"FR" : [{
				"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
				"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
				"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
				"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml"	
			},
			{
				"image" : "thumbnail[url]"
			}]	,
	"" : [{
				"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
				"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
				"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
				"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml"	
			},
			{
				"image" : "thumbnail[url]"
			}
		]
}

// rssTab Total data
var rssTabData = {
	"EN" : [{
				"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
				"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
				"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
				"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml"	
			},
			{
				"image" : "thumbnail[url]"
			}],
	"KR" : [{
			  "News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
			  "Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
			  "Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
			  "Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml"
			 },
			 {
			  "image" : "thumbnail[url]"
			}],
	"FR" : [{
				"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
				"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
				"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
				"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml"	
			},
			{
			  "image" : "thumbnail[url]"
			}],
	"" : [{
				"News" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
				"Sport" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
				"Computer" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
				"Society" : "http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml"	
			},
			{
				"image" : "thumbnail[url]"
			}
		]
};

// rssList Total Data
var rssListData = {
	"EN" : [
		"http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc.xml",
		{ "image" : "thumbnail[url]" }
	],
	"KR" : [
		"http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc1.xml",
		{  "image" : "thumbnail[url]" }
	],
	"FR" : [
		"http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc2.xml",
		{ "image" : "thumbnail[url]" }
	],
	"" : [
		"http://175.125.20.219/xml/xml.php?url=http://175.125.20.219/xml/bbc3.xml",
		{ "image" : "thumbnail[url]"}
	]
};



