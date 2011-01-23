//
// Framework TrialVersion 1.0.32
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

/* @Framework_Ver  TrialVersion 1.0.32  */

(
function(window) {

//d var widget = undefined;

// riff Global Object
var riffGlobal = new (function()
{
	//h $().buffer() 에서 사용. 실제 데이터를 저장해두는 전역 배열 공간.
	this.buffer = new Array();
	//h $().buffer() 가 class 에 붙이는 고유 식별값. 1부터 순차적 증가.
	this.bufferID = 0;
	//h ????
	this.prefixBufferClass = "riffBufferClassData";
	//h $().buffer() 가 class 에 붙이는 고유 식별값의 prefix.
	this.prefixBufferID = "riffBufferID-";
	//h timer를 관리하기 쉽게 함든 함수인  $.timer() 함수의 timer list 저장용 list.
	this.timerList = new Array(); // timer list
	//h Animation에 사용할 queue를 사용
	this.queueList = new Array();
	//h 팝업으로 떠 있는 화면의 id 저장.
	this.popup = "";
	//h 화면 이동시에, stack()을 이용해서 저장한다. 이는 go / back 을 구현하기 위해서.
	this.sceneStack = new Array();

	//h transition 효과를 보여줄 때, 뱡향의 기본값 설정. 사용자가 지정하면 그걸 따르고, 만약 없으면 이 값을 기본.
	this.transitionEffect = "slideHor";
	//h transition 효과를 보여줄 때, 효과가 적용되는 시간을 설정. 사용자가 지정하면 그걸 따르고, 만약 없으면 이 값을 기본.
	this.transitionSecond = "0.5s";
	//h transition 효과를 보여줄 때, 가속도 효과의 기본값 설정. 사용자가 지정하면 그걸 따르고, 만약 없으면 이 값을 기본.
	this.transitionMotion = "ease";
	//h transition 효과를 보여줄 때, popup 효과의 기본값 설정. 사용자가 지정하면 그걸 따르고, 만약 없으면 이 값을 기본.
	this.popupTransitionEffect = "popup";
	//h transition 효과를 보여줄 때, popup 효과가 적용되는 시간을 설정. 사용자가 지정하면 그걸 따르고, 만약 없으면 이 값을 기본.
	this.popupTransitionSecond = "0.5s";
	//h transition 효과를 보여줄 때, popup 효과가 적용되는 가속도 효과의 기본값 설정. 사용자가 지정하면 그걸 따르고, 만약 없으면 이 값을 기본.
	this.popupTransitionMotion = "ease";

	//h ???? 사용자가 transition 효과 설정을 특별히 하지 않았을 경우 기본값으로 설정해 준다.
	this.transitionDirection = "on";
	//h softkey Type 기본값 설정
	this.softkeyType = "type1";
	//h ???? softkey 값을 설정. Data이므로, Json 형태로 값을 저장한다. makeContents() 로 설정하는 것과 같은 형식으로 설정할 수 있다. ????
	this.softkeyFunc = null;
	//h ???? softkey 값을 설정. function을 지정하여 키가 눌리었을 때의 실행 함수를 지정한다. ????
	this.softkeyData = null;

	//h ???? softkey 값을 설정. Data이므로, Json 형태로 값을 저장한다. makeContents() 로 설정하는 것과 같은 형식으로 설정할 수 있다. ????
	this.softkeyDataGlobal = null;
	//h ???? softkey 값을 설정. function을 지정하여 키가 눌리었을 때의 실행 함수를 지정한다. ????
	this.softkeyFuncGlobal = null;

	//h ???? softkeySetList 값을 설정. Data이므로, Json 형태로 값을 저장한다. makeContents() 로 설정하는 것과 같은 형식으로 설정할 수 있다. ????
	this.softkeySetListData = null;
	//h ???? softkeySetList 값을 설정. function을 지정하여 키가 눌리었을 때의 실행 함수를 지정한다. ????
	this.softkeySetListFunc = null;
	//h ????
	this.setListSelectData = null;

	// get data periodically
	this.rssAutoRefreshTime = 0;

	//h 언제나 서버의 데이터를 가져와 화면을 구성한다. DOM Element만의 .
	//h 이건 위의 useRssCache 와는 상관없다.
	this.isAlwaysNewSubScene = false;
	//h AutoRefresh를 일으킬때, 다른 Subscene도 화면 갱신을 하게 할 것인가( true : 화면 갱신 하게 한다. ).
	this.isAutoRefreshChangeOtherSubscene = true;
	//h Refresh를 일으킬때, 다른 Subscene도 화면 갱신을 하게 할 것인가( true : 화면 갱신 하게 한다. ).
	this.isRefreshChangeOtherSubscene = false;

	//h WebApplication 을 다시 시작했을 때, pageCache = true이면 이전 화면의 값을 보여준다.
	this.pageCache = false;
	//h ????
	this.name = "NoName";
	//h 테마.
	this.theme = "";
	//h  이 숫자 이상이면 말줄임표로 표시.
	this.ellipsisStringNum = 20;


	//h Idle 상태일때 ( 초기상태 )일때의 width. widget 실행되면 자동으로 적용되므로, config.xml파일 말고 여기도 고쳐야 된다.
	this.widgetIdleWidth = 368;
	//h Idle 상태일때 ( 초기상태 )일때의 height.
	this.widgetIdleHeight = 188;
	//h 지금상태가 touchXXXX 이벤트를 사용하는지, 마우스의 mouseXXXX 이벤트를 사용하는지 판단.
	this.eventType = null;
	//h 탭 페이지 타이밍 설정    ????
	this.tabPageTimming = "before";


	this.$ = window.$;

	// constants
	this.AJAXREADYSTATE = {
		//d 0: The request is uninitialized (before you've called open()).
		//d 1: The request is set up, but not sent (before you've called send()).
		//d 2: The request was sent and is in process (you can usually get content headers from the response at this point).
		//d 3: The request is in process; often some partial data is available from the response, but the server isn't finished with its response.
		//d 4: The response is complete; you can get the server's response and use it.
		"UNINIT"		: 0,
		"NOTSENT"		: 1,
		"SENDING"		: 2,
		"RECEIVING"		: 3,
		"DONE"			: 4
	};
	//h TouchEvent 에 사용되는 addEventListener() 의 이벤트 문자열 등록

	 this.EVENTSTRING = {
         FLICK_LEFT :    "flickLeft"     ,
         FLICK_RIGHT :   "flickRight"    ,
         FLICK_UP :       "flickUp"      ,
         FLICK_DOWN :     "flickDown"    ,
         DRAG :           "drag"   ,
         SWIPE :       "swipe"  ,
         TAP :            "tap"    ,
         LONG_TAP :       "longTap"      ,
         DOUBLE_TAP :     "doubleTap"    ,
         TOUCH_START :    "touchStart"   ,
         TOUCH_MOVE :     "touchMove"    ,
         TOUCH_END :      "touchEnd"
	 };

//h TouchEvent에서 Flick, doubleTap, LongTap 판정 간격( millisec )
	this.TouchTimer = {
        FLICK : 1000,
	    doubleTap : 600,
	    longTap : 1000
    };
})();


//h riff 등록
var riff = function( _s ) {
	return new riff.fn.selector( _s );
};

//h 함수 확장. 주로 $.fn() 은 안 쓰고, $().XXX 의 형태로 사용.
riff.fn = riff.prototype = {

	rss : function( _data )
	{
		//h _data가 없거나, object가 아니거나, array가 아니면 failed
		if ( !_data && typeof( _data ) != 'object'  && !riff.isArray(_data.runs) )
		{
			return false;
		}

		//h data.js의 interface
		var fnLayout								= _data.layout[0];										// layout function
		var fnLayoutParams					= _data.layout[1];										// layout params
		var opts									= _data.opts;												// option (error Code)
		var successFnAfterXML				= _data.successFnAfterXML;						// successCallback Function
		var fnLayoutArray					= new Array();
		var listMode								= false;

		//h list 용하고 tab 용이 다르다.

		fnLayoutArray.push( fnLayoutParams );			// arguments[0] => layout params
		fnLayoutArray.push( _data.runs );					// arguments[1] => runs
		fnLayoutArray.push( opts );					// arguments[2] => ajaxOption
		fnLayoutArray.push( successFnAfterXML );		// arguments[3] => successCallback function

		//h 레이아웃을 먼저 실행
		fnLayout.apply( this, fnLayoutArray );
	},


	//h 인자값으로 selector 문자열 혹은 DOM Element 가 들어오면, 해당 DOM Element를 질의하여 riff 객체로 감싸준다.
	//h 인자값으로 함수가 들어오면, riff.load() 함수를 이용하여 window 객체가 load 된 후에 실행되도록 한다.
	//h 인자값:
	//h		_s : 함수, 문자열, DOM Element
	//h 반환값:
	//h		riff 객체
	selector : function ( _s )
	{
		var cArray;

		// argument : function
		if( !_s )
	    {
			cArray = new Array();
		}
		else if( typeof _s == "function" )
		{
			riff.load( _s );
			return;
		}
		//h argument : DOM object( 단수 )
		else if ( _s == window || _s == document || _s.nodeType )
		{
			cArray = new Array();
			cArray[0] = _s;
		}
		//h argument : DOM object( 복수 )
		else if( typeof _s == "object" )
		{
			cArray = _s;
		}
		// else search dom elements
		else
		{
			cArray = document.querySelectorAll(_s);
		}

		this.componentContext = this.contextToComponent(cArray);
		this.length = this.componentContext.length;

		return this;
	},

	//h 입력된 내용을 판단하여, 프레임워크 관련 객체로 변환한다.
	//h 입력된 node의 className 을 보고, 예약어라면 component 객체로, 예약어가 아니라면 riff 객체로 변환
	//h 인자값 :
	//h		_cArray : DOM Element ( 단수, 복수 )
	//h 반환값 :
	//h		component객체 배열
	contextToComponent : function ( _cArray )
	{
		var rArray = new Array();

		for ( var i = 0; _cArray[i]; i++ )
		{
			var c = _cArray[i];
			var id = _cArray[i].id;
			var classname = " " + _cArray[i].className + " ";

			//h className이 예약어( component ) 인 DOM Element일 경우
			if ( classname )
			{
				if ( classname.indexOf(" title ") != -1 )
					rArray[i] = new componentTitle( c );
				else if ( classname.indexOf(" setTitle ") != -1 )
					rArray[i] = new ComponentSettingTitle( c );
				else if ( classname.indexOf(" setList ") != -1 )
					rArray[i] = new ComponentSettingList( c );
				else if ( classname.indexOf(" list ") != -1 )
					rArray[i] = new ComponentList( c );
				else if ( classname.indexOf(" softkey ") != -1 )
					rArray[i] = new ComponentSoftKey( c );
				else if ( classname.indexOf(" popup ") != -1 )
					rArray[i] = new ComponentPopup( c );
				else if ( classname.indexOf(" scene ") != -1 )
					rArray[i] = new ComponentScene( c );
				else if ( classname.indexOf(" tab ") != -1 )
					rArray[i] = new ComponentTab( c );
				else if ( classname.indexOf(" busyIndicator ") != -1 )
					rArray[i] = new ComponentBusyIndicator( c );
				else if ( classname.indexOf(" feedReceiveTime ") != -1 )
					rArray[i] = new ComponentReceiveRssTime( c );
				else if ( classname.indexOf(" btn ") != -1 )
					rArray[i] = new ComponentButton( c );
			}

			//h className이 예약어(component)가 아닌 DOM Element일 경우
			if( !rArray[i] )
				rArray[i] = new riffBasic( c );
		}

		return rArray;
	},

	//h 질의한 DOM Element 의 갯수.
	//h 반환값 :
	//h		component의 갯수 혹은 DOM element의 갯수.
	size : function ()
	{
		return this.length;
	},

	//h JQuery의 each와 같다. 질의된 DOM Element들( 단수 혹은 복수 ) 에 대해 인자로 받은 함수를 실행한다.
	//h 인자값:
	//h		_func : 실행할 함수명
	//h 반환값:
	//h		riff 객체
	// each
	//		Iterate over a riff object, executing a function for each matched element.
	// parameters :
	//		_func : function to execute.
	// example
	//   .each( function ( index ) { ... } )
	each : function( _func )
	{
		//h 인자값 검사.
		if( !_func || typeof( _func ) != 'function' ) return this;

		for (var k = 0; this.component(k); k++ )
			_func.call( this.dom(k), k );

		return this;
	},

	//h 선택된 요소들 중 주어진 selector에 매치되는 요소들을 찾는다.
	//h 예. 인자 _s 가 "#listID1" 이면, 질의된 DOM Element 중 아이디가 listID1 인 DOM Element 를 추출한다.
	//h 인자 입력 가능한 값은 #id, .class, tagName 이다.
	//h 인자값:
	//h		_s: 문자열( id, className 혹은 tagName ).
	//h 반환값:
	//h		riff 객체.
	// filter
	//   Reduce the set of matched elements to those that match the selector or pass the function's test
	//   ( #id, .class, tagName )
	//
	// parameters
	//   _s : selector string (#id, .class, tagName)
	// return
	//   riff Object
	//
	// example
	//   .filter("#id .class DIV");
	filter : function ( _s )
	{
		//h 인자값 검사.
		if(!_s || typeof _s != "string")
			return this;

		//h 검색 문자열(selector) 를 " " 로 구분지어 배열에 넣는다.
		var selectorItems = (riff.trim(_s.split(".").join(" .").split("#").join(" #"))).split( /\s+/ ),
			l = selectorItems.length,
			cArray = new Array(),
			j;
		for ( var i =0, e; e = this.dom(i); i++ )
		{
			for( j = 0; j < l; j++)
				if( ( selectorItems[j].substr(0,1) == "#"  // if #id
					&& e.id != selectorItems[j].substring(1, selectorItems[j].length) )
				|| (selectorItems[j].substr(0,1) == "." // if class
					&& !riff(e).hasClass( selectorItems[j].substring(1, selectorItems[j].length) ) )
				|| ( selectorItems[j].substr(0,1) != "#" && // if tag name
					selectorItems[j].substr(0,1) != "." &&
					e.nodeName.toString().toUpperCase() != selectorItems[j].toUpperCase() ) )
					break;

			if ( j == l )
				cArray.push( e );
		}

		return riff(cArray);
	},


	//h filter 와 다르게, 인자로 받은 값을 제외하고 나머지를 남긴다.
	//h 인자값:
	//h		_s: 숫자 혹은 문자열( id, className 혹은 tagName ) 혹은 DOM Element( 단수 혹은 복수)
	//h			문자열 : 제외할 DOM Element 를 지정할 질의문( id, className 혹은 tagName 만 가능 )
	//h			숫자 : 질의된 DOM Element 을 배열로 보고, 그 중 제외할 순번 ( index번째의 DOM Element를 제외 )
	//h			DOM Element( 단수 혹은 복수 ) : 제외할 DOM Element.
	//h 반환값:
	//h		( 인자로 지정된 DOM Element 가 제거된 ) riff 객체.
	not : function ( _s )
	{
		//h 인자값 검사.
		if( _s == undefined || _s == null ) {
			return this;
		//h 숫자를 입력받으면, DOM Element의 index로 판단
		} else if ( typeof _s == "number" )
		{
			var cArray = new Array();

			for( var i = 0, e; e = this.dom(i); i++ )
				if( i != _s )
					cArray.push( e );

			return riff( cArray );
		}
		else if ( typeof _s == "object" )
		{
			//h DOM Element를 입력받으면, 제외할 DOM Element로 판단
			var cArray = new Array();

			for(var i = 0, e; e = this.dom(i); i++ )
				if( this.dom(i) != _s )
					cArray.push( e );

			return riff( cArray );
		}
		else if( typeof _s == "string" )
		{
			//h 검색 문자열(selector) 를 " " 로 구분지어 배열에 넣는다.
			var selectorItems = (riff.trim(_s.split(".").join(" .").split("#").join(" #"))).split( /\s+/ ),
				l = selectorItems.length,
				cArray = new Array(),
				j;

			for ( var i =0, e; e = this.dom(i); i++ )
			{
				for( j = 0; j < l; j++)
					if( ( selectorItems[j].substr(0,1) == "#"  // if #id
						&& e.id == selectorItems[j].substring(1, selectorItems[j].length) )
					|| (selectorItems[j].substr(0,1) == "." // if class
						&& riff(e).hasClass( selectorItems[j].substring(1, selectorItems[j].length) ) )
					|| ( selectorItems[j].substr(0,1) != "#" && // if tag name
						selectorItems[j].substr(0,1) != "." &&
						e.nodeName.toString().toUpperCase() == selectorItems[j].toUpperCase() ) )
						break;

				if ( j == l )
					cArray.push( e );
			}

			return riff( cArray );
		}

		return this;
	},

	//h 질의된 DOM Element 를 복사.
	//h 인자 _deep가 true면 child node 복사.
	//h 인자값:
	//h		_deep : boolean. true면 자손( descendant )도 복사.
	//h 반환값:
	//h 	riff 객체.
	//h clone 테스트코드
	clone : function( _deep )
	{
		var cArray = new Array();

		for(var i=0, e; e = this.dom(i); i++)
			cArray.push( this.dom().cloneNode( _deep ) );

		return riff( cArray );
	},

	//h 인자값인 class가 질의된 DOM Element 에 있는지 없는지 판단.
	//h 질의된 DOM Element 가 복수 개일 경우, 복수 개 node 중 하나라도 없으면 false. 모두 다 있을때 true 반환.
	//h 인자값:
	//h		_class : 확인할 문자열
	//h 반환값:
	//h 	riff 객체.
	hasClass : function ( _class )
	{
		//h 인자값 검사.
		if( !_class || typeof(_class) != 'string' ) return true;

		//h 공백 제거
		var classNames = (_class || "").split( /\s+/ );
		for (var i =0; this.dom(i); i++)
			for(var j=0; j<classNames.length; j++)
				if( (" " + this.dom(i).className + " ").indexOf( " " + classNames[j] + " ") == -1)
					return false;

		return true;
	},

	//h 클래스 값에 문자열 추가.
	//h 인자값 문자열을, 질의된 DOM Element의 class 값에 추가한다.
	//h 인자값 문자열이 DOM Element의 class 값에 없을 때에만 추가하고, 있으면 추가하지 않는다.( 같은 거 두번 안쓴다. )
	//h 복수 개에 addClass() 할 경우, 질의된 모든 DOM Element 의 class값에 추가한다.
	//h 인자값:
	//h		_class : 추가할 문자열
	//h 반환값:
	//h 	riff 객체.
	addClass : function ( _class )
	{
		//h 인자값 검사.
		if( !_class || typeof(_class) != 'string' ) return this;

		//h 공백 제거
		var classNames = (_class || "").split( /\s+/ );

		for ( var i = 0; this.component(i); i++ )
		{
			var c = this.dom(i);

		    //h className이 존재하지 않으면,  _class 를 바로 넣고 끝낸다.
			if ( !c.className )
		    	c.className = riff.trim(_class);
		    // if exist
		    else
		    {
		    	var className = " " + c.className + " ", setClass = c.className;
		    	for ( var k = 0, cl = classNames.length; k < cl; k++ )
		    		if ( className.indexOf( " " + classNames[k] + " " ) < 0 )
		    			setClass += " " + classNames[k];

		    	c.className = riff.trim(setClass);
		    }
		}

		return this;
	},

	//h DOM Element 의 class 값에서 인자값 문자열을 삭제한다.
	//h 질의된 DOM Element 가 복수 개일 때, 각각의 DOM Element 에 모두 replace를 적용한다.
	//h 인자값이 null 일 때, 질의된 DOM Element 각각의 모든 class값을 지운다.
	//h 인자값:
	//h		_class : 지울 문자열
	//h 반환값:
	//h 	riff 객체.
	// removeClass
	//   Remove the class(es) from each element in the set of matched elements.
	//   argument : doesn't exist -> remove all classes.
	//
	// parameters
	//   _class : class name
	// return
	//   riff Object
	removeClass : function ( _class )
	{
		if( !_class || typeof(_class) != 'string' ) return this;

		var classNames = (_class || "").split( /\s+/ );

		for ( var i = 0; this.component(i); i++ )
		{
			var c = this.dom(i);

		    if( !c.className || !_class)
				c.className = "";
		    else if( c.className )
		    {
		    	var className = (" " + c.className + " ").replace( /[\n\t]/g, " ");
		    	for ( var k = 0, cl = classNames.length; k < cl; k++ )
		    		className = className.replace(" " + classNames[k] + " ", " ");
		    	c.className = riff.trim( className );
		    }
		}

		return this;
	},

	//h 입력된 인자값이 class 값에 있다면 지우고, 없다면 추가한다.
	//h 복사할 경우, 입력된 인자값이 class 값에 있다면 지우고, 없다면 추가한다.
	//h 복수 개의 DOM Element에 대해 같은 작업을 반복.
	//h 인자값:
	//h		_class : 있으면 지우고, 없으면 추가할 문자열
	//h 반환값:
	//h 	riff 객체.
	// toggleClass
	//   Add or delete one or more classes from each element in the set of matched elements,
	//   has _class : delete _class
	//   doesn't _class : add _class.
	//
	// parameters
	//   _class : class name
	// return
	//   riff Object
	toggleClass : function ( _class )
	{
		if( !_class || typeof(_class) != 'string' ) return this;

		var classNames = (_class || "").split( /\s+/ );
		for ( var i = 0; this.component(i); i++ )
		{
			var c = this.dom(i);

		    if( !c.className)
   				c.className = riff.trim(_class);
		    else
		    {
		    	for ( var k = 0, cl = classNames.length; k < cl; k++ )
		    	{
		    		if( riff(c).hasClass(classNames[k]) )
		    			riff(c).removeClass(classNames[k]);
		    		else
		    			riff(c).addClass(classNames[k]);
		    	}
		    }
		}

		return this;
	},

	//h 데이터 Save / Load 함수.
	//h 전역배열인 riffGlobal.buffer 배열에 값을 저장한다.
	//h 인자값 name이 key값, 인자값 data 가 data 이다.
	//h 전역 배열의 index값으로는, class마다 고유하게 할당된 riffGlobal.prefixBufferID 값을 이용한다.
	//h ( prefix + 숫자( 증가값 ) )
	//h index는 DOM Element 기준으로 부여되므로, 배열에서 하나의 index는 prefix + index의 형태로 각 DOM Element 마다 부여된다.
	//h DOM Element가 복수개이고 _name, _data 값이 설정되면, 선택된 모든 DOM Element에 대해 전역배열에 _name을 키 값으로 _data 가 저장된다.
	//h DOM Element가 복수개이고 _name 값이 설정되면, 선택된 DOM Element 중 맨 첫번째 DOM Element에 대해 _name을 키 값으로 _data 를 반환한다.
	//h 인자값:
	//h		_name : key로 사용할 문자열.
	//h		_data : 저장할 값.
	//h 반환값:
	//h		인자값 _name이 null or undefined 일 때 : return으로 종료( 반환값 없음 ).
	//h		인자가 _name만일 때 : 저장한 ( _data ) 값.
	//h		인자가 _name, _data 일 때 : 저장하지 않은 ( _data ) 값.
	//h		_name 인자에 대한 _data값이 없을 때: "" 반환.
	// buffer
	//   set or get buffer data in object buffer space
	//
	// parameters
	//   _name : key ( string )
	//   _data : value (optional)
	// return
	//   if set : riff Object
	//   if get : value
	buffer : function ( _name, _data )
	{
		//h _name이 없거나 string이 아니면, 함수 종료.
		if( !_name || typeof( _name ) != 'string' ) return;

		if( arguments.length == 2)				//set mode
		{
			return this.each( function()
			{
		    		var classNames = (this.className || "").split( /\s+/ );
					//h 선택된 DOM Element의 class 값이 buffer 저장용 prefix + id를 가지고 있을 때
		    		for ( var i = 0; i<classNames.length; i++)
		    		{
		    			if ( classNames[i].substr(0,riffGlobal.prefixBufferID.length) == riffGlobal.prefixBufferID)
		    			{
		    				var bufferID = window.parseInt( classNames[i].substring(
		    						classNames[i].indexOf( riffGlobal.prefixBufferID ) + riffGlobal.prefixBufferID.length,
		    						classNames[i].length ) );
		    				riffGlobal.buffer[bufferID][_name] = _data;
		    				break;
		    			}
		    		}

				//h 선택된 DOM Element의 class 값이 buffer 저장용 prefix + id를 가지고 있지 않을 때
		    		if( i == classNames.length )
		    		{
					//h buffer 저장용 prefix + id를 새로 생성
					var bufferID = ++riffGlobal.bufferID;
					//h 새로 생성한 prefix + id로 전역 배열에 저장 공간 지정( index : prefix + id ).
		    			riffGlobal.buffer[ bufferID ] = {};
		    			riff(this).addClass( riffGlobal.prefixBufferID + riffGlobal.bufferID );
					//h 값 저장.
		    			riffGlobal.buffer[bufferID][_name] = _data;
		    		}
	    		});
		}
		else if( arguments.length == 1)			//get mode
		{
			//h 질의된 DOM Element 가 복수 개일 때, 맨 첫 번째의 DOM Element에 대해 데이터를 가져오자.
			var c = this.dom();

		   	if( c && c.className )
		   	{
		   		var classNames = (c.className || "").split( /\s+/ );
		   		for ( var i = 0; i<classNames.length; i++)
		   		{
		   			if ( classNames[i].substr(0,riffGlobal.prefixBufferID.length) == riffGlobal.prefixBufferID)
		   			{
		   				var bufferID = window.parseInt(classNames[i].substring(
		   					classNames[i].indexOf( riffGlobal.prefixBufferID ) + riffGlobal.prefixBufferID.length,
		   					classNames[i].length ));

		   				return riffGlobal.buffer[bufferID][_name];
		   			}
		   		}
		   	}
			//h _name에 해당하는 값이 없을때엔, "" 을 반환한다.
		    return "";
		}
	},

	//h 선택된 DOM Element의 형제 DOM Element 중 Node Type이 ELEMENT_NODE인 이전 DOM Element를 선택한다.
	//h 인자값:
	//h		인자값이 없을 때 : prev 로 추출된 형제 DOM Element 전부를 반환한다.
	//h		_s 일 때 : filter로 선택할 값. prev 로 추출된 형제 DOM Element 중 _s에 해당하는 노드를 반환한다.
	//h			인자값인 _s가 문자열( selector )일 때는 ID, class, tag를 지정할 수 있다.
	//h 반환값:
	//h 	riff 객체.
	// prev
	//   Get the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.
	//
	// parameters
	//   _s : selector string ( optional )
	// return
	//   riff Object
	prev : function( _s )
	{
		var cArray = new Array();

		for ( var i = 0, e; e = this.dom(i); i++ )
		{
			cArray[i] = e.previousSibling;

			while(cArray[i] && cArray[i].nodeType != 1)
				cArray[i] = cArray[i].previousSibling;
		}

		return riff( cArray ).filter( _s );
	},

	//h 선택된 DOM Element의 형제 DOM Element 중 Node Type이 ELEMENT_NODE인 다음 DOM Element를 선택한다.
	//h 인자값:
	//h		인자값이 없을 때 : next 로 추출된 형제 DOM Element 전부를 반환한다.
	//h		_s 일 때 : filter로 선택할 값. next 로 추출된 형제 DOM Element 중 _s에 해당하는 노드를 반환한다.
	//h			인자값인 _s가 문자열( selector )일 때는 ID, class, tag를 지정할 수 있다.
	//h 반환값:
	//h 	riff 객체.
	// next
	//   Get the immediately following sibling of each element in the set of matched elements, optionally filtered by a selector.
	//
	// parameters
	//   _s : selector string (optional)
	// retrun
	//   riff Object
	next : function( _s )
	{
		var cArray = new Array();

		for ( var i = 0, e; e = this.dom(i); i++ )
		{
			cArray[i] = e.nextSibling;

			while(cArray[i] && cArray[i].nodeType != 1)
				cArray[i] = cArray[i].nextSibling;
		}

		return riff( cArray ).filter(_s);
	},

	//h 선택된 DOM Element의 부모 DOM Element 중 Node Type이 ELEMENT_NODE인 부모 DOM Element를 선택한다.
	//h 인자값:
	//h		인자값이 없을 때 : parent 로 추출된 부모 DOM Element 전부를 반환한다.
	//h		_s 일 때 : filter로 선택할 값. parent 로 추출된 부모 DOM Element 중 _s에 해당하는 노드를 반환한다.
	//h			인자값인 _s가 문자열( selector )일 때는 ID, class, tag를 지정할 수 있다.
	//h 반환값:
	//h 	riff 객체.
	// parent
	//   Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
	//
	// parameters
	//   _s : selector string (optional)
	// retrun
	//   riff Object
	parent : function( _s )
	{
		var cArray = new Array();

		for (var i = 0, e; e = this.dom(i); i++ )
		{
			// remove duplicated nodes
			var j, l = cArray.length;

			for ( j=0; j < l; j++)
				if( cArray[j] == e.parentNode)
					break;

			if( j == l )
				cArray.push( e.parentNode  );
		}

		return riff( cArray ).filter(_s);
	},

	//h 질의된 DOM Element의 자식 DOM Element 들을 모두 선택한다.
	//h 질의된 DOM Element가 복수 개일 경우, 질의된 모든 DOM Element 각각의 자식 DOM Element 를 반환한다.
	//h 인자값:
	//h		인자값이 없을 때 : 질의된 DOM Element의 자식 DOM Element 들을 모두 선택해 반환한다.
	//h		_s 일 때 : filter로 선택할 값. contents 로 추출된 자식 DOM Element 중 _s에 해당하는 노드를 반환한다.
	//h			인자값인 _s가 문자열( selector )일 때는 ID, class, tag를 지정할 수 있다.
	//h 반환값:
	//h 	riff 객체.
	// contents
	//   Get the children of each element in the set of matched elements, including text and comment nodes.
	//
	// parameters
	//   _s : selector string (optional)
	// retrun
	//   riff Object
	contents : function( _s )
	{
		var cArray = new Array();

		for(var i =0, e; e = this.dom(i); i++ )
		{
			for(var j = 0, l = e.childNodes.length; j < l; j++)
				cArray.push( e.childNodes[j] );
		}

		return riff( cArray ).filter( _s );
	},

	//h 질의된 DOM Element의 childNodes중, Node Type이 ELEMENT_NODE인 것을 선택하여 반환한다. ( NodeType 이 1인 것만 리턴 )
	//h 질의된 DOM Element가 복수 개일 경우, 질의된 모든 DOM Element 각각의 Node Type이 ELEMENT_NODE인 것을 반환한다.
	//h 인자값:
	//h		인자값이 없을 때 : 질의된 DOM Element의 childNodes중, Node Type이 ELEMENT_NODE인 것을 선택하여 반환한다.
	//h		_s 일 때 : filter로 선택할 값. children 로 추출된 DOM Element 중 _s에 해당하는 노드를 반환한다.
	//h			인자값인 _s가 문자열( selector )일 때는 ID, class, tag를 지정할 수 있다.
	//h 반환값:
	//h 	riff 객체.
	// children
	//   Get the children of each element in the set of matched elements, optionally filtered by a selector.
	//
	// parameters
	//   _s : selector string (optional)
	// retrun
	//   riff Object
	children : function( _s )
	{
		var cArray = new Array();

		for(var i = 0, e; e = this.dom(i); i++ )
		{
			var childTemp = e.childNodes;
			for( var j =0; childTemp && childTemp[j]; j++ )
			{
				if ( childTemp[j].nodeType == 1 )
					cArray.push( childTemp[j] );
			}
		}

		return riff( cArray ).filter(_s);
	},

	//h 선택된 DOM Element의 형제 DOM Element 중 Node Type이 ELEMENT_NODE인 것들을 선택한다.
	//h 선택된 DOM Element가 복수 개일 경우, 모든 DOM Element의 siblings() 를 반환한다.
	//h 인자값:
	//h		인자값이 없을 때 : 선택된 DOM Element의 형제 DOM Element 중 Node Type이 ELEMENT_NODE인 것들을 선택하여 반환한다.
	//h		_s 일 때 : filter로 선택할 값. siblings 로 추출된 DOM Element 중 _s에 해당하는 노드를 반환한다.
	//h			인자값인 _s가 문자열( selector )일 때는 ID, class, tag를 지정할 수 있다.
	//h 반환값:
	//h 	riff 객체.
	// siblings
	//   Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
	//
	// parameters
	//   _s : selector string (optional)
	// retrun
	//   riff Object
	siblings : function ( _s )
	{
		var cArray = new Array();

		for ( var i = 0, e; e = this.dom(i); i++ )
		{
			var p = e.previousSibling,
				n = e.nextSibling,
				tArray = new Array();

			// previous
			while( p )
			{
				if ( p.nodeType == 1)
				{
					var j,
						l = tArray.length;

					for( j = 0; j < l; j++)
						if ( tArray[j] == p )
							break;

					if( j == l)
						tArray.push(p);
				}

				p = p.previousSibling;
			}

			// reverse
			tArray.reverse();

			// next
			while( n )
			{
				if ( n.nodeType == 1)
				{
					var j,
						l = tArray.length;

					for( j = 0; j < l; j++)
						if ( tArray[j] == n )
							break;

					if( j == l)
						tArray.push(n);
				}

				n = n.nextSibling;
			}

			for( var j = 0; e = tArray[j]; j++)
			{
				var k,
					l = cArray.length;

				for( k = 0; k < l; k++)
					if ( cArray[k] == e )
						break;

				if( k == l)
					cArray.push(e);
			}

		}

		return riff( cArray ).filter( _s );
	},

	//h 선택된 DOM Element에 대해, index 번째의 DOM Element를 선택하여 반환한다.
	//h _idx가 범위를 벗어난 경우, 빈 riff Object를 반환한다.
	//h 인자값이 입력되지 않으면, 첫번째 DOM Element를 선택하여 반환한다.
	//h 인자값:
	//h		인자값이 없을 경우 : _idx 가 0 인 것과 같은 효과.
	//h		_idx : 0 보다 큰 숫자. 선택할 DOM Element의 순서 (zero-based).
	//h			_idx 가 숫자 이외의 값이 들어오면, _idx 가 0 인 것과 같은 효과.
	//h 반환값:
	//h 	riff 객체.
	// eq
	//   Reduce the set of matched elements to the one at the specified index.
	//
	// parameters
	//   _idx : index (number)
	// return
	//   riff Object
	eq : function( _idx )
	{
		var cArray = new Array();

		var e = this.dom(_idx);
		if ( e )
			cArray.push( e );

		return riff( cArray );
	},

	//h 선택된 DOM Element들에 인자값으로 입력된 내용들에 해당하는 DOM Element를 추가한다.
	//h 인자값:
	//h		_data : selector( 문자열 ) 혹은 riff 객체.
	//h			selector ( 문자열 ) 이라면, 해당 문자열로 질의된 DOM Element 들을 추가한다.
	//h			riff 객체라면, riff객체가 담고 있는 DOM Element 들을 추가한다.
	//h 반환값:
	//h 	riff 객체.
	// add
	add : function( _data )
	{
		if( typeof _data == "object" )
		{
			var cArray = new Array();

			for ( var i = 0, e; e = this.dom(i); i++ )
				cArray.push( e ) ;
			for ( var i = 0, e; e = _data.dom(i); i++ )
			{
				var j, tl = this.size();
				for ( j = 0; j < tl; j++ )
					if ( e == this.dom(j) )
						break;

				if( j == tl )
					cArray.push( e ) ;
			}

			return riff( cArray );
		}
		else if( typeof _data == "string" )
			return this.add( riff(_data) );

		return this;
	},

	//h 선택된 DOM Element의 Attribute을 설정하거나 가져온다.
	//h Attribute 이름( _name ) 만 들어오면 첫번째 DOM Element 객체의 속성만 리턴
	//h Attribute 내용( _data ) 도 같이 들어오면 모든 객체 설정
	//h 선택된 DOM Element가 복수 개이고 인자값이 1개( _name ) 일 때, 선택된 DOM Element 중 첫번째 DOM Element의( eq(0) ) name 에 해당하는 Attribute를 반환한다.
	//h 선택된 DOM Element가 복수 개이고 인자값이 2개( _name, _attr ) 일 때, 선택된 DOM Element 모두에 대해 속성값을 설정한다.
	//h 인자값:
	//h		_name : Attribute 이름( 문자열 ).
	//h		_data : Attribute 설정값( 문자열 ).
	//h 반환값:
	//h 	riff 객체.
	// attr
	//   Get or set the value of an attribute for the first element in the set of matched elements.
	//
	// parameters
	//   _name : attribute name
	//   _attr : attribute value (optional)
	//
	// return
	//   if _attr exists, attribute value for the first element
	//   else riff Object
	attr : function ( _name, _attr )
	{
		if( arguments.length == 1 )
			return (this.dom())?this.dom().getAttribute(_name):"";
		else if ( arguments.length == 2 )
			return this.each( function()
			{
				this.setAttribute( _name, _attr );
			} );
	},

	//h riff 객체가 가진 DOM Element 를 반환한다.
	//h _idx가 범위를 넘을 경우, null을 반환한다.
	//h 인자값:
	//h		_idx : 반환 받을 DOM Element의 순서( 숫자 ).
	//h 반환값:
	//h 	값이 있을 경우 : DOM Element.
	//h 	값이 없을 경우 : null.
	// dom
	//   return dom element
	//
	// parameters
	//  _idx : index
	//
	// return
	//   _idx doesn't exist : the first dom element
	//   else the (_idx)th dom element
	dom : function ( _idx )
	{
		if ( isNaN( window.parseInt( _idx ) ) ) _idx = 0;

		return ((!this.componentContext[_idx]) ? null : this.componentContext[_idx].elementContext);
	},

	//h riff 객체가 가진 component 를 반환한다.
	//h _idx가 범위를 넘을 경우, null을 반환한다.
	//h 인자값:
	//h		_idx : 반환 받을 DOM Element의 순서( 숫자 ).
	//h 반환값:
	//h 	값이 있을 경우 : riff Component.
	//h 	값이 없을 경우 : null.
	// component
	//   return component object
	//
	// parameters
	//  _idx : index
	//
	// return
	//   _idx doesn't exist : the first component object
	//   else the (_idx)th component object
	component : function ( _idx )
	{
		if ( isNaN( window.parseInt( _idx ) ) ) _idx = 0;

		return (!this.componentContext[_idx]) ? null : this.componentContext[_idx];
	},


	//h 해당 형제 객체중에 몇번째 인지 알려준다.
	//h DOM Element가 복수 개일 경우, 선택된 DOM Element 중 첫번째 DOM Element의( eq(0) ) 에 대해 index() 를 적용한다.
	//h 반환값:
	//h 	몇번째( 숫자 )
	// index
	//   Search for first matched element's index from among the sliblings.
	//
	// return
	//   index (number)
	index : function ()
	{
		var c = this.dom();

		var i = 0;
		while( c )
		{
			c = c.previousSibling;
			if(c && c.nodeType==1) i++;
		}

		return i;
	},

	//h 선택된 DOM Element 중 인자 값에 대응하는 DOM Element를 제거한다.
	//h 인자 값이 입력되지 않았을 경우,선택된 DOM Element 전체를 제거한다.
	//h 인자 값으로 index가 입력되었을 경우,
	//h 선택된 DOM Element 중 index 번째의 DOM Element를 제거한다.
	//h 인자 값으로 DOM Element가 입력되었을 경우,
	//h 선택된 DOM Element 중 DOM Element를 제거한다.
	// remove
	//   remove elements
	//
	// parameters
	//   dom objects
	//   index
	//   none : all object remove
	//
	// return
	//   riff Object
	remove : function( _val )
	{
		var removeFunc = function()
		{
			this.parentNode.removeChild(this);
		};

		//number
		if ( typeof _val == "number" )
		{
			this.eq(_val).each( removeFunc );
		}
		//dom element
		else if ( typeof _val =="object")
		{
			for(var i =0, e; this.dom(i); i++)
			{
				if(this.dom(i) == _val)
					this.eq(_val).each( removeFunc );
			}
		}
		else
		{
			this.each( removeFunc );
		}

		return this;
	},

	//h 선택된 DOM Element의 CSS Property을 설정하거나 가져올 수 있다.
	//h 인자 값으로 name만 입력되었을 경우, 선택된 DOM Element 중 첫번째 DOM Element의 name 값에 해당하는 CSS Property를 반환한다.
	//h 인자 값으로 name과 value가 모두 입력되었을 경우, 선택된 DOM Element들의 name 값에 해당하는 CSS Property를 value로 설정한다.
	//h 인자값:
	//h		_name : DOM Element의 CSS Property Name String.
	//h		_value : DOM Element에 설정할 CSS Style String.
	//h 반환값:
	//h 	_name : CSS 속성에 해당하는 문자열 반환
	//h 	_name, _value : riff 객체를 반환.
	// css
	//   Get or set the value of a style property for the element in the set of matched elements.
	//
	// parameters
	//   _name : array or string
	//   _style : style property (optional)
	//
	// return
	//   riff Object
	//   a style property for the first element ( if _style exists )
	//
	// example
	//   .css ( { "width" : "300px",
	//            "height' : "200px" } );
	//   .css ( "width", "300px" );
	//   .css ( "width" );
	css : function ( _name, _value )
	{
		if( arguments.length == 1 )
		{
			if( typeof _name == "object" )
			{
				for( var k in _name)
					this.css(k, _name[k] );

				return this;
			}
			else if( typeof _name == "string" )
			{
				var style = (_name == 'float') ? 'cssFloat' :riff.camelize(_name);
				var value = (this.dom())? this.dom().style[ style ] : null;
				if( !value || value=='auto' )
				{
					var css = document.defaultView.getComputedStyle(this.dom(), null);
					value = css ? css[style] : null;
				}

				return value;
			}
		}
		else if(arguments.length == 2)
		{
			//h 만일 사용자가 css value로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
			if( typeof( _value ) != 'string' ) return this;
			return this.each( function()
			{
				if( this.style )
					this.style[ riff.trim(_name) ] = _value;
			});
		}

		return this;
	},

	//h 선택된 DOM Element의 Top값을 설정하거나 가져올 수 있다.
	//h 인자값이 없는 경우, 선택된 DOM Element의 실제 그려진 스타일(Computed Style)의 Top 값을 반환한다.
	//h 인자값이 value 인 경우, 선택된 DOM Element의 CSS Property 중 Top를 value로 설정한다.
	//h 인자값:
	//h		인자값이 없을 때 : DOM Element에 설정할 CSS top Style String.
	//h		인자값이 _value : DOM Element에 설정할 CSS top Style String.
	//h 반환값:
	//h		인자값이 없을 때 : CSS top 속성에 해당하는 문자열 반환
	//h		인자값이 _value : riff 객체 반환
	// top
	//   Get or set the "TOP" value of the CSS Property for the element in the set of matched elements.
    top : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("top"));
			else
				return null;

		//h 만일 사용자가 css value로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("top", window.parseFloat(_value) + "px" );
		});
	},

	//h 선택된 DOM Element의 Left값을 설정하거나 가져올 수 있다.
	//h 인자값이 없는 경우, 선택된 DOM Element의 실제 그려진 스타일(Computed Style)의 Left 값을 반환한다.
	//h 인자값이 value 인 경우, 선택된 DOM Element의 CSS Property 중 Left를 value로 설정한다.
	//h 인자값:
	//h		인자값이 없을 때 : DOM Element에 설정할 CSS left Style String.
	//h		인자값이 _value : DOM Element에 설정할 CSS left Style String.
	//h 반환값:
	//h		인자값이 없을 때 : CSS left 속성에 해당하는 문자열 반환
	//h		인자값이 _value : riff 객체 반환
	// top
	//   Get or set the "TOP" value of the CSS Property for the element in the set of matched elements.
	left : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("left"));
			else
				return null;

		//h 만일 사용자가 css value로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("left", window.parseFloat(_value) + "px" );
		});
	},

	//h 선택된 DOM Element의 width값을 설정하거나 가져올 수 있다.
	//h 인자값이 없는 경우, 선택된 DOM Element의 실제 그려진 스타일(Computed Style)의 width 값을 반환한다.
	//h 인자값이 value 인 경우, 선택된 DOM Element의 CSS Property 중 width를 value로 설정한다.
	//h 인자값:
	//h		인자값이 없을 때 : DOM Element에 설정할 CSS width Style String.
	//h		인자값이 _value : DOM Element에 설정할 CSS width Style String.
	//h 반환값:
	//h		인자값이 없을 때 : CSS width 속성에 해당하는 문자열 반환
	//h		인자값이 _value : riff 객체 반환
	// width
	//   Get the current computed width for the first element in the set of matched elements.
	//   Set the CSS width of each element in the set of matched elements. ( if _value exists )
	width : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("width"));
			else
				return null;

		//h 만일 사용자가 css value로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("width", window.parseFloat(_value) + "px" );
		});
	},

	//h 선택된 DOM Element의 width값을 설정하거나 가져올 수 있다.
	//h 인자값이 없는 경우, 선택된 DOM Element의 실제 그려진 스타일(Computed Style)의 width 값을 반환한다.
	//h 인자값이 value 인 경우, 선택된 DOM Element의 CSS Property 중 width 를 value로 설정한다.
	//h 인자값:
	//h		인자값이 없을 때 : DOM Element에 설정할 CSS height Style String.
	//h		인자값이 _value : DOM Element에 설정할 CSS height Style String.
	//h 반환값:
	//h		인자값이 없을 때 : CSS height 속성에 해당하는 문자열 반환
	//h		인자값이 _value : riff 객체 반환
	// height
	//   Get the current computed height for the first element in the set of matched elements.
	//   Set the CSS height of each element in the set of matched elements. ( if _value exists )
	height : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("height"));
			else
				return null;

		//h 만일 사용자가 css value로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("height", window.parseFloat(_value) + "px" );
		});
	},

	//h _htmlCode가 없을 때, 선택된 DOM Element 중 첫번째 DOM Element의 innerHTML String를 반환.(string).
	//h _htmlCode가 있을 때, HTML 코드를 삽입 혹은 replace한다.
	//h _htmlCode != NULL 일 때는, 배열의 모든 요소에 대해 _htmlCode 로 replace() 한다.(each() 처럼 )
	//h	그리고 본인 객체를 리턴한다. ( 체인 메소드 위해)
	//h _htmlCode == NULL 일 때는, 배열의 첫 요소에 대해서만 html 코드를 리턴한다.
	//h 인자값:
	//h		인자값이 없을 때 : 선택된 DOM Element 중 첫번째 DOM Element의 innerHTML String를 반환.
	//h		인자값이 _htmlCode : 선택된 모든 DOM Element의 innerHTML을 htmlCode로 변경.
	//h 반환값:
	//h		인자값이 없을 때 : 선택된 DOM Element 중 첫번째 DOM Element의 innerHTML String를 반환.
	//h		인자값이 _htmlCode : riff 객체 반환
	// html
	//   Get or set the HTML contents of the element in the set of matched elements.
	html : function( _htmlCode )
	{
		if ( arguments.length == 0 ) {
			return (this.dom())?this.dom().innerHTML:"";
		} else {
			//h 만일 사용자가 _htmlCode로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
			if( typeof( _htmlCode ) != 'string') return this;

			return this.each( function()
			{
				this.innerHTML = _htmlCode;
			});
		}
	},


	//h 인자(텍스트)가 있으면 아래 내용을 해당을 텍스트로 설정
	//h 아니면 텍스트 노드의 내용만 리턴
	//h 인자값:
	//h		인자값이 없을 때 : 선택된 DOM Element 중 첫번째 DOM Element의 Text Node들의 String를 반환.
	//h		인자값이 _text : 선택된 모든 DOM Element의 자식들을 삭제하고 textString 값을 가지는 Text Node를 자식으로 추가.
	//h 반환값:
	//h		인자값이 없을 때 : 선택된 DOM Element 중 첫번째 DOM Element의 Text Node들의 String를 반환.
	//h		인자값이 _text : riff 객체 반환
	// text
	//   Set the content of each element in the set of matched elements to the specified text.
	//   Get the combined text contents of each element in the set of matched elements, including their descendants.
	text : function ( _text )
	{
		if( _text )
		{
			//h 만일 사용자가 _text로 문자열 혹은 숫자를 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
			if( typeof( _text ) == 'number' ) _text = _text.toString();
			if( typeof( _text ) != 'string' ) return this;

			return this.each( function ()
			{
				riff(this).contents().remove();
				this.appendChild(document.createTextNode(_text));
			});
		}

		var cArray = new Array();
		for(var i=0; this.dom(i); i++)
			cArray.push(this.dom(i));

		return this.getTextByRecursive( cArray );
	},

	//h 텍스트 노드들을 얻기 위한 재귀호출 함수
	//h 자식이 있으면 그 자식을 처리하기 위해 재귀로 사용
	//h 인자값:
	//h		_cArray : 선택된 모든 DOM Element.
	//h 반환값:
	//h		_cArray ( DOM Element ) 가 가진 모든 Text를 취합해 반환.
	// getTextByRecursive
	//   it is recursive function to get a text node
	//   if the node has children, then call recursive function
	getTextByRecursive : function ( _cArray )
	{
		var rText = "";

		for ( var i =0;  _cArray[i]; i++ )
		{
			var c = _cArray[i];

			if ( c.nodeType === 3 || c.nodeType === 4 )
				rText += c.nodeValue;
			else if ( c.nodeType !== 8 )
				rText += this.getTextByRecursive( c.childNodes );
		}

		return rText;
	},

	//h 선택된 DOM Element들의 마지막 자식으로 htmlCode에 해당하는 DOM Element를 삽입한다.
	//h 인자값:
	//h		_content : 마지막에 삽입할 HTML Code.
	//h 반환값:
	//h		riff Object
	// append
	//   Insert content to the end of each element in the set of matched elements.
	append : function ( _content )
	{
		//h 만일 사용자가 _htmlCode로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var riffThis = riff(this),
				riffThisContents = riffThis.contents(),
				riffThisContentsSize = riffThisContents.size();

			if( riffThisContentsSize == 0)
				riffThis.html(_content);
			else
				riffThisContents.eq( riffThisContentsSize-1 ).after(_content);
		});
	},

	//h 선택된 DOM Element들의 첫 자식으로 htmlCode에 해당하는 DOM Element를 삽입한다.
	//h 인자값:
	//h		_content : 처음 자리에 삽입할 HTML Code.
	//h 반환값:
	//h		riff Object
	// prepend
	//   Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
	prepend : function ( _content )
	{
		//h 만일 사용자가 _htmlCode로 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var riffThis = riff(this),
				riffThisContents = riffThis.contents();

			if( riffThisContents.size() == 0)
				riffThis.html(_content);
			else
				riffThisContents.eq().before(_content);
		});
	},

	//h 선택된 DOM Element 각각을 입력받은 htmlCode 로 감싼다. 즉, 선택된 DOM Element 각각이 htmlCode에 해당되는 DOM Element의 자식 노드가 된다.
	//h 인자값:
	//h		_content : 선택된 DOM Element 를 감쌀 html code.
	//h 반환값:
	//h		riff Object
	// wrap
	//   Wrap an HTML structure around each element in the set of matched elements.
	wrap : function ( _content )
	{
		//h 만일 사용자가 _content 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var divNode = document.createElement("div");
			divNode.innerHTML = _content;
			var contentNode = divNode.childNodes[0];

			var cloneNode = this.cloneNode(true);
			riff(this).parent().dom().replaceChild(cloneNode, this);
			contentNode.appendChild(this);

			riff(cloneNode).parent().dom().replaceChild(contentNode, cloneNode);
		});
	},

	//h 입력받은 htmlCode 으로, 선택된 DOM Element 모두를 감싸는 DOM Element 를 생성한다.
	//h	선택된 DOM Element 모두가, htmlCode로 생성된 DOM Element의 자식 노드가 된다.
	//h 인자값:
	//h		_content : 선택된 DOM Element 를 감쌀 html code.
	//h 반환값:
	//h		riff Object
	// wrapAll
	//   Wrap an HTML structure around all elements in the set of matched elements.
	wrapAll : function( _content )
	{
		//h 만일 사용자가 _content 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( typeof( _content ) != 'string') return this;

		riff(this.dom()).wrap(_content);

		for( var i = 1; this.dom(i); i++)
			riff(this.dom()).parent().dom().appendChild(this.dom(i));

		return this;
	},

	//h 선택된 DOM Element 뒤에 HtmlCode를 추가한다.
	//h 즉, 선택된 DOM Element들의 다음에, htmlCode에 해당하는 DOM Element를 삽입한다.
	//h 인자값:
	//h		_content : 선택된 DOM Element의 다음에 삽입 될 DOM Element에 해당하는 HTMLCode.
	//h 반환값:
	//h		riff Object
	// after
	//   Insert content, specified by the parameter, after each element in the set of matched elements.
	after : function ( _content )
	{
		//h 만일 사용자가 _content 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var nextNode = this.nextSibling;
			var divNode = document.createElement("div");
			divNode.innerHTML = _content;

			// if this is last element (next node is null or undefiend) then insert last
			while(divNode.childNodes[0])
				riff(this).parent().dom().insertBefore(divNode.childNodes[0], nextNode);
		});
	},

	//h 선택된 DOM Element 의 이전에 HtmlCode를 추가한다.
	//h 즉, 선택된 DOM Element들의 이전에, htmlCode에 해당하는 DOM Element를 삽입한다.
	//h 인자값:
	//h		_content : 삽입될 DOM Element에 해당하는 HTMLCode.
	//h 반환값:
	//h		riff Object
	// before
	//   Insert content, specified by the parameter, before each element in the set of matched elements.
	before : function ( _content )
	{
		//h 만일 사용자가 _content 문자열을 입력하지 않았으면, 그냥 riff 객체를 반환하고 종료.
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var divNode = document.createElement("div");
			divNode.innerHTML = _content;

			while(divNode.childNodes[0])
				riff(this).parent().dom().insertBefore(divNode.childNodes[0], this);
		});
	},

	//h 선택된 DOM Element의 자손 DOM Element 중 selector에 대응되는 DOM Element를 선택하여 반환한다.
	//h 인자값으로 문자열 이외의 값을 입력하면, 빈 객체를 반환한다.
	//h 인자값:
	//h		_s : 찿으려는 DOM Element를 검색하기 위한 CSS Selector Syntax String.
	//h 반환값:
	//h		riff Object
	// find
	//   Get the descendants of each element in the current set of matched elements, filtered by a selector.
	find : function ( _s )
	{
		var cArray = new Array();
		//h 만일 사용자가 _s 로 문자열을 입력하지 않았으면, 빈 객체를 반환.
		if( typeof( _s ) != 'string') return riff(cArray);

		for(var i=0; this.dom(i); i++)
		{
			var tArray = this.dom(i).querySelectorAll(_s);
			for(var j=0; tArray[j]; j++)
				cArray.push(tArray[j]);
		}

		return riff(cArray);
	},

	//h 선택된 DOM Element에 대하여 CSS 속성을 이용하여 에니메이션을 적용 할 수있다.
	//h CSS Property 의 변화 할 값과 변화할 시간을 정한다.
	//h callback이 인자값으로 입력되면 애니메이션이 끝나고 실행된다.
	//h preCallback가 인자값으로 입력되면 애니메이션이 시작될 때 실행된다.
	//h 애니메이션은 애니메이션Queue를 이용하여 관리된다.
	//h 인자값:
	//h		_prop : animation의 원하는 css속성의 목표치를 설정해주는 부분.
	//h		_time : animation에서 실행되는 시간을 설정해주는 부분. ( 목표치까지의 이동시간 ). “slow”, “normal”, “fast”혹은 ms 단위의 시간.
	//h		_func : 애니메이션이 끝나고 실행되는 함수. (optional)
	//h		_preFunc : 애니메이션 시작 전에 실행되는 함수. (optional)
	//h 반환값:
	//h		Framework Object
	//h 사용예 : $(“#Div1”).animate({“height” : “200px”},300,function() {alert(“animation end”);},
	animate : function(_prop, _time, _func, _preFunc)
    {
        if(!_prop || !_time)
            return this;
        if(typeof _time != "number")
        {
            if(_time == "slow") _time = 1000;
            else if(_time == "nomal") _time = 600;
            else _time = 300;
        }
        if(!this.buffer("riffAnimateInitFlag"))
        {
            var thisObject = this;
            this.buffer("riffAnimateStopFlag",false);
            this.buffer("riffAnimateInitFlag",true);
            var timerCount = 0;
            this.buffer("riffAnimationTimerFirstSetting",true);
            var popupObj;
			//h timer함수에 애니메이션 등록
			riff.timer(function()
			{(
		        function()
		        {
			        if( this.buffer("riffAnimateStopFlag"))
					{
						//h animation 효과 중지.
						riff.timer("riffAnimationTimer");
						this.buffer("riffAnimateStopFlag",false);
						this.buffer("riffAnimateInitFlag",false);
						return;
					}

					//h 새로운 에니메이션의 타이머.  처음 시작시에 최초에 한번 불려진다.
					if(this.buffer("riffAnimationTimerFirstSetting"))
					{
						//h riffAnimateQueue 로 예약된 animation queue 를 가져온다.
					    popupObj = riff.queue("riffAnimateQueue");
						//h animation queue에 "riffAnimateQueue" 가 없으면
					    if(popupObj == null)
					    {
					        riff.timer("riffAnimationTimer");
						    this.buffer("riffAnimateInitFlag",false);
						    return;
					    }
						//h queue안에 "pre" 로 선언된 preFunc 가 있다면 실행.
						if(popupObj["pre"]) popupObj["pre"].call(this);
						//h Animation 구현( = css 속성값 설정.)	????
						var param = new Array();
						var risevalue = new Array();
						for(var p in popupObj["prop"])
						{
							param[p] = window.parseFloat(this.css(p));
							risevalue[p] = (popupObj["prop"][p] - param[p])/(popupObj["time"] / 16.0);
						}
						this.buffer("riffAnimationTimerParamInitValue",param);
						this.buffer("riffAnimationTimerParamRiseValue",risevalue);
						this.buffer("riffAnimationTimerFirstSetting",false);
					}
					for(var p in popupObj["prop"])
					{
						var str = this.css(p);
						if(str.indexOf("px") == -1)
						{
							str = "";
						} else {
							str = "px";
						}

						if(this.buffer("riffAnimationTimerParamInitValue")[p] > popupObj["prop"][p] ? (this.buffer("riffAnimationTimerParamRiseValue")[p] * timerCount + this.buffer("riffAnimationTimerParamInitValue")[p]) <= popupObj["prop"][p] : (this.buffer("riffAnimationTimerParamRiseValue")[p] * timerCount + this.buffer("riffAnimationTimerParamInitValue")[p]) >= popupObj["prop"][p])
						{
							this.css(p, popupObj["prop"][p] + str);
							continue;
						}
						this.css(p, this.buffer("riffAnimationTimerParamRiseValue")[p] * timerCount + this.buffer("riffAnimationTimerParamInitValue")[p] + str);
					}
					timerCount++;
					if( this.buffer("riffAnimationTimerParamInitValue")[p] > popupObj["prop"][p] ? parseFloat( this.css(p)) <= popupObj["prop"][p] : parseFloat( this.css(p)) >= popupObj["prop"][p])
					{
						for(var p in popupObj["prop"])
						{
							var str = this.css(p);
							if(str.indexOf("px") == -1) str = "";
							else str = "px";
							this.css(p, popupObj["prop"][p] + str);
						}
						if(popupObj["func"]) popupObj["func"].call(this);

						this.buffer("riffAnimationTimerFirstSetting",true);
						timerCount = 0;
					}
				}
			).call( thisObject ); }, 16,"riffAnimationTimer");
        }
        for(var p in _prop)
        {
            if(typeof _prop[p] == "number")
                continue;
            var str = _prop[p];
            if(str.indexOf("px"))
            {
                 _prop[p] = str.substring(0,str.indexOf("px"));
            }
        }
        riff.queue({"prop":_prop,"time":_time,"func":_func,"pre":_preFunc},"riffAnimateQueue");
        return this;
        // riff.queue
    },

    //h animation queue를 비우고 현재 실행중인 animation까지 실행시킨다.
	//h 즉, 애니메이션 Queue에 저장되어 있는 에니메이션들을 제거한다.
	//h 이 때 만약 현재 애니메이션이 실행되고 있다면, 해당 애니메이션 까지는 실행이 진행되어 완료되고
	//h 그 다음 애니메이션 부터는 실행이 시작되지 않는다.
	//h 인자값: -
	//h 반환값:
	//h		Framework Object
	clearQueue : function()
    {
        riff.queue("clear","riffAnimateQueue");
        return this;
    },

    //h animation queue 를 비우고, 현재 실행중인 animation을 멈춘다.
	//h 인자값: -
	//h 반환값:
	//h		Framework Object
    stop : function()
    {
        riff.queue("clear","riffAnimateQueue");
        this.buffer("riffAnimateStopFlag",true);
        return this;
    },

	//h 지정한 객체를 화면에 나타낸다.
	//h 인자값이 입력되지 않으면, 선택한 DOM Element를 화면상에 표시하기 위해 display 속성을 block로 변경한다.
	//h 인자값이 입력되는 경우, 선택된 DOM Element를 나타나게 하는 애니메이션을 실행하기 위해
	//h width, height, opacity값을 0에서 기존 값까지 동시에 변화시킨다. 이로 인해 객체의 투명도와 width, height 가 바뀌며 나타난다.
	//h 기존의 display속성이 있을 경우는 메소드 호출 후 display속성이 기존의 값으로 변화되고, 기존에 없었을 경우 “block”로 설정된다.
    //h 인자값:
	//h		인자값이 없을 경우 : 지정한 객체를 화면에 출력( CSS "display" 속성 -> block으로 ).
	//h		_time : 애니메이션의 속도(CSS 속성 상태 변화 목표치까지의 이동시간). “slow”, “normal”, “fast”혹은 ms 단위의 시간.
    //h		_func : 애니메이션이 끝나고 실행되는 함수. (optional)
	//h 반환값:
	//h		Framework Object
	// show
	//   show DOM elements
	show : function(_time, _func)
	{
	    return this.each( function()
	    {
	        var thisObj = riff(this);
		    if(!thisObj.buffer("riffEffectPreState"))
		    {
		        if(thisObj.css("display") == "none")
		        {
		            thisObj.css("display","block");
		            thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":"none",
		            "height":thisObj.css("height"),"width":thisObj.css("width"),"display":"none" });
		            thisObj.css("display","none");
		        }
		        else thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":thisObj.css("display"),"height":thisObj.css("height"),"width":thisObj.css("width"),"display":thisObj.css("display") });
		    }

		    if(!_time)
	        {
		        if(thisObj.buffer("riffEffectPreState")["absdisplay"] == "none")
		            thisObj.css("display","block");
		        else
		            thisObj.css("display",thisObj.buffer("riffEffectPreState")["absdisplay"]);
	            return this;
		    }

	        thisObj.animate({"height":thisObj.buffer("riffEffectPreState")["absheight"],"width":thisObj.buffer("riffEffectPreState")["abswidth"],"opacity":1.0 },
	        _time,function(){
	            thisObj.css("width",thisObj.buffer("riffEffectPreState")["abswidth"]);
	            thisObj.css("height",thisObj.buffer("riffEffectPreState")["absheight"]);
	            if(_func)_func.call(this);
	        },function(){
	            if(thisObj.css("display") == "none") thisObj.css("display","block");
	            else
	            {
	                thisObj.css("display",thisObj.buffer("riffEffectPreState")["absdisplay"]);
	            }
	            thisObj.css("width","0px");
	            thisObj.css("height","0px");
	            thisObj.css("opacity",0);
	        });
		});
	},

	//h 지정한 객체를 화면에서 사라지게 한다.
	//h 인자값이 입력되지 않으면, 선택한 DOM Element를 화면상에서 가리기 위해 display 속성을 none으로 변경한다.
	//h 인자값이 입력되는 경우, 선택된 DOM Element를 가리는 애니메이션을 실행하기 위해
	//h width, height, opacity값을 기존 값에서 0까지 동시에 변화시킨다.
	//h 메소드 호출 후 display속성은 “none”으로 설정된다.
	//h 인자값:
	//h		인자값이 없을 경우 : 지정한 객체를 화면에서 지운다.( CSS "display" 속성 -> none으로 ).
	//h		_time : 애니메이션의 속도(CSS 속성 상태 변화 목표치까지의 이동시간). “slow”, “normal”, “fast”혹은 ms 단위의 시간.
    //h		_func : 애니메이션이 끝나고 실행되는 함수. (optional)
	//h 반환값:
	//h		Framework Object
	// hide
	//   hide DOM elements
	//h 객체의 투명도와 width, height 가 바뀌며 사라진다.
    //h _time : 실행되는 시간
    //h _func : 실행되고나서 실행되는 함수.
	hide : function(_time, _func)
	{
	    return this.each( function()
	    {
	        var thisObj = riff(this);

            if(!thisObj.buffer("riffEffectPreState"))
            {
                if(thisObj.css("display") == "none")
                {
                    thisObj.css("display","block");
                    thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":"none",
                    "height":thisObj.css("height"),"width":thisObj.css("width"),"display":"none" });
                    thisObj.css("display","none");
                }
                else thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":thisObj.css("display"),"height":thisObj.css("height"),"width":thisObj.css("width"),"display":thisObj.css("display") });
            }
            if(!_time)
	        {
			    thisObj.css("display","none");
			    return this;
		    }

            thisObj.animate({"height":0,"width":0,"opacity":0 },
            _time,function(){
                thisObj.css("width",thisObj.buffer("riffEffectPreState")["abswidth"]);
	            thisObj.css("height",thisObj.buffer("riffEffectPreState")["absheight"]);
                thisObj.css("display","none");
                if(_func)_func.call(this);
            },function(){
                if(thisObj.css("display") == "none") thisObj.css("display","block");
                else
                {
                    thisObj.css("display",thisObj.buffer("riffEffectPreState")["absdisplay"]);
                }
            });

        });
	},


	//h toggle() 함수가 실행될때마다, _func1, _func2 callback 함수가 번갈아 실행된다.
	//h 인자값:
	//h		_func1 : 번갈아 실행할 함수 1
    //h		_func2 : 번갈아 실행할 함수 2
	//h 반환값:
	//h		Framework Object
	// toggle
	//   bind toggle functions with elements.
	toggle : function ( _func1, _func2 )
	{
		return this.tap( function ()
		{
			if ( riff(this).buffer("riffToggleData") == "Func2" )
			{
				_func2.call(this);
				riff(this).buffer("riffToggleData", "Func1" );
			}
			else
			{
				_func1.call(this);
				riff(this).buffer("riffToggleData", "Func2" );
			}
		});
	},

	//h 배열.trigger( 이벤트 종류 )  배열 객체에 대해 순차적으로 [이벤트 종류] 를 실행.
	//h "이벤트 종류"는 반드시 기존 존재 이벤트. Framework에서 정의한 artificial event 는 쓰면 안된다.
	//h 인자값:
	//h		_existEventName : 기존에 존재하는 이벤트 이름( ex: onfocus )
	//h 반환값:
	//h		Framework Object
	//  trigger @_eventName to the DOM node elements.
	//  @_eventName : event name to trigger. ( only the artificial event )
    triggerExistEvent : function( _existEventName )
    {
		//d debug.log("triggerExistEvent() START ");
        var i = 0, t = null;
        var domObject = this.dom(i);
        while( domObject )
        {
            //h Handle triggering a single element
            //h don't do events on text and comment nodes
            //h if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) { return undefined; }
            domObject[ _existEventName ] && domObject[ _existEventName ]();  // Text 노드 등 클릭 이벤트가 Null or Undefined 경우를 상정
            domObject = this.dom(++i);
        };
		//d debug.log("triggerExistEvent() END ");
    	return this;
    },


	//h 배열.trigger( 이벤트 종류 )  배열 객체에 대해 순차적으로 [이벤트 종류] 를 실행.
	//h "이벤트 종류"는 반드시  Framework에서 정의한 Artificial Event.
	//h 인자값:
	//h		_customEventName : Framework에서 정의한 Artificial Event 문자열( ex: "tap" )
	//h 반환값:
	//h		Framework Object
	//  trigger @_eventName to the DOM node elements.
	//  @_eventName : event name to trigger. ( only the artificial event )
    triggerCustomEvent : function( _customEventName )
    {
        var i = 0, t = null;
        var domObject = this.dom(i);
        while( domObject )
        {
            //d Handle triggering a single element
            //d don't do events on text and comment nodes
            //d if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) { return undefined; }
            domObject[ _customEventName ] && riffTouch.Send( _customEventName, domObject, "trigger", null );
            domObject = this.dom(++i);
        };
        return this;
    },

	//h 배열.trigger( 이벤트 종류 )  배열 객체에 대해 순차적으로 [이벤트 종류] 를 실행.
	//h 만일 배열 객체 중 [이벤트 종류]에 대해 이벤트 핸들러가 설정되어 있지 않으면, 아무것도 실행되지 않는다.
	//h 인자값:
	//h		_eventName : Event 종류 문자열( ex: "tap" )
	//h 반환값:
	//h		Framework Object
	//  trigger @_eventName to DOM node elements.
	//  @_eventName : event name to trigger.
    trigger : function( _eventName )
    {
        if ( !_eventName ) {
            return this;
        }

        switch( _eventName )
        {
            case riffGlobal.EVENTSTRING.FLICK_LEFT :
            case riffGlobal.EVENTSTRING.FLICK_RIGHT :
            case riffGlobal.EVENTSTRING.FLICK_UP :
            case riffGlobal.EVENTSTRING.FLICK_DOWN :
            case riffGlobal.EVENTSTRING.TAP :
            case riffGlobal.EVENTSTRING.LONG_TAP :
            case riffGlobal.EVENTSTRING.DOUBLE_TAP :
            case riffGlobal.EVENTSTRING.TOUCH_START :
            case riffGlobal.EVENTSTRING.TOUCH_MOVE :
            case riffGlobal.EVENTSTRING.TOUCH_END :
                //h 이벤트 이름이 Custom event 일 경우는, riffTouch.Send() 로 CustomEvent를 실행시켜야 한다.
				// use the artificial event ( ex: TAP ).
                this.triggerCustomEvent( _eventName );
                //h customEvent[ "touchEnd" ] = touch[ _eventName ].call( this );
                return this;
            default :
                //h 이벤트 이름이 Custom Event 가 아닐 경우는, 기존처럼 addEventListener 를 이용하거나, domObject.eventName() 의 형태로 실행하면 된다.
				// use the existed event ( ex: onfocus ).
                this.triggerExistEvent( _eventName );
        }
        return this;
    },

	//h 이벤트 추가 공통 함수. 전역변수설정에 있는 "touch"( widget ) / "mouse"( PC or SDK ) 값으로, 등록해야 할 이벤트를 판단.
	//h 인자값:
	//h		domObject : 이벤트를 추가할 DOM Element
	//h 반환값:
	//h		Framework Object
	// attach the existed events to the domObject.
    //	@domObject : DOM node elements for event handling.
    primaryEventRegist : function( domObject )
    {
		if( riffGlobal.eventType == "touch" )
		{
			domObject.addEventListener( "touchstart", riffTouch.onTouchEvent, false );
	        domObject.addEventListener( "touchmove", riffTouch.onTouchEvent, false );
		    domObject.addEventListener( "touchend", riffTouch.onTouchEvent, false );
		}
		else
		{
			domObject.addEventListener( "mouseup", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mousemove", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mousedown", riffTouch.onTouchEvent, false );
		}

		return this;
	},

	//h 객체의 event가 disable되었을때 사용되는 함수로, event를 enable 시켜주어 이벤트에 등록된 event handler 를 실행할 수 있도록 한다.
	//h 인자값:
	//h		_event : DOM 객체에 대해, 이벤트 가능을 설정할 이벤트 문자열. ( riffGlobal.EVENTSTRING 참고)
	//h 반환값:
	//h		Framework Object
	enableEvent : function( _event )
    {
	//h Swipe 은 두 가지 이상의 이벤트를 조합한 조합 이벤트라, 처리 방법이 다르다.
        if(_event == riffGlobal.EVENTSTRING.SWIPE)
        {
            var eventType = this.buffer("riffSaveEvent");
            eventType[riffGlobal.EVENTSTRING.FLICK_RIGHT] = true;
            eventType[riffGlobal.EVENTSTRING.FLICK_LEFT] = true;
            eventType[riffGlobal.EVENTSTRING.DRAG] = true;
            this.buffer("riffSaveEvent",eventType);
            return this;
        }
        var eventType = this.buffer("riffSaveEvent");
        eventType[_event] = true;
        this.buffer("riffSaveEvent",eventType);
        return this;
    },
    //h event를 disable 시켜주어, 이벤트에 등록된 event handler 를 실행할 수 없도록 한다.
	//h 인자값:
    //h		_event : DOM 객체에 대해, 이벤트 불가능을 설정할 이벤트 문자열. ( riffGlobal.EVENTSTRING 참고)
	//h 반환값:
	//h		Framework Object
    disableEvent : function( _event )
    {
	//h Swipe 은 두 가지 이상의 이벤트를 조합한 조합 이벤트라, 처리 방법이 다르다.
        if(_event == riffGlobal.EVENTSTRING.SWIPE)
        {
            var eventType = this.buffer("riffSaveEvent");
            eventType[riffGlobal.EVENTSTRING.FLICK_RIGHT] = false;
            eventType[riffGlobal.EVENTSTRING.FLICK_LEFT] = false;
            eventType[riffGlobal.EVENTSTRING.DRAG] = false;
            this.buffer("riffSaveEvent",eventType);
            return this;
        }
        var eventType = this.buffer("riffSaveEvent");
        eventType[_event] = false;
        this.buffer("riffSaveEvent",eventType);
        return this;
    },
    //h drag 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    drag : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.DRAG, riffTouch.dragMove);
        this.buffer("riffDragEventFunc",_fnEventHandle);
        return this;
    },

    //h flickLeft 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    flickLeft : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_LEFT, _fnEventHandle);
        return this;
    },

    //h flickRight 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    flickRight : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_RIGHT, _fnEventHandle);
        return this;
    },

    //h flickUp 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    flickUp : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_UP, _fnEventHandle);
        return this;
    },

    //h flickDown 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    flickDown : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_DOWN, _fnEventHandle );
        return this;
    },

    //h tap 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    tap : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TAP, _fnEventHandle);
        return this;
	},

    //h longTap 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
    //h		_touchTime : long tap이 걸리는 기준시간을 설정. 설정안할경우에 default 값이 들어간다. (optional).
	//h 반환값:
	//h		Framework Object
	longTap : function( _fnEventHandle, _touchTime )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.LONG_TAP, _fnEventHandle);
        if(!_touchTime) this.buffer("riffLongTapTime",riffGlobal.TouchTimer.longTap);
        else this.buffer("riffLongTapTime",_touchTime);
        return this;
    },

    //h doubleTap 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    doubleTap : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.DOUBLE_TAP, _fnEventHandle);
        return this;
    },

    //h touchStart 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    touchStart : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TOUCH_START, _fnEventHandle);
        return this;
    },

    //h touchMove 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    touchMove : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TOUCH_MOVE, _fnEventHandle);
        return this;
    },

    //h touchEnd 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
	//h 인자값:
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    touchEnd : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TOUCH_END, _fnEventHandle);
        return this;
    },

    //h swipe 이벤트 등록 함수. 해당 이벤트에 대해 event hander 함수를 실행한다.
    //h swipe event 는 darg, flickRight, flickLeft가 합쳐진 event 이다.
    //h DOM Elenent에 대해 drag event -> flick event 가 발생한다.
    //h 이 때 이벤트가 적용중인 DOM Element는, 자연스럽게 움직이며( CSS의 left값 변환) 이동하다 멈춘다.
    //h 그러므로 움직이는 DOM Element를 감싸주는 box 역할을 하는 DOM Element가 필요하다.
    //h DOM Element에 swipe 이벤트를 적용한 후 swipe 이벤트가 발생하면, 인자값인 _fnEventHandle 가 작동한다.
    //h _fnEventHandle 에는, swipe의 상태( drag/ 감속이동 / 정지 )를 알 수 있는 인자값을 전달한다.
    //h _fnEventHandle 함수에 전달되는 인자값은 다음과 같다.
    //h 	_fnEventHandler( state, ptx, pty )
    //h 		state : swipe event가 적용되어 움직이는 DOM Element의 현재 상황을 나타나는 값.
    //h 			문자열이며, 다음의 중 한 가지를 반환한다.
    //h 				"dragMove" : swipe event 중 drag 가 발생중일 때 전달하는 값.
    //h 				"leftMove" : swipe event가 발생 해서 왼쪽으로 움직이기 시작할 때 최초로 한번 전달하는 값.
    //h 				"rightMove" : swipe event가 발생 해서 오른쪽으로 움직일 때 최초로 한번 전달하는 값.
    //h 				"move" : swipe event가 발생하고 움직일 때 전달하는 값.
    //h 				"leftEnd" : swipe event가 발생하여 왼쪽 끝으로 이동 하였을 때에 전달하는 값.
    //h 				"rightEnd" : swipe event가 발생하여 오른쪽 끝으로 이동 하였을 때에 전달하는 값.
    //h 				"end" : swipe event가 끝났을 때에 전달하는 값.
    //h 			고로, 예를 들어 swipe이 왼쪽에서 오른쪽으로 발생할 경우, state는 다음과 같은 순서로 값을 전달한다.
    //h 			"dragMove" -> "dragMove" -> ... "dragMove" -> "rightMove" -> "move" -> "move" ... "move" -> "rightEnd" -> "end"
    //h 		ptx : swipe event 중 객체의 left속성 위치를 나타낸다.
    //h 		pty : swipe event 중 객체의 top속성 위치를 나타낸다.
	//h 인자값:
    //h		_isFlickEnd : boolean. swipe시에 swipe객체를 감싸고 있는 box객체를 넘을지 안넘을지 선언해주는 부분.
    //h                          true일경우 box객체를 넘을수없다.
    //h		_verlocityPercent : number. swipe 이벤트 중 DOM Element가 자동으로 움직일때, 움직이는 속도를 퍼센트 단위로 설정해주는 부분.
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
	swipe : function( _isFlickEnd ,_verlocityPercent,_fnEventHandle )
	{
		this.addEventByType( riffGlobal.EVENTSTRING.DRAG , riffTouch.dragForSwipe);
		this.addEventByType( riffGlobal.EVENTSTRING.FLICK_RIGHT, riffTouch.flickForSwipe);
		this.addEventByType( riffGlobal.EVENTSTRING.FLICK_LEFT,  riffTouch.flickForSwipe);

		this.buffer("riffSwipeFunc",_fnEventHandle);
		this.buffer("riffSwipeVerlocityPercent",_verlocityPercent);
		this.buffer("riffSwipeIsSwipeEnd",_isFlickEnd);
		return this;
	},

	//h 인자값으로 들어온 함수를 DOM Element에 적용한다.
	//h 인자값:
    //h		_eventType : 문자열. 합성이벤트의 이름.
    //h		_fnEventHandle : 실행할 이벤트 핸들러 함수
	//h 반환값:
	//h		Framework Object
    addEventByType : function( _eventType, _fnEventHandle)
    {
		var i = 0;
        var domObject = this.dom(i);
        while( domObject )
        {
            this.primaryEventRegist( domObject );
            riffTouch.AddEvent( riffTouch, _eventType, domObject, _fnEventHandle );
            domObject = this.dom(++i);
        }
        this.addClass("handsPointer");
		return this;
    },

	//h component의 makeStructs() 함수 실행
	// set
	//	component function
	//	set component
	makeStructs : function( )
	{
		return this.each( function()
		{
			var c = riff(this);
			if(c.component().makeStructs)
				c.component().makeStructs.call(this);
		});
	},

	//h component의 makeContents() 함수 실행
	// makeContents
	//	component function
	//	set component's makeContents
	makeContents : function( _value )
	{
		if( arguments.length == 0 )
		{
			if(this.component().makeContents)
				return this.component().makeContents.apply(this.dom());

			return null;
		}

		var args = arguments;
		return this.each( function()
		{
			var c = riff(this);
			if(c.component().makeContents)
				c.component().makeContents.apply(this, args);
		});
	},

	//h component의 count() 함수 실행
	count : function ()
	{
		if(this.component().count)
			return this.component().count.apply(this.dom());

		return null;
	},

	//h component의 move() 함수 실행
	// move
	//	component function
	move : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().move)
				c.component().move.apply(this, args);
		});
	},


	//h component의 subSceneLoad() 함수 실행
	// func
	//	component function
	subSceneLoad : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().subSceneLoad)
				c.component().subSceneLoad.apply(this, args);
		});
	},

	//h component의 subSceneLoadFlag() 함수 실행
	// subSceneLoadFlag
	//	component function
	subSceneLoadFlag : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().subSceneLoadFlag)
				c.component().subSceneLoadFlag.apply(this, args);
		});
	},

	//h component의 subSceneSelect() 함수 실행
	// subSceneSelect
	//	component function
	subSceneSelect : function()
	{
		var rriff = riff();

		for ( var i = 0, l = this.size(); i < l; i++ )
			if( this.component(i).subSceneSelect )
				rriff = rriff.add ( this.component(i).subSceneSelect.apply(this.dom(i), arguments) );

		return rriff;
	},

	//h component의 refresh() 함수 실행
	// refresh
	//	component function
	refresh : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().refresh)
				c.component().refresh.apply(this, args);
		});
	},

	//h component의 autoRefresh() 함수 실행
	// autoRefresh
	//	component function
	autoRefresh : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().autoRefresh)
				c.component().autoRefresh.apply(this, args);
		});
	},

	//h component의 addSubScene() 함수 실행
	// addSubScene
	//	component function
	addSubScene : function( _url )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().addSubScene)
				c.component().addSubScene.apply(this, args);
		});
	},

	//h component의 option() 함수 실행
	// option
	//	component function
	//	set each component's option
	option : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().option)
				c.component().option.apply(this, args);
		});
	},

	//h component의 removeListItem() 함수 실행
	// removeListItem
	//	component function
	removeListItem : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().removeListItem)
				c.component().removeListItem.apply(this, args);
		});
	},

	//h component의 okFunc() 함수 실행
	// okFunc
	//	component function
	okFunc : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().okFunc)
				c.component().okFunc.apply(this, args);
		});
	},

	//h component의 getSettingValue() 함수 실행
	//h 해당 컴포넌트 데이터
	//h 첫번째 것만 반환
	// getSettingValue
	//	component function
	//	set component selected data or return component selected data
	getSettingValue : function( _value )
	{
		if( arguments.length == 0 )
		{
			if(this.component().getSettingValue)
				return this.component().getSettingValue.apply(this.dom());

			return null;
		}

		var args = arguments;
		return this.each( function()
		{
			var c = riff(this);
			if(c.component().getSettingValue)
				c.component().getSettingValue.apply(this, args);
		});
	},

	componentContext : null,
	length : 0
};

