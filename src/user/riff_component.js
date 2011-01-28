//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

// Basic riff Object Component

// If the className is not a reserved name and is a DOM Element, using a call the type object is set
var riffBasic = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "object";
}

// riff Idle Component
// If className = idle, the DOM element's type is set to idle
var ComponentIdle = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "idle";
}

// dynamically create DOM elements of idle
ComponentIdle.prototype.makeStructs = function ()
{
	var riffThis = riff(this);

	riffThis.append("<div class='rf-idle-logo'>Riff Widget</div>");
	riffThis.append("<div class='rf-idle-refresh'></div>");
	riffThis.append("<div class='rf-idle-go'></div>");
	riffThis.append("<div class='rf-idle-section1'></div>");
	riffThis.append("<div class='rf-idle-section2'></div>");
	riffThis.append("<div class='rf-idle-busyindicator'></div>");
	riffThis.append("<div class='rf-idle-datareceivetime'></div>");


	// Idle Category Logic
	riffThis.children(".rf-idle-section1").append("<div class='rf-idle-artcle-back'>Back</div><div class='rf-idle-article'></div><div class='rf-idle-artcle-forward'>Forward</div>")

	// Idle Content Logic
	riffThis.children(".rf-idle-section2").append("<div class='rf-idle-category-left'>&lt;</div><div class='rf-idle-category'></div><div class='rf-idle-category-right'>&gt;</div>")

	riff(".rf-idle-go").tap( function() { riff.go("#index"); } );
	riff(".rf-idle-article").tap( function() { riffThis.moveFEEDArticle("article"); } );
	riff(".rf-idle-category-left").tap( function () { riffThis.moveFEEDArticle("categoryLeft") } );
	riff(".rf-idle-category-right").tap( function () { riffThis.moveFEEDArticle("categoryRight") } );
	riff(".rf-idle-artcle-back").tap( function () { riffThis.moveFEEDArticle("articleLeft") } );
	riff(".rf-idle-artcle-forward").tap( function () { riffThis.moveFEEDArticle("articleRight") } );
	riff(".rf-idle-refresh").tap( function () { riffThis.moveFEEDArticle("refresh") } );
}

ComponentIdle.prototype.setContents = function ()
{

}

ComponentIdle.prototype.option = function ( _data )
{
	for ( var k in _data){
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}
	}
}


ComponentIdle.prototype.moveFEEDArticle = function ( _move )
{
	var riffThis = riff(this);

	var feedComponent = riffThis.buffer("ComponentDataFEEDComponent");
	if( !feedComponent )
		return;

	var componentObject = feedComponent.component();
	if( !componentObject )
		return;

	// if type is tab
	if ( componentObject.type == "tabMenu" )
	{
		// article click event
		if(_move == "article"){
			var tabID = riffThis.buffer("ComponentDataFEEDComponentID");
			var parentID = $(tabID).parent().parent().dom().id;
			riff.go( parentID );
		}

		// refresh event
		if(_move == "refresh")	{
			var tabID = riffThis.buffer("ComponentDataFEEDComponentID");
			riff(tabID).refresh(false);
		}

		var dataSet = feedComponent.buffer("ComponentTabMenuComponentDataSet");
		if( !dataSet )
			return;

		var FEEDKey = riffThis.buffer("ComponentDataFEEDKey");
		if ( typeof FEEDKey !="number" && !FEEDKey )
			riffThis.buffer("ComponentDataFEEDKey", FEEDKey = null);

		var FEEDIndex = riffThis.buffer("ComponentDataFEEDIndex");
		if ( typeof FEEDIndex !="number" && !FEEDIndex )
			riffThis.buffer("ComponentDataFEEDKey", FEEDIndex = null);

		if ( FEEDKey == null ){
			FEEDKey = 0;
		}else {
			if ( _move == "categoryLeft" )	{
				if (--FEEDKey < 0) {
					FEEDKey = dataSet.length - 1;
				}
			}else if ( _move == "categoryRight" )	{
				if ( ++FEEDKey >= dataSet.length) {
					FEEDKey = 0;
				}
			}
		}

		riffThis.buffer("ComponentDataFEEDKey",FEEDKey);

		var idleSet = feedComponent.scenePartSelect(FEEDKey).find(".rf-component-list").buffer("ComponentDataIdleSet");

		if( !idleSet )
			FEEDIndex = null;

		if( typeof _move == "number"){
			FEEDIndex = _move;
		}else if ( FEEDIndex == null ||  _move == "categoryLeft" ||  _move == "categoryRight" ){
			feedComponent.go(FEEDKey);
			FEEDIndex = 0;
		}else{
			if ( _move == "articleLeft" ){
				if (--FEEDIndex < 0) {
					FEEDIndex = idleSet.length - 1;
				}
			}else if ( _move == "articleRight" ){
				if ( ++FEEDIndex >= dataSet.length) {
					FEEDIndex = 0;
				}
			}
		}

		riffThis.buffer("ComponentDataFEEDIndex",FEEDIndex);

		// idle title, ouput text to the article section
		if( FEEDIndex != null ){
			if ( idleSet[FEEDIndex] ){
				var reduceTitleText = riff.ellipsisString( feedComponent.children("ul").children("li").eq(FEEDKey).text(), 15 );
				riff(".rf-idle-category").text( reduceTitleText );

				var reduceArticleText = riff.ellipsisString( idleSet[FEEDIndex].txtHead, 100 );
				riff(".rf-idle-article").text( reduceArticleText );

				riff('.rf-idle-datareceivetime').text()
			}
		}
	}
}

// sets feedComponent.
ComponentIdle.prototype.setFeedComponent = function ( _component )
{
	if ( typeof _component  == "string" ){
		riff(this).buffer("ComponentDataFEEDComponentID", _component );
		riff(this).setFeedComponent( riff( _component ) );
	}else if ( typeof _component == "object" ){
		_component.buffer("ComponentDataFEEDIdle", riff(this) );
		riff(this).buffer("ComponentDataFEEDComponent", _component );
		_component.go(0);
	}
}

