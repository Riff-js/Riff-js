
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

riff.extend({
	util : {
		//n Determine whether the argument is an array.
		//n @_obj {Object}
		//n @return {Boolean}
		isArray : ("isArray" in Array) ? Array.isArray : function ( _obj ){
			return toString.call(_obj) === "[object Array]";
		},
		//n Nodelist -> Array
		toArray : function( _obj ) {
			return Array.prototype.slice.call( _obj );
		},
		pop : function(_arr, _obj){
			if(typeof _obj != "undefined"){
				var tIdx = _arr.indexOf(_obj);
				if(tIdx > -1) return _arr.splice(tIdx,1);			
			} else {
				return _arr.pop();
			}
		},
		push : function(_arr, _obj, _idx){
			if(_obj){
				var tIdx = _arr.indexOf(_obj);
				if(tIdx == -1){
					if(_idx){
						var tArr = _arr.splice(_idx);
						_arr.push(_obj);
						_arr = _arr.concat(tArr);
					} else {
						_arr.push(_obj);
					}
				}
				tIdx = null;
			}
			return _arr;
		},
		//n Determine whether the argument is an array.
		//n @_fnOrId { string or number or function } function to execute.
		//n @_time { number } timerInterval's exection interval for funciton( millisecond )
		//n @_id { string } timerInterval's funciton id to delete.
		//n example : riff.util.timer( foo, 1000 );		// function foo with timerinterval 1000ms. 
		//n example : riff.util.timer( foo, 1000, "id1" );		// function foo with timerinterval 1000ms and id is "id1".
		//n example : riff.util.timer( "id1" );		// delete the "id1" timerinterval.
		timer : function( _fnOrID, _time, _id )
		{
			//n when user want to delete timer.
			if ( arguments.length == 1 ) {
				clearInterval( riff.global.timerList[ _fnOrID ] );
				if (riff.global.timerList[_fnOrID]) {
					riff.util.pop(riff.global.timerList, riff.global.timerList[_fnOrID]);
				}
				return true;
			};

			//n when user want to create timer.
			var count = 0;
			var timeoutID = ( _time ) ? 
				setInterval( function( ){ _fnOrID.call( this, ++count ); } , _time ) 
				: setInterval( _fnOrID, 0 );
			if( _id ) 
				return riff.global.timerList[ _id ] = timeoutID;
			else  
				return riff.global.timerList[ timeoutID ] = timeoutID;
		},
		cloneObject : function(what) {
			if ( riff.util.isArray( what ) )
				return what.slice( 0 );
			else
				for (i in what) {
					if ( riff.util.isArray( what[i] ) ) {
						this[i] = what[i].slice( 0 );
					} else if (typeof what[i] == 'object') {
						this[i] = new riff.util.cloneObject(what[i]);
					}
					else
						this[i] = what[i];
				}
		},

		cipherZero : function(_num){
			return ( _num > 9 ) ? _num : "0" + _num;
		},
		replaceNoLoop : function( _str, _from, _to )
		{
			if( !_from || _from == _to ) return _str;
		
			try {
				_to += "";			
				if( _to && (_to.indexOf( _from )  > - 1) ) return ""; 
		
				var rv = _str;
		
				while(  rv.indexOf( _from )  > -1 ) {
					rv  = rv.replace( _from, _to );
				};
				return rv;
			} catch ( e ) {
				return _str;
			}
		},
		compareArr : function(_arr1, _arr2){
			if(riff.util.isArray(_arr1) && riff.util.isArray(_arr2)){
				var t = _arr1.length - _arr2.length;
				if(t == 0){
					if(_arr1.sort().join(",") == _arr2.sort().join(",")){
						return -1;
					} else {
						return 0;
					}
				} else if(t > 0){
					return 0;
				} else {
					return 1;
				}
			}
		}
	}
});

window.$u = riff.util;





riff.extend(
{
	string : {
		camelize : function ( _s ){
			if( typeof(_s) == "string" ) {
				return _s.replace(/-+(.)?/g, function(match, chr) {
					return chr ? chr.toUpperCase() : '';
				});
			}
		},
		//n Remove space charater in String.
		//n @_s {String}
		//n @return {String}
		trim : ("trim" in String) ? String.prototype.trim : function( _s ){
			return _s.replace(/^\s+|\s+$/g, "");
		},
		//e Adds "..." behind a string
		ellipsis : function ( _str, _num, _isArabic )
		{
			var L = "", R = "...";
			if( _isArabic ) {
				L = "..."; 
				R = "";
			};
			return (_str.length > _num)? L + _str.substring(0,_num-3) + R : _str;
		}
	}

}

);

window.$s = riff.string;


riff.extend(
{
	data : {
		//n @_elm {Array} an array of DOM nodes
		increaseBufferIdx : function ( _el ) {
			_el.bufferIdx = riff.global.bufferIdx++;
			return _el.bufferIdx;
		},
		//n Internal function. not for the user.
		bufferInternalSet : function( _el, _key, _value ) {
			if( _el.bufferIdx ) {
				return riff.global.buffer[ _el.bufferIdx ][_key] = _value;
			} else {
				tBufferID = riff.data.increaseBufferIdx( _el );
				riff.global.buffer[ tBufferID ] = {};
				return riff.global.buffer[ tBufferID][_key] = _value;
			};
		},
		//n Internal function. not for the user.
		bufferInternalGet : function ( _el, _key ) {
			if( _el && _el.bufferIdx ) {
				if ( _el.bufferIdx ) return riff.global.buffer[ _el.bufferIdx ][ _key ];
			}
			return "";
		},
		//n @_elm {Array} an array of DOM nodes
		bufferSingle : function ( _el, _key, _value ) {
			if( arguments.length == 3) {				//n set mode
				return riff.data.bufferInternalSet( _el, _key, _value );
			} else if( arguments.length == 2) {			//n get mode
				return riff.data.bufferInternalGet( _el, _key );
			}
		},

		//n @_elm {Array} an array of DOM nodes
		buffer : function ( _elm, _key, _value ) {
			_elm = riff.elmCheck(_elm);
			if( arguments.length == 3) {				//n set mode
				function tFnSetMode ( _el ) {
					riff.data.bufferInternalSet( _el, _key, _value );
				};
				_elm.forEach( tFnSetMode );
				return _elm;
			} else if( arguments.length == 2) {			//n get mode
//				return riff.data.bufferInternalGet( _elm[0], _key );
				var rvArr = [];
				function tFnGetBufferArray( _el )
				{
					rvArr.push( riff.data.bufferInternalGet( _el, _key ) );
				};
				_elm.forEach( tFnGetBufferArray );
				return rvArr;
			}
		},
		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_el {Node} DOM Elements.NOT ARRAY.
		deleteBufferSingle : function( _el ) {
			if( _el.bufferIdx ) {
				delete riff.global.buffer[ _el.bufferIdx ];
				delete _el.bufferIdx;
			};

			var tChildNodes = _el.childNodes;
			for( var k in tChildNodes ) {
				if( tChildNodes[k].nodeType == 1 ) {
					riff.data.deleteBufferSingle( tChildNodes[k] );
				}
			}
			tChildNodes = null;
			return _el;
		},

		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_elm { queryString } CSS QueryString .
		//n @_elm { Array of NodeList } DOM Elements. ARRAY.
		deleteBuffer : function( _elm ) {
			_elm = riff.elmCheck( _elm );
			function tFn ( _el ) {
				riff.data.deleteBufferSingle( _el );
			}
			_elm.forEach( tFn );
			return _elm;
		},
		//n storage base localStorage(PC)
		storage : function(_key, _value){
			if(!_key){
				return null;
			}
			var tStorageObj = window.localStorage;
			if(tStorageObj){
				if(arguments.length == 1){
					return tStorageObj.getItem(_key);
				} else if(arguments.length == 2) {
					tStorageObj.setItem(_key, _value);
				}
			}
			tStorageObj = null;
		}
	}
});

window.$d = riff.data;



