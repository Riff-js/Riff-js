riff.extend({
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
		},
		pop : function(_arr, _obj){
			if(typeof _obj != "undefined"){
				var tIdx = _arr.indexOf(_obj);
				if(tIdx > -1) return _arr.splice(tIdx,1);			
			} else {
				return _arr.pop();
			}
		},
		push : function(_arr, _obj, _idx){
			if(_obj){
				var tIdx = _arr.indexOf(_obj);
				if(tIdx == -1){
					if(_idx){
						var tArr = _arr.splice(_idx);
						_arr.push(_obj);
						_arr = _arr.concat(tArr);
					} else {
						_arr.push(_obj);
					}
				}
				tIdx = null;
			}
			return _arr;
		},
		//n Determine whether the argument is an array.
		//n @_fnOrId { string or number or function } function to execute.
		//n @_time { number } timerInterval's exection interval for funciton( millisecond )
		//n @_id { string } timerInterval's funciton id to delete.
		//n example : riff.util.timer( foo, 1000 );		// function foo with timerinterval 1000ms. 
		//n example : riff.util.timer( foo, 1000, "id1" );		// function foo with timerinterval 1000ms and id is "id1".
		//n example : riff.util.timer( "id1" );		// delete the "id1" timerinterval.
		timer : function( _fnOrID, _time, _id )
		{
			//n when user want to delete timer.
			if ( arguments.length == 1 ) {
				clearInterval( riff.global.timerList[ _fnOrID ] );
				if (riff.global.timerList[_fnOrID]) {
					riff.util.pop(riff.global.timerList, riff.global.timerList[_fnOrID]);
				}
				return true;
			};

			//n when user want to create timer.
			var count = 0;
			var timeoutID = ( _time ) ? 
				setInterval( function( ){ _fnOrID.call( this, ++count ); } , _time ) 
				: setInterval( _fnOrID, 0 );
			if( _id ) 
				return riff.global.timerList[ _id ] = timeoutID;
			else  
				return riff.global.timerList[ timeoutID ] = timeoutID;
		},
		cloneObject : function(what) {
			if ( riff.util.isArray( what ) )
				return what.slice( 0 );
			else
				for (i in what) {
					if ( riff.util.isArray( what[i] ) ) {
						this[i] = what[i].slice( 0 );
					} else if (typeof what[i] == 'object') {
						this[i] = new riff.util.cloneObject(what[i]);
					}
					else
						this[i] = what[i];
				}
		},

		cipherZero : function(_num){
			return ( _num > 9 ) ? _num : "0" + _num;
		},
		replaceNoLoop : function( _str, _from, _to )
		{
			if( !_from || _from == _to ) return _str;
		
			try {
				_to += "";			
				if( _to && (_to.indexOf( _from )  > - 1) ) return ""; 
		
				var rv = _str;
		
				while(  rv.indexOf( _from )  > -1 ) {
					rv  = rv.replace( _from, _to );
				};
				return rv;
			} catch ( e ) {
				return _str;
			}
		},
		compareArr : function(_arr1, _arr2){
			if(riff.util.isArray(_arr1) && riff.util.isArray(_arr2)){
				var t = _arr1.length - _arr2.length;
				if(t == 0){
					if(_arr1.sort().join(",") == _arr2.sort().join(",")){
						return -1;
					} else {
						return 0;
					}
				} else if(t > 0){
					return 0;
				} else {
					return 1;
				}
			}
		}
	}
});

window.$u = riff.util;



