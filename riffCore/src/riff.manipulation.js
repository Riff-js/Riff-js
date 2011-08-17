
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
			var tBfName = riff.event.constString.bfName, tBf, tFn = null;
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
		//n @_elm { DOM Element } DOM nodes( singular )( Parent )
		//n @_node { Array } an array of DOM nodes( Child )

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