riff.extend(
{
	language: {
		langReg: function( _lang, _langListArr ){
			riff.global.language.translateTable[ _lang ] = _langListArr;
			return true;
		},
		translateTableIndexing: function(){
			var tKeyArray = riff.global.language.translateTable["en"];
			function tFn(_el, _idx, _arr){
				_arr[_el] = _idx;
			};
			tKeyArray.forEach(tFn);
			return true;
		},
		translateNodeR: function( _el, _targetStr, _replaceStr ){
			if ( _el.nodeType === 3 || _el.nodeType === 4 ) {
				var tKey = _el.translateKey || _el.nodeValue, 
					tTranslatedStr = "";
				tTranslatedStr = riff.language.translateAtoB( riff.global.language.currentLanguage, tKey );
				if( !tTranslatedStr ) return;
				if( arguments.length > 1 ) {
					tTranslatedStr = riff.util.replaceNoLoop( tTranslatedStr, _targetStr, _replaceStr ); 
				};
				_el.nodeValue = tTranslatedStr;
				if( ! _el.translateKey ) _el.translateKey = tKey;
				tKey = null;
			}
			else 
				if (_el.nodeType === 1) {
					var tChildNode = _el.childNodes,
						tLen = tChildNode.length,
						tFn = riff.language.translateNodeR;
					for( var i = 0; i < tLen; i++) {
 						tFn( tChildNode[ i ], _targetStr, _replaceStr );
					}
					tLen = tFn = tChildNode = null;
				}
			return true;
		},
		translateNodeR2: function( _lang, _el ){
			if ( _el.nodeType === 3 || _el.nodeType === 4 ) {
				var tKey = _el.translateKey || _el.nodeValue;
				_el.nodeValue = riff.language.translateAtoB( _lang, tKey );
				if( ! _el.translateKey ) _el.translateKey = tKey;
				tKey = null;
			}
			else 
				if (_el.nodeType === 1) {
					var tChildNode = _el.childNodes,
						tLen = tChildNode.length,
						tFn = riff.language.translateNodeR2;
					for( var i = 0; i < tLen; i++) {
 						tFn( _lang, tChildNode[ i ] );
					}
					tLen = tFn = tChildNode = null;
				}
			return true;
		},
		translateAllSingle: function( _dom, _targetStr, _replaceStr ){
			if ( !_dom ) return _dom;
			riff.language.translateNodeR( _dom, _targetStr, _replaceStr );
			return _dom;
		},
		translateAllArray: function( _domArray, _targetStr, _replaceStr ){
			if ( !_domArray ) return _domArray;
			function tFn( _el ) { riff.language.translateNodeR( _el, _targetStr, _replaceStr ); };
			_domArray.forEach( tFn );
			return _domArray;
		},
		translateAllFlow: function( _flow, _targetStr, _replaceStr ){
			function tFn( _el )
			{
				riff.language.translateAllComponent( _el, _targetStr, _replaceStr );
			}
			_flow.comps.forEach( tFn );
			return _flow;
		},
		translateAllComponent: function( _component, _targetStr, _replaceStr ){
			var tNodeArray = riff.selector( _component.bodyId );
			if ( !tNodeArray || tNodeArray.length == 0 ) return _component;

			riff.language.translateNodeR( tNodeArray[0], _targetStr, _replaceStr );
			tNodeArray = null;
			_component.lang = riff.global.language.currentLanguage;
			return _component;
		},
		translateAtoB: function(_lang, _key){
			var tLangTable = riff.global.language.translateTable[_lang];
			var tIndex = riff.global.language.translateTable["en"][_key];
			if (!(tLangTable && (tIndex > -1))) {
				rv = "";
			} else {
				rv = tLangTable[tIndex] || "";
			};
			tLangTable = null;
			tIndex = null;
			return rv;
		}
		
	}
});

window.$l = riff.language;