// riff Button Component
// when the className is btn, using a call the type is set to btn
var ComponentButton = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "btn";
}

// button option setting
// params  : _data => { property : value }
ComponentButton.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		// applying size, color, btnImage to relavent buttons
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

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// riff datareceivetime Component
var ComponentDataReceiveTime= function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "dataReceiveTime";
}

// datareceivetime option setting
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentDataReceiveTime.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		// applying size, color, btnImage to relavent buttons
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf(" from ") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
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

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// riff Scene Component
// when the className equals scene, the type is set to scene
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
			if (_data[k] == "rf-resourceImg1"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg1');
			} else if (_data[k] == "rf-resourceImg2"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg2');
			} else if (_data[k] == "rf-resourceImg3"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg3');
			} else if (_data[k] == "rf-resourceImg4"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg4');
			} else if (_data[k] == "none"){
				riff(this).children('.rf-effect-scene-background').css("background-image","none");
			} else {
				riff(this).children('.rf-effect-scene-background').css("background-image","url("+_data[k]+")");
			}
		}

		if(k == "opacity"){
			riff(this).children('.rf-effect-scene-background').css("opacity",_data[k]);
		}

		if(k == "backgroundColor"){
			riff(this).css("backgroundColor",_data[k]);
		}

		if(k == "softkeyData" ) {
			riff(this).buffer("ComponentSceneComponentDataSoftkey", _data[k] );
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// scene setting
// Blank DIV Element for BackgroundImage
// using sceneWrape, the infrastructure object <div class="rf-wrapper-scene"> wraps all elements
// place <div class="rf-wrapper-scene"> at the front to compose the frame and background
ComponentScene.prototype.makeStructs = function ()
{
	// Scene Component Default Setting
	// every elements has a class equals "scene"

	var riffThis = riff(this);
	riffThis.children().wrapAll("<div class='rf-wrapper-scene'></div>");
	riffThis.prepend("<div class='frameTop'></div><div class='frameBottom'></div><div class='rf-effect-scene-background'></div>");
	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// riff popup Component
// when the class name is popup the type is set to popup and is callable
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
				riff(this).find('.rf-area-contents-popup').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.rf-area-contents-popup').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('.rf-area-contents-popup').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor"){
			riff(this).find('.rf-area-contents-popup').css("color",_data[k]);
		}

		if(k == "borderColor"){
			riff(this).find('.rf-area-contents-popup').css("border-color",_data[k]);
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).find('.rf-area-contents-popup').css("font-size","28px");
			} else if (_data[k] == "normal"){
				riff(this).find('.rf-area-contents-popup').css("font-size","24px");
			} else if (_data[k] == "small"){
				riff(this).find('.rf-area-contents-popup').css("font-size","20px");
			} else {
				riff(this).find('.rf-area-contents-popup').css("font-size",_data[k]);
			}
		}

		if(k == "btnAreaBackground"){
			if (_data[k][0] == "color"){
				riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// popup structure settings
ComponentPopup.prototype.makeStructs = function ( )
{
	// popup Component Default Setting
	// every element has a class equals "rf-component-popup"

	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentPopupComponentDataSet");	// getMode

	// when buffer has no values, setMode is used to save the buffer
	if ( !dataSet )
		riffThis.buffer("ComponentPopupComponentDataSet", dataSet = {} );	 // setMode

	// additional elements of popup
	riffThis.contents().not(".rf-area-btn-popup").wrapAll('<div class="rf-area-txt-popup"></div>');
	riffThis.contents().wrapAll('<div class="rf-area-contents-popup"></div>');

	// when setting the riff.js alert default button ( riff.back() ) through the okFunc function
	if ( typeof dataSet.okFunc == "function" ) {
		riffThis.children('.rf-area-contents-popup').children('.rf-area-btn-popup').children(".popupOK").tap( dataSet.okFunc );
	}

	// when setting the riff.js alert default button ( riff.back() ) through the cancelFunc function
	if ( typeof dataSet.cancelFunc == "function" ) {
		riffThis.children('.rf-area-contents-popup').children('.rf-area-btn-popup').children(".popupCancel").tap( dataSet.cancelFunc );
	}

	// editing or removing the focus class when a button on a popup is either touched or released
	riffThis.find('.rf-component-btn').touchStart(function(){ riff(this).addClass("rf-state-onfocus")})
				.touchEnd(function(){ riff(this).removeClass("rf-state-onfocus")})

	// popup option function call
	riffThis.option( riffThis.buffer("ComponentDataOption") );

}

// popup markup and data setting
// params : _data => { html : string }, { okFunc : function() {} } or { cancelFunc : function() {} }
ComponentPopup.prototype.setContents = function ( _data )
{
	var riffThis = riff(this),
		dataSet = {},
		inHTML = "",
		btnHTML = "";

	for( var k in _data ) 	{
		if( k == "html" )
			dataSet.html = _data[k];
		else if( k =="okFunc")
			dataSet.okFunc = _data[k];
		else if( k =="cancelFunc" )
			dataSet.cancelFunc = _data[k];
	}
	inHTML += dataSet.html;

	// Creating markups based off the button events within the riff.alert() function
	if( dataSet.okFunc ) {
		btnHTML += '<button class="rf-component-btn popupOff popupOK">OK</button>';
	}
	if( dataSet.cancelFunc ) {
		btnHTML += ' <button class="rf-component-btn popupOff popupCancel">Cancel</button>';
	}
 	if ( btnHTML != "" )  {
		inHTML += '<div class="rf-area-btn-popup">' + btnHTML + '</div>';
	}

 	riffThis.buffer("ComponentPopupComponentDataSet", dataSet);	// buffer setMode
	riffThis.html(inHTML);
 	riffThis.makeStructs();
}

// riff list Component
// when className equals list, the type is set to list and callable
var ComponentList = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="list";
}

// riff list AutoRefresh
// params _time : number
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
		if ( ( riffThis.parent().parent().css( "display" ) == 'block' )
			|| ( riff( "#idle" ).css( "display" ) == 'block' ) ) {
			riffThis.refresh();
		}
	}, _time );

	riffThis.buffer("ComponentListComponentDataTimer", dataTimer);
}

