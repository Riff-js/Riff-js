// riff.event.js
// version : v0.0.1
// revision : 693

riff.extend(
{
	event : {
		//n
		//n @_elm {Array} an array of DOM nodes
		tap : function ( _elm, _fn ) {
			_elm = riff.elmCheck(_elm);
	
			function tFnEventAdd( _el2, _idx ) {
				var tevFn = riff.data.buffer( [ _el2 ], "_evFn" );
				if ( tevFn ) {
					_el2.removeEventListener( "click", tevFn, false ); 
				} else {
				};

				riff.data.buffer( [_el2], "_evFn", _fn );
				_el2.addEventListener( "click", riff.data.buffer( [ _el2 ], "_evFn" ), false ); 
				tevFn = null;
			};
			_elm.forEach( tFnEventAdd );
		}
	}
});