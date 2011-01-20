//
// Framework 0.98
//
// Copyright 2010, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

/* @Framework_Ver 0.98 */
//h Component() = 요소를 생성해서 id, className, type를 부여.


// Basic riff Object Component
var riffBasic = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "object";
}

// riff Button Component
var ComponentButton = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "button";
}

// button option setting
// params  : _data => { property : value }
ComponentButton.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		//h 해당 버튼 객체에 size, color, btnImage 스타일을 적용시킨다.
		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","32px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","28px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","24px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		if(k == "btnImage"){
			riff(this).css("-webkit-border-image" ,"url('"+_data[k]+"') 15 stretch stretch");
		}
		
		//h 옵션 데이터를 버퍼에 저장한다. ( 초기화 이후 요소를 동적으로 생성했을 경우 추가로 옵션을 걸어준다. )
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// riff RssTime Component
var ComponentReceiveRssTime = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "feedReceiveTime";
}

// feedReceiveTime option setting
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentReceiveRssTime.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		//h 해당 버튼 객체에 size, color, btnImage 스타일을 적용시킨다.
		
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf(" from ") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","24px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","18px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","14px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}
		
		//h 옵션 데이터를 버퍼에 저장한다. ( 초기화 이후 요소를 동적으로 생성했을 경우 추가로 옵션을 걸어준다. )
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// riff Scene Component
var ComponentScene = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "scene";
}

// scene option setting
// params : _data = > 1. { property : value }
ComponentScene.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "backgroundImage"){
			if (_data[k] == "image1"){
				riff(this).children('.sceneBackground').addClass('image1');
			} else if (_data[k] == "image2"){
				riff(this).children('.sceneBackground').addClass('image2');
			} else if (_data[k] == "image3"){
				riff(this).children('.sceneBackground').addClass('image3');
			} else if (_data[k] == "image4"){
				riff(this).children('.sceneBackground').addClass('image4');
			} else if (_data[k] == "none"){
				riff(this).children('.sceneBackground').css("background-image","none");
			} else {
				riff(this).children('.sceneBackground').css("background-image","url("+_data[k]+")");
			}
		}
		
		if(k == "opacity"){
			riff(this).children('.sceneBackground').css("opacity",_data[k]);
		}

		if(k == "backgroundColor"){
			riff(this).css("backgroundColor",_data[k]);
		}
		
		if(k == "softkeyData" ) {
			riff(this).buffer("ComponentSceneComponentDataSoftkey", _data[k] );
		}
		
		//h 옵션 데이터를 버퍼에 저장한다. ( 초기화 이후 요소를 동적으로 생성했을 경우 추가로 옵션을 걸어준다. )
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// scene setting 
//h componentSetting.js 에서 호출됨, <div class="scene"> 하부요소를 전부 sceneWrap 으로 감싼다.
//h frame 및 background 구성하고 <div class="sceneWarp"> 앞에 위치
ComponentScene.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.children().wrapAll("<div class='sceneWrap'></div>");	// Blank DIV Element for BackgroundImage
	riffThis.prepend("<div class='frameTop'></div><div class='frameBottom'></div><div class='sceneBackground'></div>"); // Blank DIV Element for BackgroundImage
	riffThis.option( riffThis.buffer("ComponentDataOption") );	// scene.option function call
}

// riff popup Component
var ComponentPopup = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "popup";
}

// popup option setting
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentPopup.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find('.popupCon').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.popupCon').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('.popupCon').addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor"){
			riff(this).find('.popupCon').css("color",_data[k]);
		}

		if(k == "borderColor"){
			riff(this).find('.popupCon').css("border-color",_data[k]);
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).find('.popupCon').css("font-size","28px");
			} else if (_data[k] == "normal"){
				riff(this).find('.popupCon').css("font-size","24px");
			} else if (_data[k] == "small"){
				riff(this).find('.popupCon').css("font-size","20px");
			} else {
				riff(this).find('.popupCon').css("font-size",_data[k]);
			}
		}

		if(k == "btnAreaBackground"){
			if (_data[k][0] == "color"){
				riff(this).find('.popupCon .btnArea').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.popupCon .btnArea').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('.popupCon .btnArea').addClass("c_"+_data[k][1]);
				}
			}
		}
		
		//h 옵션 데이터를 버퍼에 저장한다. ( 초기화 이후 요소를 동적으로 생성했을 경우 추가로 옵션을 걸어준다. )
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];	
	}
}

//h popup 구조 셋팅
//h buffer에 값이 없을때 setMode로 buffer에 set시키고 riff Obj 리턴받음
ComponentPopup.prototype.makeStructs = function ( )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentPopupComponentDataSet");	// getMode

	if ( !dataSet )
		riffThis.buffer("ComponentPopupComponentDataSet", dataSet = {} );	 // setMode

	//h 팝업 요소 구성
	riffThis.contents().not(".btnArea").wrapAll('<div class="popupConTxt"></div>');
	riffThis.contents().wrapAll('<div class="popupCon"></div>');

	//h framework.js 의 alert 함수에서 default 버튼을 riff.back() 를 okFunc에 설정했을 경우
	if ( typeof dataSet.okFunc == "function" ) {
		riffThis.children('.popupCon').children('.btnArea').children(".popupOK").tap( dataSet.okFunc );
	}

	//h framework.js 의 alert 함수에서 default 버튼을 riff.back() 를 cancelFunc에 설정했을 경우
	if ( typeof dataSet.cancelFunc == "function" ) {
		riffThis.children('.popupCon').children('.btnArea').children(".popupCancel").tap( dataSet.cancelFunc );
	}

	riffThis.find('.btn').touchStart(function(){ riff(this).addClass("focus")})
				.touchEnd(function(){ riff(this).removeClass("focus")})
				
	riffThis.option( riffThis.buffer("ComponentDataOption") );		// popup option function call

}