riff.extend(
{
	manipulation : {
		//n @_elm {Array} an array of DOM nodes
		text : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			if( _s && typeof(_s) == "string"){
				var tChilds = [];

				function tFnChild( _elChild ) { _elChild.parentNode.removeChild( _elChild ); };

				function tFnElm( _el ) {
					tChilds = riff.util.toArray( _el.childNodes );
					tChilds.forEach( tFnChild );
					_el.appendChild( document.createTextNode(_s) );
					tChilds = null;
				};

				_elm.forEach( tFnElm );
				return _elm;
			}
			return riff.manipulation.getTextNode( _elm );
		},

		//n Internal Function. (Used by recursive.)
		//n @_elm {Array} an array of DOM nodes
		getTextNode : function ( _elm ) {
			var rText = "";
			_elm.forEach( function( _el2, _idx2 ) {
				if( _el2.nodeType === 3 || _el2.nodeType === 4 )
					rText += _el2.nodeValue;
				else if ( _el2.nodeType !== 8 )
					rText += riff.manipulation.getTextNode( riff.util.toArray( _el2.childNodes ) );
			}) ;

			return rText;
		},
		addClass : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			_s = riff.string.trim(_s);
			var tArrAdd = _s.split( /\s+/ ),
				tArrResult,
				tNewClassName,
				tOld;

			function tFnElm( _el, _idx, _arr ) {
				tOld = _el.className.split( /\s+/ )
				function tFnNew( _addClass ) {
					if( tOld.indexOf( _addClass ) < 0 ) {
						tArrResult.push( _addClass );
					};
				};

				if ( _el.className ) {  //n DOM Element's className exist.
					tArrResult = [ _el.className ];
					tArrAdd.forEach( tFnNew );
					_el.className = tArrResult.join(" ");
				} else {
					//n DOM Element's className do not exist. -> add the classname as new className of the DOM element.
					_el.className = _s;
				}
			};
			_elm.forEach( tFnElm );

			tArrAdd = tArrResult = tNewClassName = tOld = null;
			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} to add in the className of nodes.( ex: "class1 class2" )
		removeClass : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);

			var tArrRm = _s.replace(/^\s+|\s+$/g, "").split(/\s+/),
				tArrResult;

			function tFnClass( _elClass ) {
				if( tArrRm.indexOf( _elClass ) < 0 ) {
					tArrResult.push( _elClass );
				};
			};

			function tFnElm( _el, _idx, _arr ) {
				var tArrOld = _el.className.split(/\s+/);

				if ( tArrOld.length ) {  //n DOM Element's className exist.
					tArrResult = [];
					tArrOld.forEach( tFnClass );
					_el.className = tArrResult.join(" ");
					tArrResult = null;
				}
				tArrOld = null;
			};
			_elm.forEach( tFnElm );
			
			tArrRm = tArrResult = null;
			return _elm;
		},

		//n @_elm {Array} an array of DOM nodes
		hasClass : function ( _elm, _s ) {
			try{
				_elm = riff.elmCheck(_elm);
				//n Checks the validity of the argument
				if( !_s || typeof(_s) != 'string' ) return true;
	
				//n Removes white spaces
				var tArrHas = (_s || "").split( /\s+/ ),
					tClassName,
					tTrim = riff.string.trim ;
	
				function tFnAddSpace( _el, _idx, _arr ){
					_arr[ _idx ] = [ " ", _el, " " ].join(""); 
				};
				tArrHas.forEach( tFnAddSpace );
				
				for( var len = _elm.length, lp = len - 1; lp > -1; lp-- ){
					tClassName = _elm[ lp ].className;
					if (!tClassName || !tTrim(tClassName)) {
						return false;
					};
					tClassName = [ " ", tClassName, " " ].join("");
					for (var len2 = tArrHas.length, lp2 = len2 - 1; lp2 > -1; lp2--) {
						if (tClassName.indexOf(tArrHas[lp2]) < 0) {
							return false;
						};
					}
				};
				return true;				
			} finally {
				tTrim = tClassName = tArrHas = null;
			}
		},

		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} className. ( without space. )
		//n ex: _s : "class1" -> right.
		//n ex: _s : "class1 class2"  -> wrong.
		toggleClass : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			_s = riff.string.trim(_s);
			var tArrTogg = _s.split(/\s+/),
				tArrNew = [];
			
			function tFnElm( _el, _idx, _arr ) {
				var tArrOld = riff.string.trim(_el.className).split(/\s+/);

				if ( tArrOld.length ) {  //n DOM Element's className exist.
					for(var i=0, len = tArrOld.length; i < len; i++){
						if(tArrTogg.indexOf(tArrOld[i])==-1) tArrNew.push(tArrOld[i]);
					}
					
					for(var i=0, len = tArrTogg.length; i < len; i++){
						if(tArrOld.indexOf(tArrTogg[i])==-1) tArrNew.push(tArrTogg[i]);
					}
					_el.className = tArrNew.join(" ");
				} else {
					//n DOM Element's className do not exist. -> add the classname as new className of the DOM element.
					_el2.className = tArrTogg.join(" ");
				}
				tArrOld = null;
			};

			_elm.forEach( tFnElm );
			tArrTogg = tArrNew = null;

			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} a String of HTML codes
		after : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);

			if( !_s || typeof(_s) != "string" ) return _elm;

			function tFnElm(_el, _idx, _arr){
				var tNextNode = _el.nextSibling;
				var tDivNode = document.createElement("div");
				tDivNode.innerHTML = _s;

				while(tDivNode.childNodes[0])
					_el.parentNode.insertBefore(tDivNode.childNodes[0], tNextNode);
				tNextNode = tDivNode = null;
			}

			_elm.forEach(tFnElm);
			
			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} a String of HTML codes
		before : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);

			if( !_s || typeof(_s) != "string" ) return _elm;

			function tFnElm(_el, _idx, _arr){
				var tDivNode = document.createElement("div");
				tDivNode.innerHTML = _s;

				while(tDivNode.childNodes[0])
					_el.parentNode.insertBefore(tDivNode.childNodes[0], _el);
				tDivNode = null;
			}

			_elm.forEach(tFnElm);

			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} a String of HTML codes
		appendStr : function ( _elm, _s ){
			_elm = riff.elmCheck(_elm);

			if( !_s || typeof(_s) != "string" ) return _elm;

			function tFn( _el, _idx, _arr){
				var tChildNode = _el.childNodes;
				if(tChildNode.length == 0){
					_el.innerHTML = _s;
				} else {
					riff.manipulation.after([tChildNode[--tChildNode.length]], _s);
				}
				tChildNode = null;
			};

			_elm.forEach(tFn);

			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} a String of HTML codes
		prependStr : function ( _elm, _s ){
			_elm = riff.elmCheck(_elm);

			if( !_s || typeof(_s) != "string" ) return _elm;

			function tFn( _el, _idx, _arr){
				var tChildNode = _el.childNodes;
				if(tChildNode.length == 0){
					_el.innerHTML = _s;
				} else {
					riff.manipulation.before([tChildNode[0]], _s);
				}
				tChildNode = null;
			};

			_elm.forEach(tFn);

			return _elm;
		},

		//n @_elm {Array} an array of DOM nodes
		//n @_name {String}
		//n @_value {String}
		css : function ( _elm, _key, _value){
			_elm = riff.elmCheck(_elm);

			if (arguments.length == 2) {
				if (typeof(_key) == 'object') {
					function tFnObj(_el, _idx, _arr){
						for (var k in _key) 
							riff.manipulation.css([_el], k, _key[k]);
					};
					
					_elm.forEach(tFnObj);
					
				}
				else 
					if (typeof(_key) == 'string') {
						var tStyle = (_key == 'float') ? 'cssFloat' : riff.string.camelize(_key), rValue = _elm[0].style[tStyle];
						
						if (!rValue || rValue == "auto") {
							var tCss = document.defaultView.getComputedStyle(_elm[0], null);
							rValue = tCss ? tCss[tStyle] : null;
						}
						return rValue;
					}
			}
			else 
				if (arguments.length == 3) {
					var tStyle = (_key == 'float') ? 'cssFloat' : riff.string.camelize(_key);
					
					function tFnStr(_el, _idx, _arr){
						_el.style[tStyle] = _value;
					};
					
					_elm.forEach(tFnStr);
					
					return true;
				}
		},
		//n @_elm {Array} an array of DOM nodes
		each : function( _elm, _fn ){
			_elm = riff.elmCheck(_elm);
			if (riff.util.isArray(_elm)) {
				function tfn( _el ) {
					_fn.call( _el );
				};
				_elm.forEach( tfn );
			} else 
				_fn.call(_elm);
		},
		//n @_elm {Array} an array of DOM nodes
		remove : function ( _elm, _mode ){
			_elm = riff.elmCheck(_elm);
			var tBfName = riff.global.event.bfName, tBf, tFn = null;
			//n remove dom element only 
			function tFnRemove( _domParent1, _domDelete1 ){
				_domParent1.parentNode.removeChild( _domDelete1 );
			};
			tFn = tFnRemove;
			if ( "clear" == _mode ) {
				//n remove dom element and buffer
				function tFnRemoveWithBuffer( _domParent2, _domDelete2 ){
					tBf = riff.data.bufferSingle( _domDelete2, tBfName );	 
					riff.event.eventMemoryFree( tBf );
					riff.data.deleteBufferSingle( _domDelete2 );
					_domParent2.parentNode.removeChild( _domDelete2 );
				};
				tFn = tFnRemoveWithBuffer;
			};
			
			function tFnSelf ( _el, _idx, _arr){
				tFn( _el, _el );
			};
			_elm.forEach(tFnSelf);

			tBfName = tBf = tFn = null;
			return true;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} a String of HTML codes
		wrap : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);

			if( !_s || typeof _s != "string") return _elm;

			function tFnElm(_el, _idx, _arr){
				var tDivNode = document.createElement("div");
				tDivNode.innerHTML = _s;
				var tContentNode = tDivNode.childNodes[0];

				var tCloneNode = _el.tCloneNode(true);
				_el.parentNode.replaceChild(tCloneNode, _el);
				tContentNode.appendChild(_el);

				tCloneNode.parentNode.replaceChild(tContentNode, tCloneNode);
				tDivNode = null;
			}

			_elm.forEach(tFnElm);

			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {String} a String of HTML codes
		wrapAll : function( _elm, _s ){
			_elm = riff.elmCheck(_elm);

			if( !_s || typeof(_s) != "string" ) return _elm;

			riff.manipulation.wrap(_elm, _s);

			function tFnElm(_el, _idx, _arr){
				_el.parentNode.appendChild(_el);
			}

			_elm.forEach(tFnElm);

			return _elm;
		},
		//n @_elm {Array} an array of DOM nodes
		attr : function ( _elm, _key, _attr ) {
			_elm = riff.elmCheck(_elm);

			if( arguments.length == 2 ){
				return ( _elm[0] ) ? _elm[0].getAttribute( _key ) : "";
			} else if ( arguments.length == 3 ) {
				function tFnElm( _el2, _idx2 ) {
					_el2.setAttribute( _key, _attr );
				};
				_elm.forEach( tFnElm );
			}
		},
		createElem : function(_tag, _attr){
			var rElm = document.createElement(_tag);
			
			for(var k in _attr){
				rElm.setAttribute(k, _attr[k]);
			}
			
			return rElm;
		},
		
		createText : function(_s){
			return document.createTextNode(_s);
		},
		//n @_elm { Array } an array of DOM nodes( Parent )
		//n @_node { DOM Element } DOM Element( singular )( Child )
		appendNode : function( _elm, _node){
			_elm = riff.elmCheck(_elm);

			if( _elm.length == 1 ) {
				_elm[0].appendChild( _node );
			} else {
				function tFn(_el ){
					_el.appendChild( _node.cloneNode( true ) );
				};
				_elm.forEach( tFn );
				if( _node.parentNode ) 
					_node.parentNode.removeChild( _node );
				else 
					_node = null;
			} 
			return _elm;
		},	
		//n @_elm {Array} an array of DOM nodes( Parent )
		//n @_node {Array} an array of DOM nodes ( Child )
		appendNodes : function(_elm, _node){
			_elm = riff.elmCheck(_elm);
			var tFrag = document.createDocumentFragment();
			function tFnAppendTarget( _el2 ) {
				tFrag.appendChild( _el2 );
			};
			_node.forEach( tFnAppendTarget ); 

			function tFnAppendSource(_el ){
				_el.appendChild( tFrag.cloneNode(true) );
			}
			_elm.forEach( tFnAppendSource );
			tFrag = null;
			return _elm;
		},	
		//n @_elm {Array} an array of DOM nodes( Parent )
		//n @_node {Array} an array of DOM nodes ( child )		 
		prependNode : function(_elm, _node){
			_elm = riff.elmCheck(_elm);
		
			if( _elm.length == 1 ) {
				_elm[0].insertBefore( _node, _elm[0].firstChild );
			} else {
				function tFn(_el ){
					_el.insertBefore( _node.cloneNode( true ), _el.firstChild );
				};
				_elm.forEach( tFn );
				if( _node.parentNode ) 
					_node.parentNode.removeChild( _node );
				else 
					_node = null;
			} 
			return _elm;
		},
		//n @_elm { DOM Element } DOM nodes( singular )( Parent )
		//n @_node {Array} an array of DOM nodes ( child )		 
		prependNodes : function(_elm, _node){
			_elm = riff.elmCheck(_elm);
			var tFrag = document.createDocumentFragment();
			function tFnPrependTarget( _el2 ) {
				tFrag.appendChild( _el2 );
			};
			_node.forEach( tFnPrependTarget ); 

			function tFnPrependSource(_el ){
				_el.insertBefore( tFrag.cloneNode(true), _el.firstChild );
			}
			_elm.forEach( tFnPrependSource );
			tFrag = null;
			return _elm;			
		}
	}
});

window.$m = riff.manipulation;