// riff list refresh
ComponentList.prototype.refresh = function ()
{
	var riffThis = riff(this);

	var feedRefresh = riffThis.buffer("ComponentListComponentDataFEEDRefresh");

	if( feedRefresh && typeof feedRefresh == "function")
	{
		feedRefresh();
	}
}

// riff list Option
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentList.prototype.option = function ( _data )
{
	for ( var k in _data){
		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).find('ul > li > .rf-effect-half-glow').show();
			} else if (_data[k] == "false"){
				riff(this).find('ul > li > .rf-effect-half-glow').hide();
			}
		}

		if(k == "lineTopColor"){
			riff(this).find('ul > li .rf-effect-line-top').css('display','block');
			riff(this).find('ul > li .rf-effect-line-top').css('border-color',_data[k]);
		}

		if(k == "lineBottomColor"){
			riff(this).find('ul > li .rf-effect-line-bottom').css('display','block');
			riff(this).find('ul > li .rf-effect-line-bottom').css('border-color',_data[k]);
		}

		if(k == "lineTopOpacity"){
			riff(this).find('ul > li .rf-effect-line-top').css('opacity',_data[k]);
		}

		if(k == "lineBottomOpacity"){
			riff(this).find('ul > li .rf-effect-line-bottom').css('opacity',_data[k]);
		}

		if(k == "fontColor"){
			riff(this).find('ul > li').css("color",_data[k]);
		}

		if(k == "subTextFontColor"){
			riff(this).find('ul > li .rf-style-txt-desc').css("color",_data[k]);
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find("li").css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).find("li").css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find("li").addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "maxLen")	{
			riff(this).buffer("ComponentListComponentDataMaxLen", _data[k]);
			riff(this).setContents( riff(this).buffer("ComponentListComponentDataInput") );
		}

		if(k == "SettingComponentPosition"){
			riff('.rf-obj-component-setting').css('float',_data[k]);
		}

        	// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)

		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// list count
// return number
ComponentList.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}

// list structs setting
ComponentList.prototype.makeStructs = function ()
{
	// List Component Default Setting
	var riffThis = riff(this),
		listRow = riffThis.children('ul').children('li');

	listRow.prepend("<div class='rf-effect-line-top'></div>"+		// Blank DIV Element for LineTop
				"<div class='rf-effect-line-bottom'></div>"+					// Blank DIV Element for LineBottom
				"<div class='rf-effect-half-glow'></div>"); 								// Blank DIV Element for Gradient

	listRow.touchStart(	function() { riff(this).addClass('rf-state-onfocus'); })
		.touchEnd( function() { riff(this).removeClass('rf-state-onfocus'); });

	// if there is no data, markups data will be read and saved
	if( !riffThis.buffer("ComponentListComponentDataSet") )
	{
		// array of the buffer dataSet
		riffThis.buffer("ComponentListComponentDataSet", new Array() );

		// retrieve the buffer's dataset
		listRow.each ( function () {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
				dataSetCur = {},
				listType = [ "radio", "check", "onoff", "rf-style-thumnail2", "rf-style-thumnail" ];

			// if there is a relevant class for the scene list listType
			// the dataSet.type will be used for setting
			for ( var i = 0, l = listType.length; i < l; i++)
			{
				if( riffThis.hasClass(listType[i]))
				{
					dataSetCur.type = listType[i];
					break;
				}
			}

			// when there is no listType, the type will be set through text
			if( i == l)
				dataSetCur.type = "text";

			dataSet.push( dataSetCur );
		});
	}


	listRow.each( function() {
		var riffThis = riff(this);

		riffThis.children('.rf-style-txt-desc').parent().addClass("rf-style-row-multi"); //add multiline class

		if( riffThis.children('.rf-wrapper-thumnail').size() != "0")
		{
			riffThis.addClass("rf-style-thumnail");

			if( !riffThis.children('.rf-wrapper-thumnail').next().hasClass('rf-style-txt-head') )
			{
				riffThis.addClass("rf-style-thumnail2");
			}
		};
	});

	listRow.filter('.rf-style-row-multi.rf-style-thumnail').each(function(){
		var riffThis = riff(this);

		if(riffThis.children('.rf-wrapper-thumnail').children('rf-style-thumnail').size()!=0){
		riffThis.children('.rf-style-txt-desc').css("width", (430- riffThis.children('.rf-wrapper-thumnail').children('rf-style-thumnail').width()) + "px");
		} else{
		riffThis.children('.rf-style-txt-desc').css("width", (430- riffThis.children('.rf-wrapper-thumnail').width()) + "px");
		}
	})

	listRow.filter('.rf-style-thumnail').each(function(){
		var riffThis = riff(this);
		riffThis.css("line-height", (riffThis.children('.rf-wrapper-thumnail').children('img').height() + 28) +"px")
	})

	// Checkbox Component Default Setting
	listRow.filter('.check').prepend('<div class="rf-obj-component-setting"><div class="rf-component-checkbox"><div class="rf-obj-checkbox-1"></div><div class="rf-obj-checkbox-2"></div></div></div>')
			.tap( function() {

		var	riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.rf-obj-component-setting').children('.rf-component-checkbox');

		liSym.toggleClass('rf-state-on');
		listDataSet[ idx ].selectFlag = liSym.hasClass('rf-state-on');
	});

	// onoff Component Default Setting
	listRow.filter('.onoff').prepend('<div class="rf-obj-component-setting"><div class="rf-component-onoff"><div class="rf-obj-bg-onoff"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.rf-obj-component-setting').children('.rf-component-onoff');

		liSym.toggleClass('rf-state-on');
		listDataSet[ idx ].selectFlag = liSym.hasClass('rf-state-on');
	});

	// radio Component Default Setting
	listRow.filter('.radio').prepend('<div class="rf-obj-component-setting"><div class="rf-component-radio"><div class="rf-obj-radio"></div><div class="rf-obj-radio-shadow"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.rf-obj-component-setting').children('.rf-component-radio'),
			liThisRow = riffThis.parent().children('li');

		for( var k in listDataSet ){
			if( listDataSet[k].type == "radio" ){
				listDataSet[k].selectFlag = false;
				liThisRow.eq(k).children('.rf-obj-component-setting').children('.rf-component-radio').removeClass('rf-state-on');
			}
		}

		listDataSet[idx].selectFlag = true;
		liSym.addClass('rf-state-on');

		if ( typeof listDataSet[idx].scenePartLoad == "function" ){
			listDataSet[idx].scenePartLoad.apply(this, listDataSet[idx].funcArgs);
		}
	});

	// when the Radio exists, the list value is adjusted
	listRow.children(".innerCom").each( function(){
		var riffThis = riff(this),
			riffThisParent = riffThis.parent();

		// Adjust Sub Text width
		riffThis.siblings('.rf-style-txt-desc').css('width','390px');

		// the components position is adjust when there's only one line
		if(! riffThisParent.hasClass('rf-style-row-multi'))
		{
			var pH = window.parseInt(riffThisParent.css("line-height"));
			riffThis.css("margin-top",(pH-(pH/2+20))+"px");
		}

		// setting the left and right margins
		if(riffThis.css('float') == "left")
			riffThis.css('margin-right','10px');
	});

	// list option function call
	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// list structs setting