// popup markup create
// params : _data => { html : string }, { okFunc : function() {} } or { cancelFunc : function() {} }
ComponentPopup.prototype.makeContents = function ( _data )
{
	var riffThis = riff(this),
		dataSet = {},
		inHTML = "",
		btnHTML = "";

	for( var k in _data )
	{
		if( k == "html" )
			dataSet.html = _data[k];
		else if( k =="okFunc")
			dataSet.okFunc = _data[k];
		else if( k =="cancelFunc" )
			dataSet.cancelFunc = _data[k];
	}
	inHTML += dataSet.html;

	if( dataSet.okFunc )
		btnHTML += '<button class="btn popupOff popupOK">OK</button> ';
	if( dataSet.cancelFunc )
		btnHTML += ' <button class="btn popupOff popupCancel">Cancel</button>';

 	if ( btnHTML != "" ) inHTML += '<div class="btnArea">' + btnHTML + '</div>';

 	riffThis.buffer("ComponentPopupComponentDataSet", dataSet);	// buffer setMode
	riffThis.html(inHTML);
 	riffThis.makeStructs();
}

// riff list Component
var ComponentList = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="list";
}

// riff list AutoRefresh
ComponentList.prototype.autoRefresh = function ( _time )
{
	var riffThis = riff(this),
		dataTimer = riffThis.buffer("ComponentListComponentDataTimer");

	if( dataTimer && typeof dataTimer == "number" ){
		riff.timer( dataTimer );
		dataTimer = null;
	}

	if( !_time || _time <= 0 )
		return;

	dataTimer = riff.timer( function() {
		if ( riffThis.parent().parent().css( "display") == 'block' ){
			riffThis.refresh();
		}
	}, _time );

	riffThis.buffer("ComponentListComponentDataTimer", dataTimer);
}

// riff list refresh
ComponentList.prototype.refresh = function ()
{
	var riffThis = riff(this);

	var rssRefresh = riffThis.buffer("ComponentListComponentDataRSSRefresh"); 

	if( rssRefresh && typeof rssRefresh == "function")
	{
		rssRefresh();	
	}
}

// riff list Option
ComponentList.prototype.option = function ( _data )
{
	for ( var k in _data){
		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).find('ul > li > .glow').show();
			} else if (_data[k] == "false"){
				riff(this).find('ul > li > .glow').hide();
			}
		}

		if(k == "lineTopColor"){
			riff(this).find('ul > li .listLineTop').css('display','block');
			riff(this).find('ul > li .listLineTop').css('border-color',_data[k]);
		}

		if(k == "lineBottomColor"){
			riff(this).find('ul > li .listLineBottom').css('display','block');
			riff(this).find('ul > li .listLineBottom').css('border-color',_data[k]);
		}

		if(k == "lineTopOpacity"){
			riff(this).find('ul > li .listLineTop').css('opacity',_data[k]);
		}

		if(k == "lineBottomOpacity"){
			riff(this).find('ul > li .listLineBottom').css('opacity',_data[k]);
		}

		if(k == "fontColor"){
			riff(this).find('ul > li').css("color",_data[k]);
		}

		if(k == "subTextFontColor"){
			riff(this).find('ul > li .subTxt').css("color",_data[k]);
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find("li").css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).find("li").css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find("li").addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "maxLen")	{
			riff(this).buffer("ComponentListComponentDataMaxLen", _data[k]);
			riff(this).makeContents( riff(this).buffer("ComponentListComponentDataInput") );
		}

		if(k == "SettingComponentPosition"){
			riff('.innerCom').css('float',_data[k]);
		}
		
		//h 옵션 데이터를 버퍼에 저장한다. ( 초기화 이후 요소를 동적으로 생성했을 경우 추가로 옵션을 걸어준다. )
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];	
	}
}

// list count
ComponentList.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}

