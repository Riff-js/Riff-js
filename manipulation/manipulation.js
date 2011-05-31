riff.extend(
	{
		manipulation : {
			//n @_elm {Array} an array of DOM nodes
			text : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);
				if( _s ) {
					var tChilds = [];

					function tFn1( _el2 ) {
						tChilds = riff.util.nodeListToArray( _el2.childNodes );
						function tFn2( _el3 ) { _el2.removeChild( _el3 ); };
						tChilds.forEach( tFn2 );
						_el2.appendChild( document.createTextNode(_s) );
					};

					_elm.forEach( tFn1 );
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
						rText += riff.manipulation.getTextNode( riff.util.nodeListToArray( _el2.childNodes ) );
				}) ;

				return rText;
			},
			//n @_elm {Array} an array of DOM nodes
			//n _s {String} to add in the className of nodes.( ex: "class1 class2" )
			addClass : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);
				_s = riff.string.trim(_s);

				var tArrNew = tNew.split( /\s+/ ),
					tArr;

				function tFn1( _el2, idx2, _elArr2 ) {
					var tOld = _el2.className;
					function tFn2( _el3 ) {
						if( tOld.indexOf( _el3 ) < 0 ) {
							tArr.push( _el3 );
						};
					};

					if ( tOld ) {  //n DOM Element's className exist.
						tArr = [tOld];
						tArrNew.forEach( tFn2 );
						_el2.className = tArr.join(" ");
					} else {
						//n DOM Element's className do not exist. -> add the classname as new className of the DOM element.
						_el2.className = _s;
					}
				};
				_elm.forEach( tFn1 );

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} to add in the className of nodes.( ex: "class1 class2" )
			removeClass : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);

				var addClassName = _s.replace(/^\s+|\s+$/g, ""),
					tArr;

				function tFn1( _el2, idx2, _elArr2 ) {
					var elClassName = _el2.className,
						elClassNames = elClassName.split( /\s+/ );

					function tFn2( _el3 ) {
						if( addClassName.indexOf( _el3 ) < 0 ) {
							tArr.push( _el3 );
						};
					};

					if ( elClassName ) {  //n DOM Element's className exist.
						tArr = [];
						elClassNames.forEach( tFn2 );
						_el2.className = tArr.join(" ");
					}

				};
				_elm.forEach( tFn1 );

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			hasClass : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);
				//n Checks the validity of the argument
				if( !_s || typeof(_s) != 'string' ) return true;

				//n Removes white spaces
				var classNames = (_s || "").split( /\s+/ );
				function tFn(_el, _idx, _arr){
					for(var i=0;i<classNames.length;i++)
						if( (" " + _el.className + " " ).indexOf( " " + classNames[i] + " ") == -1)
							return false
				};

				_elm.forEach(tFn);

				return true;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} className. ( without space. )
			//n ex: _s : "class1" -> right.
			//n ex: _s : "class1 class2"  -> wrong.
			toggleClass : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);

				var addClassName = _s.replace(/^\s+|\s+$/g, ""),

				function tFn( _el2, idx2, _elArr2 ) {
					var elClassName = _el2.className;

					if ( elClassName ) {  //n DOM Element's className exist.
						var t = elClassName.indexOf( addClassName ) ;
						if( t == -1 ) {
							//n add new classname to the DOM element.
							_el2.className = [ elClassName, " ", addClassName ].join("");
						} else {
							//n if not matched, add classname as string.
							_el2.className = [ elClassName.substring( 0, t - 1) , elClassName.substring( t + addClassName.length ) ].join("");
						}
					} else {
						//n DOM Element's className do not exist. -> add the classname as new className of the DOM element.
						_el2.className = addClassName;
					}
				};

				_elm.forEach( tFn );
				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} a String of HTML codes
			after : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);

				if( !_s || typeof(_s) != "string" ) return _elm;

				function tFn(_el, _idx, _arr){
					var nextNode = _el.nextSibling;
					var divNode = document.createElement("div");
					divNode.innerHTML = _s;

					while(divNode.childNodes[0])
						_el.parentNode.insertBefore(divNode.childNodes[0], nextNode);
					divNode = null;
				}

				_elm.forEach(tFn);

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} a String of HTML codes
			before : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);

				if( !_s || typeof(_s) != "string" ) return _elm;

				function tFn(_el, _idx, _arr){
					var divNode = document.createElement("div");
					divNode.innerHTML = _s;

					while(divNode.childNodes[0])
						_el.parentNode.insertBefore(divNode.childNodes[0], _el);
					divNode = null;
				}

				_elm.forEach(tFn);

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} a String of HTML codes
			append : function ( _elm, _s ){
				_elm = riff.elmCheck(_elm);

				if( !_s || typeof(_s) != "string" ) return _elm;

				function tFn( _el, _idx, _arr){
					var childNode = _el.childNodes;
					if(childNode.length == 0){
						_el.innerHTML = _s;
					} else {
						riff.mainpulation.after([childNode[--childNode.length]], _s);
					}
					childNode = null;
				};

				_elm.forEach(tFn);

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} a String of HTML codes
			prepend : function ( _elm, _s ){
				_elm = riff.elmCheck(_elm);

				if( !_s || typeof(_s) != "string" ) return _elm;

				function tFn( _el, _idx, _arr){
					var childNode = _el.childNodes;
					if(childNode.length == 0){
						_el.innerHTML = _s;
					} else {
						riff.mainpulation.before([_el], _s);
					}
					childNode = null;
				};

				_elm.forEach(tFn);

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_name {String}
			//n @_value {String}
			css : function ( _elm, _name, _value){
				_elm = riff.elmCheck(_elm);

				if(arguments.length == 2){
					if ( typeof(_name) == 'object'){
						function tFn(_el, _idx, _arr){
							for(var k in _name)
								riff.mainpulation.css([_el], k, _name[k]);
						};

						_elm.forEach(tFn);

					} else if (typeof(_obj) == 'string') {
						var _style = (_name == 'float') ? 'cssFloat' : riff.camelize(_name);

						return _elm[0].style[_style];
					}
				} else if(arguments.length == 3){
					var _style = (_name == 'float') ? 'cssFloat' : riff.camelize(_name);

					function tFn(_el, _idx, _arr){
						_el.style[ _style ] = _value;
					};

					_elm.forEach(tFn);

					return true;
				}
			},
			//n @_elm {Array} an array of DOM nodes
			each : function( _elm, _fn ){
				_elm = riff.elmCheck(_elm);
				if ( riff.isArray(_elm) )
					_elm.forEach( _fn );
				else
					_fn.call( _elm );
			},
			//n @_elm {Array} an array of DOM nodes
			remove : function ( _elm, _s ){
				_elm = riff.elmCheck(_elm);
				_s = riff.elmCheck(_s);

				if(!_s){
					function tFn1 ( _el, _idx, _arr){
						_el.parentNode.removeChild(_el);
					};

					_elm.forEach(tFn1);
				} else {
					if(typeof _s == "number"){
						_elm[_s].parentNode.removeChild(_elm[_s]);
					} else if(typeof _s == "object"){
						function tFn2( _el, _idx, _arr){
							for(var i=0; i<_s.length;i++){
								if(_el === _s[i]) _el.parentNode.removeChild(_s[i]);
							}
						}

						_elm.forEach(tFn2);
					}
				}

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} a String of HTML codes
			wrap : function ( _elm, _s ) {
				_elm = riff.elmCheck(_elm);

				if( !_s || typeof _s != "string") return _elm;

				function tFn(_el, _idx, _arr){
					var divNode = document.createElement("div");
					divNode.innerHTML = _s;
					var contentNode = divNode.childNodes[0];

					var cloneNode = _el.cloneNode(true);
					_el.parentNode.replaceChild(cloneNode, _el);
					contentNode.appendChild(_el);

					cloneNode.parentNode.replaceChild(contentNode, cloneNode);
					divNode = null;
				}

				_elm.forEach(tFn);

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			//n @_s {String} a String of HTML codes
			wrapAll : function( _elm, _s ){
				_elm = riff.elmCheck(_elm);

				if( !_s || typeof(_s) != "string" ) return _elm;

				riff.mainpulation.wrap(_elm, _s);

				function tFn(_el, _idx, _arr){
					_el.parentNode.appendChild(_el)
				}

				_elm.forEach(tFn);

				return _elm;
			},
			//n @_elm {Array} an array of DOM nodes
			height : function( _elm, _s ) {
				_elm = riff.elmCheck(_elm);

				if( !_s ) {
					if ( RegExp(/Firefox/).test(navigator.userAgent) ) {
						// firefox
						return window.parseFloat(_elm[0].ownerDocument.defaultView.getComputedStyle(_elm[0], null).getPropertyValue("height"));
					} else {
						// other Browser
						return window.parseFloat(window.getComputedStyle(_elm[0], null).getPropertyValue("height"));
					}
				}

				//n If the user does not input the css value string, the riff object is returned and the function ends
				if( isNaN( window.parseFloat(_s) ) ) return _elm;

				return riff.mainpulation.css(_elm, "height", window.parseFloat(_s) + "px");
			},
			//n @_elm {Array} an array of DOM nodes
			width : function( _elm, _s ){
				_elm = riff.elmCheck(_elm);

				if( !_s ) {
					if ( RegExp(/Firefox/).test(navigator.userAgent) ) {
						// firefox
						return window.parseFloat(_elm[0].ownerDocument.defaultView.getComputedStyle(_elm[0], null).getPropertyValue("width"));
					} else {
						// other Browser
						return window.parseFloat(window.getComputedStyle(_elm[0], null).getPropertyValue("width"));
					}
				}

				//n If the user does not input the css value string, the riff object is returned and the function ends
				if( isNaN( window.parseFloat(_s) ) ) return _elm;

				return riff.mainpulation.css(_elm, "width", window.parseFloat(_s) + "px");
			},
			//n @_elm {Array} an array of DOM nodes
			top : function( _elm, _s ) {
				_elm = riff.elmCheck(_elm);
				if( !_s ) {
					if ( RegExp(/Firefox/).test(navigator.userAgent) ) {
						// firefox
						return window.parseFloat(_elm[0].ownerDocument.defaultView.getComputedStyle(_elm[0], null).getPropertyValue("top"));
					} else {
						// other Browser
						return window.parseFloat(window.getComputedStyle(_elm[0], null).getPropertyValue("top"));
					}
				}
				//n If the user does not input the css value string, the riff object is returned and the function ends
				if( isNaN( window.parseFloat(_s) ) ) return _elm;

				return riff.mainpulation.css(_elm, "top", window.parseFloat(_s) + "px");
			},
			//n @_elm {Array} an array of DOM nodes
			left : function( _elm, _s ) {
				_elm = riff.elmCheck(_elm);
				if( !_s ) {
					if ( RegExp(/Firefox/).test(navigator.userAgent) ) {
						// firefox
						return window.parseFloat(_elm[0].ownerDocument.defaultView.getComputedStyle(_elm[0], null).getPropertyValue("left"));
					} else {
						// other Browser
						console.log(window.getComputedStyle(_elm[0], null).getPropertyValue("left"));
						return window.parseFloat(window.getComputedStyle(_elm[0], null).getPropertyValue("left"));
					}
				}
				//n If the user does not input the css value string, the riff object is returned and the function ends
				if( isNaN( window.parseFloat(_s) ) ) return _elm;

				return riff.mainpulation.css(_elm, "left", window.parseFloat(_s) + "px");
			},
			//n @_elm {Array} an array of DOM nodes
			attr : function ( _elm, _name, _attr ) {
				_elm = riff.elmCheck(_elm);

				if( arguments.length == 2 )
					return ( _elm[0] ) ? _elm[0].getAttribute( _name ) : "";
				else if ( arguments.length == 3 )
				{
					function tFn( _el2, _idx2 ) {
						_el2.setAttribute( _name, _attr );
					};
					_elm.forEach( tFn );
				}
			}
		}
	}
);