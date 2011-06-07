// riff.util.js
// version : v0.0.1
// revision : 693

riff.extend(
{
	util : {

		//n Determine whether the argument is an array.
		//n @_obj {Object}
		//n @return {Boolean}
		isArray : ("isArray" in Array) ? Array.isArray : function ( _obj ){
			return toString.call(_obj) === "[object Array]";
			//return _obj instancof Array;
		},

		//n Nodelist -> Array
		toArray : function( _obj ) {
			return Array.prototype.slice.call( _obj );
		}

	}

}

)