riff.extend(
{
	traversal : {
		//n Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
		//n @_elm {Array} an array of DOM nodes
		parent : function ( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();

			function tFn(_el, _idx, _arr){
				for(var i=0; i< rArr.length; i++){
					if(rArr[i] === _el.parentNode) break;
				}
				if(i ==_idx) rArr.push(_el.parentNode);
			};

			_elm.forEach(tFn);
			return riff.traversal.filtering(rArr, _s);
		},
		//n Get the children of each element in the set of matched elements, optionally filtered by a selector.
		//n @_elm {Array} an array of DOM nodes
		children : function( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();

			function tFnElm ( _el, _idx, _arr){
				var tChild = riff.util.toArray(_el.childNodes);
				if( tChild && tChild.length > 0){
					tChild.forEach( tFnChild );
				}
			};

			function tFnChild ( _el, _idx, _arr){
				if(_el.nodeType == 1) rArr.push(_el);
			};

			_elm.forEach( tFnElm );

			return riff.traversal.filtering(rArr, _s);
		},
		//n get the children of each element in the set of matched elements, optionally filtered by a selector.
		//n @_elm {Array} an array of DOM nodes 
		contents : function(_elm, _s){
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();

			function tFnChild ( _el ){
				rArr.push(_el);
			};

			function tFnElm ( _el, _idx, _arr){
				var tChild = riff.util.toArray(_el.childNodes);
				if( tChild && tChild.length > 0){
					tChild.forEach( tFnChild );
				}
				tChild = null;
			};

			_elm.forEach( tFnElm );

			return riff.traversal.filtering(rArr, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		//n @_s {string / number } queryString or number of index for filtering / not filtering.
		//n @_type {string} undefined or null or "" for flitering or "EXCLUDE" for NOT filtering.
		filtering: function ( _elm, _s, _type){
			if ( !_s && typeof( _s ) != "number" ) {		//n if "_s" is 0
				if ( _type == "not" ) 
					return [];
				else {
					return _elm;
				}
			};

			_elm = riff.elmCheck(_elm);
			var rArr = new Array();

			if(arguments.length == 1 || typeof(_s) == "undefined"){
				return _elm;
			} else if( typeof(_s) == "number"){
				function tFnFilter(_el, _idx, _arr){
					if(_idx == _s) rArr.push(_el);
				};
				function tFnNotFilter(_el, _idx, _arr){
					if(_idx != _s) rArr.push(_el);
				}; 
				if( _type == "not" ) {
					_elm.forEach( tFnNotFilter );
				} else {
					_elm.forEach( tFnFilter );
				}
			} else if( typeof(_s) == "string") {

				var tParentArr = [],
					currentDOMArr = [],
					tParentNode;
				//n get the ParentNode list of the _elm 
				function tfnFindParentAndCopyDOM( _el ) {
					currentDOMArr.push( _el );
					tParentNode = _el.parentNode;
					var i, len ;
					for( i = 0 , len = tParentArr.length; i < len; i++ )
					{
						if( tParentArr[ i ] === tParentNode ) break;		//n if same parentNode, do not push it.
					}
					if( i == len ) tParentArr.push( tParentNode );		
				};

				_elm.forEach( tfnFindParentAndCopyDOM );
				tParentNode = null;

				var elmLen = currentDOMArr.length, tFilterList;
				//n compare between _elm( exist DOM Element list ) and parent.querySelectorAll()
				function tfnCompareByFilter( _elParent )
				{
					tFilterList = _elParent.querySelectorAll( _s );
					tFilterList = riff.util.toArray( tFilterList );

					function tfnCompareByFilter2( _elFilterList )
					{
						for( var lp = 0; lp < currentDOMArr.length ; lp++ ) {
							if( currentDOMArr[ lp ]  && ( currentDOMArr[ lp ] === _elFilterList ) ) {
								rArr.push( _elFilterList );		//n if matched, store the matched node for "filter" operation
								currentDOMArr[ lp ] = currentDOMArr[ currentDOMArr.length - 1 ];	//n for "notfilter" operation
								currentDOMArr.pop();																		//n for "notfilter" operation
								break;
							}
						}
					};
					tFilterList.forEach( tfnCompareByFilter2 );
				};

				tParentArr.forEach( tfnCompareByFilter );
				tParentArr = tFilterList = null;
			
				if( _type == "not" ) {
					delete rArr;
					rArr = currentDOMArr;
					return currentDOMArr;
				} else {
					delete currentDOMArr;
					currentDOMArr = null;
				}
			};
			return rArr;
		},
		//n @_elm {Array} an array of DOM nodes
		prev : function ( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();
			
			function tFn(_el, _idx, _arr){
				var tEl = _el.previousSibling;
				
				while(tEl && tEl.nodeType != -1 )
					tEl = tEl.proviousSibling;
					
				if(tEl != null) rArr.push(tEl);
			};
			
			_elm.forEach(tFn);
			
			return riff.traversal.filtering(rArr, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		next : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();
			
			function tFn(_el, _idx, _arr){
				var tEl = _el.nextSibling;
				
				while(tEl && tEl.nodeType != -1 )
					tEl = tEl.nextSibling;
					
				if(tEl != null) rArr.push(tEl);
				tEl = null;
			};
			
			_elm.forEach(tFn);			
			
			return riff.traversal.filtering(rArr, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		find : function( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			
			var _s = riff.string.trim( _s ),
				tChar = _s.charAt(0),
				tIdx = _s.indexOf(" "),
				tArrElm = [],
				tArrTotal = [],
				rArr = [];

			if ( tIdx < 0 ) {		//n no space in the queryString.
				if( ! riff.regexSChar.test(_s.substring(1)) ) {	//n no special character from the other words in the queryString.
					if ( tChar == "."){
						var tFn = function(_el, _idx, _arr){
							var tEl = _el.getElementsByClassName( _s.replace(/\./, ""));
							if(tEl.length > 0) tArrElm.push(tEl);
						};
						_elm.forEach(tFn);
					} else if ( riff.regexChar.test( tChar )){
						var tFn = function(_el, _idx, _arr){
							var tEl = _el.getElementsByTagName( _s );
							if(tEl.length > 0) tArrElm.push(tEl);
						};

						_elm.forEach(tFn);
					} else {
						var tFn = function(_el, _idx, _arr){
							var tEl = _el.querySelectorAll( _s );
							if(tEl.length > 0) tArrElm.push(tEl);
						};
						_elm.forEach(tFn);
					}
				} else {
					var tFn = function(_el, _idx, _arr){
						var tEl = _el.querySelectorAll( _s );
						if(tEl.length > 0) tArrElm.push(tEl);
					};
					_elm.forEach(tFn);
				}
			} else {				//n space exists
				var tFn = function(_el, _idx, _arr){
					var tEl = _el.querySelectorAll( _s );
					if(tEl.length > 0) tArrElm.push(tEl);
				};
				_elm.forEach(tFn);
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

			tArr = tArrTotal = tElm = null;
			
			return rArr;
			//return riff.traversal.filtering(_elm, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		siblings : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();
			var tParenrArr = new Array();

			function tFn(_el, _idx, _arr){
				var tFirstChild = _el.parentNode.firstChild;

				while( tFirstChild ){
					if( tFirstChild.nodeType === 1 && tFirstChild !== _el ){
						tParenrArr.push(tFirstChild);
					}
					tFirstChild = tFirstChild.nextSibling;
				};
				tFirstChild = null;

			};
			_elm.forEach( tFn );

			for(var i=0;i<tParenrArr.length;i++){
				if(rArr.length > 0){
					var tIsSameParent = 0;
					for(var j=0; j<rArr.length; j++){
						if(tParenrArr[i] === rArr[j]) tIsSameParent++;
					}
					if(tIsSameParent == 0) rArr.push(tParenrArr[i])
				} else {
					rArr.push(tParenrArr[i]);
				}
			}

			tParenrArr = null;

			return riff.traversal.filtering( rArr, _s );
		},
		//n @_el { DOM Element } DOM nodes ( singlur ) 
		index : function ( _elm )
		{
			_elm = riff.elmCheck(_elm)[0];
			var currentIndex = 0;
			while( _elm )
			{
				_elm = _elm.previousSibling;
				if (_elm && _elm.nodeType == 1) currentIndex++;
			}
	
			return currentIndex;
		}
	}
}

);

window.$t = riff.traversal;



riff.extend(
{
	event : {
		//n enable, disable DOM Element.
		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_eventType {String} eventType to enable / disable.
		//n @_enableDisable {String} disable event if _enableDisable == "disable". Otherwise, enable the event.
		//n @return {Array} an array of DOM nodes
		enableDisable: function ( _elm, _eventType, _enableDisable )
		{
			var tg = riff.global.event, td = riff.data, _elm = riff.elmCheck(_elm);
			var flag = ( _enableDisable && _enableDisable == "disable" ) ? false : true;
			function tFnEnableDisable( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );
				if( tEvent ) tEvent.isDisable[ _eventType ] = flag;
				tEvent = null;
			};

			_elm.forEach( tFnEnableDisable );
			tg = td = null;
			return _elm;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_eventType {String} eventType to trigger( execute ).
		trigger : function ( _elm, _eventType )
		{
			var tg = riff.global.event, td = riff.data, _elm = riff.elmCheck(_elm);

			function tFnTrigger( _el )
			{
				var tEvent = td.bufferSingle( _el, tg.bfName );
				if( tEvent && tEvent.evFnStart[ _eventType ] && tEvent.evFnStart[ _eventType ][1] ) tEvent.evFnStart[ _eventType ][1].call( _el );
				if( tEvent && tEvent.evFnMove[ _eventType ] && tEvent.evFnMove[ _eventType ][1] ) tEvent.evFnMove[ _eventType ][1].call( _el );
				if( tEvent && tEvent.evFnEnd[ _eventType ] && tEvent.evFnEnd[ _eventType ][1] ) tEvent.evFnEnd[ _eventType ][1].call( _el );
				tEvent = null;
			};
			
			_elm.forEach( tFnTrigger );
			td = null;
			return _elm;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_fn { function } event function handler to run by touchstart event.
		touchStart : function ( _elm, _fn )
		{
			var tg = riff.global.event, te = riff.event, td = riff.data, _elm = riff.elmCheck(_elm);
			function tFnTouchStart( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				//n if there is no "touchStart" event, register "touchstart" and "touchStart" event.
				if( ! ( tEvent && tEvent.evFnRiff && tEvent.evFnRiff[ tg.touchStart ] ) ) {
					//n get a buffer object for the event.
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					//n primary event ("touchstart") register.
					te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
					//n event ("touchStart") execution-check-function register.
					tEvent.evFnRiff[ tg.touchStart ] = [];
					tEvent.evFnRiff[ tg.touchStart ][0] = te.checkTouchStartEnable;
				}
				//n event ("touchStart") execution( event handler ) register.
				tEvent.evFnRiff[ tg.touchStart ][1] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchStart );
			tg = te = td = null;
			return true;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query 
		//n @_fn { function } event function handler to run by touchmove event.
		touchMove : function ( _elm, _fn )
		{
			var tg = riff.global.event, te = riff.event, td = riff.data, _elm = riff.elmCheck( _elm );
			function tFnTouchMove( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				if( ! ( tEvent && tEvent.evFnRiff && tEvent.evFnRiff[ tg.touchMove ] ) ) {
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					te.addPrimaryEvent( _el, tEvent, tg.touchMoveOrMouseDown, te.primaryTouchMove );
					tEvent.evFnRiff[ tg.touchMove ] = [];
					tEvent.evFnRiff[ tg.touchMove ][0] = te.checkTouchMoveEnable;
				}
				tEvent.evFnRiff[ tg.touchMove ][1] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchMove );
			tg = te = td = null;
			return true;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_fn { function } event function handler to run by touchend event.
		touchEnd : function ( _elm, _fn )
		{
			var tg = riff.global.event, te = riff.event, td = riff.data, _elm = riff.elmCheck(_elm);
			function tFnTouchEnd( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				if( ! ( tEvent && tEvent.evFnRiff && tEvent.evFnRiff[ tg.touchEnd ] ) ) {
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					te.addPrimaryEvent( _el, tEvent, tg.touchEndOrMouseDown, te.primaryTouchEnd );
					tEvent.evFnRiff[ tg.touchEnd ] = [];
					tEvent.evFnRiff[ tg.touchEnd ][0] = te.checkTouchEndEnable;
				}
				tEvent.evFnRiff[ tg.touchEnd ][1] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchEnd );
			tg = te = td = null;
			return true;
		},

		//n internal Function
		getEventBuffer : function( _el, _evBf )
		{
			_evBf = riff.data.bufferSingle( _el, riff.global.event.bfName, {} ) ;
			_evBf.primary = [];
			_evBf.evFnRiff = [];					//n touchStart
			_evBf.evFnStart = [];					//n touchStart
			_evBf.evFnMove = [];					//n touchMove
			_evBf.evFnEnd = [];					//n touchEnd
			_evBf.status = {};
			_evBf.toggle = [];
			_evBf.isDisable = [];
			_evBf.destroy = riff.event.eventMemoryFree;
			return _evBf;
		},

		//n internal Function
		evBfFree: function( _evfn )
		{
			for( var k in _evfn ) {
				delete _evfn[k][0];
				delete _evfn[k][1];
			}
		},

		//n internal Function
		eventMemoryFree : function( _evBf )
		{
			var tg = riff.global.event, te = riff.event;
			delete _evBf.primary;
			te.evBfFree( _evBf.evFnStart ); delete _evBf.evFnStart;
			te.evBfFree( _evBf.evFnMove ); delete _evBf.evFnMove;
			te.evBfFree( _evBf.evFnEnd ); delete _evBf.evFnEnd;
			te.evBfFree( _evBf.evFnRiff ); delete _evBf.evFnRiff;
			tg = te = null;
			delete _evBf.status;
			delete _evBf.toggle;
			delete _evBf.isDisable;
			delete _evBf.destroy;
		},

		//n internal Function
		addPrimaryEvent : function( _el, _evBf,  _primaryEventType, _primaryEventFn )
		{
			if ( ! _evBf.primary[ _primaryEventType ] ) {
				_el.addEventListener( _primaryEventType, _primaryEventFn, false );
				_evBf.primary[ _primaryEventType ] = true;
			}
		},

		//n internal Function
		checkTouchStartEnable : function( _evBf, _ev ) {
			if (_evBf.isDisable[riff.global.event.touchStart ] == false ) return false;
			if( _evBf.isDisable[ riff.global.event.touchStart ] )
				return ( _evBf.evFnRiff[ riff.global.event.touchStart ][1] && _evBf.status.touchstart );
			return true;
		},
		//n internal Function
		checkTouchMoveEnable : function( _evBf, _ev ) {
			if (_evBf.isDisable[riff.global.event.touchMove] == false ) return false;
			if (_evBf.isDisable[riff.global.event.touchMove] )
				return (_evBf.evFnRiff[riff.global.event.touchMove][1] && _evBf.status.touchmove);
			return true; 
		},
		//n internal Function
		checkTouchEndEnable : function( _evBf, _ev ) {
			if (_evBf.isDisable[riff.global.event.touchEnd ] == false ) return false;
			if( _evBf.isDisable[ riff.global.event.touchEnd ] )
				return ( _evBf.evFnRiff[ riff.global.event.touchEnd ][1] && _evBf.status.touchend );
			return true; 
		},
		//n internal function
		//n touchstart function for primary "touchstart" ( or mousedown etc ) function.
		primaryTouchStart : function( _ev ) {
			_ev.stopPropagation();
			var tg = riff.global.event, tEvent = riff.data.bufferSingle( this, tg.bfName );
			tEvent.startTime = ( new Date() ).getTime();
			tEvent.status.touchstart = true;
			tEvent.status.touchmove = false;
			tEvent.status.touchend = false;
			
			tEvent.prevX = tEvent.curX = _ev.clientX;
			tEvent.prevY = tEvent.curY = _ev.clientY;
			if( tEvent.evFnRiff[ tg.touchStart ] && tEvent.evFnRiff[ tg.touchStart ][0]( tEvent, _ev ) ) tEvent.evFnRiff[ tg.touchStart ][1].call( this, _ev );
			var tEvFn = tEvent.evFnStart;

			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][0]( tEvent, _ev  ) ) tEvFn[ k ][1].call( this, _ev );
			}
			tg = tEvFn = tEvent = null;
			return true;
		},
		//n internal function
		//n touchstart function for primary "touchmove" ( or mousemove etc ) function.
		primaryTouchMove : function( _ev ) {
			_ev.stopPropagation();
			var tg = riff.global.event, tEvent = riff.data.bufferSingle( this, tg.bfName );
			tEvent.moveTime = ( new Date() ).getTime();
			tEvent.status.touchmove = true;
			tEvent.prevX = tEvent.curX;
			tEvent.prevY = tEvent.curY;
			tEvent.curX = _ev.clientX;
			tEvent.curY = _ev.clientY;
			if( tEvent.evFnRiff[ tg.touchMove ] && tEvent.evFnRiff[ tg.touchMove ][0]( tEvent, _ev ) ) tEvent.evFnRiff[ tg.touchMove ][1].call( this, _ev );
			var tEvFn = tEvent.evFnMove;

			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][0]( tEvent, _ev  ) ) tEvFn[ k ][1].call( this, _ev );
			}
			tg = tEvFn = tEvent = null;
			return true;
		},
		//n internal function
		//n touchstart function for primary "touchup" ( or mouseup etc ) function.
		primaryTouchEnd : function( _ev ) {
			_ev.stopPropagation();
			var tg = riff.global.event, tEvent = riff.data.bufferSingle( this, tg.bfName );
			tEvent.endTime = ( new Date() ).getTime();
			tEvent.status.touchend = true;
			tEvent.prevX = tEvent.curX;
			tEvent.prevY = tEvent.curY;
			tEvent.curX = _ev.clientX;
			tEvent.curY = _ev.clientY;
			if( tEvent.evFnRiff[ tg.touchEnd ] && tEvent.evFnRiff[ tg.touchEnd ][0]( tEvent, _ev ) ) tEvent.evFnRiff[ tg.touchEnd ][1].call( this, _ev );
			var tEvFn = tEvent.evFnEnd;
			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][0]( tEvent, _ev ) ) tEvFn[ k ][1].call( this, _ev );
			}

			if (tEvent && tEvent.status) {
				tEvent.status.touchstart = false;
				tEvent.status.touchmove = false;
				tEvent.status.touchend = false;
			}

			tg = tEvFn = tEvent = null;
			return true;
		},

		extend : function( _newEvent ) {
			for( var k in _newEvent )
			{
				riff.event[k] = _newEvent[k].addEvent;
				riff.event[k].checkEventEnable = _newEvent[k].checkEventEnable;
			}
		}
	}
});

