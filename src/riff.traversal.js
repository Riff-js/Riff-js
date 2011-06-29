
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

			function tFnElm ( _el, _idx, _arr){
				var tChild = riff.util.toArray(_el.childNodes);
				if( tChild && tChild.length > 0){
					tChild.forEach( tFnChild );
				}
			};

			function tFnChild ( _el, _idx, _arr){
				rArr.push(_el);
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
				tFilterList = null;
			
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



			tArr = null;
			tArrTotal = null;
			tElm = null;
			
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

)