//h 입력된 문자열에 대해, 문자열 맨 앞과 맨 뒤에 공백이 있다면 제거한 후에 반환한다.
//h 인자값:
//h		_s : 공백을 제거할 문자열.
//h 반환값:
//h		trim() 이 적용된 문자열
// Remove the whitespace from the beginning and end of a string.
riff.trim = function ( _s )
{
	if( typeof _s == "string" ) {
		return _s.replace(/^\s+|\s+$/g, "");
	}
};

//h 문자열을 camelize 해주는 함수( ex: "abc-eee" -> "abcEee" )
//h 인자값:
//h		_s : camel 표기법을 적용할 문자열
//h 반환값:
//h		camel 표기법이 적용된 문자열
riff.camelize = function ( _s )
{
	if( typeof _s == "string" ) {
		return _s.replace(/-+(.)?/g, function(match, chr) {
			return chr ? chr.toUpperCase() : '';
		});
	}
};

//h 새 링크로 이동하는 함수. phone의 경우 widget함수를 이용하고 PC의 경우 해당 링크로 이동한다.
//h 인자값:
//h		_url : 이동할 링크주소
//h 반환값:
//h		true : 함수 실행이 성공했을 때
//h		false : 함수 실행이 실패했을 때
riff.openURL = function ( _url )
{
	if( typeof _url == "string" ) {
		if( riff.isWidget() ) {
			widget.openURL(_url);
		}else {
			window.location.href = _url;
		}
		return true;
	}
	return false;
};

