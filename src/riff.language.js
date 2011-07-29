
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

