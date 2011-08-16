riff.event.extend({
	"doubleTap" : {
		init : function( ) 
		{
			var eventName = "doubleTap";
			riff.event[eventName].interval = 600;

			riff.event[eventName].deleteDoubleTap = function( _evBf ) {
				_evBf.evEtc[ eventName ].startTime = 0;
			}
			riff.event[eventName].checkExtentionMove = function( _evBf, _ev ) {
				if( !_evBf.status.touchstart ) return false;
				return true;
			};

			riff.event[eventName].moveEventHandler = function( _ev, _evBfStatus, _evBf ) {
				riff.event[eventName].deleteDoubleTap(_evBf);
			};

			riff.event[eventName].checkExtentionEnd = function( _evBf, _ev  ) {
				var rv = false;
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				
				if ( _evBf.status.touchstart && _evBf.status.touchend && !_evBf.status.touchmove ) {
					if ( _evBf.evEtc[ eventName ].startTime > 0 ) {
						if ( ( _evBf.status.endTime - _evBf.evEtc[ eventName ].startTime ) <= riff.event[eventName].interval ) { 
							riff.event[eventName].deleteDoubleTap( _evBf );
							rv = true;
						} else {
							_evBf.evEtc[ eventName ].startTime = _evBf.status.startTime;
							rv = false; 
						}
					} else {
						_evBf.evEtc[ eventName ].startTime = _evBf.status.startTime; 
						rv = false;
					}
					
				} else {
					rv = false;
				}
				return rv;
			};

		},

		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ "doubleTap" ] == false ) return false;
				return true;
		},
		addEvent: function( _elm, _fn ) {
				var tg = riff.event.constString, te = riff.event, td = riff.data, tEventName = "doubleTap",
					_elm = riff.elmCheck(_elm);

				function tFnDoubleTap( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evFnEnd && tEvent.evFnEnd[ tEventName ] ) ) {
						if (!tEvent) tEvent = te.getEventBuffer(_el, tEvent);
						if (!tEvent.evEtc[tEventName] ) tEvent.evEtc[tEventName] = new Object();
						
						
						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );

						tEvent.evFnMove[ tEventName ] = [];
						tEvent.evFnMove[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkExtentionMove;
						tEvent.evFnMove[ tEventName ][riff.event.constString.execution] = riff.event[ tEventName ].moveEventHandler;

						tEvent.evFnEnd[ tEventName ] = [];
						tEvent.evFnEnd[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkExtentionEnd;
					}

					tEvent.evFnEnd[tEventName][riff.event.constString.execution] = function( _ev, _evBfStatus, _evBf ){
						_fn.call( this, _ev, _evBfStatus, _evBf );
					}

					tEvent.destroy[ tEventName ] = function( _evBf ){
						delete _evBf.evEtc[ tEventName ].startTime;
						delete _evBf.evEtc[ tEventName ];
					};
					tEvent = null;
				};

				_elm.forEach( tFnDoubleTap );
				tg = te = td = null;
				return true;
		}
	}
});





