riff.extend(
	{
		event : {
			//n
			//n @_elm {Array} an array of DOM nodes
			tap : function ( _elm, _fn ) {
				_elm = riff.elmCheck(_elm);
				function tFn( _el2, _idx ) {
					_el2.addEventListener( "click",
						function( ){ _fn( ev, _el2, _idx ); 	}
						, false
				); };
				_elm.forEach( tFn );
			}
		}
	}
);