//h 문자열을 CSS의 ID 검색 형식으로 바꾸는 함수. = 문자열 앞에 "#" 가 없으면 붙이고, 있으면 그대로 반환.
//h 인자값:
//h		_str : ID 검색 형식으로 변환할 문자열( "#" + id 의 형태 )
//h 반환값:
//h		함수 실행 성공 : 변환한 문자열
//h		함수 실행 실패 : 공백 문자열
riff.toID = function ( _str )
{
	if( typeof _str == "string" ) {
		var strTrim = riff.trim(_str);
		return (strTrim.substr(0,1) == "#" ) ? strTrim : "#" + strTrim;
	}
	return "";
};


//h 현재 작동이 PC에서 혹은 에뮬인지, 아님 widget에서 하고 있는지 판단.
//h 인자값: -
//h 반환값:
//h		boolean : SDK 에서 실행중이면 true, 그 이외에는 false 반환
riff.isEmulator = function ( )
{
	//h widget 객체가 없으면 PC에서 실행 - false
	if ( typeof widget == "undefined" ) {
		return false;
	}

	try {
		//h SDK에는 widget.addEventListener 함수가 없다.
		if ( widget.addEventListener ) {
			return false;
		} else {
			return true;
		}
	} catch( e ) {
		return true;
	}
};

