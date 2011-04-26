//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


var softKeyData = {
	"Setting" : function(){ $.go("refreshSetting")},
	"Refresh" : function(){ $.feedRefresh(); }
};

// Auto Refresh Setting
var refreshSettingData =  [{
	"18000000" : ["radio",true, "AutoRefresh - 30m"],
	"36000000" : ["radio", "AutoRefresh - 60m"]
}, function( params ) {
		$('.rf-component-tabmenu').autoRefresh( params[0] );
}];

// TabMenu Data
var feedTabData = {
	runs :
	{
		// Coding your Feed URL here.
		// Example Code.
		"Discussion"	: [ "Discussion", "http://175.125.20.219/xml/xml.php?url=http://innovator.samsungmobile.com/servlet/rss/discussion.xml" ],
		"Products"	: [ "Products", "http://175.125.20.219/xml/xml.php?url=http://innovator.samsungmobile.com/servlet/rss/products.xml" ]
	},
	layout :
	{
		"image" : "thumbnail[url]"
	}
}