window.$e = riff.event;










riff.event.extend({
	"tap" : {
		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.isDisable[ "tap" ] == false ) return false;
				return ( _evBf.evFnEnd[ "tap" ][1] && _evBf.status.touchstart && _evBf.status.touchend && (!_evBf.status.touchmove) );
			},
		addEvent: 
			function( _elm, _fn, _useFocus ) {
				var tg = riff.global.event, te = riff.event, td = riff.data, tEventName = "tap",
					_elm = riff.elmCheck(_elm);
				if ( !(_useFocus == false)  ) {
					riff.event.touchStart( _elm, function(tItem){ riff.manipulation.addClass( riff.traversal.filtering([this],".rf-status-dim","not"),"rf-status-focus" ); } ); 
					riff.event.touchMove( _elm, function(tItem){ riff.manipulation.removeClass( riff.traversal.filtering([this],".rf-status-dim","not"),"rf-status-focus" ); } );
					riff.event.touchEnd( _elm, function(tItem){ riff.manipulation.removeClass( riff.traversal.filtering([this],".rf-status-dim","not"),"rf-status-focus" ); } );
					
				}; 
				function tFnTap( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evFnEnd && tEvent.evFnEnd[ tEventName ] ) ) {
						if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );
						tEvent.evFnEnd[ tEventName ] = [] ;
						tEvent.evFnEnd[ tEventName ][0] = riff.event[ tEventName ].checkEventEnable;
					}
					tEvent.evFnEnd[ tEventName ][1] = _fn;
					tEvent = tItem = null;
				};

				_elm.forEach( tFnTap );
				tg = te = td = null;
				return true;
		}
	}
});