//h Animation 효과에서, 각각의 Animation을 저장하거나 가져오기 위한 함수.
//h 사용법.
//h		$.queue( "clear" ) : queue 의 모든 내용 삭제.
//h		$.queue( "XXXXX" ) : queue 에 저장한 animation 효과 배열에 대한 key값.
//h		$.queue( _data, _id ) : queue 에 저장한 animation 효과 배열을 저장.
//h			Animation용 전역 배열( riffGlobal.queueList )에서 _id값을 키 값으로 animation queue를 가져온다.
//h			가져온 animation queue에 _data 를 추가한다.
//h 인자값:
//h		인자가 1개일 때 :
//h			_data : 문자열. 불러올 animation 효과 배열에 대한 key값.
//h		인자가 2개일 때 :
//h			_data : 저장할 animation 효과.
//h			_id : 문자열. 저장할 animation 효과 배열에 대한 key값.
//h 반환값:
//h		인자가 1개일 때 :
//h			입력한 인자값이 문자열 "clear" 일 때 : null
//h			입력한 인자값을 key 로 하는 animation 효과 data가 존재하지 않을 때 : null
//h			입력한 인자값을 key 로 하는 animation 효과 data가 존재할 때 : animation 효과 data.
//h		인자가 2개일 때 : null
riff.queue = function( _data, _id )
{
    if( _data == "clear")
    {
        riffGlobal.queueList[_id] = null;
        return null;
    }
    if(arguments.length == 1)
    {
		//h 입력된 키 값(_data) 으로 저장된 Animation 효과가 없으면 ????
		if(typeof arguments[0] != "string" || !riffGlobal.queueList[_data])
			return null;

		//h 입력된 키 값(_data) 으로 저장된 Animation 효과가 있으면 ????
		if(riffGlobal.queueList[_data].length != 0)
		{
			//h 해당 key 값으로 animation stack을 꺼내서,
			//h 맨 아래 걸 꺼낸 다음 반환.
			var queue = riffGlobal.queueList[_data];
			queue.reverse();
			var reValue = queue.pop();
			queue.reverse();
			riffGlobal.queueList[_data] = queue;
			return reValue;
		}
		else
			return null;
    }
    if(!riffGlobal.queueList[_id])
    {
		//h "_id" queue에 "_data" 를 추가.
        var queue = new Array();
        queue.push(_data);
        riffGlobal.queueList[_id] = queue;
    }
    else
    {
		//h "_id" queue가 없으면, "_id" queue를 생성한 후 "_data" 를 추가.
		var queue = riffGlobal.queueList[_id];
        queue.push(_data);
        riffGlobal.queueList[_id] = queue;
    }

	return null;
};

