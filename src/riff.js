// riff.js
// version : v0.0.1
// revision : 693

var riff = {
	//n Regular expression for Selector argument
	//n 1. regexSChar : Special Character ( '.', '#', ',', '>', '[', ']', ':', '*', '+' )
	//n 2. regexChar : Alphabet Character ( a-z, A-Z )
	regexSChar : /[\.\#\,\>\[\]\:\*\+]/,
	regexChar : /[a-z,A-Z]/,

	//n extend( "foo", function( ... ){ } )
	//n extend( { foo1: function( ... ){ }, foo2: function( ... ){ }  )
	//n @_obj {Object}
	//n @_fn {Function}
	extend : function( _obj,  _fn ) {	// add more APIs to the core.
		if( typeof( _obj) == "string" ) {
			if( this[_obj] ) return false;	 // already exists.
			this[ _obj ] = _fn;
		} else {
			for( var k in _obj ) {
				if( this[_obj[k]] ) continue;
				this[ k ] = _obj[k];
			}
		}

		return true;
	},
	//n Selects an array of DOM nodes by CSS selector
	//n @_q {String} CSS selector
	//n @return {Array} an array of DOM nodes
	selector : function ( _q, _q2 ){
		if(arguments.length == 1){
			var _q = riff.string.trim( _q ),
				tChar = _q.charAt(0),
				tIdx = _q.indexOf(" "),
				rArr = [];

			if ( tIdx < 0 ) {		//n no space in the queryString.
				if( ! riff.regexSChar.test(_q.substring(1)) ) {	//n no special character from the other words in the queryString.
					if( tChar == "#"){
						rArr.push( document.getElementById( _q.replace(/\#/, "")) );
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
						rArr = document.getElementById( tKey.replace(/\#/gi, "") ).querySelectorAll( tQuery );
					} else {
						rArr = document.querySelectorAll( _q );
					}
				} else {
					rArr = document.querySelectorAll( _q);
				}
			}
		} else if(arguments.length > 1){
			var _q = riff.elmCheck(_q),
				_q2 = riff.string.trim( _q2 ),
				tChar2 = _q2.charAt(0),
				tIdx2 = _q2.indexOf(" "),
				tArrElm = [],
				tArrTotal = [],
				rArr = [];

			if ( tIdx2 < 0 ) {		//n no space in the queryString.
				if( ! riff.regexSChar.test(_q2.substring(1)) ) {	//n no special character from the other words in the queryString.
					if ( tChar2 == "."){
						var tFn = function(_el, _idx, _arr){
							var tEl = _el.getElementsByClassName( _q2.replace(/\./, ""));
							if(tEl.length > 0) tArrElm.push(tEl);
						};
						_q.forEach(tFn);
					} else if ( riff.regexChar.test( tChar2 )){
						var tFn = function(_el, _idx, _arr){
							var tEl = _el.getElementsByTagName( _q2 );
							if(tEl.length > 0) tArrElm.push(tEl);
						};

						_q.forEach(tFn);
					} else {
						var tFn = function(_el, _idx, _arr){
							var tEl = _el.querySelectorAll( _q2 );
							if(tEl.length > 0) tArrElm.push(tEl);
						};
						_q.forEach(tFn);
					}
				} else {
					var tFn = function(_el, _idx, _arr){
						var tEl = _el.querySelectorAll( _q2 );
						if(tEl.length > 0) tArrElm.push(tEl);
					};
					_q.forEach(tFn);
				}
			} else {				//n space exists
				var tFn = function(_el, _idx, _arr){
					var tEl = _el.querySelectorAll( _q2 );
					if(tEl.length > 0) tArrElm.push(tEl);
				};
				_q.forEach(tFn);
			}

			for(var i=0, tArrLen=tArrElm.length;i<tArrLen;i++){
				if(tArrElm[i].length > 0){
					var tArrNode = riff.util.toArray(tArrElm[i]);
					for(var j=0, tArrNodeLen=tArrNode.length; j<tArrNodeLen; j++){
						tArrTotal.push(tArrNode[j])
					}
				} else {
					tArrTotal.push(tArrElm[i]);
				}
			}

			for(var i=0;i<tArrTotal.length;i++){
				if(rArr.length > 0){
					var tIsSameNode = 0;
					for(var j=0; j<rArr.length; j++){
						if(tArrTotal[i] === rArr[j]) tIsSameNode++;
					}
					if(tIsSameNode == 0) rArr.push(tArrTotal[i])
				} else {
					rArr.push(tArrTotal[i]);
				}
			}



			tArr = null;
			tArrTotal = null;
			tElm = null;
		}

		if( riff.util.isArray(rArr) )
			return rArr;
		else
			return riff.util.toArray(rArr);
	},
	//n @_elm {Array|String} an array of DOM nodes || CSS selector query
	elmCheck : function ( _elm ){
		return ( typeof(_elm) == "string" ? riff.selector( _elm ) : _elm );
	},

	noConflict : function() {
		window.$ = riff.global.$;
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
		buffer : [],
		bufferIdx : 1,
		ajax : {
			UNSENT : 0,		//e	open() has not been called yet.
			OPENED : 1,		//e	send()has not been called yet.
			HEADERS_RECEIVED : 2,	//e	send() has been called, and headers and status are available.
			LOADING : 3,	//e	Downloading; responseText holds partial data.
			DONE : 4			//e	The operation is complete.
		}
	},

	component : {
		//n Blank object for plugin
	}
};

window.$ = riff;