riff.extend({
	ajax : {
		getAjaxArgsObjInternal : function( _ajaxData ) {
			if ( !_ajaxData.openOption ) _ajaxData.openOption = new Object();
			if ( !_ajaxData.sendOption ) _ajaxData.sendOption = new Object();
			if ( !_ajaxData.success ) _ajaxData.success = new Object();
			if ( !_ajaxData.changeState ) _ajaxData.changeState = new Object();
			if ( !_ajaxData.error ) _ajaxData.error = new Object();
			if ( !_ajaxData.error.exception ) _ajaxData.error.exception = new Object();
			if ( !_ajaxData.error.timeout ) _ajaxData.error.timeout = new Object();
			if ( !_ajaxData.error.retry ) _ajaxData.error.retry = new Object();
			if ( !_ajaxData.error.abort ) _ajaxData.error.abort = new Object();
		},

		retry : function( _readyState, _status ) {	//n Retry handle function.
			var txhr = this.xhr
				, tRetry = this.ajaxData.error.retry
				, tException = this.ajaxData.error && this.ajaxData.error.exception;

			if( typeof( _readyState ) == undefined || typeof( _readyState ) == null ) {
				_readyState = txhr.readyState;
				try { _status = txhr.status; } catch ( e ) { _status = -1; };
			};
			if ( ( tRetry.value > 0 ) && ( this.retryCount < tRetry.value ) ) {
				++ this.retryCount;
				if( tRetry.fn ) tRetry.fn( _readyState, _status, tRetry.args );
				this.request();
			} else {
				if( tException && tException.fn ) tException.fn( _readyState, _status, tException.args );
				this.destroy();
			};
			txhr = tRetry = tException = null;
			return true;
		},
		timeout : function() {	//n Timeout handle function.
			window.clearTimeout( this.timeoutID );
			this.xhr.abort();
			if (this.xhr) {		// not pc.
				var tTimeout = this.ajaxData.error && this.ajaxData.error.timeout;
				if (tTimeout && tTimeout.fn) 
					tTimeout.fn(this.xhr.readyState, tTimeout.args);
				this.retry();
				tTimeout = null;
			}
			return true;
		},
		abortByUser : function() {	//n Abort handle function.
			window.clearTimeout( this.timeoutID );
			var txhr = this.xhr,
				tAbort = this.ajaxData.error.abort,
				tException = this.ajaxData.error && this.ajaxData.error.exception;
			this.abortByUserWorked = true;
			txhr.abort();
			if ( this.xhr ) {		// not pc.
				if (tAbort.fn) 
					tAbort.fn(txhr.readyState, txhr.status, tAbort.args);
				if (tException && tException.fn) 
					tException.fn(txhr.readyState, txhr.status, tException.args);
			}
			tAbort = txhr = tException = null;
			return true;
		},
		request : function () {	//n Open and send data to server.
			var txhr = this.xhr,
				ajaxData = this.ajaxData
				, tOpenData = ajaxData.openOption
				, tSendOption = ajaxData.sendOption
				, tHeaderData = tSendOption && tSendOption.headerData
				, tSendData = tSendOption && tSendOption.tSendData;
			txhr.open( tOpenData.type, tOpenData.url, tOpenData.isAsync );
			txhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
			for ( var k in tHeaderData ) {
				txhr.setRequestHeader( k, ( typeof( tHeaderData[k] ) == "function" ) ? tHeaderData[k]() : tHeaderData[k] );
			};
			//n For the timeout function
			var tThis = this;
			var tTime = this.ajaxData.error && this.ajaxData.error.timeout && this.ajaxData.error.timeout.value;
			var tFnTimeout = this.timeout;
			if( tTime > 0 ) {
				this.timeoutID = setTimeout( function( ) { tFnTimeout.call( tThis ); tThis = tTime = tFnTimeout = null; }, tTime );
			};
			txhr.send( tSendData );
			txhr = ajaxData = tOpenData = tSendOption = tHeaderData = null;
			return true;
		},
		getXMLHttpRequest : function ()	{	//n  Create the XMLHttpRequest object.
			this.xhr = new XMLHttpRequest();
			if ( this.xhr.overrideMimeType ) this.xhr.overrideMimeType( 'text/xml' );
			this.xhr.tThis = this;			//n for the XHttp.onreadystatechange()
			return true;
		},
		retryWithNewXHR : function( readyState, status )		//n create new XMLHttpRequest if needed.
		{
			if ( !( status > 0 ) ) {
				this.xhr.tThis = null;
				delete this.xhr; this.xhr = null;
				riff.ajax.getXMLHttpRequest.call( this );
				this.xhr.onreadystatechange = function(){ this.tThis.onReceive(); };
			}
			this.xhr.abort();
			this.retry( readyState, status );
			return true;
		},

		onReceive : function( ) {		//n receiving data from server.
			var status,
				txhr = this.xhr,
				ajaxData = this.ajaxData,
				tSuccess = ajaxData.success,
				tChange = ajaxData.changeState,
				tException = this.ajaxData.error && this.ajaxData.error.exception ;
			if ( this.abortByUserWorked ) return;		//n if user aborts the transmitting data, DO NOT working by onReceive(). Handle by abortByUser().
			if( txhr.readyState == riff.global.ajax.DONE ) {	//n if the receving ends.
				window.clearTimeout( this.timeoutID );
				if ( ( 200 <= txhr.status && txhr.status < 300 ) ) {	//n the condition of the success.
					if ( tSuccess.resultTextOnly ) {
						tSuccess.fn( txhr.readyState, txhr.status, txhr.responseText, tSuccess.args );
						riff.ajax.eraseConnectedList( this );
					} else {
						tSuccess.fn( txhr.readyState, txhr.status, txhr.responseText, txhr.responseXML, tSuccess.args );
						riff.ajax.eraseConnectedList( this );
					}
					this.destroy();
				} else {
					this.retryWithNewXHR( txhr.readyState, txhr.status );
				}
			} else {
				try { status = txhr.status; } catch ( e ) { status = -1; }
				if ( tChange && tChange.fn ) tChange.fn( txhr.readyState, status, tChange.args );
				if ( !( status == 0 || status == 200 || status == -1 ) ) {		//n if the transmitting failed
					this.retryWithNewXHR( txhr.readyState, status );
				}
			}
			return true;
		},
		eraseConnectedList: function( _this ) {
			var tIdx = riff.global.ajax.connectedList.indexOf( _this );
			if( tIdx > -1 ) {
				delete riff.global.ajax.connectedList[ tIdx ];
				riff.global.ajax.connectedList.splice( tIdx , 1 );
			} 
		},
		destroy : function( _this, _fnMore ) {		//n free the memory that used in the ajax.
			if( !_this ) _this = this;
			function tFnFree( _obj ) {
				if( !_obj ) return false;
				if( _obj.fnJudge ) delete _obj.fnJudge;
				if( _obj.fn ) delete _obj.fn;
				if( _obj.args ) delete _obj.args;
				if( _obj.value ) delete _obj.value;
				return true;
			};
			delete _this.xhr.onreadystatechange; delete _this.xhr;
			var tObj = _this.ajaxData;
			delete tObj.openOption;
			if( tObj.sendOption ) {
				delete tObj.sendOption.headerData;
				delete tObj.sendOption.sendData;
			};
			delete tObj.sendOption;
			tFnFree( tObj.success ); delete tObj.success;
			tFnFree( tObj.changeState ); delete tObj.changeState;
			tObj = _this.ajaxData.error;
			if( tObj ) {
				if( tFnFree( tObj.timeout ) ) delete tObj.timeout;
				if( tFnFree( tObj.retry ) ) delete tObj.retry;
				if( tFnFree( tObj.exception ) ) delete tObj.exception;
				if( tFnFree( tObj.abort ) ) delete tObj.abort; 
			};
			delete _this.ajaxData.error;
			delete _this.ajaxData;
			if( _fnMore ) _fnMore.call( _this );

			delete _this.request;
			delete _this.onReceive;
			delete _this.destroy;
			delete _this.retry;
			delete _this.timeout;
			delete _this.abortByUser;
			delete _this.retryWithNewXHR;
			delete _this.ajaxData;
			delete _this.retryCount;
			delete _this.xhr;
			//n erase from riff.global.ajax.connectedList array
			riff.ajax.eraseConnectedList( _this );
			_this = null;
			delete this;
			tObj = null;
			return true;
		},

		exec : function( _ajaxData ) {		//n constructor

			if( !_ajaxData ) return false;		//n if success callback is not passed by arguments, fail.
			if( !_ajaxData.success || !_ajaxData.success.fn ) return false;		//n if success callback is not passed by arguments, fail.
			if( !_ajaxData.openOption || !_ajaxData.openOption.url ) return false;		//n if  is not passed by arguments, fail.
			if( ! window.XMLHttpRequest ) return false;

			var len = riff.global.ajax.connectedList.length - 1;
			if( len < 0 ) len = 0;
			riff.global.ajax.connectedList.push( new riff.ajax.initInternal( _ajaxData ) );
			riff.global.ajax.connectedList[ riff.global.ajax.connectedList.length - 1 ].request();
			len = null;
		},

		initInternal : function( _ajaxData ) {		//n constructor
			
			riff.ajax.getAjaxArgsObjInternal( _ajaxData );
			var tThisOpts , tUserOpts;

			//n setup default or use setting data by argument.
			this.ajaxData = _ajaxData;
			tThisOpts = this.ajaxData.openOption;
			tUserOpts = _ajaxData.openOption;
			tThisOpts.type = tUserOpts.type || "GET";
			tThisOpts.isAsync = ( typeof( tUserOpts.isAsync ) == "undefined" ) ? true : tUserOpts.isAsync ;
			tThisOpts = this.ajaxData.success;
			this.retryCount = 0;	//n For the retry function, retry counter set to 0.

			riff.ajax.getXMLHttpRequest.call( this );
			this.request = riff.ajax.request;
			this.onReceive = riff.ajax.onReceive;
			this.destroy = riff.ajax.destroy;
			this.retry = riff.ajax.retry;
			this.timeout = riff.ajax.timeout;
			this.abortByUser = riff.ajax.abortByUser;
			this.retryWithNewXHR = riff.ajax.retryWithNewXHR;
			this.xhr.onreadystatechange = function(){ this.tThis.onReceive(); };
		},

		//n search from XML by queryString( _s )
		//n @_xml { XML Object } XML object.
		//n @_s { string } queryString to search from XML object
		//n @return { Array } Array of DOM Elements by searching with _s.
		xmlSelector : function( _xml, _s ) {
			if( !_xml || !_xml.documentElement || !_s ) return null;
			var result = _xml.documentElement.querySelectorAll( _s );
			if( result.length > 0 ) {
				return riff.util.toArray( result );
			} else {
				return [];
			}
		},
		textArray : function ( _elmOrXml, _s ) {
			var _elm;
			if( riff.util.isArray( _elmOrXml ) ) {	//n if _elmOrXml = Array of DOM Elements
				if( _s )
					_elm = riff.traversal.find( _elmOrXml, _s );
				else 
					_elm = _elmOrXml;
			} else {
				_elm = riff.ajax.xmlSelector( _elmOrXml, _s );
			}

			//n under this code, _eml is always Array of DOM Elements 
			var tm = riff.manipulation,
				rArr = [];
			function tFn( _el ) {
				rArr.push( tm.text( [ _el ] ) );
			};
			_elm.forEach( tFn );
			tm = null;
			return rArr;
		},
		//n Abort all the communication. ( Call the abort() for all the ajax communication. ) 
		abortAllAjax : function()
		{
			var ajaxConn = null,
				list = riff.global.ajax.connectedList;
				len = riff.global.ajax.connectedList.length;
				isAbortWork = false;
			function tAbortAll( _el ) { _el.abortByUser(); };
			list.forEach( tAbortAll );
			
			while( list.length > 0 ) {
				if (list[list.length - 1] && list[list.length - 1].destroy) {
					list[list.length - 1].destroy();
				} else {
					list[list.length - 1] = null;
					list.pop();
				}
			};
			
			return true;
		}
	}
});

