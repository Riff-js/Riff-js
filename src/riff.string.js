
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

)