// list set
ComponentList.prototype.makeStructs = function ( )
{
	// List Component Default Setting
	//h class="list" 인 모든 요소임.
	var riffThis = riff(this),
		listRow = riffThis.children('ul').children('li');

		//h listRow앞에 추가
		listRow.prepend("<div class='listLineTop'></div>"+		// Blank DIV Element for LineTop
					"<div class='listLineBottom'></div>"+					// Blank DIV Element for LineBottom
					"<div class='glow'></div>"); 								// Blank DIV Element for Gradient

	//h focus 추가 및 제거
	listRow.touchStart(	function() { riff(this).addClass('focus'); })
		.touchEnd( function() { riff(this).removeClass('focus'); });

	//h 각 li의 형태에 따라 class추가한다.
	listRow.each( function() {
		var riffThis = riff(this);

		//h subText 가 존재하는 요소의 상위에 multiline 추가
		riffThis.children('.subTxt').parent().addClass("multiLine"); //add multiline class

		//h add img class - 타입에 따라 두가지로 된다.
		if( riffThis.children('.img').size() != "0")
		{
			riffThis.addClass("img");

			//h 자식노드에 img 클래스 다음에 txt 클래스가 없으면 2번 형태   (data함수에 있는 리스트 형태에 따라 달라짐) 1. img->txt->subTxt, 2: txt->img->subTxt
			if( !riffThis.children('.img').next().hasClass('txt') )
			{
				riffThis.addClass("img2");
			}
		};
	});

	//h 만약 데이터가 없다면 마크업 상에 데이터들을 읽어들여 저장
	if( !riffThis.buffer("ComponentListComponentDataSet") )
	{
		//h buffer에 dataSet 배열 set
		riffThis.buffer("ComponentListComponentDataSet", new Array() );

		//h 버퍼의 dataSet을 가져옴
		listRow.each ( function () {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
				dataSetCur = {},
				listType = [ "radio", "check", "onoff", "img2", "img" ];

			//h 해당 scene의 list에 listType에 해당하는 class가 있으면
			//h dataSet.type 으로 설정.
			for ( var i = 0, l = listType.length; i < l; i++)
			{
				if( riffThis.hasClass(listType[i]) )
				{
					dataSetCur.type = listType[i];
					break;
				}
			}

			//h listType에 없는 경우 type을 text로 설정
			if( i == l)
				dataSetCur.type = "text";

			dataSet.push( dataSetCur );
		});
	}

	//h Image 크기에 따라 Subtxt 가변적
	listRow.filter('.multiLine.img').each(function(){
		var riffThis = riff(this);

		if(riffThis.children('.img').children('img').size()!=0){
		riffThis.children('.subTxt').css("width", (430- riffThis.children('.img').children('img').width()) + "px");
		} else{
		riffThis.children('.subTxt').css("width", (430- riffThis.children('.img').width()) + "px");
		}
	})

	//h Image 크기에 따라 1 line일때 Line-height 변경 (중앙정렬위해)
	listRow.filter('.img').each(function(){
		var riffThis = riff(this);
		riffThis.css("line-height", (riffThis.children('.img').children('img').height() + 28) +"px")
	})

	// radio Component Default Setting
	listRow.filter('.radio').prepend('<div class="innerCom"><div class="symRadio"><div class="comRadioObj"></div><div class="comRadioOnShadow"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.innerCom').children('.symRadio'),
			liThisRow = riffThis.parent().children('li');

		for( var k in listDataSet )
			if( listDataSet[k].type == "radio" )
			{
				listDataSet[k].select = false;
				liThisRow.eq(k).children('.innerCom').children('.symRadio').removeClass('on');
			}

		listDataSet[ idx ].select = true;
		liSym.addClass('on');

		if ( typeof listDataSet[idx].subSceneLoad == "function" )
			listDataSet[idx].subSceneLoad.apply(this, listDataSet[idx].funcArgs);
	});

	//h Radio 가 있을때 List 값 조정
	listRow.children(".innerCom").each( function(){
		var riffThis = riff(this),
			riffThisParent = riffThis.parent();

		// Adjust Sub Text width
		riffThis.siblings('.subTxt').css('width','390px');

		//h 한줄일 때 컴포넌트 위치 조정
		if(! riffThisParent.hasClass('multiLine'))
		{
			var pH = window.parseInt(riffThisParent.css("line-height"));
			riffThis.css("margin-top",(pH-(pH/2+20))+"px");
		}

		//h 오른쪽, 왼쪽 방향에 따른 Margin
		if(riffThis.css('float') == "left")
			riffThis.css('margin-right','10px');
	});

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

//h select() -> 선택된 것들의 배열
//h select(key) -> 이놈을 선택 ( 아직 미구현 )
ComponentList.prototype.subSceneSelect = function ()
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet"),
		rArray = new Array();

	for ( var k in dataSet)
		if( dataSet[k].select == true)
			rArray.push( dataSet[k].key );

	return rArray;
};

// list rssCache
ComponentList.prototype.rssCache = function ()
{
	var strXML = riff.storage( "riffRSSData" +riffGlobal.name + this.id );

	if ( !strXML )
		return;

	var itemElem = riff.xmlSelector ( ( new DOMParser() ).parseFromString( strXML, "application/xml" ) , "item" ),
		dataSet = new Array();

	for ( var i=0, l=itemElem.size(); i<l; i++ )
	{
		var dataSetCur = new Array();
		var type = itemElem.eq(i).find("type").text();
		dataSetCur.push( type );

		if( type == "img" || type == "img2" )
			dataSetCur.push( itemElem.eq(i).find("image").text() );

		dataSetCur.push( itemElem.eq(i).find("title").text() );
		dataSetCur.push( itemElem.eq(i).find("description").text() );
		dataSetCur.push( [
			function ( _url ) { riff.openURL( _url ); },
			itemElem.eq(i).find("link").text()
		] );

		dataSet.push(dataSetCur);
	}

	riff(this).makeContents( dataSet );
}

// list func
// params -> _data : object
ComponentList.prototype.subSceneLoad = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	if( typeof _data == "object" )
		for ( var k in _data)
			dataSet[k].subSceneLoad = _data[k];
}

// list sub
// params -> _key : number or string
ComponentList.prototype.subSceneSelect = function ( _key )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	//h 현재  key 값에 해당하는 요소를 반환한다.
	//h 키가 number, string 이 아니면 li요소 전체 반환.
	if( typeof _key == "string" )
	{
		for ( var k in dataSet)
			if( dataSet[k].key == _key )
				return riffThis.subSceneSelect( window.parseInt(k) );
	}
	else if ( typeof _key == "number")
		return riffThis.children('ul').children('li').eq(_key);
	else
		riffThis.children('ul').children('li').eq();
}

// list removeListItem
// params -> _key : string or number
ComponentList.prototype.removeListItem = function ( _key )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	if( typeof _key == "string" )
	{
		for ( var k in dataSet)
			if( dataSet[k].key == _key )
				riffThis.remove( window.parseInt(k) );
	}
	else if ( typeof _key == "number")
	{
		var dataSetTemp = new Array();

		//	이부분이 필요한 이유??
		for( var i = 1, l = dataSet.length - _key; i< l; i++)
			dataSetTemp.push( dataSet.popup() );

		for( var i = 0, l = dataSetTemp.length; i< l; i++)
			dataSet.push( dataSetTemp.popup() );

		//h _key 번재 리스트 삭제
		riffThis.subSceneSelect(_key).remove();	
	}
}

// riff SetList Component
var ComponentSettingList = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "setList";
}