ComponentList.prototype.setContents = function ( _data, _type )
{
	var riffThis = riff(this);

	if( riffThis.hasClass('setList') )
	{
		// setttingList Component Default Setting

		if( !_data ) {
			return riffThis.buffer("ComponentListComponentDataSet");
		}

		var inHTML = "<ul>",
			dataSet = new Array(),
			data;

		if( typeof _data[1] == "function" ) {
			data = _data[0];
			riffThis.buffer( "ComponentListComponentDataFunc", _data[1] );
		} else {
			data = _data;
		}

		// make markup
		for( var k in data ) {

			var dataSetCur = {},
				i = 0;

			dataSetCur.key = k;

			dataSetCur.type = data[k][i++];

			if( dataSetCur.type == "rf-style-thumnail" || dataSetCur.type == "rf-style-thumnail2" ) {
				dataSetCur.img = data[k][i++];
			}else if( typeof data[k][i] == "boolean" ) {
				dataSetCur.selectFlag =data[k][i++];
			}

			dataSetCur.header = data[k][i++];

			if( typeof data[k][i] == "string" ) {
				dataSetCur.headerList = data[k][i++];
			}
			dataSet.push(dataSetCur);

			inHTML += '<li' + ((dataSetCur.type=="radio" || dataSetCur.type=="check" || dataSetCur.type=="onoff")?' class="'+ dataSetCur.type+'"':'') + '>';

			if( dataSetCur.img ) {
				if(dataSetCur.type=="rf-style-thumnail") {
					inHTML += '<div class="rf-wrapper-thumnail"><img src="' + dataSetCur.img + '"></div>' + '<div class="rf-style-txt-head">' + dataSetCur.header + '</div>';
				}else {
					inHTML += '<div class="rf-style-txt-head">' + dataSetCur.header + '</div>' + '<div class="rf-wrapper-thumnail"><img src="' + dataSetCur.img + '"></div>';
				}
			}else {
				inHTML += '<div class="rf-style-txt-head">' + dataSetCur.header + '</div>';
			}

			if( dataSetCur.headerList ) 	{
				inHTML += '<div class="rf-style-txt-desc">' + dataSetCur.headerList + '</div>';
			}
			inHTML += '</li>';
		}
		inHTML += "</ul>";

		riffThis.buffer("ComponentListComponentDataSet", dataSet );
		riffThis.html(inHTML);
		riffThis.makeStructs();

		for( var k in dataSet ) {
			if( dataSet[k].selectFlag ) {
				riffThis.getSettingValue( dataSet[k].key );
			}
		}
	}
	else if( _type != "setting")
	{
		var _xml			= "";
		var _fnIndex	= 0;
		var _tagOpts	= "";
		var _opts			= "";
		var args			= "";

		riff.popup.back();

		if( arguments.length == 1 && typeof arguments[0] == "object" )
		{
			args			= arguments[0];
			_xml			= args[0];
			_fnIndex	= args[1];
			_tagOpts = args[2];
			_opts		= args[3];
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

		var dataArray = new Array();
		var itemElem = _xml.selector(opts.iterator);
		var inHTML = "<ul>";
		var urlArray = new Array();

		var dataSetFEED = new Array();

		for ( var i=0, l=itemElem.size(); i<l; i++ )
		{
			var dataType = "";
			var dataImgUrl = "";
			var dataTitle = "";
			var dataDescription = "";
			var dataLink = "";
			var moveUrl = "";

			if( tagInfo.image )
			{
				var elem = itemElem.eq(i).find(tagInfo.image);

				if( elem.size() != 0 )
				{
					var strSelect = riff.trim(tagInfo.image);		// ex thumbnail[url]

					if( strSelect.substr(strSelect.length-1, strSelect.length) == ']' )
					{
						var attr = riff.trim( strSelect.substring( strSelect.lastIndexOf("[")+1 , strSelect.lastIndexOf("]") ) ),
							imgSrc = elem.attr(attr);

						if( imgSrc )
						{
							dataType = "rf-style-thumnail";
							dataImgUrl = imgSrc;
						}
					}
					else if ( riff.trim(elem.text()) )
					{
						dataType = "rf-style-thumnail";
						dataImgUrl = riff.trim( elem.text());
					}
				}

				if( opts.description != "none" ) {
					dataDescription = itemElem.eq(i).find(tagInfo.description).text();
				}

				if( opts.link != "none" && riff.trim(itemElem.eq(i).find(tagInfo.link).text()) )
				{
					dataLink = itemElem.eq(i).find(tagInfo.link).text();
					moveUrl = [function ( _url ) { riff.openURL( _url ); }, dataLink];
					urlArray.push([function ( _url ) { riff.openURL( _url ); }, dataLink] );
				}

				var txtHead = itemElem.eq(i).find(tagInfo.title).text();

				inHTML += '<li' + ((dataType =="radio" || dataType=="check" || dataType=="onoff" || dataType=='accordion')?' class="'+ dataType+'"':'') + '>';

				if( imgSrc )
					if(dataType =="rf-style-thumnail")
						inHTML += '<div class="rf-wrapper-thumnail"><img src="' + dataImgUrl + '"></div>' + '<div class="rf-style-txt-head">' + txtHead + '</div>';
					else
						inHTML += '<div class="rf-style-txt-head">' + txtHead + '</div>' + '<div class="rf-wrapper-thumnail"><img src="' + dataImgUrl + '"></div>';
				else if(dataType == "accordion")
					inHTML += txtHead;
				else
					inHTML += '<div class="rf-style-txt-head">' + txtHead + '</div>';

				if( dataDescription )
					inHTML += '<div class="rf-style-txt-desc">' + dataDescription + '</div>';

				if( dataType == "accordion" )
					inHTML += '<div class="accCon"><div class="rf-component-list"></div></div>';

				inHTML += '</li>';

				var dataSetFEEDCur = {};
				dataSetFEEDCur.dataImgUrl = dataImgUrl;
				dataSetFEEDCur.txtHead = txtHead;
				dataSetFEEDCur.dataDescription = dataDescription;
				dataSetFEEDCur.dataLink = dataLink;
				dataSetFEED.push( dataSetFEEDCur );
			}
		}
		inHTML += "</ul>";

		riffThis.html(inHTML);

		riffThis.find("ul > li").each(
			function ( eachIndex ) {
				var riffThis = riff(this);
				riffThis.tap( function () { urlArray[eachIndex][0](urlArray[eachIndex][1] );  } ) ;
		});


		riffThis.buffer("ComponentDataIdleSet", dataSetFEED );

		riffThis.makeStructs();

		riffThis.buffer("ComponentListComponentDataFEEDFlag", true).buffer("ComponentListComponentDataFEEDTime", riff.currentTime() );

		riff(".rf-idle-datareceivetime").text(riff.currentTime());
	}
}

// list func
// params -> _data : object
ComponentList.prototype.scenePartLoad = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");

	if( !dataSet ) {
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );
	}

	if( typeof _data == "object" ) {
		for ( var k in _data) {
			dataSet[k].scenePartLoad = _data[k];
		}
	}
}

