riff.extend(
{
	traversal :
	{
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

			return riff.traversal.filter(rArr, _s);
		},
		//n Get the children of each element in the set of matched elements, optionally filtered by a selector.
		//n @_elm {Array} an array of DOM nodes
		children : function( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			var rArr = new Array();

			function tFn1 ( _el, _idx, _arr){
				var tChild = riff.nodeListToArray(_el.childNodes);
				if( tChild && tChild.length > 0){
					tChild.forEach( tFn2 );
				}
			};

			function tFn2 ( _el, _idx, _arr){
				if(_el.nodeType == 1) rArr.push(_el);
			};

			_elm.forEach( tFn1 );

			return riff.traversal.filterOrNot(rArr, _s);
		},
		//n Internal Function
		//n @_elm {Array} an array of DOM nodes
		filterOrNot : function ( _type, _elm, _s){
			var rArr = new Array();

			if(arguments.length == 1 || typeof(_s) == "undefined"){
				return _elm;
			}
			if( typeof(_s) == "number"){

				function tFn1(_el, _idx, _arr){
					if(_idx == _s) rArr.push(_el);
				};

				function tFn2(_el, _idx, _arr){
					if(_idx != _s) rArr.push(_el);
				};

				if( _type == "NOT" ){
					_elm.forEach(tFn2);
				} else {
					_elm.forEach(tFn1);
				}
			} else if( typeof(_s) == "string") {
				function tFn1 (_el, _idx, _arr){
					var tempElm = _el.parentNode.querySelectorAll( _s );
					for(var i=0 ; i< tempElm.length; i++){
						if( _el === tempElm[i]) {
							rArr.push(_el);
							break;
						}
					}
				};
				function tFn2 (_el, _idx, _arr){
					var tempElm = _el.parentNode.querySelectorAll( _s );
					for(var i=0 ; i< tempElm.length; i++){
						if( _el !== tempElm[i]) {
							rArr.push(_el);
							break;
						}
					}
				};

				if( _type == "NOT" ){
					_elm.forEach(tFn2);
				} else {
					_elm.forEach(tFn1);
				}
			} else {
				function tFn1 (_el, _idx, _arr){
					for(var i=0; i < _s.length ; i++){
						if( _el === _s[i] ) rArr.push(_el);
					}
				};

				function tFn2 (_el, _idx, _arr){
					for(var i=0; i < _s.length ; i++){
						if( _el !== _s[i] ) rArr.push(_el);
					}
				};

				if( _type == "NOT" ){
					_elm.forEach(tFn2);
				} else {
					_elm.forEach(tFn1);
				}
			}

			return rArr;
		},
		//n Reduce the set of matched elements to those that match the selector or pass the function's test.
		//n @_elm {Array} an array of DOM nodes
		filter : function ( _elm , _s ){
			_elm = riff.elmCheck(_elm);
			if ( !_s ) return _elm;			//n if there is no filtering, return the DOM Elements ( _elm );
			return riff.traversal.filterOrNot("", _elm, _s);
		},
		//n Remove elements from the set of matched elements.
		//n @_elm {Array} an array of DOM nodes
		not : function(_elm, _s){
			_elm = riff.elmCheck(_elm);
			if ( !_s ) return _elm;			//n if there is no filtering, return the DOM Elements ( _elm );
			return riff.traversal.filterOrNot("NOT", _elm, _s);
		},


		//n @_elm {Array} an array of DOM nodes
		prev : function ( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			var tArr = new Array();

			for(var i=0; i < _elm.length ; i++ ){
				tArr[i] = _elm[i].previousSibling;

				while(tArr[i] && tArr[i].nodeType != 1)
					tArr[i] = tArr[i].previousSibling;
			}

			return riff.traversal.filter(tArr, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		next : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			var tArr = new Array();

			for(var i=0; i < _elm.length ; i++ ){
				tArr[i] = _elm[i].nextSibling;

				while(tArr[i] && tArr[i].nodeType != 1)
					tArr[i] = tArr[i].nextSibling;
			}

			return riff.traversal.filter(tArr, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		find : function( _elm, _s ){
			_elm = riff.elmCheck(_elm);
			return riff.traversal.filter(_elm, _s);
		},
		//n @_elm {Array} an array of DOM nodes
		siblings : function ( _elm, _s ) {
			_elm = riff.elmCheck(_elm);
			var tArr = new Array();
			var tParentArr = new Array();

			function tFn(_el, _idx, _arr){
				var tFirstChild = _el.parentNode.firstChild;

				while( tFirstChild ){
					if( tFirstChild.nodeType === 1 && tFirstChild !== _el ){
						tParentArr.push(tFirstChild);
					}
					tFirstChild = tFirstChild.nextSibling;
				};
				tFirstChild = null;

			};
			_elm.forEach( tFn );

			for(var i=0;i<tParentArr.length;i++){
				if(tArr.length > 0){
					var tIsSameParent = 0;
					for(var j=0; j<tArr.length; j++){
						if(tParentArr[i] === tArr[j]) tIsSameParent++;
					}
					if(tIsSameParent == 0) tArr.push(tParentArr[i])
				} else {
					tArr.push(tParentArr[i]);
				}
			}

			tParentArr = null;

			return riff.traversal.filter( tArr, _s );
		}
	}
}

)