// setList data
// params->_data : object or function
ComponentSettingList.prototype.makeContents = function ( _data )
{
	var riffThis = riff(this);

	if( !_data )
		return riffThis.buffer("ComponentSettingListComponentDataSet");

	var inHTML = "<ul>",
		dataSet = new Array(),
		data;

	if( typeof _data[1] == "function" )
	{
		data = _data[0];
		riffThis.buffer( "ComponentSettingListComponentDataFunc", _data[1] );
	}
	else
		data = _data;


	// save data
	for( var k in data )
	{
		var dataSetCur = {},
			i = 0;

		dataSetCur.key = k;
		dataSetCur.type = data[k][i++];

		if( dataSetCur.type == "img" || dataSetCur.type == "img2" )
			dataSetCur.img = data[k][i++];
		else if( typeof data[k][i] == "boolean" )
			dataSetCur.select =data[k][i++];

		dataSetCur.title = data[k][i++];

		if( typeof data[k][i] == "string" )
			dataSetCur.subTitle = data[k][i++];

		dataSet.push(dataSetCur);

												inHTML += '<li' + ((dataSetCur.type=="radio" || dataSetCur.type=="check" || dataSetCur.type=="onoff")?' class="'+ dataSetCur.type+'"':'') + '>';
		if( dataSetCur.img )
			if(dataSetCur.type=="img") 			inHTML += '<div class="img"><img src="' + dataSetCur.img + '"></div>' + '<div class="txt">' + dataSetCur.title + '</div>';
			else 								inHTML += '<div class="txt">' + dataSetCur.title + '</div>' + '<div class="img"><img src="' + dataSetCur.img + '"></div>';
		else 									inHTML += '<div class="txt">' + dataSetCur.title + '</div>';

		if( dataSetCur.subTitle ) 				inHTML += '<div class="subTxt">' + dataSetCur.subTitle + '</div>';
												inHTML += '</li>';

	}
	inHTML += "</ul>";

	riffThis.buffer("ComponentSettingListComponentDataSet", dataSet );
	riffThis.html(inHTML);
	riffThis.makeStructs();

	for( var k in dataSet )
		if( dataSet[k].select )
			riffThis.getSettingValue( dataSet[k].key );
}

//h 셋팅 리스트의 갯수
ComponentSettingList.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}


//h 구조 설정
ComponentSettingList.prototype.makeStructs = function ( )
{
	// List Component Default Setting
	var riffThis = riff(this),
		listRow = riffThis.children('ul').children('li');

	// Add to list css property
	riffThis.addClass("list");
	if( !riffThis.buffer("ComponentSettingListComponentDataSet") )
	{
		riffThis.buffer("ComponentSettingListComponentDataSet", new Array() );
		listRow.each ( function (idx) {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentSettingListComponentDataSet"),
				dataSetCur = {},
				listType = [ "radio", "check", "onoff", "img2", "img" ];

			for ( var i = 0, l = listType.length; i < l; i++)
			{
				if( riffThis.hasClass(listType[i]) )
				{
					dataSetCur.type = listType[i];
					break;
				}
			}
			if( i == l)
				dataSetCur.type = "text";
			dataSetCur.key = idx;

			dataSet.push( dataSetCur );
		});
	}

	listRow.prepend("<div class='listLineTop'></div>"+		// Blank DIV Element for LineTop
					"<div class='listLineBottom'></div>"+		// Blank DIV Element for LineBottom
					"<div class='glow'></div>"); 		// Blank DIV Element for Gradient

	listRow.touchStart(	function() { riff(this).addClass('focus'); })
			.touchEnd( function() { riff(this).removeClass('focus'); });

	listRow.each( function() {
		var riffThis = riff(this);
		riffThis.children('.subTxt').parent().addClass("multiLine"); //add multiline class

		//h add img class - 타입에 따라 두가지로 된다.
		if( riffThis.children('.img').size() != "0")
		{
			riffThis.addClass("img");
			if( !riffThis.children('.img').next().hasClass('txt') )
				riffThis.addClass("img2")
		};
	})

	//h Image 크기에 따라 Subtxt 가변적
	listRow.filter('.multiLine.img').each(function(){
		var riffThis = riff(this);
		riffThis.children('.subTxt').css("width", (430- riffThis.children('.img').children('img').width()) + "px");
	})

	//h Image 크기에 따라 1 line일때 Line-height 변경 (중앙정렬위해)
	listRow.filter('.img').each(function(){
		var riffThis = riff(this);
		riffThis.css("line-height", (riffThis.children('.img').children('img').height() + 28) +"px")
	})

	// Checkbox Component Default Setting
	listRow.filter('.check').prepend('<div class="innerCom"><div class="symCheck"><div class="comCheckboxObj1"></div><div class="comCheckboxObj2"></div></div></div>')
			.tap( function() {

		var	riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentSettingListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.innerCom').children('.symCheck');

		liSym.toggleClass('on');
		listDataSet[ idx ].selectFlag = liSym.hasClass('on');
	});

	// onoff Component Default Setting
	listRow.filter('.onoff').prepend('<div class="innerCom"><div class="symOnoff"><div class="symOnoffOnBg"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentSettingListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.innerCom').children('.symOnoff');

		liSym.toggleClass('on');
		listDataSet[ idx ].selectFlag = liSym.hasClass('on');
	});
	
	// radio Component Default Setting
	listRow.filter('.radio').prepend('<div class="innerCom"><div class="symRadio"><div class="comRadioObj"></div><div class="comRadioOnShadow"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentSettingListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.innerCom').children('.symRadio'),
			liThisRow = riffThis.parent().children('li');

		for( var k in listDataSet )
			if( listDataSet[k].type == "radio" )
			{
				listDataSet[k].selectFlag = false;
				liThisRow.eq(k).children('.innerCom').children('.symRadio').removeClass('on');
			}

		listDataSet[ idx ].selectFlag = true;
		liSym.addClass('on');
	});

	//h Radio, checkBox, onoff 가 있을때 List 값 조정
	listRow.children(".innerCom").each( function(){
		var riffThis = riff(this),
			riffThisParent = riffThis.parent();

		//h Sub Text width 값 조정
		riffThis.siblings('.subTxt').css('width','390px');

		//h 한줄일때 Component 위치 조정
		if(! riffThisParent.hasClass('multiLine'))
		{
			var pH = window.parseInt(riffThisParent.css("line-height"));
			riffThis.css("margin-top",(pH-(pH/2+20))+"px");
		}

		//h 오른쪽, 왼쪽 방향에 따른 Margin
		if(riffThis.css('float') == "left")
			riffThis.css('margin-right','10px');
	});
	
	riffThis.option( riffThis.buffer("ComponentDataOption") );	
}