//h 현재 widget 실행이 PC에서 하고 있는지, 아님 단말( 전화기 ) 에서 하고 있는지 판단
//h 인자값: -
//h 반환값:
//h		boolean : 전화기에서 실행중이면 true, 그 이외에는 false 반환
//detects the widget-working-status( on PC or on phone ).
//the phone is not comfortable to check the touch function, match the "mouseevent" with "touchevent" for simple test on desktop.
riff.isWidget = function ( )
{
	// the widget object exist == phone.  not exist == Desktop
	//h 위젯 객체가 있으면 핸드폰, 없으면 PC다.
	if( riff.isEmulator() ) return false;
	return ( typeof widget == "undefined" ) ? false : true;
};

//h navigation 기능.
//h 페이지로 이동.
//h #id 혹은 id 로 접근.
//h 글로벌 변수엔 # 붙인것까지 저장.
//h 인자값:
//h		_page : 이동할 DOM Element의 ID. riff Components로 구성.
//h		_option : "transitionEffect", "transitionMotion", "transitionSecond", "transitionFunc" 설정 가능.
//h 반환값:
//h		팝업 또는 페이지 이동 시 함수를 호출한 결과값.
riff.move = function( _page, _option  )
{
	if( typeof _page == "string" ) {
		var page = riff.toID(_page),
			pageriff = riff( page );

		//h 팝업일 경우와 그외 경우로 나뉜다.
		if( pageriff.size() !=0 && pageriff.component().type == "popup" ) {
			return riff.popup.apply(this, arguments);
		}else {
			return riff.scene.apply(this, arguments);
		}
	}

	return false;
};

