//
// RIFFjs TrialVersion 1.0.29 
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

var softKeyData = {
	"Transition" : function(){ $.move("setTrans")},
	"Theme" : function(){ $.move("setTheme")}
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
	"green" : ["radio", "green"],
	"modern_black" : ["radio", "modern_black"],
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


//h 탭 인터페이스
var rssTestDataTab = {
	runs : 
	{
			"NEWS"		: [ "http://175.125.20.219/xml/xml.php?url=http://www.samsung.com/us/function/rss/rssFeedItemList.do?typeCd=NEWS",   fooTab, [] ],
			"IR"		: [ "http://175.125.20.219/xml/xml.php?url=http://www.samsung.com/us/function/rss/rssFeedItemList.do?typeCd=IR",   fooTab, [] ],
			"PRODUCTS"	: [ "http://175.125.20.219/xml/xml.php?url=http://www.samsung.com/us/function/rss/rssFeedItemList.do?typeCd=PRODUCTS",   fooTab, [] ],
			"SUPPORT"	: [ "http://175.125.20.219/xml/xml.php?url=http://www.samsung.com/us/function/rss/rssFeedItemList.do?typeCd=SUPPORT",   fooTab, [] ]	
	}
	, layout : [ frameworkTab ]
	, opts :
	{
		ajaxOption : {  }
		, cache : true
	}
	, successFnAfterXML : null
}

//h 프레임 워크용 탭 레이아웃.
function frameworkTab()
{
	var layoutParamsArray		= arguments[0];
	var subSceneArray			= arguments[1];
	var opts							= arguments[2];
	var xmlSuccessCallback	= arguments[3];
	
	//h rss 관련 옵션 데이터 저장 ( tab 이동시 사용) 
	var dataSetRSS = new Array();			

	//h tab이 로드될 때랑 해당 tab 이동할 때 호출할 함수 저장 
	var dataSet = new Array();	

	//h 각 피드별 
	for( var k in subSceneArray )
	{		
		//h tab.prototype.move에서 viewFunc 호출시 이함수 실행되면서 버퍼에 있는 값을 가져와서 데이터 설정.
		dataSet[k] = ["<div class='list' id='ComponentTabRSSList"+k+"'></div>", 
			function ( idx )
			{
				var riffThis = riff(this);
				var riffThisDataSetRss = riffThis.buffer("ComponentTabComponentDataSetRss");	

				riff.popup( "#busyIndicator" );
				//h _xml : riffXML 객체
				//h _xmlObject : 데이터 통신에서 수신한 xml 
				//h _xmlString : xml 의 직렬화. ( optional )
				riff.xml(
					riffThisDataSetRss[idx].url,
					function( _xml, _xmlObject, _xmlString ) {

						var _xmlCache = _xmlObject;
						var args = new Array();
						args.push( _xml );
						args.push( idx );	
						args.push( riffThisDataSetRss[idx].tagOpts );

						//h data.js의 user가 정의한 화면 구성 함수 호출
						if( riffThisDataSetRss[idx].subSceneFunction && typeof riffThisDataSetRss[idx].subSceneFunction == "function" ){
							riffThisDataSetRss[idx].subSceneFunction.apply( riffThis, args );	 		
						}
					}
					,  opts.ajaxOption );
			},
			function ( idx ) 
			{
				//h 페이지가 이동되면 컴포넌트 하단 부분에 업데이트 시간 표시
				riff.feedReceiveTime( riff.now() );
			}
		];
			//h dataSetRSS에 data.js에서 넣은 값 setting
			var dataSetRSSCur = {};
			dataSetRSSCur.url							= subSceneArray[k][0];
			dataSetRSSCur.subSceneFunction	= subSceneArray[k][1];
			dataSetRSSCur.tagOpts					= subSceneArray[k][2];
			dataSetRSSCur.opts						= opts;
			dataSetRSSCur.xmlSuccessCallBackSet = xmlSuccessCallback;
			dataSetRSS.push(dataSetRSSCur);				
		}

		//h 이곳에서 버퍼에 저장한 후 후에 viewFunc 에서 위의 funcSet 실행 시 현재 버퍼에 저장한 값을 가지고 데이터 셋팅을 마무리 한다.
		this.buffer("ComponentTabComponentDataSet", dataSet )	
			.buffer("ComponentTabComponentDataSetRss", dataSetRSS)
			.makeContents( dataSet );
};

//h 페이지 컨트롤의 subScene 구성부분
function fooTab()  
{
	riff.popup.back();
	var _xml			= arguments[0];
	var _fnIndex	= arguments[1];
	var _tagOpts	= arguments[2][0];
	var _opts			= arguments[3];

	//h 기본 image 이외의 추가 args.
	var _otherOptions = new Array();
	for( var i = 1; i < arguments[2].length; i++)
	{
		_otherOptions = arguments[2][i];
	}
	
	// opts Setting
	var opts = {};
	opts.iterator			= "item";
	opts.imageType	= "img";
	for ( var k in _opts )
		opts[k] = _opts.ajaxOption[k];

	var tagInfo = {};
	tagInfo.title = "title";
	tagInfo.description = "description";
	tagInfo.link = "link";
	tagInfo.image = "image";
	
	for( var k in _tagOpts )
	{
		if( k == "title" )
			tagInfo.title = _tagOpts[k];
		else if(k=="description")
			tagInfo.description = _tagOpts[k];
		else if(k == "link")
			tagInfo.link = _tagOpts[k];
		else if(k == "image")
			tagInfo.image = _tagOpts[k];
	}

	//h rss callback
	var dataArray = new Array();
	var itemElem = _xml.selector(opts.iterator);
	var inHTML = "<ul>";
	var urlArray = new Array();

	// rss data element create.
	var strStorage = "<riffRSSData>";
	
	for ( var i=0, l=itemElem.size(); i<l; i++ )
	{
		//h 캐시 데이터
		strStorage += "<item>";

		var dataType = "";
		var dataImgUrl = "";
		var dataTitle = "";
		var dataDescription = "";
		var dataLink = "";
		var moveUrl = "";
		
		//h 이미지정보 있으면
		if( tagInfo.image )		
		{
			var elem = itemElem.eq(i).find(tagInfo.image);

			if( elem.size() != 0 )
			{
				var strSelect = riff.trim(tagInfo.image);		// ex thumbnail[url]
				
				//h url 구해서 배열에 넣기.
				if( strSelect.substr(strSelect.length-1, strSelect.length) == ']' )
				{
					var attr = riff.trim( strSelect.substring( strSelect.lastIndexOf("[")+1 , strSelect.lastIndexOf("]") ) ),
						imgSrc = elem.attr(attr);

					if( imgSrc )
					{
						dataType = "img";
						dataImgUrl = imgSrc;
					}
				}
				else if ( riff.trim(elem.text()) )
				{
					dataType = "img";
					dataImgUrl = riff.trim( elem.text());
				}
			}

			//h tagInfo text를 보여줄지 말지.
			if( opts.description != "none" ) {
				dataDescription = itemElem.eq(i).find(tagInfo.description).text();
			}
			
			//h link 요소 생성 및 linkUrl 연결
			if( opts.link != "none" && riff.trim(itemElem.eq(i).find(tagInfo.link).text()) ) 
			{
				dataLink = itemElem.eq(i).find(tagInfo.link).text();
				moveUrl = [function ( _url ) { riff.openURL( _url ); }, dataLink];
				urlArray.push([function ( _url ) { riff.openURL( _url ); }, dataLink] );

				//h 캐시 데이터
				strStorage += "<link>"+ dataLink + "</link>";
			}

			var txtTitle = itemElem.eq(i).find(tagInfo.title).text();
	
			//h <li>...</li> 생성
			inHTML += '<li' + ((dataType =="radio" || dataType=="check" || dataType=="onoff" || dataType=='accordion')?' class="'+ dataType+'"':'') + '>';

			//h img 유무 체크 -> 1: img+title+subTitle, 2: title + image + subTitle (리스트 형태 구성)
			if( imgSrc )
				if(dataType =="img")
					inHTML += '<div class="img"><img src="' + dataImgUrl + '"></div>' + '<div class="txt">' + txtTitle + '</div>';
				else
					inHTML += '<div class="txt">' + txtTitle + '</div>' + '<div class="img"><img src="' + dataImgUrl + '"></div>';	
			else if(dataType == "accordion")
				inHTML += txtTitle;
			else
				inHTML += '<div class="txt">' + txtTitle + '</div>';

			//h subTitle 있으면 추가
			if( dataDescription )
				inHTML += '<div class="subTxt">' + dataDescription + '</div>';

			//h type == accordion 이면 요소 추가
			if( dataType == "accordion" )
				inHTML += '<div class="accCon"><div class="list"></div></div>';

			inHTML += '</li>';


			//h 캐시 데이터
			strStorage += "<type>" + dataType + "</type>";
			if( dataType == opts.imageType )
			{
				strStorage += "<image>" + dataImgUrl + "</image>";
				strStorage += "<title>" + txtTitle + "</title>";
				strStorage += "<description>" + dataDescription + "</description>";
			}
			else
			{
				strStorage += "<title>" + txtTitle + "</title>";
				strStorage += "<description>" + dataDescription + "</description>";
			}
			strStorage += "</item>";

		}
	}
	inHTML += "</ul>";

	strStorage += "</riffRSSData>";
//	riff.storage("riffRSSData" +this.dom().id + riffGlobal.cacheKeyArray[ _fnIndex ] , strStorage );		// save data

	//h 해당 subScene에 markup  넣어주기
	this.subSceneSelect(_fnIndex).children(".list").html(inHTML);

	//h 해당 사이트로 링크 붙임
	this.subSceneSelect(_fnIndex).children(".list").find("ul > li").each(
		function (k) {
			riff(this).tap( function () { urlArray[k][0](urlArray[k][1]);  } ) ;
	});

	//h 구조 셋팅
	this.subSceneSelect(_fnIndex).children(".list").makeStructs();

	//h rss feed 받은 시간 추가 부분
	this.subSceneSelect(_fnIndex).children(".list").buffer("ComponentListComponentDataRSSFlag", true).buffer("ComponentListComponentDataRSSTime", riff.now() );
};

























//h 리스트 인터페이스
var rssTestDataList = {
	runs : 
	[
		"http://175.125.20.219/xml/xml.php?url=http://www.samsung.com/us/function/rss/rssFeedItemList.do?typeCd=NEWS",   fooList, [ ]
	]
	, layout : [ frameworkList, [ ] ]
	, opts :
	{
		ajaxOption : {  }
		, cache : true
	}
	, successFnAfterXML : null
}


//h 프레임워크용 리스트 레이아웃.
function frameworkList()
{
	var layoutParamsArray		= arguments[0];
	var sceneArray					= arguments[1];
	var opts							= arguments[2];
	var xmlSuccessCallback	= arguments[3];
	var riffThis = this;
	
	riffThis.buffer("ComponentListComponentDataRSSRefresh", 	
		function ()
		{
			riff.xml( 
				sceneArray[0],
				function( _xml, _xmlObject, _xmlString ) {
					var _xmlCache = _xmlObject;
					
					var args = new Array();
					args.push( _xml );
					args.push( 0 );	
					args.push( sceneArray[2] );

					//h data.js의 user가 정의한 화면 구성 함수 호출
					if( sceneArray[1] && typeof sceneArray[1] == "function" ){
						sceneArray[1].apply( riffThis, args );	 		
					}
				}
				,  opts.ajaxOption );
			}
		);

	var rssRefresh = riffThis.buffer("ComponentListComponentDataRSSRefresh"); 
	rssRefresh();
	riff.feedReceiveTime( riff.now() );
};

//h 프레임워크용 리스트 구성부분
function fooList( _this )  
{
	var _xml			= arguments[0];
	var _fnIndex	= arguments[1];
	var _tagOpts	= arguments[2][0];

	// opts Setting
	var opts = {};
	opts.imageType = "img";

	var tagInfo = {};
	tagInfo.title = "title";
	tagInfo.description = "description";
	tagInfo.link = "link";
	tagInfo.image = "image";
	
	for( var k in _tagOpts )
	{
		if( k == "title" )
			tagInfo.title = _tagOpts[k];
		else if(k=="description")
			tagInfo.description = _tagOpts[k];
		else if(k == "link")
			tagInfo.link = _tagOpts[k];
		else if(k == "image")
			tagInfo.image = _tagOpts[k];
	}

	//h rss callback
	var dataArray = new Array();
	var itemElem = _xml.selector("item");
	var inHTML = "<ul>";
	var urlArray = new Array();
	
	for ( var i=0, l=itemElem.size(); i<l; i++ )
	{
		var dataType = "";
		var dataImgUrl = "";
		var dataTitle = "";
		var dataDescription = "";
		var dataLink = "";
		var moveUrl = "";
		
		//h 이미지정보 있으면
		if( tagInfo.image )		
		{
			var elem = itemElem.eq(i).find(tagInfo.image);

			if( elem.size() != 0 )
			{
				var strSelect = riff.trim(tagInfo.image);		// ex thumbnail[url]
				
				//h url 구해서 배열에 넣기.
				if( strSelect.substr(strSelect.length-1, strSelect.length) == ']' )
				{
					var attr = riff.trim( strSelect.substring( strSelect.lastIndexOf("[")+1 , strSelect.lastIndexOf("]") ) ),
						imgSrc = elem.attr(attr);
						
					if( imgSrc )
					{
						dataType = "img";
						dataImgUrl = imgSrc;
					}
				}
				else if ( riff.trim(elem.text()) )
				{
					dataType = "img";
					dataImgUrl = riff.trim( elem.text());
				}
			}
			
			//h tagInfo text를 보여줄지 말지.
			if( opts.description != "none" ) {
				dataDescription = itemElem.eq(i).find(tagInfo.description).text();
			}
			
			//h link 요소 생성 및 linkUrl 연결
			if( opts.link != "none" && riff.trim(itemElem.eq(i).find(tagInfo.link).text()) ) 
			{
				dataLink = itemElem.eq(i).find(tagInfo.link).text();
				moveUrl = [function ( _url ) { riff.openURL( _url ); }, dataLink];
				urlArray.push([function ( _url ) { riff.openURL( _url ); }, dataLink] );
			}

			var txtTitle = itemElem.eq(i).find(tagInfo.title).text();
				
			//h <li>...</li> 생성
			inHTML += '<li' + ((dataType =="radio" || dataType=="check" || dataType=="onoff" || dataType=='accordion')?' class="'+ dataType+'"':'') + '>';

			//h img 유무 체크 -> 1: img+title+subTitle, 2: title + image + subTitle (리스트 형태 구성)
			if( imgSrc )
				if(dataType =="img")
					inHTML += '<div class="img"><img src="' + dataImgUrl + '"></div>' + '<div>' + txtTitle + '</div>';
				else
					inHTML += '<div class="txt">' + txtTitle + '</div>' + '<div class="img"><img src="' + dataImgUrl + '"></div>';	
			else if(dataType == "accordion")
				inHTML += txtTitle;
			else
				inHTML += '<div class="txt">' + txtTitle + '</div>';

			//h subTitle 있으면 추가
			if( dataDescription )
				inHTML += '<div class="subTxt">' + dataDescription + '</div>';

			//h type == accordion 이면 요소 추가
			if( dataType == "accordion" )
				inHTML += '<div class="accCon"><div class="list"></div></div>';

			inHTML += '</li>';
		}
	}

	inHTML += "</ul>";
	
	this.html(inHTML);
	
	//h 해당 사이트로 링크 붙임
	this.children('ul').children("li").each(
		function (k) {
			riff(this).tap( function () { urlArray[k][0](urlArray[k][1]);  } ) ;
	} );	
	this.makeStructs();

	//h rss feed 받은 시간 추가 부분
	this.buffer("ComponentListComponentDataRSSFlag", true).buffer("ComponentListComponentDataRSSTime", riff.now() );
};