//h setting에서 ok버튼 누를때 실행 인자로는 선택된 key값들의 배열
ComponentSettingList.prototype.okFunc = function ()
{
	var riffThis = riff(this),
		func = riffThis.buffer("ComponentSettingListComponentDataFunc");

	if( typeof func == "function" ){
		func.call(this, riffThis.getSettingValue() );
	}
}

//h setting에서 선택된 item의 key값들이 배열로 리턴
ComponentSettingList.prototype.getSettingValue = function ( _key, _value )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentSettingListComponentDataSet");


	//h _key 타입이 string 일 경우 indexNo를 파라미터로 넘겨서 getSttingValue 함수를 다시 불러서
	//h _key 타입을 number로 변경하게 된다.
	if( !dataSet ){
		return null;
	}
	else if( typeof _key == "string" ){
		for( var i = 0; dataSet[i]; i++)
			if( dataSet[i].key == _key )
				riffThis.getSettingValue(i, _value);
	}else if ( typeof _key == "number" && dataSet[_key]){
		var liAll = riffThis.children('ul').children('li'),
			liSelect = liAll.eq(_key),
			liSym;

		if( dataSet[_key].type == "check" ){
			liSym = liSelect.children('.innerCom').children('.symCheck');
		}else if ( dataSet[_key].type == "onoff" ){
			liSym = liSelect.children('.innerCom').children('.symOnoff');
		}else if ( dataSet[_key].type == "radio" )
		{
			for( var i = 0; dataSet[i]; i++){
				if( dataSet[i].type == "radio"){
					dataSet[i].selectFlag = false;
				}
			}

			liAll.children('.innerCom').children('.symRadio').removeClass('on');
			liSym = liSelect.children('.innerCom').children('.symRadio');
		}

		if ( liSym ){
			if(_value == "off"){
				liSym.removeClass('on');
				dataSet[ _key ].selectFlag = false;
			}else{
				liSym.addClass('on');
				dataSet[ _key ].selectFlag = true;
			}
		}
	}else{
		var rArray = new Array();

		for ( var k in dataSet)
			if( dataSet[k].selectFlag == true)
				rArray.push( dataSet[k].key );

		return rArray;
	}
}

//h ok버튼에 들어가는 함수 설정
ComponentSettingList.prototype.setOKFunc = function ( _func )
{
	riff(this).buffer("ComponentSettingListComponentDataFunc", _func );
}

// riff Tab Component
var ComponentTab = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "tab";
}

//h 탭 컴포넌트에 대한 옵션 설정
ComponentTab.prototype.option = function ( _data )
{
	for ( var k in _data)
	{

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find('li').not('.on').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('li').not('.on').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('li').not('.on').addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "focusBackground")
		{
			if (_data[k][0] == "color"){
				riff(this).find('li.on').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1)
				{
					riff(this).find('li.on').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				}
				else
				{
					riff(this).find('li.on').addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor")
		{
			riff(this).find('li').not('.on').css("color",_data[k]);
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).find('li').css("font-size","32px");
			} else if (_data[k] == "normal"){
				riff(this).find('li').css("font-size","28px");
			} else if (_data[k] == "small"){
				riff(this).find('li').css("font-size","24px");
			} else {
				riff(this).find('li').css("font-size",_data[k]);
			}
		}

		if(k == "focusFontColor")
		{
			riff(this).find('li.on').css("color",_data[k]);
		}


		if(k == "glow")
		{
			if (_data[k] == "true"){
				riff(this).find('.glow').show();
			} else if (_data[k] == "false"){
				riff(this).find('.glow').hide();
			}
		}

		if(k == "lineOpacity")
		{
			riff(this).find(".tabBorder").css("opacity",_data[k]);

		}

		if(k == "lineColorLight")
		{
			riff(this).find('.tabBorder').css("border-left-color",_data[k]);
		}


		if(k == "lineColorDark")
		{
			riff(this).find('.tabBorder').css("border-right-color",_data[k]);
		}

		if( k =="maxLen" )
		{
			riff(this).parent().find('.list').option( { "maxLen" : _data[k] } );
		}

		if( k == "transitionOption" )
		{
			riff(this).buffer("ComponentTabComponentDataTransitionOption", _data[k] );
		}
		
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];	
	}

}

//h 탭 메뉴의 갯수
ComponentTab.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}

//h 탭 구조 셋팅
ComponentTab.prototype.makeStructs = function ( )
{
	var riffThis		= riff(this);
	var riffThisUl		= riffThis.children('ul');
	var lis				= riffThisUl.children('li');

	lis.prepend("<div class='innerGrd'></div>"+		// Blank DIV Element for Border
				"<div class='tabBorder'></div>"); 			// Blank DIV Element for Border

	riffThis.prepend("<div class='glow'></div>");	// Blank DIV Element for Glow

	//h 버퍼에 dataSet이 없을 경우 (rss 함수처럼 동적으로 element 생성이 아니고, 컴포넌트의 탭을 사용할 때는 index.html에 element를 만들고 사용한다.)
	if ( !riffThis.buffer("ComponentTabComponentDataSet") )
	{
		riffThis.buffer("ComponentTabComponentDataSet", new Array() );
		
		riffThis.children('ul').children('li').each ( function () {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentTabComponentDataSet"),
				dataSetCur = {};

			dataSetCur.key = riff.trim( riffThis.text() );

			dataSetCur.enable = true;
			dataSet.push( dataSetCur );
		});
	}

	//h 탭간에 이동할 때 발생하는 이벤트
	lis.tap( function() {
		var liThis	= riff(this);
		var tabRiff = riff(this).parent().parent();

		tabRiff.move( liThis.index() );
	});

	riffThis.option( riffThis.buffer("ComponentDataOption") );

	riffThis.move(0); //First Scene View
}


