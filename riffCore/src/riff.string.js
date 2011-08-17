
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
		
		ellipsis : function( _str, _num, _isArabic, _opt ){
			var ch = _opt || "...",
				L = "",
				R = ch,
				_str = riff.string.trim(_str),
				len1 = _str.length,
				len2 = riff.string.stringByteSize(_str);
			if( _isArabic ) {
				L = ch; 
				R = "";
			};
			
			if(len1 < len2) _num = _num / 2;
			
			return (len1 > _num)? L + _str.substring(0,_num) + R : _str;
		},
		ellipsisText : function(_elm, _len, _opt){
			_elm = riff.elmCheck(_elm);
			
			var tFn = function(_el, _idx, _arr){
				var tElm = riff.traversal.contents([_el]);
				
				if(tElm.length > 0){
					tElm.forEach(tFn);
				} else {
					_el.nodeValue = riff.string.ellipsis(_el.nodeValue, _len, null, _opt);
				}
			};
			
			_elm.forEach(tFn);
			
			tFn = null;
		},
		charByteSize : function(_c){
			if (_c == null || _c.length == 0) {
				return 0;
			}
	
			var charCode = _c.charCodeAt(0);
	
			if (charCode <= 0x00007F) {
				return 1;
			} else if (charCode <= 0x0007FF) {
				return 2;
			} else if (charCode <= 0x00FFFF) {
				return 3;
			} else {
				return 4;
			}
		},
		stringByteSize : function(_s){
			if(_s == null || _s.length == 0){
				return 0;
			}
			
			var cnt = 0;
			
			for(var i=0;i<_s.length;i++){
				cnt += riff.string.charByteSize(_s.charAt(i));
			}
			
			return cnt;
		}
	}
}

);

window.$s = riff.string;