// list sub
// params -> _key : number or string
ComponentList.prototype.scenePartSelect = function ( _key )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	// returns elements that are relevant to the key values
	// if the key is not a number or string, it will return the entire li element
	if( typeof _key == "string" )	{
		for ( var k in dataSet) {
			if( dataSet[k].key == _key ) {
				return riffThis.scenePartSelect( window.parseInt(k) );
			}
		}
	}else if ( typeof _key == "number") {
		return riffThis.children('ul').children('li').eq(_key);
	}else {
		return riffThis.children('ul').children('li').eq();
	}
}

// list removeListItem
// params -> _key : string or number
ComponentList.prototype.removeListItem = function ( _key )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	// if the _key type is a string, the remove() function is called
	// if the _key type is a number, the _key'ed list position will be deleted from the dataSet array
	if( typeof _key == "string" ) {
		for ( var k in dataSet) {
			if( dataSet[k].key == _key ) {
				riffThis.remove( window.parseInt(k) );
			}
		}
	}else if ( typeof _key == "number") {
		var dataSetTemp = new Array();

		for( var i = 1, l = dataSet.length - _key; i< l; i++) {
			dataSetTemp.push( dataSet.pop() );
		}
		for( var i = 0, l = dataSetTemp.length; i< l; i++) {
			dataSet.push( dataSetTemp.pop() );
		}

		// deletes the keyed list
		riffThis.scenePartSelect(_key).remove();
	}
}

// the number within the setting list
ComponentList.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}


// when pressing the OK button inside of the settings, the executable arguments based on chosen keys are placed in an array.
ComponentList.prototype.okFunc = function ()
{
	var riffThis = riff(this),
		func = riffThis.buffer("ComponentListComponentDataFunc");

	if( typeof func == "function" ){
		func.call(this, riffThis.getSettingValue() );
	}
}

