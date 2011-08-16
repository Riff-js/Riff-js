
riff.event.extend({
	"tap" : {
		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ "tap" ] == false ) return false;
				return ( _evBf.evFnEnd[ "tap" ][riff.event.constString.execution] && _evBf.status.touchstart && _evBf.status.touchend && (!_evBf.status.touchmove) );
			},
		addEvent: 
			function( _elm, _fn, _useFocus ) {
				var tg = riff.event.constString, te = riff.event, td = riff.data, tEventName = "tap",
					_elm = riff.elmCheck(_elm);
				if ( !(_useFocus == false)  ) {
					riff.event.touchStart( _elm, function(tItem){ riff.manipulation.addClass( riff.traversal.filtering([this],".rf-status-dim","not"),"rf-status-focus" ); } ); 
					riff.event.touchMove( _elm, function(tItem){ riff.manipulation.removeClass( riff.traversal.filtering([this],".rf-status-dim","not"),"rf-status-focus" ); } );
					riff.event.touchEnd( _elm, function(tItem){ riff.manipulation.removeClass( riff.traversal.filtering([this],".rf-status-dim","not"),"rf-status-focus" ); } );
					
				}; 
				function tFnTap( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evFnEnd && tEvent.evFnEnd[ tEventName ] ) ) {
						if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );
						tEvent.evFnEnd[ tEventName ] = [] ;
						tEvent.evFnEnd[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkEventEnable;
					}
					tEvent.evFnEnd[ tEventName ][riff.event.constString.execution] = _fn;
					tEvent = tItem = null;
				};

				_elm.forEach( tFnTap );
				tg = te = td = null;
				return true;
		}
	}
});