// tab control markup and tab subScene list markup create
ComponentTab.prototype.makeContents = function ( _data )
{
	var riffThis = riff(this);
	if( !_data )
		return riffThis.buffer("ComponentTabComponentDataSet");

	var dataSet = new Array(),
		inHTML = "<ul>",
		sceneHTML = "";

	//h 각 탭 별 세부 설정
	for( var k in _data )
	{
		var dataSetCur = {};

		dataSetCur.feedTitle = k;
		dataSetCur.enable = true;

		if( typeof _data[k] == "string" )
		{
			dataSetCur.subSceneInnerList = _data[k];
		}
		else if( typeof _data[k] == "object" )
		{
			//h subScene 하위에 list class를 가지는 div Element 적용
			dataSetCur.subSceneInnerList = _data[k][0];
			//h 해당 탭에 접근할때 호출할 함수 적용
			dataSetCur.subSceneLoadFlag = _data[k][1];
			//h 해당 탭에 접근할때마다 시간 갱신되는 함수 적용
			dataSetCur.subSceneLoad = _data[k][2];
		}

		dataSet.push( dataSetCur );

		inHTML += "<li>" + dataSetCur.feedTitle + "</li>";
		sceneHTML += "<div class='subScene'>" + dataSetCur.subSceneInnerList + "</div>";
	}

	inHTML += "</ul>";

	riffThis.html(inHTML);			// tab control markup
	riffThis.after(sceneHTML);	// tab subScene markup
	
	riffThis.buffer("ComponentTabComponentDataSet", dataSet);
	riffThis.buffer("ComponentTabComponentDataCurTab", null);
	riffThis.makeStructs();
}

// tab move event function
//h 탭 클릭시 발생하는 이벤트 함수
ComponentTab.prototype.move = function ( _tab, _opts )
{
	if (typeof _tab == "number")
	{
		var riffThis = riff(this),
			dataSet = riffThis.buffer("ComponentTabComponentDataSet"),
			curTab = riffThis.buffer("ComponentTabComponentDataCurTab"),
			subScene = riffThis.siblings('.subScene'),
			tabList = riffThis.children('ul').children('li');

		//h 현재 탭 선택할 경우
		if(  curTab === _tab )
			return;

		//h dataSet이 없으면 탭
		if( !dataSet )
			riffThis.buffer("ComponentTabComponentDataSet", dataSet = new Array() );

		//h 현재 탭 표시 삭제
		tabList.removeClass('on');
		//h 이동할 탭에 현재탭 표시
		tabList.eq(_tab).addClass('on');

		//h 현재 탭 번호 버퍼에 저장
		riffThis.buffer("ComponentTabComponentDataCurTab", _tab);


		//h 밀리초 계산하는 부분
		var second = 0;
		if( typeof curTab != "number" || riffGlobal.tabPageTimming == "after")
		{
			second = 0;
		}
		else if ( _opts )
		{
			if( _opts.transitionEffect == "none" ) second = 0;
			else second = window.parseFloat( _opts.transitionSecond );
		}
		else if ( riffThis.buffer("ComponentTabComponentDataTransitionOption") )
		{
			if ( riffThis.buffer("ComponentTabComponentDataTransitionOption").transeffect == "none" ) second = 0;
			else second = window.parseFloat( riffThis.buffer("ComponentTabComponentDataTransitionOption").transitionSecond );
		}
		else
		{
			if ( riffGlobal.transeffect == "none" ) second = 0;
			else second = window.parseFloat( riffGlobal.transitionSecond );
		}

		window.setTimeout( function() {
			if ( dataSet[_tab] )
			{
				//h 현재 탭을 접근했을 경우 화면 갱신 플래그와, 화면 갱신 함수가 있는지 확인해서 화면 갱신하고 플래그 변경한다. ( refresh 정책 없으 경우는 처음한번만 호출됨 ) 
				if ( !dataSet[_tab].isSubsceneNew && dataSet[_tab].subSceneLoadFlag )
				{
					dataSet[_tab].subSceneLoadFlag.call( riffThis.dom(), _tab );

					//h AutoRefresh, Refresh 설정값에 따라 화면 갱신 정책을 적용한다. 
					//h Component.move() 로 이동했을 때, flag를 갱신한다. 
					riff.changeSubsceneFlag( dataSet.length, _tab, dataSet, true );
				}

				if ( dataSet[_tab].subSceneLoad )
					dataSet[_tab].subSceneLoad.call( riffThis.dom(), _tab );
			}
		}, second*1000 );


		//h 현재 탭의 타입이 숫자가 아닐 경우, _tab 번재 subScene 을 보여준다.
		if( typeof curTab != "number")
		{
			subScene.hide();
			subScene.eq(_tab).show();
		}
		else
		{
			//h _tab = on, curTab = off, _opts 유무에 따라 이펙트 준다.
			riff.transition(
				subScene.eq(_tab),
				subScene.eq(curTab), 
				(_opts)?_opts:riffThis.buffer("ComponentTabComponentDataTransitionOption") );
		}
	}
}

//h 탭 subScene 화면 갱신 함수
ComponentTab.prototype.subSceneLoad = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabComponentDataSet");
	if( !dataSet )
		return true;

	if( typeof _data == "object" )
		for ( var k in _data)
			dataSet[k].subSceneLoad = _data[k];
}