// the key values from selected items within setting are returned as an array
ComponentList.prototype.getSettingValue = function ( _key, _value )
{
	var riffThis = riff(this),
	dataSet = riffThis.buffer("ComponentListComponentDataSet");

	// when the _key type is a string, it will pass the indexNo as a parameter, and call back the getStringValue function
	// and change the _key to a number
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

		// checks to see what kind of type and divides it
		if( dataSet[_key].type == "check" ){
			liSym = liSelect.children('.rf-obj-component-setting').children('.rf-component-checkbox');
		}else if ( dataSet[_key].type == "onoff" ){
			liSym = liSelect.children('.rf-obj-component-setting').children('.rf-component-onoff');
		}else if ( dataSet[_key].type == "radio" ){
			for( var i = 0; dataSet[i]; i++){
				if( dataSet[i].type == "radio"){
					dataSet[i].selectFlag = false;
				}
			}
			liAll.children('.rf-obj-component-setting').children('.rf-component-radio').removeClass('rf-state-on');
			liSym = liSelect.children('.rf-obj-component-setting').children('.rf-component-radio');
		}

		// where there is an already checked type, will edit or remove the attribute, and change the flag value
		if ( liSym ){
			if(_value == "off"){
				liSym.removeClass('rf-state-on');
				dataSet[ _key ].selectFlag = false;
			}else{
				liSym.addClass('rf-state-on');
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

// riff Tab Component
var ComponentTabMenu = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "tabMenu";
}

// option settings for the tab component
ComponentTabMenu.prototype.option = function ( _data )
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
					riff(this).find('li').not('.on').addClass("rf-resource-color-"+_data[k][1]);
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
					riff(this).find('li.on').addClass("rf-resource-color-"+_data[k][1]);
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
				riff(this).find('.rf-effect-half-glow').show();
			} else if (_data[k] == "false"){
				riff(this).find('.rf-effect-half-glow').hide();
			}
		}

		if(k == "lineOpacity")
		{
			riff(this).find(".rf-obj-border-tab").css("opacity",_data[k]);

		}

		if(k == "lineColorLight")
		{
			riff(this).find('.rf-obj-border-tab').css("border-left-color",_data[k]);
		}


		if(k == "lineColorDark")
		{
			riff(this).find('.rf-obj-border-tab').css("border-right-color",_data[k]);
		}

		if( k =="maxLen" )
		{
			riff(this).parent().find('.list').option( { "maxLen" : _data[k] } );
		}

		if( k == "transitionOption" )
		{
			riff(this).buffer("ComponentTabMenuComponentDataTransitionOption", _data[k] );
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}

}

// tab menu number
ComponentTabMenu.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}

// tab structure settings
ComponentTabMenu.prototype.makeStructs = function ( )
{
	var riffThis		= riff(this);
	var riffThisUl		= riffThis.children('ul');
	var lis				= riffThisUl.children('li');

	lis.prepend("<div class='rf-effect-shadow-inner'></div>"+		// Blank DIV Element for Border
				"<div class='rf-obj-border-tab'></div>"); 			// Blank DIV Element for Border

	riffThis.prepend("<div class='rf-effect-half-glow'></div>");	// Blank DIV Element for Glow

	// when there's no dataset in the buffer (just like feed function does not dynamically create elements, when the component uses a tab creates an indext.html element and uses it)
	if ( !riffThis.buffer("ComponentTabMenuComponentDataSet") )
	{
		riffThis.buffer("ComponentTabMenuComponentDataSet", new Array() );

		riffThis.children('ul').children('li').each ( function () {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentTabMenuComponentDataSet"),
				dataSetCur = {};

			dataSetCur.key = riff.trim( riffThis.text() );

			dataSetCur.enable = true;
			dataSet.push( dataSetCur );
		});
	}

	lis.tap( function() {
		var liThis	= riff(this);
		var tabMenuRiff = riff(this).parent().parent();

		tabMenuRiff.go( liThis.index() );
	});

	if(lis.size() =="1"){
		lis.css("width","100%");
	} else if (lis.size() =="2"){
		lis.css("width","50%");
	} else if (lis.size() =="3"){
		lis.css("width","33.3%");
	} else if (lis.size() >="4"){
		lis.css("width","25%");
	}

	riff('.rf-component-scenepart').parent().css("overflow","hidden");

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}


// tabMenu control markup and tabMenu scenePart list markup create
ComponentTabMenu.prototype.setContents = function ( _data )
{
	var riffThis = riff(this);
	if( !_data )
		return riffThis.buffer("ComponentTabMenuComponentDataSet");

	var dataSet = new Array(),
		inHTML = "<ul>",
		sceneHTML = "";

	// detailed settings for each tab
	for( var k in _data )
	{
		var dataSetCur = {};

		dataSetCur.feedTitle = k;
		dataSetCur.enable = true;

		if( typeof _data[k] == "string" )
		{
			dataSetCur.scenePartInnerList = _data[k];
		}
		else if( typeof _data[k] == "object" )
		{
			// applying div Element to beneath the subScene List class
			dataSetCur.scenePartInnerList = _data[k][0];
			// applying the called function when approaching a relavant tab
			dataSetCur.scenePartLoadFlag = _data[k][1];
			// calling the calling time renewal function when approaching a relevant tab
			dataSetCur.scenePartLoad = _data[k][2];
		}

		dataSet.push( dataSetCur );

		inHTML += "<li>" + dataSetCur.feedTitle + "</li>";
		sceneHTML += "<div class='rf-component-scenepart'>" + dataSetCur.scenePartInnerList + "</div>";
	}

	inHTML += "</ul>";

	riffThis.html(inHTML);			// TabMenu control markup
	riffThis.after(sceneHTML);	// TabMenu scenePart markup

	riffThis.buffer("ComponentTabMenuComponentDataSet", dataSet);
	riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu", null);
	riffThis.makeStructs();
}

