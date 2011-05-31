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
	selector : function ( _q ){
		var _q = riff.trim( _q ),
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
		if( riff.isArray(rArr) )
			return rArr;
		else
			return riff.nodeListToArray(rArr);
	},

	//n @_elm {Array|String} an array of DOM nodes || CSS selector query
	elmCheck : function ( _elm ){
		return ( typeof(_elm) == "string" ? riff.selector( _elm ) : _elm );
	},

	noConflict : function() {
		window.$ = riff.global.$;
		return riff;
	},

	//n Global Object
	global : {
		$ : window.$
	}
};

window.$ = riff;