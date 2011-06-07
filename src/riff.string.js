// riff.string.js
// version : v0.0.1
// revision : 693

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
		}
	}

}

)