// TabMenu move event function
// trigging funcation when a tab is clicked
ComponentTabMenu.prototype.go = function ( _tab, _opts )
{
	if (typeof _tab == "number")
	{
		var riffThis = riff(this),
			dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet"),
			curTabMenu = riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu"),
			scenePart = riffThis.siblings('.rf-component-scenepart'),
			tabMenuList = riffThis.children('ul').children('li');

		riffThis.buffer("ComponentTabMenuFirstLoad", true);

		// when selecting the curent tab
		if(  curTabMenu === _tab )
			return;

		riffThis.buffer("ComponentTabMenuIndex", _tab);

		// no dataSet tab
		if( !dataSet )
			riffThis.buffer("ComponentTabMenuComponentDataSet", dataSet = new Array() );

		// deleting the current tab mark
		tabMenuList.removeClass('on');
		// when moving to another tab, marking the current tab
		tabMenuList.eq(_tab).addClass('on');

		// saving the current tab number into the buffer
		riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu", _tab);


		// calculating the number of milliseconds
		var second = 0;
		if( typeof curTabMenu != "number" || riffGlobal.tabTransitionOrder == "after")
		{
			second = 0;
		}
		else if ( _opts )
		{
			if( _opts.transitionEffect == "none" ) second = 0;
			else second = window.parseFloat( _opts.transitionSecond );
		}
		else if ( riffThis.buffer("ComponentTabMenuComponentDataTransitionOption") )
		{
			if ( riffThis.buffer("ComponentTabMenuComponentDataTransitionOption").transeffect == "none" ) second = 0;
			else second = window.parseFloat( riffThis.buffer("ComponentTabMenuComponentDataTransitionOption").transitionSecond );
		}
		else
		{
			if ( riffGlobal.transeffect == "none" ) second = 0;
			else second = window.parseFloat( riffGlobal.transitionSecond );
		}

		window.setTimeout( function() {
			if ( dataSet[_tab] )
			{
				if ( riff.isWidget() && ( !riff.widget.sysInfo_network_getIsNetworkAvailable() ) )
				{
					riff.alert( "Network unavailable" );
				} else {
					if ( !dataSet[_tab].isScenePartNew && dataSet[_tab].scenePartLoadFlag )
					{
						dataSet[_tab].scenePartLoadFlag.call( riffThis.dom(), _tab );

						// screen renewal policies are applied based off the autoRefresh, refresh settings
						// when moving using the component.move() function, the flag is renewed
						riff.changeScenePartFlag( dataSet.length, _tab, dataSet, true );
					}
				}
				if ( dataSet[_tab].scenePartLoad )
					dataSet[_tab].scenePartLoad.call( riffThis.dom(), _tab );
			}
		}, second*1000 );


		// when the current tab type is not a number, it will show the tabbed subScene
		if( typeof curTabMenu != "number")
		{
			scenePart.hide();
			scenePart.eq(_tab).show();
		}
		else
		{
			// will show an effect based off h _tab = on, curTab = off
			riff.transition(
				scenePart.eq(_tab),
				scenePart.eq(curTabMenu),
				(_opts)?_opts:riffThis.buffer("ComponentTabMenuComponentDataTransitionOption") );
		}
	}
}

// renewal function for the tab subScene screen
ComponentTabMenu.prototype.scenePartLoad = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet");
	if( !dataSet )
		return true;

	if( typeof _data == "object" )
		for ( var k in _data)
			dataSet[k].scenePartLoad = _data[k];
}


// When the tab changes if the flag is set to true, the screen is renewed
ComponentTabMenu.prototype.scenePartLoadFlag = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentTabMenuComponentDataSet", dataSet = new Array() );

	if( typeof _data == "object" )
		for ( var k in _data)
		{
			dataSet[k].scenePartLoadFlag = _data[k];
			dataSet[k].isScenePartNew = false;
		}
}


// the next relevent element after this is set to 0 and retrieved.
ComponentTabMenu.prototype.scenePartSelect = function ( _idx )
{
	var riffThis= riff(this),
		idx = ( typeof _idx == "undefined" )? riffThis.buffer("ComponentTabMenuComponentDataCurPage") : _idx ;
	return riff(this).siblings(".rf-component-scenepart").eq( idx );
}

// tab refresh function
ComponentTabMenu.prototype.refresh = function ( _isCallByAutoRefresh )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet"),
		curTabMenu = riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu");

	if ( dataSet && dataSet[curTabMenu] )
	{
		if ( dataSet[curTabMenu].scenePartLoadFlag )
		{
			dataSet[curTabMenu].scenePartLoadFlag.call( this, curTabMenu );
			if ( _isCallByAutoRefresh )
			{
				// when renewing the screen using Autorefresh() function, the flag is also renewed
				riff.changeScenePartFlag( dataSet.length, curTabMenu, dataSet, false, true, false );
			} else {
				// when renewing the screen using refresh() function, the flag is also renewed
				riff.changeScenePartFlag( dataSet.length, curTabMenu, dataSet, false, false, true );
			}
		}

		if ( dataSet[curTabMenu].scenePartLoad )
			dataSet[curTabMenu].scenePartLoad.call( this, curTabMenu );
	}
}

// tab autorefresh function
ComponentTabMenu.prototype.autoRefresh = function ( _time )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet"),
		curTabMenu = riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu");

	if( dataSet && typeof dataSet.timer == "number" )
	{
		riff.timer( dataSet.timer );
		dataSet.timer = null;
	}

	if( !_time )
		return;

	dataSet.timer = riff.timer( function() {
		if ( ( riffThis.parent().parent().css( "display") == 'block' )
			|| ( riff("#idle").css( "display") == 'block' ) ) {
			riffThis.refresh( true );
		}
	}, _time );
}




// riff Softkey Component
var ComponentSoftKey = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="softkey";
}


