//
// Cheese Framework 0.94
//
// Copyright 2010, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

$( function (){

	
	$("#idlego").tap(function(){
	$.go("#index");
			function foo( _xml )
			{
				var opens = new Array();
				var closes = new Array();
				var times = new Array();
				var dates = new Array();
		        var volume = new Array();
		        
				var values = _xml.selector("value");

				for(var i=0; i<200; i++)
				{
					opens[i]=parseFloat(values.eq(i).find("open").text());
					closes[i]=parseFloat(values.eq(i).find("close").text());
					volume[i]=parseFloat(values.eq(i).find("volume").text());
				}
				
				$("#digi").data({"type" : "line",
				"chartArray" : [opens,closes],
				"chartComponentColors" : ["red","green"]  ,
				"verticalTextPosition" : ["right",0] , 
				"verticalTextLabels" : ["11","22","33"],
				"horizonLineNum" : 4,
				"verticalLineNum" : 4,
				"tableTextFont" : 8 });
				
				
				$("#digi2").data({"type": "bar",
				"chartArray" : [opens],
				"chartComponentColors" : ["red"] ,
				"horizonTextLabels" : "auto",
				"verticalLineNum" : 4});
				

				//$("#digi2").chartAnimation(450,400,2000,function(){alert("callback function call")});
			}

			
			//var t = CheeseXML( "http://h9design.co.kr/jh/yahooxml.xml", foo );
			var t = CheeseXML( "test_oneday.xml" ,foo ); 
			
	});	
})
    