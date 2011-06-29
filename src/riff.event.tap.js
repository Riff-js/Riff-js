
riff.event.extend({
	"tap" : {
		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.isDisable[ "tap" ] == false ) return false;
				return ( _evBf.evFnEnd[ "tap" ][1] && _evBf.status.touchstart && _evBf.status.touchend );
			},
		addEvent: 
			function( _elm, _fn ) {
				var tg = riff.global.event, te = riff.event, td = riff.data, tEventName = "tap",
					_elm = riff.elmCheck(_elm);
				riff.event.touchStart( _elm, function(){ riff.manipulation.addClass( [this],"rf-status-focus" ); } ); 
				riff.event.touchEnd( _elm, function(){ riff.manipulation.removeClass( [this],"rf-status-focus" ); } ); 
				function tFnTap( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evFnEnd && tEvent.evFnEnd[ tEventName ] ) ) {
						if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );
						tEvent.evFnEnd[ tEventName ] = [] ;
						tEvent.evFnEnd[ tEventName ][0] = riff.event[ tEventName ].checkEventEnable;
					}
					tEvent.evFnEnd[ tEventName ][1] = _fn;
					tEvent = null;
				};

				_elm.forEach( tFnTap );
				tg = te = td = null;
				return true;
		}
	}
});