// softkey setContents and markStructs
ComponentSoftKey.prototype.setContents = function( _data, _type, _func )
{
	var riffThis = riff(this);
	riffThis.html("");

	if (!_data)
		return;

	if(!_type)
		_type = riffGlobal.softkeyType;

	if(!_func)
		_func = riffGlobal.softkeyFunc;

	if(_type == "type1")
		_type = "rf-type-softkey-1";

	riffThis.removeClass("rf-type-softkey-1").addClass(_type);
	var dataSet = new Array();

	if( _type == "rf-type-softkey-1" )
	{
		var softKeyHTML = '<div class="rf-effect-dropshadow"></div><div class="rf-area-key-normal">'
						+'<div class="rf-area-backbtn"></div><ul class="rf-style-key-normal">';
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

		softKeyHTML += ( dataSet.length > 3 )?'<li>More</li></ul></div><ul class="rf-area-key-more">'+moreHTML : moreHTML;
	    softKeyHTML += "</ul>";

	    riffThis.html(softKeyHTML);
	    riffThis.buffer("riffSoftKeyData", dataSet);

		riffThis.children(".rf-area-key-more").children("li").tap( function()
		{
			var softkeydata = riffThis.buffer("riffSoftKeyData");

			var func = softkeydata[riff(this).index()+2][1];
			func.call(this, riff(this).index()+2 );
			riff.softkey.softKeyMoreHide();
		});

		//Softkey Width Set
		var keyObj =riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-style-key-normal li');
		var keyNum = keyObj.size();

		if(keyNum == 3 ){
			keyObj.css("width","131px");
		} else if (keyNum == 2 ){
			keyObj.css("width","198px");
		} else if (keyNum == 1 ){
			keyObj.css("width","398px");
		}

		var moreList=riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more');
		var moreObj = riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li');
		var moreNum = moreObj.size();

		if (moreNum%2 == 0){
			moreObj.css("width","238px");
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:last-child').addClass('evenLast')
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:nth-last-child(2)').addClass('evenLast2')

		} else {
			moreObj.css("width","238px");
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:last-child').css("width","478px");
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:last-child').addClass('oddLast')
		}

		//Softkey more function
		riff( this ).find(".rf-style-key-normal > li").not( (dataSet.length>3)?2:null ).tap( function() {
			var softkeydata = riff(".rf-component-softkey").buffer("riffSoftKeyData");

			var func = softkeydata[riff(this).index()][1];
			func.call( this, riff(this).index() );
			riff.softkey.softKeyMoreHide();
		});

		if( dataSet.length  > 3 )
			riff( this ).find(".rf-style-key-normal > li").eq(2).tap(function(){
				if( rf-area-key-more.css('bottom') == '70px')
				{
					var morekeyHeight = Math.abs(70-moreList.height());
					moreList.css('bottom','-'+morekeyHeight+'px');
				}
				else
				{
					moreList.css('bottom','70px');
				}
			});

		riff('.rf-component-softkey .rf-area-key-normal .rf-area-backbtn').tap(function(){
			_func.call(this, -1);
		})

		riff('.rf-component-softkey li').touchStart( function() { riff(this).addClass('rf-state-onfocus'); })
					.touchEnd(function() { riff(this).removeClass('rf-state-onfocus'); });
	}
}


// riff header Component
var ComponentHeader = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="header";
}

// option settings for the Title
ComponentHeader.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "radius"){
			if (_data[k] == "normal"){
				riff(this).addClass('rf-effect-border-radius');
			} else if (_data[k] == "big"){
				riff(this).addClass("rf-effect-border-radius big");
			} else if (_data[k] == "small"){
				riff(this).addClass("rf-effect-border-radius small");
			} else if (_data[k] == "false"){
				riff(this).removeClass("rf-effect-border-radius");
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
				riff(this).children(".rf-effect-half-glow").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-half-glow").hide();
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
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "pattern"){
			if (_data[k] == "true"){
				riff(this).children(".rf-effect-pattern").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-pattern").hide();
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
				riff(this).next(".rf-effect-dropshadow-header").show();
			} else if (_data[k] == "false"){
				riff(this).next(".rf-effect-dropshadow-header").hide();
			}
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// Setting for Title structure
ComponentHeader.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.append("<div class='rf-effect-pattern'></div>"		// Blank DIV Element for Pattern
					+"<div class='rf-effect-half-glow'></div>") 		// Blank DIV Element for Gradient
				.after('<div class="rf-effect-dropshadow-header"></div>'); // Shadow Element

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// Header setContents
ComponentHeader.prototype.setContents = function( _string )
{
    riff(this).text(_string).makeStructs();
}


//  Setting Title Component
var ComponentHeaderSetting = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="headerSetting";
}

// setting Title option
ComponentHeaderSetting.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "radius"){
			if (_data[k] == "normal"){
				riff(this).addClass('rf-effect-border-radius');
			} else if (_data[k] == "big"){
				riff(this).addClass("rf-effect-border-radius big")
			} else if (_data[k] == "small"){
				riff(this).addClass("rf-effect-border-radius small")
			} else if (_data[k] == "false"){
				riff(this).removeClass("rf-effect-border-radius")
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
				riff(this).children(".rf-effect-half-glow").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-half-glow").hide();
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
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}

			}

		}

		if(k == "pattern"){
			if (_data[k] == "true"){
				riff(this).children(".rf-effect-pattern").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-pattern").hide();
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

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// structure setting for the title
ComponentHeaderSetting.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.append("<div class='rf-effect-pattern'></div>"		// Blank DIV Element for Pattern
						+"<div class='rf-effect-half-glow'></div>") 		// Blank DIV Element for Gradient
				.after('<div class="rf-effect-dropshadow-setting"></div>'); 	// Shadow Element

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// Settings for the string used in the title
ComponentHeaderSetting.prototype.setContents = function( _string )
{
    riff(this).text(_string).makeStructs();
}

// riff BusyIndicator Component
var ComponentBusyIndicator = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "busyIndicator";
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
					riff(this).parent().parent().addClass("rf-resource-color-"+_data[k][1]);
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
				riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background",_data[k][1])
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")")
				} else {
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}


		if(k == "busyIndicatorStyle"){
			if (_data[k] == "1"){
				riff(this).removeClass().addClass('rf-component-busyindicator rf-resource-busyindicator-1');
			} else if (_data[k] == "2"){
				riff(this).removeClass().addClass('rf-component-busyindicator rf-resource-busyindicator-2');
			} else if (_data[k] == "3"){
				riff(this).removeClass().addClass('rf-component-busyindicator rf-resource-busyindicator-3');
			}
		}

		if(k == "busyIndicatorSpeed"){
			riff(this).css("-webkit-animation-duration",_data[k])
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}
