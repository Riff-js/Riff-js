
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
		translateNodeR: function( _el ){
			if (_el.translateKey && (_el.nodeType === 3 || _el.nodeType === 4)) {
				_el.nodeValue = riff.language.translateAtoB( riff.global.language.currentLanguage, _el.translateKey );
			}
			else 
				if (_el.nodeType === 1) {
					var tChildNode = riff.util.toArray(_el.childNodes);
					tChildNode.forEach( riff.language.translateNodeR );
					tChildNode = null;
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
		
		translateAllSingle: function(_lang, _dom, _className){
			if ( _className ) {
				var tNodeArray = riff.traversal.find([_dom], _className);
				function tFn( _el )
				{
					riff.language.translateNodeR2( _lang, _el );
				}
				tNodeArray.forEach( tFn );
				tNodEArray = null;
			} else {
				riff.language.translateNodeR2( _lang, _dom );
			}
			return _dom;
		},
		translateAllArray: function(_lang, _domArray, _className){
			var tNodeArray = _domArray;
			if (_className) {
				_tNodeArray = riff.traversal.find(_domArray, _className);
			};
			function tFn( _el ) { riff.language.translateNodeR2( _lang, _el ); };
			tNodeArray.forEach( tFn );
			tNodeArray = null;
			return _domArray;
		},
		translateAllFlow: function(_lang, _flow, _className){
			var tNodeArray = [],
			tFnTrans = riff.language.translateNodeR2;
			function tFnToDOMArray( _el ) {
				tNodeArray.push( riff.selector( _el.cId )[0] );
			};
			_flow.actComponent.forEach( tFnToDOMArray );
			if ( _className ) {
				tNodeArray = riff.traversal.find( tNodeArray, _className );
			};
			function tFnTranslate( _el ) { tFnTrans( _lang, _el ); };
			tNodeArray.forEach( tFnTranslate );
			tNodeArray = tFnTrans = null;
			return _flow;
		},
		translateAtoB: function(_lang, _key){
			var tLangTable = riff.global.language.translateTable[_lang];
			var tIndex = riff.global.language.translateTable["en"][_key];
			if (!(tLangTable && (tIndex > -1))) {
				rv = _key;
			} else {
				rv = tLangTable[tIndex] || _key;
			};
			tLangTable = null;
			tIndex = null;
			return rv;
		}
	}
});