//h navigation 기능.
//h 이전 화면으로 복귀.
//h 인자값:
//h		_option : "transitionEffect", "transitionMotion", "transitionSecond", "transitionFunc" 설정 가능.
//h 반환값:
//h		팝업 또는 페이지 이동 시 함수를 호출한 결과값.
riff.back = function( _option )
{
	if( typeof _option == "object" || typeof _option =="undefined" ) {
		return riff.scene.apply( null, _option );
	}

	return false;
};

//h navigation 기능.
//h 페이지로 이동.
//h #id 혹은 id 로 접근
//h 인자값:
//h		_scene : 이동할 DOM Element의 ID. riff Components로 구성된 것들.
//h		_option : "transitionEffect", "transitionMotion", "transitionSecond", "transitionFunc" 설정 가능.
//h 반환값:
//h		팝업 또는 페이지 이동 시 함수를 호출한 결과값.
riff.scene = function( _scene, _option)
{
	if( typeof _scene == "object" || typeof _scene =="undefined" ) {
		return riff.scene.back.apply(this, arguments);
	}else {
		return riff.scene.move.apply(this, arguments);
	}
};

//h navigation 기능.
//h 페이지로 이동.
//h #id 혹은 id 로 접근
//h 인자값:
//h		_scene : 이동할 DOM Element의 ID. riff Components로 구성.
//h		_option :
//h			{ "transitionEffect" : "slideVer" / "slideHor" / "popup" / "fade" / "spin" / "none"
//h			  "transitionMotion" : "ease" / "ease-in" / "ease-out" / "ease-in-out"
//h			  "transitionSecond" : 1234 ( millisec )
//h			  "transitionDirection" : "on" / "off"
//h			  "transitionFunc" : function() { ...alert(); ...};
//h			} 설정 가능
//h 반환값:
//h		팝업 또는 페이지 이동 시 함수를 호출한 결과값.
riff.scene.move = function ( _scene, _option )
{
	if( typeof _scene == "string" ) {

		//h 인자 값 체크
		var scene = riff.toID(_scene);

		//h Idle로 이동(첫화면으로 복귀)할 경우
		if( scene == "#idle" ){
			//h Phone일 경우, 화면 크기 바꾸어 줘야 되니까.
			if( riff.isWidget() || riff.isEmulator() )
			{
				riff.resize(riffGlobal.widgetIdleWidth, riffGlobal.widgetIdleHeight);
			}

			//h 화면 클릭 못하게 덮었던 거 걷어내기
			riff(".widgetWrap").hide();
			riff(scene).show();

			//h IDLE 화면이니, Back 기능은 사용할 필요 없으므로, 화면 stack 삭제.
			riffGlobal.sceneStack = new Array();
			riffGlobal.sceneStack.push( [ scene, null ] );
			return true;
		}

		//h pageCache 기능을 설정했다면, 재실행때도 같은 화면을 보여주기 위해 현재 화면의 ID를 저장한다.
		if( riffGlobal.pageCache == true ) {
			riff.storage("riffPageCacheData", scene);
		}

		//h 에뮬이나 위젯일 경우 크기 변경
		if( riff.isWidget() || riff.isEmulator() ) {
			riff.resize();
		}

		//h 똑같은 씬 일때
		var curScene = riffGlobal.sceneStack.pop();
		if(curScene[0] == scene) {
			riffGlobal.sceneStack.push(curScene);
			return true;
		}

		//h 이동한 scene이 tab 및 list일 경우
		var isTab = riff( scene ).children(".sceneWrap").children(".tab");
		if ( isTab.size() ) {
			isTab.move( 0 );
		}

		//h 각 소프트 키 값 변경
		//h setList 있을때 소프트 키 변경
		var riffScene = riff(scene),
			riffSceneSetList = riffScene.find('.setList');

		if( riffSceneSetList.size() > 0 )	{
			riffGlobal.setListSelectData = riffSceneSetList.getSettingValue();
			riff.softkey( riffGlobal.softkeySetListData );
			riff.softkey( riffGlobal.softkeySetListFunc );
			riff(".setTitle").show();
			riff(".title").hide();
		}else if ( riff(scene).buffer("ComponentSceneComponentDataSoftkey") ) {
			riff.softkey( riff(scene).buffer("ComponentSceneComponentDataSoftkey") );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
		}else{
			riff.softkey( riffGlobal.softkeyDataGlobal );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
			riff(".title").show();
			riff(".setTitle").hide();
		}

		//h RSSTime 있을때 소프트 키 변경
		// feedReceiveTime
		//h 아래의 .tab, .list 는 RSS Component를 사용하는 Component들이다.
		var strTime = "",
			riffSceneTab = riffScene.find('.tab'),
			riffSceneTabList = riffSceneTab.subSceneSelect().find(".list"),
			riffSceneList = riffScene.find(".list");

		if( riffSceneTabList.buffer("ComponentListComponentDataRSSFlag") ) {
			//h RSS를 사용하는 TAB Component가 존재한다면
			//h TAB Component 의 RSS 값을 가져온다.
			riff.feedReceiveTime( riffSceneTabList.buffer("ComponentListComponentDataRSSTime") );
		} else if ( ( riffSceneTab.size() == 0 ) &&  riffSceneList.buffer("ComponentListComponentDataRSSFlag") ) {
			//h RSS를 사용하는 List Component가 존재한다면
			//h List Component 의 RSS 값을 가져온다.
			riff.feedReceiveTime( riffSceneList.buffer("ComponentListComponentDataRSSTime") );
		} else {
			//h RSS를 사용하는 Component가 존재하지 않는다면
			//h feedReceiveTime 을 숨긴다 .
			riff.feedReceiveTime();
		}

		//h 화면 클릭 못하게 덮자.
		riff(".widgetWrap").show();
		//h softkey의 more 가 화면에 있다면, 내리자.
		riff.softkey.softKeyMoreHide();
		//h 새 Scene을 화면 크기에 맞춘다.
		riff.adjustSceneSize();

		//h 이동 전 화면이, 아무것도 안떠있는 화면이었다면( EX: 처음부터 전체화면 실행), 입력받은 ID 에 해당하는 Scene를 화면에 보여준다.
		if( !curScene ) {
			riff(scene).show();
			riffGlobal.sceneStack.push( [scene, null] );
			return true;
		}else if( curScene[0] == "#idle" ) {
			//h 이동 전에 떠 있던 화면이 idle이면
			//h 이전 화면 숨기고, 새 화면 보이고, sceneStack 에 이전 화면을 넣는다.( back() 을 처리하기 위해 ).
			riff(curScene[0]).hide();
			riff(scene).show();
			riffGlobal.sceneStack.push(curScene);
			riffGlobal.sceneStack.push( [scene, null] );
			return true;
		}

		// option setting
		var option = new Array();
		for(var k in _option)
			option[k] = _option[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.transitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.transitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.transitionMotion;
		option.transitionDirection = "on";

		riff.transition( riff(scene), riff(curScene[0]), option );

		option.transitionDirection = null;
		option.transitionFunc = null;
		riffGlobal.sceneStack.push( curScene);
		riffGlobal.sceneStack.push( [scene, option] );

		return true;
	}

	return false;
}

//h 현재 화면 이전의 화면으로 복귀.
//h _option :
//h		{ "transitionEffect" : "slideVer" / "slideHor" / "popup" / "fade" / "spin" / "none"
//h		  "transitionMotion" : "ease" / "ease-in" / "ease-out" / "ease-in-out"
//h		  "transitionSecond" : 1234 ( millisec )
//h		  "transitionDirection" : "on" / "off"
//h		  "transitionFunc" : function() { ...alert(); ...};
//h		} 설정 가능
riff.scene.back = function ( _option )
{
	if( typeof _option == "object" || typeof _option == "undefined" ) {

		//h 팝업 떠있으면 끄고 마침
		if( riffGlobal.popup )
		{
			riff.popup();
			return true;
		}

		//h 현재 scene 이름 들고 오기
		var curScene = riffGlobal.sceneStack.pop();
		var backScene = riffGlobal.sceneStack.pop();

		//h 뒷 scene가 없거나 idle일 경우
		if( !backScene || backScene[0] == "#idle" )
		{
			//h idle가 있다면
			if(riff("#idle").size() != 0)
			{
				riff(curScene[0]).hide();
				riff.move("idle");
			}
			//h 더이상 뒤 로 갈 곳이 없을 때
			else
				riffGlobal.sceneStack.push(curScene);

			return true;
		}

		//h setList 있을때 소프트 키 변경
		var riffScene = riff(backScene[0]),
			riffSceneSetList = riffScene.find('.setList');
		if( riffSceneSetList.size() > 0 )
		{
			riffGlobal.setListSelectData = riffSceneSetList.getSettingValue();
			riff.softkey( riffGlobal.softkeySetListData );
			riff.softkey( riffGlobal.softkeySetListFunc );
			riff(".setTitle").show();
			riff(".title").hide();
		}
		else if ( riff(backScene[0]).buffer("ComponentSceneComponentDataSoftkey") )
		{
			riff.softkey( riff(backScene[0]).buffer("ComponentSceneComponentDataSoftkey") );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
		}
		else
		{
			riff.softkey( riffGlobal.softkeyDataGlobal );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
			riff(".title").show();
			riff(".setTitle").hide();
		}

		// feedReceiveTime
		var strTime = "",
			riffSceneTab = riffScene.find('.tab'),
			riffSceneTabList = riffSceneTab.subSceneSelect().find(".list"),
			riffSceneList = riffScene.find(".list");

		if( riffSceneTabList.buffer("ComponentListComponentDataRSSFlag") ) {
			riff.feedReceiveTime( riffSceneTabList.buffer("ComponentListComponentDataRSSTime") );
		}else if ( ( riffSceneTab.size() == 0 ) &&  riffSceneList.buffer("ComponentListComponentDataRSSFlag") ){
			riff.feedReceiveTime( riffSceneList.buffer("ComponentListComponentDataRSSTime") );
		}else {
			riff.feedReceiveTime();
		}

		riff.softkey.softKeyMoreHide();
		riff.adjustSceneSize();

		// option setting
		var appOption = (_option)?_option:curScene[1],
			option = new Array();
		for(var k in appOption)
			option[k] = appOption[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.transitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.transitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.transitionMotion;
		option.transitionDirection = "off";

		riff.transition(  riff(backScene[0]), riff(curScene[0]), option );
		riffGlobal.sceneStack.push(backScene);

		return true;
	}
}


//h 지정된 ID( _popup ) 를, popup scene으로 띄운다.
//h #id 혹은 id 로 접근
//h _scene : 이동할 DOM Element의 ID. riff Components로 구성.
//h _option :
//h		{ "transitionEffect" : "slideVer" / "slideHor" / "popup" / "fade" / "spin" / "none"
//h		  "transitionMotion" : "ease" / "ease-in" / "ease-out" / "ease-in-out"
//h		  "transitionSecond" : 1234 ( millisec )
//h		  "transitionDirection" : "on" / "off"
//h		  "transitionFunc" : function() { ...alert(); ...};
//h		} 설정 가능
riff.popup = function(_popup, _option)
{
	if( typeof _popup == "object" || typeof _popup =="undefined" )
		return riff.popup.back.apply(this, arguments);
	else
		return riff.popup.move.apply(this, arguments);
};

//h 지정된 ID( _popup ) 를, popup scene으로 띄운다.
//h #id 혹은 id 로 접근
//h _scene : 이동할 DOM Element의 ID. riff Components로 구성.
//h _option :
//h		{ "transitionEffect" : "slideVer" / "slideHor" / "popup" / "fade" / "spin" / "none"
//h		  "transitionMotion" : "ease" / "ease-in" / "ease-out" / "ease-in-out"
//h		  "transitionSecond" : 1234 ( millisec )
//h		  "transitionDirection" : "on" / "off"
//h		  "transitionFunc" : function() { ...alert(); ...};
//h		} 설정 가능
riff.popup.move = function ( _popup, _option )
{
	if( typeof _popup == "string" ) {
		//h _popup을 CSS ID 형태로 만들어준다.
		var popup = riff.toID(_popup);

		//h 소프트키 모어 끔
		riff.softkey.softKeyMoreHide();

		//h 팝업 떠있으면 끔
		if( riffGlobal.popup )
			riff.popup();

		riff.softkey.softKeyMoreHide();
		//h popup() 아래를 검정으로 덧씌워, 사용자가 클릭 못하게 하자.
		riff(".blackBlank").show();

		// option setting
		var option = new Array();
		for(var k in _option)
			option[k] = _option[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.popupTransitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.popupTransitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.popupTransitionMotion;
		option.transitionDirection = "on";

		riff(popup).show();
		//h 암것두 없는( null ) 곳에서 지정한게( .popupCon ) 나오게 하는 효과.
		riff.transition( riff(popup).children(".popupCon"), null, option );

		option.transitionDirection = null;
		option.transitionFunc = null;
		//h 화면에 이미 popup 이 떠 있는 걸 표시.
		riffGlobal.popup = [popup, option];

		return true;
	}
}

//h 현재 화면에 떠 있는 popup을 지운다.
//h _option :
//h		{ "transitionEffect" : "slideVer" / "slideHor" / "popup" / "fade" / "spin" / "none"
//h		  "transitionMotion" : "ease" / "ease-in" / "ease-out" / "ease-in-out"
//h		  "transitionSecond" : 1234 ( millisec )
//h		  "transitionDirection" : "on" / "off"
//h		  "transitionFunc" : function() { ...alert(); ...};
//h		} 설정 가능
riff.popup.back = function ( _option )
{
	if( typeof _option == "object" || typeof _option == "undefined" ) {
		//h 없으면
		if( !riffGlobal.popup )
			return true;

		//h 인자값 체크
		var popup = riffGlobal.popup[0];
		riff.softkey.softKeyMoreHide();

		// option setting
		var appOption = (_option)?_option:riffGlobal.popup[1],
			option = new Array();
		for(var k in appOption)
			option[k] = appOption[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.popupTransitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.popupTransitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.popupTransitionMotion;
		option.transitionDirection = "off";

		riff(popup).hide();
		//h popup 끌 때에는 해 줘야 할 작업이 있다.
		option.transitionFunc = function () {
			//h 화면 배경 검정색으로 만들었던 거 원래대로 하고
			riff(".blackBlank").hide();
			//h popup 지울 때 실행할 함수가 등록되어 있으면 실행하자.
			if( _option && _option.transitionFunc)
				_option.transitionFunc();
		}

		riff.transition( null, riff(popup).children(".popupCon"), option );
		riffGlobal.popup = null;


		return true;
	}
}

// riff Object Transition Function
// _on : riff Object that will be showed
// _off : riff Object that will be hided
// _opts : option
//h _option :
//h		{ "transitionEffect" : "slideVer" / "slideHor" / "popup" / "fade" / "spin" / "none"
//h		  "transitionMotion" : "ease" / "ease-in" / "ease-out" / "ease-in-out"
//h		  "transitionSecond" : 1234 ( millisec )
//h		  "transitionDirection" : "on" / "off"
//h		  "transitionFunc" : function() { ...alert(); ...};
//h		} 설정 가능
riff.transition = function ( _on, _off, _opts )
{
	var effect = null,
		motion = null,
		second = null,
		direction = null,
		func = null;

	for (var k in _opts)
	{
		if( k == "transitionEffect" ) effect = _opts[k];
		else if( k == "transitionSecond" ) second = _opts[k];
		else if( k == "transitionMotion" ) motion = _opts[k];
		else if( k == "transitionDirection" ) direction = _opts[k];
		else if( k == "transitionFunc" ) func = _opts[k];
	}

	if( !effect ) effect = riffGlobal.transitionEffect;
	if( !second ) second = riffGlobal.transitionSecond;
	if( !motion ) motion = riffGlobal.transitionMotion;
	if( !direction ) direction = riffGlobal.transitionDirection;

	if( effect == "none" )
	{
		if ( _off ) _off.hide();
		if ( _on ) _on.show();
		if( func ) func();

		return true;
	}

	if ( direction == "on" ) direction = "On";
	else if ( direction == "off" ) direction = "Off";

	riff(".whiteBlank").show();

	if( _off )
	{
		_off.addClass( effect + direction + "Cur");
		_off.css("-webkit-animation-timing-function", motion );
		_off.css("-webkit-animation-duration", second );

	}

	if( _on )
	{
		_on.show();
		_on.addClass( effect + direction + "App");
		_on.css("-webkit-animation-timing-function", motion );
		_on.css("-webkit-animation-duration", second );
	}

	window.setTimeout(
		function(){

			if( _off )
			{
				_off.hide();
				_off.removeClass(effect + direction + "Cur");
				_off.css("-webkit-animation-duration", "" );
				_off.css("-webkit-animation-timing-function", "" );
			}

			if( _on )
			{
				_on.removeClass(effect + direction + "App");
				_on.css("-webkit-animation-duration", "" );
				_on.css("-webkit-animation-timing-function", "" );
			}

			riff(".whiteBlank").hide();

			if( func )
				func();
		},
		window.parseFloat(second)*1000);

	return true;
}


//h 현재 페이지의 사이즈를 줄인다.
//h 위젯 객체가 있으면 위젯의 사이즈를 줄이고
//h 없으면 걍 윈도우 사이즈 줄임
//h 인자가 하나도 들어와 있지 않으면
//h 위젯 활성화 크기인 480, 800으로 변경
// resize
// resize window
riff.resize = function ( _width, _height )
{
	if(arguments.length == 0 || arguments.length == 1){
		_width = 480; /*jb Device 의 width, height (Indicator 제외한 값) 를 가져오는 API 이용하여 값 구성 widget API 중 상단 Indicator 부분의 Height 를 가져오는 APi가 존재한다.*/
		_height = 800;
	}

	if( riff.isWidget() || riff.isEmulator() ){

		widget.window.resizeWindow(_width, _height);
	}else{
		window.resizeTo(_width, _height);
	}

	return true;
}

//riff storage
//save data on device
//save cookie, perference if possible
//if return value exist, return peference value
//if preference value doesn't exist, return cookie value
riff.storage = function ( _key, _value )
{
	if( !_key ) {
		return null;
	}

	if( arguments.length == 2 ) {
		if( riff.isWidget() )
			riff.storage.preference( _key, _value );
		else {
			riff.storage.localStorage( _key, _value );
		}
		return true;
	} else if(arguments.length == 1 ) {
		if( riff.isWidget() ) {
			return riff.storage.preference( _key );
		} else {
			return riff.storage.localStorage( _key );
		}
	}
};


//save data by using perference function
riff.storage.preference = function (_key, _value)
{
	if ( !riff.isWidget() || !_key )
	{
		return null;
	}

	if ( arguments.length == 1 )
		return widget.preferenceForKey( _key );
	else if( arguments.length == 2 )
		return widget.setPreferenceForKey( _value, _key );
}

//h 사용자가 PC에서 widget을 테스트할 때, localStorage를 이용하여 기기에 저장한다.
//h 저장하는 값은 문자열만 가능하다. 객체 등은 저장할 수 없다.
//h 인자값 :
//h		_key : 문자열. 데이터( _value)를 가져오거나 저장할 때 사용할 키값
//h		_value : 문자열. 저장할 값.
//h 반환값 :
//h		인자값이 1개일 때 :
//h			저장 성공 : key 로 저장된 값 반환( 문자열 )
//h			저장 실패 : null 반환
//h		인자값이 2개일 때 :
//h			저장 성공 : true 반환
//h			저장 실패 : null 반환
// save data by using localStorage
// parameter
//	@_key : string. used by key to find data or set data with key.
//	@_value : string. used data to save. indexed by(with) key.
//
riff.storage.localStorage = function ( _key, _value )
{
	if ( !_key )
		return null;
	//h local Storage가 없으면 에러
	var storageObj = window.localStorage;
	if ( !storageObj ) {
		riff.alert(" the localStorage() Object is not exist.");
		return null;
	}

	if( arguments.length == 1) {
		//h 저장된 값 반환
		return storageObj.getItem( _key );
	} else if( arguments.length == 2 ) {
		//h 저장
		storageObj.setItem( _key, _value );
		return true;
	}
	return null;
};

//global setting function
//two style argument
//riff.option ( { "key" : "value",
//                 "key2" : ["value1", "value2"] );
//riff.option ( "key", "value" );
//riff.option ( "key", ["value1", "value2"] );
riff.globalSetting =  riff.option = function( )
{
	var setting = {};

	//if first argument is string
	if(typeof arguments[0] == "string")
		setting[ arguments[0] ] = arguments[1];
	else if(typeof arguments[0] == "object")
		setting = arguments[0];

	for(var k in setting)
	{
		if( k == "transitionEffect" || k == "transitionSecond"  || k == "transitionMotion"
			|| k == "isAlwaysNewSubScene" || k == "isAutoRefreshChangeOtherSubscene"  || k == "isRefreshChangeOtherSubscene"
			|| k == "useRssCache" || k == "rssAutoRefreshTime"
			|| k == "popupTransitionEffect" || k == "popupTransitionSecond"  || k == "popupTransitionMotion"
			|| k =="softkeySetListData"  ||  k =="softkeySetListFunc"  )
		{
			riffGlobal[k] = setting[k];
		}
		else if(k =="theme" )
		{
			riffGlobal.theme = setting[k];
			var cssLink = riff('head').children('link').each(
				function()
				{
					if ( riff(this).attr('href').indexOf('theme.css') != -1 )
						riff(this).remove();
				});

			if( riffGlobal.theme != "none" )
				riff('head').append('<link rel="stylesheet" href="theme/'+riffGlobal.theme+'/theme.css" type="text/css">');
		}
		else if( k == "softkeyType" || k == "softkeyFunc" || k == "softkeyData" )
		{
			if( setting[k] == "none" || k == "softkeyData" )
				riffGlobal.softkeyDataGlobal = setting[k];
			if( k == "softkeyFunc" )
				riffGlobal.softkeyFuncGlobal = setting[k];

			riff.softkey(setting[k]);
		}
		else if( k =="name" )
		{
			riffGlobal.name = setting[k]; /*jb widget api 를 이용해서 하는 방법 알아보기 */
		}
		else if ( k =="eventType" )
		{
			riffGlobal.eventType = setting[k];
		}
		else if( k == "pageCache" )
		{
			if( setting[k] == true && riff.storage("riffPageCacheData") )
				riff.move ( riff.storage("riffPageCacheData") );

			riffGlobal.pageCache = setting[k];
		}
	}
	return true;
};

//h softkey
//h argument로 오브젝트가 들어오면 데이터 배열이라고 인식
//h argument로 function이 들어오면 백키에 들어갈 펑션이라고 인식
//h arugment로 문자열이 들어오면 타입이라고 인식(type1, type2)
riff.softkey = function ()
{
	if( riff(".softkey").size() == 0 )
		riff('.scenes').after('<div class="softkey"></div>');

	for( var i = 0; arguments[i]; i++ )	{

		if( typeof arguments[i] == "object" ) {			// softkey data
			riffGlobal.softkeyData = arguments[i];
		}else if( typeof arguments[i] == "string" ){	 		// softkey type
			if( arguments[i] == "none" ){
				riff('.softkey').remove();
				break;
			}
			riffGlobal.softkeyType = arguments[i];
		} else if ( typeof arguments[i] == "function" )	{		// softkey function
			riffGlobal.softkeyFunc = arguments[i];
		}

		riff(".softkey").makeContents( riffGlobal.softkeyData, riffGlobal.softkeyType, riffGlobal.softkeyFunc  );
	}

	riff.adjustSceneSize();

	return true;
};

// more softkey Hide
riff.softkey.softKeyMoreHide = function()
{
	if( riff('.softkey.type1 ul.moreList').size() !=0 && riff('.softkey.type1 ul.moreList').css('bottom') == '70px' )
	{
		var morekeyHeight = Math.abs(70-riff('.softkey.type1 ul.moreList').height());
		riff('.softkey.type1 ul.moreList').css('bottom','-'+morekeyHeight+'px');
	}
	return true;
};

// ajax
riff.ajax = function ( _url, _fnSuccess, _option )
{
	if( !_url || typeof _url != "string" )  {
		return false;
	}
	if( _fnSuccess && typeof _fnSuccess != "function" )  {
		return false;
	}
	if( _option && typeof _option != "object" )  {
		return false;
	}

	return new riffAJAX( _url, _fnSuccess, _option  );	/* return true, falss 로 수정*/
}

// xml
riff.xml = function ( _url, _fnSuccess, _opts  )
{
	if( arguments.length == 2 && typeof _url =="string" && typeof _fnSuccess == "object") {
		var opts = _fnSuccess,
			funcLoad = opts["load"],
			funcAttach = opts["attach"],
			funcOpts = opts["option"];

		return new riffXML( _url, function( _xml, _xmlObject, _xmlString ){
			var r;
			if( typeof funcLoad  == "function" )
				r = funcLoad.call(_xml, _xml, _xmlObject, _xmlString );
			if ( typeof funcAttach == "function" )
				funcAttach.call(_xml, r );
			},	funcOpts
		);
	}else {
		return new riffXML( _url, _fnSuccess, _opts  );
	}
}

//h window 가 전부 load되고 나서( = onload 이벤트 실행시 ) 작동할 함수 설정
//h 인자값 :
//h		_func : window load 완료후 실행할 함수.
//h 반환값 :
//h		true
riff.load = function( _func )
{
	//h Window 객체가 완전히 load되고 나서 실행하는 함수를 지정한다.
	//h _func 가 없으면 종료.
	if( !_func || typeof( _func ) != 'function' )
	{
		return true;
	}
	//h 먼저 설정되어 있는 onload 함수가 없으면, _func 를 바로 설정한다.
	var loadFunc = window.onload;
	if( !loadFunc )
	{
		window.onload = _func;
		return true;
	}

	//h 이미 설정되어 있는 window.onload 함수가 있으면, 해당 함수를 먼저 실행한 후 _func 를 다음에 실행하도록 설정한다.
	var setFunc = function()
	{
		loadFunc.call( window );
		_func.call( this );
	}
	window.onload = setFunc;
	return true;
};

//d x = riff.noConflict();
//d x("abcd").,,,
riff.noConflict = function ()
{
	window.$ = riffGlobal.$;

	return riff;
};


// now time
riff.now = function ( )
{
	var	timeCur = new Date();

	return (1900 + timeCur.getYear()) + "-" + (1 + timeCur.getMonth()) + "-" + timeCur.getDate() + " " + timeCur.getHours() + ":" + timeCur.getMinutes();
};

//h RSS Component에서 pubData 혹은 데이터 수신 등의 시간 값을 html로 출력.
riff.feedReceiveTime = function ( _str )
{
	if( arguments.length == 1 ) {
		riff(".feedReceiveTime").show();
		riff(".feedReceiveTime").html(_str);
	}else {
		riff(".feedReceiveTime").hide();
		riff(".feedReceiveTime").html("");
	}

	return true;
};

//h 화면 크기를 자동 계산.
riff.adjustSceneSize = function ()
{
	// Scene Height Controller
	var h = 16; // Margin-top

	//h Title 처리. Scene 의 Top POsition 에도 영향을 준다.
	if(riff('.widgetWrap').find('.title').size() != "0" && riff('.widgetWrap').find('.title').css('display') != "none"){
		var titleH = riff('.widgetWrap').find('.title').height();
		h = h + titleH;

		riff('.widgetWrap').find('.scenes').css('top',h+"px");
	}

	if(riff('.widgetWrap').find('.setTitle').size() != "0" && riff('.widgetWrap').find('.setTitle').css('display') != "none"){
		var setTitleH = riff('.widgetWrap').find('.setTitle').height();
		h = h + setTitleH;
		riff('.widgetWrap').find('.scenes').css('top',h+"px");
	}

	if(riff('.widgetWrap').find('.softkey').size() != "0" && riff('.widgetWrap').find('.softkey').css('display') != "none")
		h = h + riff('.widgetWrap').find('.softkey').height();

	if(riff('.widgetWrap').find('.feedReceiveTime').size() != "0" && riff('.widgetWrap').find('.feedReceiveTime').css('display') != "none")
		h = h + riff('.widgetWrap').find('.feedReceiveTime').height();

	var sceneH = 762-h+"px"; //h 762px는 위젯 최대 높이

	riff('.widgetWrap').find('.scenes').css('height',sceneH);
	riff('.widgetWrap').find('.scene').css('height',sceneH);
	riff('.widgetWrap').find('.sceneBackground').css('height',sceneH);
	riff('.widgetWrap').find('.sceneWrap').css('height',sceneH);

	//Subscene
	var tabH = window.parseInt(riff('.tab').css('height'))+window.parseInt(riff('.tab').css('border-top-width'))+window.parseInt(riff('.tab').css('border-bottom-width'))+window.parseInt(riff('.tab').css('padding-top'))+window.parseInt(riff('.tab').css('padding-bottom'))+window.parseInt(riff('.tab').css('margin-bottom'))+window.parseInt(riff('.tab').css('margin-top')),
		 tabSubSceneH = window.parseInt(sceneH)-tabH;

	 riff('.tab').parent().find('.subScene').css('height',tabSubSceneH+"px");

	 return true;
}

//h XML로 검색한 결과를 riff로 싸 주어 리턴하여, riff의 filter, each 등을 사용할 수 있게 하자.
//d var riff.XML.getAllDataByQuerySelectorReturnriff = function ( _xml, _queryString, _xPathResultType )
//d var getDataBySelectorReturnriff = function ( _xml, _queryString )
riff.xmlSelector = function ( _xml, _queryString )
{
	if ( !_xml || typeof( _xml ) != 'object' || !_xml.documentElement ) {
		return null;
	}

	var rv = new Array();
	var len = 0;
	var t3 = _xml.documentElement.querySelectorAll( _queryString );

	//h xml 검색결과가 없을 경우
	if( (len = t3.length) < 0 &&  (len = (_xml.getElementsByTagName( _queryString )).length) < 0 ){
		return riff();
	}

	//h 검색 결과 만큼 XML Element를 배열에 넣는다.
	for( var lp = 0; lp < len; lp++ )	{
		rv.push( t3[ lp ] );
	}

	return riff( rv );
};


//h 문자열 뒤에 말줄임표 붙이기
riff.ellipsisString = function ( _str, _num )
{
	if( typeof _str == "string" ) {
		var num = ( typeof _num == "number" )?_num:
			(( typeof _num == "string" )?window.parseInt(_num):
				riffGlobal.ellipsisStringNum);

		return (_str.length > num)?_str.substring(0,num-3)+"...":_str;
	}

	return null;
};


//h 플러그인 추가함수 (함수확장)
riff.extend = function ( _name, _function )
{
	//h 복수개의 함수를 받아서 하나씩 다시 extent() 를 호출해서 등록한다.
	if( typeof _name == "object" ) {
		for ( var k in _name ) {
			riff.extend(k, _name[k]);		// extend recall
		}
	}else if (typeof _name == "string" && typeof _function == "function" ) {
		riff.fn[_name] = _function;
	}
	return true;
};

//h option이 포함된 알림창
riff.alert = function ( _str, _opts )
{
	var opts = {};

	opts.cancelFunc = function(){ riff.back(); };

	for ( var k in _opts )
		opts[k] = _opts[k];
	opts.html = _str;

	//h 팝업 markup 생성 부분에서 처리해준다.
	riff("#alert").makeContents( opts );

	//h 화면에 알림창이 없으면 알림창을 보여준다.
	if( !(riffGlobal.popup && riffGlobal.popup[0] == "#alert")  ) {
		riff.move("alert");
	}

	return true;
};

//h timer를 관리하기 쉽게 함든 함수.
//h _func : timer 실행시에 실행되는 함수.
//h _time : timer 함수가 실행되는 주기
//h _id   : timer 를 쉽게관리하기 위해 사용하는 id, id값은 꼭 넣어줘야한다.
//h riff.timer(_id) 이런식으로 사용할경우 timer삭제
riff.timer = function( _func, _time, _id )
{
    if(arguments.length == 1 && typeof arguments[0] =="string")
    {
		if ( riffGlobal.timerList[_func] )
		{
			clearInterval( riffGlobal.timerList[_func] );
			riffGlobal.timerList[_func] = null;
		}

		return true;
    }
	else if ( typeof _func == "number")
	{
		clearInterval( _func );

		for( var k in riffGlobal.timerList )
		{
			if( riffGlobal.timerList[k] == _func )
				riffGlobal.timerList[k] = null;
		}

		return true;
	}
    else if( typeof _func == "function" )
    {
		if( _id && riffGlobal.timerList[_id])
			riff.timer(_id);
        var count = 0;
        var ti = ( _time ) ? setInterval(function(){ _func.call(this, ++count);},_time) : setTimeout(_func, 0);
		if( _id) riffGlobal.timerList[_id] = ti;

		return ti;
    }
};


//h riffGlobal.isAlwaysNewSubScene, riffGlobal.isAutoRefreshChangeOtherSubscene, riffGlobal.isRefreshChangeOtherSubscene( 설정값 ) 에 따라 화면 갱신 정책을 적용한다.
//h 정책 설정 값은 다음과 같다.( tab을 예로 들다. )
//h 최초 Markup 이 자동생성된 직후는, 모든 flag 는 undefined이다. ( 예를들면, ComponentTab의 각 TAB.isSubsceneNew = undefined )
//h 복수 개의 TAB 중 최초 화면 focus 되는 0번째 TAB은, RSS() -> XML() 을 거쳐 데이터 수신을 하면서 isSubsceneNew 를 true 로 바꾼다.
//h 이 이후
//h
//h 1. riffGlobal.isAlwaysNewSubScene 는 riffGlobal.isAutoRefreshChangeOtherSubscene, riffGlobal.isRefreshChangeOtherSubscene 에 우선한다.
//h		riffGlobal.isAlwaysNewSubScene = true 일 경우, 현재 화면 flag를 항상 false 로 설정 -> 화면 이동하면 항상 서버에서 데이터 수신해서 화면 재구성.
//h
//h 2. isAutoRefreshChangeOtherSubscene	= false / isRefreshChangeOtherSubscene	= false 일 경우 ; AutoRefresh 던 Refresh 던, "현재 선택된 TAB의 데이터를 갱신한다 해도 그 갱신 여부를 다른 TAB에게 전파하거나 영향을 끼치지 않는 경우."
//h		현재 Focus된 TAB의 flag -> NEW로 갱신
//h		현재 Focus된 TAB이외의 flag -> 변경안한다.
//h		노리는 효과 : 현재 TAB은 새거라는 걸 알리되, 나머지는 건드리지 않는다. 이럼 딴 TAB 갈 때 그 TAB에 갱신 영향 끼치지 않고, 딴 TAB 갔다 돌아오면 현재 TAB은 DOM 을 그대로 보여줄 수 있다.
//h
//h 3. isAutoRefreshChangeOtherSubscene	= true / isRefreshChangeOtherSubscene	= true 일 경우 ; AutoRefresh 던 Refresh 던, "현재 선택된 TAB의 데이터를 갱신하면, 딴 TAB에게 전파하여 항상 최신 데이터로 유지해야 한다."
//h		현재 Focus된 TAB의 flag -> NEW로 갱신
//h		현재 Focus된 TAB이외의 flag -> OLD로 변경.
//h		노리는 효과 : 현재 TAB은 새거라는 걸 알리고, 동시에 딴 TAB들은 오래된 데이터란 걸 알린다. 이럼 딴 TAB 갈 때마다 데이터를 항상 새걸로 가져오기 위해 서버에서 가져오고, 현재 TAB이 DOM에서 데이터를 보여주는 경우는 없다.
//h
//h 4. isAutoRefreshChangeOtherSubscene	= true / isRefreshChangeOtherSubscene	= false 일 경우 ; AutoRefresh 일 경우는 현재 TAB이 데이터 갱신하면 다른 TAB들도 갱신하게 강제하고, Refresh 일 경우는 현재 TAB의 갱신 여부가 다른 TAB에게는 상관없도록 한다.
//h		AutoRefresh 가 발생한 경우 : 현재 TAB 을 갱신하고, 다른 TAB 도 갱신하게 한다.
//h		현재 Focus된 TAB의 flag -> NEW로 갱신
//h		현재 Focus된 TAB이외의 flag -> OLD로 변경.
//h		노리는 효과 : 현재 TAB은 새거라는 걸 알리고, 동시에 딴 TAB들은 오래된 데이터란 걸 알린다. 이럼 딴 TAB 갈 때마다 데이터를 항상 새걸로 가져오기 위해 서버에서 가져오고, 현재 TAB이 DOM에서 데이터를 보여주는 경우는 없다.
//h		Refresh 가 발생한 경우 : 현재 TAB 은 갱신하되, 다른 TAB 은 놔둔다.
//h		현재 Focus된 TAB의 flag -> NEW로 갱신
//h		현재 Focus된 TAB이외의 flag -> 변경안한다.
//h		노리는 효과 : 현재 TAB은 새거라는 걸 알리되, 나머지는 건드리지 않는다. 이럼 딴 TAB 갈 때 그 TAB에 갱신 영향 끼치지 않고, 딴 TAB 갔다 돌아오면 현재 TAB은 DOM 을 그대로 보여줄 수 있다.
//h
//h 5. isAutoRefreshChangeOtherSubscene	= false / isRefreshChangeOtherSubscene	= true 일 경우 ; AutoRefresh 일 경우는 현재 TAB의 갱신 여부가 다른 TAB에게는 상관없도록 하고, Refresh 일 경우는 현재 TAB이 데이터 갱신하면 다른 TAB들도 갱신하게 강제한다.
//h		AutoRefresh 가 발생한 경우 : 현재 TAB 은 갱신하되, 다른 TAB 은 놔둔다.
//h		현재 Focus된 TAB의 flag -> NEW로 갱신
//h		현재 Focus된 TAB이외의 flag -> 변경안한다.
//h		노리는 효과 : 현재 TAB은 새거라는 걸 알리되, 나머지는 건드리지 않는다. 이럼 딴 TAB 갈 때 그 TAB에 갱신 영향 끼치지 않고, 딴 TAB 갔다 돌아오면 현재 TAB은 DOM 을 그대로 보여줄 수 있다.
//h		Refresh 가 발생한 경우 : 현재 TAB 을 갱신하고, 다른 TAB 도 갱신하게 한다.
//h		현재 Focus된 TAB의 flag -> NEW로 갱신
//h		현재 Focus된 TAB이외의 flag -> OLD로 변경.
//h		노리는 효과 : 현재 TAB은 새거라는 걸 알리고, 동시에 딴 TAB들은 오래된 데이터란 걸 알린다. 이럼 딴 TAB 갈 때마다 데이터를 항상 새걸로 가져오기 위해 서버에서 가져오고, 현재 TAB이 DOM에서 데이터를 보여주는 경우는 없다.
//h
riff.changeSubsceneFlag = function( _maxLength, _currentIndex, _dataSet, _isGoRun, _isAutoRefreshRun, _isRefreshRun )
{
	//h 현재 TAB의 화면 갱신 여부를 다른 TAB에게 전파하지 않는다.
	function DontCareTheOtherSubscene()
	{
		_dataSet[ _currentIndex ].isSubsceneNew = true ;
	};

	//h 현재 TAB의 화면 갱신 여부를 다른 TAB에게도 전파한다.
	function TheOtherSubsceneMakeOld()
	{
		for( var lp = 0; lp < _maxLength; lp++ )
		{
			_dataSet[ lp ].isSubsceneNew = false;
		}
		_dataSet[ _currentIndex ].isSubsceneNew = true ;
	};

	//h 현재 화면 flag를 항상 false 로 설정 -> 화면 이동하면 항상 서버에서 데이터 수신해서 화면 재구성.
	if ( true == riffGlobal.isAlwaysNewSubScene )
	{
		TheOtherSubsceneMakeOld();
		return true;
	}

	//h 화면이 Component.move() 에 의해 갱신된거라면
	//h 만약 _isAutoRefreshRun / _isAutoRefreshRun 가 값이 없으면
	if ( ( _isGoRun && (true == _isGoRun) )
		|| ( typeof( _isAutoRefreshRun ) == 'undefined' && typeof( _isRefreshRun ) == 'undefined' )
		)
	{
		//h 현재의 TAB만 갱신하고, 끝내자.
		DontCareTheOtherSubscene();
		return true;
	};

	if ( !riffGlobal.isAutoRefreshChangeOtherSubscene && !riffGlobal.isRefreshChangeOtherSubscene )
	{
		DontCareTheOtherSubscene();
	} else if ( true == riffGlobal.isAutoRefreshChangeOtherSubscene && true == riffGlobal.isRefreshChangeOtherSubscene )
	{
		TheOtherSubsceneMakeOld();
	} else if ( true == riffGlobal.isAutoRefreshChangeOtherSubscene && !riffGlobal.isRefreshChangeOtherSubscene )
	{
		if ( true == _isAutoRefreshRun )
		{
			TheOtherSubsceneMakeOld();
		} else if ( true == _isRefreshRun )
		{
			DontCareTheOtherSubscene();
		}
	} else if ( !riffGlobal.isAutoRefreshChangeOtherSubscene && true == riffGlobal.isRefreshChangeOtherSubscene )
	{
		if ( true == _isAutoRefreshRun )
		{
			DontCareTheOtherSubscene();
		} else if ( true == _isRefreshRun )
		{
			TheOtherSubsceneMakeOld();
		}
	}

	return true;
}


//h 배열인지 아닌지 체크
riff.isArray = function()
{
	if( arguments.length > 0)
	{
		 if ( arguments[0].push )
		 {
			return true;
		 }
		 else
		{
			 return false;
		}
	} else {
		return false;
	}
}



riff.fn.selector.prototype = riff.fn;
window.riff = window.$ = riff;
window.riffGlobal = riffGlobal;

document.write("<script src=riff_component.js ></script>");
document.write("<script src=riff_componentsetting.js ></script>");
document.write("<script src=riff_touchevent.js ></script>");
document.write("<script src=riff_ajax.js ></script>");
document.write("<script src=riff_xml.js ></script>");
document.write("<script src=riff_widgetapi.js></script>");

}
)(window);