window.$a = riff.ajax;








riff.extend({
	widget : {
		global : {
			fullW : "480",					
			fullH : "800",
			idleW : "300",
			idleH : "200",
			msgStoptime : 2000,
			effObj : {
				border : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-border"});
				},
				bg : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-bg"});
				},
				arrLeft : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-arrL"});
				},
				arrRight : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-arrR"});
				},
			},
			componentSync : false,
			flowType : "row",
			theme : {
				dir : "http://dev.h9works.com/riff/newriff_mirror/branches/plugin_themeBasic",
				name : "src"
			},
			objs : {
				allMasters : [],
				allComps : [],
				
				fixedComps : [],
				
				master : null,
				comps : [],
				flow : null,
				refreshComps : [],
			},
			className : {
				act : "rf-temp-act",
				actQ : ".rf-temp-act",
			},
			component : {
				className : {
					base : "rf-component",
					header : "rf-component-header",
					list : "rf-component-list",
					item : "rf-component-item",
					tab : "rf-component-tab",
					navigation : "rf-component-navigation",
					softkey : "rf-component-softkey",
					subinfo : "rf-component-subinfo",
					softBackkey : "rf-component-softBackkey",
					softBackkeyEle : "rf-component-softBackkey-ele",
					container : "rf-component-container",
					modal : "rf-component-modal",
					button : "rf-component-button",
					textBox : "rf-component-textBox",
					dim : "rf-component-dim",
					btn : "rf-component-btn",
					ordering : "rf-component-ordering",
					orderingList : "rf-component-ordering-list",
					orderingUp : "rf-component-orderingUp",
					orderingDown : "rf-component-orderingDown",
					checkbox : "rf-component-checkbox",
					checklist : "rf-component-checklist",
					selectAll : "rf-component-selectAll",
					radio : "rf-component-radio",
					radioList : "rf-component-radioList",
					idlePrev : "rf-component-idlePrev",
					idleNext : "rf-component-idleNext",
					idleList : "rf-component-idleList",
					idleIndicator : "rf-component-idleIndicator",
				},
				blankMsg : "No data to display",
				selectAllStr : "Select all",
				failed : "Connection failed",
				changed : "Changed",
				portrait: "Portrait view only",
				atLeast: "At least 1 characters required",
				unavailable : "Network unavailiable",
				noDefaultCategory : "Selected category has been deleted. Tap to set default news category",
				noDcFull : "Selected category has<br>been deleted. You need to<br> select category in settings",
				notRegion : "Yahoo! News could not detect your country - tap to choose your preferred News edition.",
				loadingStr : "Loading...",
			},
			master : {
				className : {
					base : "rf-master",
					basicFull : "rf-master-basicFull",
					basicIdle : "rf-master-basicIdle"					
				},
			},
			exceptionFlag : null,
			ajaxUI : {
				timeout : {
					value : 90000 
				},
				//_destroyObj = Ajax Object;
				failed : function(_readyState,_status,_args,_destroyObj){
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.run("failed");						
						if(_destroyObj) _destroyObj.destroy;		
									
					} else if (riff.widget.global.objs.master.type == "full"){						
						if( riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") ){
							busyindicator.stop();
						}
						var tScene = riff.widget.global.objs.master.scene.cId;
						var tComps = riff.widget.global.objs.flow.comps;
						var tFn = function(_el){
							if(_el.failedFn) _el.failedFn();
						}
						tComps.forEach(tFn);
						msg.start(riff.widget.global.component.failed);						
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				nu : function(_readyState,_status,_args,_destroyObj){
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.run("network");						
						if(_destroyObj) _destroyObj.destroy;		
									
					} else if (riff.widget.global.objs.master.type == "full"){						
						if( riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") ){
							busyindicator.stop();
						}
						msg.start(riff.widget.global.component.unavailable);						
						var tScene = riff.widget.global.objs.master.scene.cId;
						var tComps = riff.widget.global.objs.flow.comps;
						var tFn = function(_el){
							if(_el.failedFn) _el.failedFn(); 
						}
						tComps.forEach(tFn);
						//var tCompInScene = riff.selector(".rf-component.rf-status-visible");
						
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				busyStart : function(_readyState,_status,_args,_destroyObj){
					
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.run("loading");						
						if(_destroyObj) _destroyObj.destoy;					
					} else if (riff.widget.global.objs.master.type == "full"){						
						
						if(riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") == false){						
							busyindicator.start(riff.widget.global.component.loadingStr);				
						}													
						if(_destroyObj) _destroyObj.destroy;
					}
					
				},
				busyEnd : function(_readyState,_status,_args,_destroyObj){
					
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.stop();
						if(idleIndicator.disableObj){
							for( _k in idleIndicator.disableObj){								
								if(idleIndicator.disableObj[_k].enable){
									idleIndicator.disableObj[_k].enable();
								}								
							}
							
							for( _k in idleIndicator.stopObj){								
								idleIndicator.stopObj[_k].start();
							}
						}						
						if(_destroyObj) _destroyObj.destroy;
					
					} else if (riff.widget.global.objs.master.type == "full"){						
						
						busyindicator.stop();																		
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				
			},

			
		},
		isWidget : function(){
			return (typeof widget == "undefined") ? false : true;
		},
		resize : function(_width, _height){
			if(arguments.length < 2){
				_width = riff.widget.global.w;
				_height = riff.widget.global.h;
			}
			if(riff.widget.isWidget()){
				widget.window.resizeWindow(_width, _height);
			} else {
				window.resizeTo(_width, _height);
			}
		},
		openURL : function( _url ) {
			try
			{
				var t = widget && widget.getFullmodeSize();
				if ( t )
					widget.openURL(_url);
				else
					window.location.href = _url;
				t = null;
			}
			catch ( e )
			{
				window.location.href = _url;
			}
			return true;
		},
		convertDate : function(_dateObj){
			if(!_dateObj) _dateObj = new Date();
			var timeCur  = _dateObj;
			 var rv = "";
			
			 var YYYY = (1900 + timeCur.getYear());
			 var MM = (1 + timeCur.getMonth());
			 var DD = timeCur.getDate();
			 var hh24 = timeCur.getHours();
			 var hh = ( hh24 > 12 ) ? hh24 - 12 : hh24;
			 var mm = timeCur.getMinutes();
			 var ampm = ( hh24 >= 12 ) ? "PM" : "AM";
			
			 MM = riff.util.cipherZero( MM ) ;
			 DD = riff.util.cipherZero( DD ) ;
			 hh = riff.util.cipherZero( hh ) ;
			 mm = riff.util.cipherZero( mm ) ;
			
			 var tMcc = riff.widget.global.sample.MCC ? Number( riff.widget.global.sample.MCC ) : 0;
			
			 switch( riff.widget.global.sample.MCC )
			 {
			  case "310" : // us
			  case "311" :
			  case "312" :
			  case "313" :
			  case "314" :
			  case "315" :
			  case "316" :
			   rv = MM + "-" + DD + "-" + YYYY + " " + hh + ":" + mm + " " + ampm;
			   break;
			  case "460" :  // cn
			  case "461" :
			  case "450" : // kr
			  case "" :  
			   rv = YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + " " + ampm;
			   break;
			  default :  
			   rv = DD + "-" + MM + "-" + YYYY + " " + hh + ":" + mm + " " + ampm;
			 }
			 return rv;
		},		
		currentTimeParsing : function ( _timeString )
		{
			try{
				if(_timeString){
					 var ymdmds = _timeString.split( 'T' );
					 var ymd = ymdmds[0].split( '-' );
					 var YYYY = ymd[0].toString();
					 var MM = ymd[1].toString();
					 var DD = ymd[2].toString();
					 var mds = ymdmds[1].substring( 0, _timeString.indexOf( 'Z' ) );
					 mds = mds.split( ':' );
					 var hh = mds[0].toString();
					 var mm = mds[1].toString();
					
					 return riff.widget.convertDate( new Date( YYYY, MM - 1, DD, hh, mm ) );
				}
			} catch( ec ) {
				return _timeString;
			}
		},
		endKeyfn : function(){
			riff.ajax.abortAllAjax();
			flowInit.run("back");
			busyindicator.stop();
			
			function tFn(_el){
				if(_el.disable){
					_el.disable();
				}	
			}
			flowIdle3.comps.forEach( tFn );
			
			
		}
		

		
	}
});



