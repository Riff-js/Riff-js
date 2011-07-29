
var riff = {
	//n Regular expression for Selector argument
	//n 1. regexSChar : Special Character ( '.', '#', ',', '>', '[', ']', ':', '*', '+' )
	//n 2. regexChar : Alphabet Character ( a-z, A-Z )
	regexSChar : /[\.\#\,\>\[\]\:\*\+]/,
	regexChar : /[a-z,A-Z]/,
	//n extend( { foo1: function( ... ){ }, foo2: function( ... ){ } , true )
	//n @_obj { _extend } object to add / overwrite( PLUGIN etc.).
	//n @_isOverwrite { boolean } if true, overwrite function.
	extend : function( _extend, _isOverwrite ) {	// add more APIs to the core.
		riff.extendR( riff, _extend, _isOverwrite );
		return true;
	},

	
	//n internal function. 
	//n riff.extend internal recursive function.
	extendR : function ( _source, _extend, _isOverwrite )
	{
		for( var k in _extend ) {
			var t = typeof( _extend[k] );
			if( t == "function" ) {		//n if "function", overwrite or add the _extend.
				if( _isOverwrite || !_source[k] ) _source[k] = _extend[k];
			} else if( typeof( _extend[k] ) == "object" ) {
				if ( _source[k] )	{					//n if "object", chech each property and add/overrite THE PRPOERTY. DO NOT OVERWRITE Object itself. 
					riff.extendR( _source[k], _extend[k], _isOverwrite );	//n if exists, recursive it.
				} else {
					_source[k] = _extend[k];		//n if no exists, add.
				}
			} else 
				_source[k] = _extend[k];			//n if values, overwrite. do not need to care.
		}
	},
	
	//n Selects an array of DOM nodes by CSS selector
	//n @_q {String} CSS selector
	//n @return {Array} an array of DOM nodes
	selector : function ( _q ){
		var _q = riff.string.trim( _q ),
			tChar = _q.charAt(0),
			tIdx = _q.indexOf(" "),
			rArr = [],
			tResult = null;

		if ( tIdx < 0 ) {		//n no space in the queryString.
			if( ! riff.regexSChar.test(_q.substring(1)) ) {	//n no special character from the other words in the queryString.
				if( tChar == "#"){
					tResult = document.getElementById( _q.replace(/\#/, ""));
					if( tResult ) rArr.push( tResult );
				} else if ( tChar == "."){
					rArr = document.getElementsByClassName( _q.replace(/\./, "") );
				} else if ( riff.regexChar.test( tChar )){
					rArr = document.getElementsByTagName( _q );
				} else {
					rArr = document.querySelectorAll( _q );
				}
			} else {
				rArr = document.querySelectorAll( _q );
			}
		} else {				//n space exists
			var tKey = _q.substring(0, tIdx++);
			var tQuery = _q.substring(tIdx);
			if( ! riff.regexSChar.test(tKey.substring(1))){		//n no special character in the first word in the queryString.
				if( tChar == "#" && (/[\.a-zA-Z]/).test(tQuery.charAt(0))){
					tResult = document.getElementById( tKey.replace(/\#/gi, "") );
					if( tResult ) rArr = tResult.querySelectorAll( tQuery );
				} else {
					rArr = document.querySelectorAll( _q );
				}
			} else {
				rArr = document.querySelectorAll( _q);
			}
		}		

		tResult = null;
		if( riff.util.isArray(rArr) )
			return rArr;
		else
			return riff.util.toArray(rArr);
	},

	//n @_elm {Array|String} an array of DOM nodes || CSS selector query
	elmCheck : function ( _elm ){
		return ( typeof(_elm) == "string" ? riff.selector( _elm ) : _elm );
	},

	noConflict : function( ) {
		window.$ = riff.global.$;
		window.$a = riff.global.$a;
		window.$d = riff.global.$d;
		window.$e = riff.global.$e;
		window.$l = riff.global.$l;
		window.$m = riff.global.$m;
		window.$s = riff.global.$s;
		window.$t = riff.global.$t;
		window.$u = riff.global.$u;
		window.$w = riff.global.$w;
		
		return riff;
	},

	load : function( _func )
	{
		//e The executable functions are selected after the window object is totally loaded.
		//e end if the h_func does not exist
		if( !_func || typeof( _func ) != 'function' )
		{
			return true;
		}
		//e If the previously set onload function does not exist, the _func function will be immediately set
		var loadFunc = window.onload;
		if( !loadFunc )
		{
			window.onload = _func;
			return true;
		}

		//e If window.onload function is set already, the relevant functions are executed first, then _func will be executed next
		var setFunc = function()
		{
			loadFunc.call( window );
			_func.call( this );
		}
		window.onload = setFunc;
		return true;
	},

	//n Global Object
	global : {
		$ : window.$ ,
		$a : window.$a ,
		$d : window.$d ,
		$e : window.$e ,
		$l : window.$l ,
		$m : window.$m ,
		$s : window.$s ,
		$t : window.$t ,
		$u : window.$u ,
		$w : window.$w ,

		buffer : [],
		bufferIdx : 1,
		timerList : [],
		ajax : {
			UNSENT : 0,		//e	open() has not been called yet.
			OPENED : 1,		//e	send()has not been called yet.
			HEADERS_RECEIVED : 2,	//e	send() has been called, and headers and status are available.
			LOADING : 3,	//e	Downloading; responseText holds partial data.
			DONE : 4,			//e	The operation is complete.
			connectedList : []		//e ajax communication list( currently connected ajax list ).
		},
		event : {
/*			
			touchstartOrMouseDown : "touchstart" ,
			touchmoveOrMouseMove : "touchmove" ,
			touchendOrMouseUp : "touchend" ,
*/
			touchstartOrMouseDown : "mousedown" ,
			touchmoveOrMouseMove : "mousemove" ,
			touchendOrMouseUp : "mouseup" ,
			bfName : "_riffEvent",
			touchStart : "touchStart",
			touchMove : "touchMove",
			touchEnd : "touchEnd"
		},
		language: {
			currentLanguage : "en",
			translateTable: {}
		}
	},

	component : {
		//n Blank object for plugin
	}
};

window.$ = riff;
