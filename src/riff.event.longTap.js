
riff.event.extend({
	"longTap" : {
		init : function( ) 
		{
			var eventName = "longTap";
			riff.event[eventName].timerID = 0;
			riff.event[eventName].interval = 1800;
			riff.event[eventName].dom = null;

			riff.event[eventName].longTapWatch = function( ) {
				var tEvent = null;
				if ( riff.event[eventName].dom ) tEvent = riff.data.bufferSingle( riff.event[eventName].dom, riff.event.constString.bfName );
				if( tEvent ) {
//					if( tEvent.evFnEtc[ eventName ][riff.event.constString.judgement].call( riff.event[eventName].dom, tEvent, _ev ) ) tEvent.evFnEtc[ eventName ][riff.event.constString.execution].call( riff.event[eventName].dom, _ev, tEvent );
					if( tEvent.evFnEtc[ eventName ][riff.event.constString.judgement].call( riff.event[eventName].dom, tEvent ) ) tEvent.evFnEtc[ eventName ][riff.event.constString.execution].call( riff.event[eventName].dom, tEvent );
				}
				tEvent = null;
			};

			riff.event[eventName].longTapRequest = function( _el ) {
				clearTimeout( riff.event[eventName].timerID );
				riff.event[eventName].dom = _el;
				riff.event[eventName].timerID = setTimeout( riff.event[eventName].longTapWatch, riff.event[eventName].interval ) 
			};
			
			riff.event[eventName].checkExtentionEnableTimerEvent = function( _evBf ) {
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
			
				var tNow = ( new Date() ).getTime();
				if( 
					( _evBf.status.startTime > 0 ) 
					&& _evBf.status.touchstart && (!_evBf.status.touchmove) && (!_evBf.status.touchend )
					&& ( ( tNow - _evBf.status.startTime ) >= riff.event[eventName].interval )
				) {
					return true;
				} else
					return false;
			};
		},

		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ "longTap" ] == false ) return false;
				//h timer 가 따로 실행시키는 거니까.
//				return ( _evBf.status.touchstart && (!_evBf.status.touchend) && (!_evBf.status.touchmove ) );
				return true;
		},
		addEvent: 
			function( _elm, _fn ) {
				var tg = riff.event.constString, te = riff.event, td = riff.data, tEventName = "longTap",
					_elm = riff.elmCheck(_elm);
				function tFnLongTap( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evFnEtc && tEvent.evFnEtc[tEventName] ) ) {
						if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );

						tEvent.evFnEtc[ tEventName ] = [] ;
						tEvent.evFnEtc[ tEventName ][riff.event.constString.judgement] = riff.event[tEventName].checkExtentionEnableTimerEvent;
						
						tEvent.evFnStart[ tEventName ] = [] ;
						tEvent.evFnStart[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkEventEnable;
						tEvent.evFnStart[ tEventName ][riff.event.constString.execution] = function() { riff.event[ tEventName ].longTapRequest( this ) };
					}

					tEvent.evFnEtc[ tEventName ][riff.event.constString.execution] = _fn
					tEvent.destroy[ tEventName ] = function( _evBf ){ 
						delete _evBf.evFnEtc[ tEventName ][riff.event.constString.judgement];
						delete _evBf.evFnEtc[ tEventName ][riff.event.constString.execution];
					};
					tEvent = null;
				};

				_elm.forEach( tFnLongTap );
				tg = te = td = null;
				return true;
		}
	}
});