//n if Widget, riff.data.storage overwrite
if(riff.widget.isWidget()){
	//Widget Endkey
	widget.addEventListener("widgetendkey", riff.widget.endKeyfn, false);
	
	//n widget storage(overwrite riff.data.storage) : dummy code
	riff.extend( { 
		data : {
 			storage : function(_key, _value){
				if (!_key) {
					return null;
				};
				function setf1(_key, _value ){	
					var t = widget.setPreferenceForKey( _value, _key );
					return t;
				};
				function getf1( _key ){	
					var t = widget.preferenceForKey( _key );
					return t;
				};
				if (arguments.length == 1) {
					return getf1( _key );
				}
				else {
					return setf1( _key, _value );
				}
			}
		}
	}, true );
 
};

//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//



riff.extend({
	widget : {
		isNetworkAvailable : function()
		{
			try{
				return widget.sysInfo.network.getIsNetworkAvailable();
			} 
			catch(e) {
				return true;
			}
		},
		getLanguage : function() {
			try {
				return window.widget.sysInfo.getLanguage();
			} catch( e ) {
				return false;
			}
		},
		getLanguageList : function() {
			try {
				return window.widget.sysInfo.getLanguage().toLowerCase();
			} catch( e ) {
				return false;
			}
		},
		getMccMnc : function() {
			try {
				return widget.sysInfo.SIM.getMccMnc();
			} catch( e ) {
				return false;
			}
		},
		getCurrentDirection : function()		//n get the "horizontal" or "vertical"( portrait ) mode
		{
			try{
				return widget.window.getCurrentDirection();
			} catch(e){
				return null;
			}
		},
		
		error_notify : function(_param)		//e Forcefully terminates the network use by a mobile phone. 
		{
			try{
				widget.window.error.notify(_param);
				return true;
			}catch(e){
				return false;
			}
		},
		getFullmodeSize : function()		//n get full mode size( "width_On_PortraitMode, height_On_PortraitMode, width_On_horizontal_Mode, height_On_horizontal_Mode" )
		{
			try {
				return widget.getFullmodeSize().split(",");
			} catch (e) {
				return null;
			}
		}
	}
});

window.$w = riff.widget;