//h 탭 이동시 플래그가 true 이면 갱신한다.
ComponentTab.prototype.subSceneLoadFlag = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentTabComponentDataSet", dataSet = new Array() );

	if( typeof _data == "object" )
		for ( var k in _data)
		{
			dataSet[k].subSceneLoadFlag = _data[k];
			dataSet[k].isSubsceneNew = false;
		}
}


//h 해당 this 다음 요소부터 0으로 해서 가져온다.
ComponentTab.prototype.subSceneSelect = function ( _idx )
{
	var riffThis= riff(this),
		idx = ( typeof _idx == "undefined" )? riffThis.buffer("ComponentTabComponentDataCurPage") : _idx ;
	return riff(this).siblings(".subScene").eq( idx );
}

//h 탭 리프레쉬 함수
ComponentTab.prototype.refresh = function ( _isCallByAutoRefresh )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabComponentDataSet"),
		curTab = riffThis.buffer("ComponentTabComponentDataCurTab");

	if ( dataSet && dataSet[curTab] )
	{
		if ( dataSet[curTab].subSceneLoadFlag )
		{
			dataSet[curTab].subSceneLoadFlag.call( this, curTab );
			if ( _isCallByAutoRefresh )
			{
				//h Autorefresh() 로 화면 갱신했을 때, flag를 갱신한다. 
				riff.changeSubsceneFlag( dataSet.length, curTab, dataSet, false, true, false );
			} else {
				//h refresh() 로 화면 갱신했을 때, flag를 갱신한다. 
				riff.changeSubsceneFlag( dataSet.length, curTab, dataSet, false, false, true );
			}
		}

		if ( dataSet[curTab].subSceneLoad )
			dataSet[curTab].subSceneLoad.call( this, curTab );
	}
}

//h  탭 오토 리프레쉬 함수
ComponentTab.prototype.autoRefresh = function ( _time )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabComponentDataSet"),
		curTab = riffThis.buffer("ComponentTabComponentDataCurTab");

	if( dataSet && typeof dataSet.timer == "number" )
	{
		riff.timer( dataSet.timer );
		dataSet.timer = null;
	}

	if( !_time )
		return;

	dataSet.timer = riff.timer( function() {
		if ( riffThis.parent().parent().css( "display") == 'block' ){
			riffThis.refresh( true );
		}
	

//d		if ( dataSet && dataSet[curTab] )
//d		{
//d			if ( dataSet[curTab].subSceneLoadFlag )
//d			{
//d				dataSet[curTab].subSceneLoadFlag.call( this, curTab );
//d
//d				for( var i = 0, l = dataSet.length; i < l; i++ )
//d					dataSet[i].isSubsceneNew = false;
//d				dataSet[curTab].isSubsceneNew = true;
//d			}
//d			
//d			if ( dataSet[curTab].func )
//d				dataSet[curTab].func.call( this, curTab );
//d		}

	}, _time );
}




// riff Softkey Component
var ComponentSoftKey = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="softkey";
}


//h 소프트키 makeContents and markStructs
ComponentSoftKey.prototype.makeContents = function( _data, _type, _func )
{
	var riffThis = riff(this);
	riffThis.html("");

	if (!_data)
		return;

	if(!_type)
		_type = riffGlobal.softkeyType;

	if(!_func)
		_func = riffGlobal.softkeyFunc;

	riffThis.removeClass("type1 type2").addClass(_type);
	var dataSet = new Array();

	if( _type == "type1" )
	{
		var softKeyHTML = '<div class="shadow"></div><div class="normalList">'
						+'<div class="back"></div><ul class="keyList">';
		var moreHTML = "";

		var k = 0;
		for ( var curdata in _data )
		{
			// data
			var dataSetCur= new Array();
			dataSetCur.push( curdata ); // key value
			dataSetCur.push( _data[curdata] ); // function
			dataSet.push(dataSetCur);

			if( k<2 )
				softKeyHTML += ( "<li>" + curdata + "</li>" );
			else
				moreHTML += ( "<li>" + curdata + "</li>" );

			k++;
	    }

		softKeyHTML += ( dataSet.length > 3 )?'<li>More</li></ul></div><ul class="moreList">'+moreHTML : moreHTML;
	    softKeyHTML += "</ul>";

	    riffThis.html(softKeyHTML);
	    riffThis.buffer("riffSoftKeyData", dataSet);

		riffThis.children(".moreList").children("li").tap( function()
		{
			var softkeydata = riffThis.buffer("riffSoftKeyData");

			var func = softkeydata[riff(this).index()+2][1];
			func.call(this, riff(this).index()+2 );
			riff.softkey.softKeyMoreHide();
		});

		//Softkey Width Set
		var keyObj =riff('.softkey.type1 ul.keyList li');
		var keyNum = keyObj.size();

		if(keyNum == 3 ){
			keyObj.css("width","131px");
		} else if (keyNum == 2 ){
			keyObj.css("width","198px");
		} else if (keyNum == 1 ){
			keyObj.css("width","398px");
		}

		var moreList=riff('.softkey.type1 ul.moreList');
		var moreObj = riff('.softkey.type1 ul.moreList li');
		var moreNum = moreObj.size();

		if (moreNum%2 == 0){
			moreObj.css("width","238px");
			riff('.softkey.type1 ul.moreList li:last-child').addClass('evenLast')
			riff('.softkey.type1 ul.moreList li:nth-last-child(2)').addClass('evenLast2')

		} else {
			moreObj.css("width","238px");
			riff('.softkey.type1 ul.moreList li:last-child').css("width","478px");
			riff('.softkey.type1 ul.moreList li:last-child').addClass('oddLast')
		}

		//Softkey more function
		riff( this ).find(".keyList > li").not( (dataSet.length>3)?2:null ).tap( function() {
			var softkeydata = riff(".softkey").buffer("riffSoftKeyData");

			var func = softkeydata[riff(this).index()][1];
			func.call( this, riff(this).index() );
			riff.softkey.softKeyMoreHide();
		});

		if( dataSet.length  > 3 )
			riff( this ).find(".keyList > li").eq(2).tap(function(){
				if( moreList.css('bottom') == '70px')
				{
					var morekeyHeight = Math.abs(70-moreList.height());
					moreList.css('bottom','-'+morekeyHeight+'px');
				}
				else
				{
					moreList.css('bottom','70px');
				}
			});

		riff('.softkey .normalList .back').tap(function(){
			_func.call(this, -1);
		})

		riff('.softkey li').touchStart( function() { riff(this).addClass('focus'); })
					.touchEnd(function() { riff(this).removeClass('focus'); });
	}
}


// riff Title Component
var componentTitle = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="title";
}

//h 타이틀의 옵션 설정
componentTitle.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "round"){
			if (_data[k] == "normal"){
				riff(this).addClass('round');
			} else if (_data[k] == "big"){
				riff(this).addClass("round big");
			} else if (_data[k] == "small"){
				riff(this).addClass("round small");
			} else if (_data[k] == "false"){
				riff(this).removeClass("round");
			} else {
				riff(this).css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
				riff(this).children('.gradient').css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
			}
		}

		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).children(".glow").show();
			} else if (_data[k] == "false"){
				riff(this).children(".glow").hide();
			}
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}


			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "pattern"){
			if (_data[k] == "true"){
				riff(this).children(".pattern").show();
			} else if (_data[k] == "false"){
				riff(this).children(".pattern").hide();
			}
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","38px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","34px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","30px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		if(k == "textAlign"){
			riff(this).css("text-align",_data[k]);
		}

		if(k == "shadow"){
			if (_data[k] == "true"){
				riff(this).next(".titleShadow").show();
			} else if (_data[k] == "false"){
				riff(this).next(".titleShadow").hide();
			}
		}
		
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];	
	}
}

//h 타이틀의 구조 셋팅
componentTitle.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.append("<div class='pattern'></div>"		// Blank DIV Element for Pattern
					+"<div class='glow'></div>") 		// Blank DIV Element for Gradient
				.after('<div class="titleShadow"></div>'); // Shadow Element
				
	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// title makeContents
componentTitle.prototype.makeContents = function( _string )
{
    riff(this).text(_string).makeStructs();
}


//  Setting Title Component
var ComponentSettingTitle = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="setTitle";
}

// setting Title option 
ComponentSettingTitle.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "round"){
			if (_data[k] == "normal"){
				riff(this).addClass('round');
			} else if (_data[k] == "big"){
				riff(this).addClass("round big")
			} else if (_data[k] == "small"){
				riff(this).addClass("round small")
			} else if (_data[k] == "false"){
				riff(this).removeClass("round")
			} else {
				riff(this).css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
				riff(this).children('.gradient').css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
			}
		}

		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).children(".glow").show();
			} else if (_data[k] == "false"){
				riff(this).children(".glow").hide();
			}
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background-color",_data[k][1]);
			}


			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+"!important)");
				} else {
					riff(this).addClass("c_"+_data[k][1]);
				}

			}

		}

		if(k == "pattern"){
			if (_data[k] == "true"){
				riff(this).children(".pattern").show();
			} else if (_data[k] == "false"){
				riff(this).children(".pattern").hide();
			}
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","40px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","36px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","32px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		if(k == "textAlign"){
			riff(this).css("text-align",_data[k]);
		}
		if(k == "display")
		{
			if (_data[k] == "true"){
				riff(this).css("display","block");
			} else if (_data[k] == "false"){
				riff(this).css("display","none");
			}
		}
		
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];	
	}
}

//h 셋팅 타이틀의 구조 설정
ComponentSettingTitle.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.append("<div class='pattern'></div>"		// Blank DIV Element for Pattern
						+"<div class='glow'></div>") 		// Blank DIV Element for Gradient
				.after('<div class="titleShadow"></div>'); 	// Shadow Element
				
	riffThis.option( riffThis.buffer("ComponentDataOption") );				
}

//h 셋팅 타이틀로 쓸 string을 셋팅
ComponentSettingTitle.prototype.makeContents = function( _string )
{
    riff(this).text(_string).makeStructs();
}

// riff BusyIndicator Component
var ComponentBusyIndicator = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "busy";
}


// busyIndicator option 
ComponentBusyIndicator.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).parent().parent().css("background",_data[k][1])
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).parent().parent().css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")")
				} else {
					riff(this).parent().parent().addClass("c_"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor"){
			riff(this).parent().parent().css("color",_data[k])
		}

		if(k == "borderColor"){
			riff(this).parent().parent().css("border-color",_data[k])
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).parent().parent().css("font-size","28px")
			} else if (_data[k] == "normal"){
				riff(this).parent().parent().css("font-size","24px")
			} else if (_data[k] == "small"){
				riff(this).parent().parent().css("font-size","20px")
			} else {
				riff(this).parent().parent().css("font-size",_data[k])
			}
		}

		if(k == "btnAreaBackground"){
			if (_data[k][0] == "color"){
				riff(this).find('.popupCon .btnArea').css("background",_data[k][1])
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.popupCon .btnArea').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")")
				} else {
					riff(this).find('.popupCon .btnArea').addClass("c_"+_data[k][1]);
				}
			}
		}


		if(k == "busyIndicatorStyle"){
			if (_data[k] == "1"){
				riff(this).removeClass().addClass('busyIndicator type1');
			} else if (_data[k] == "2"){
				riff(this).removeClass().addClass('busyIndicator type2');
			} else if (_data[k] == "3"){
				riff(this).removeClass().addClass('busyIndicator type3');
			}
		}

		if(k == "busyIndicatorSpeed"){
			riff(this).css("-webkit-animation-duration",_data[k])
		}
		
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}