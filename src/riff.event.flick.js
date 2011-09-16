riff.event.extend({
	"flick" : {
		init : function( ) 
		{
			var eventName = "flick";
			riff.event[eventName].dxMin = 3;
			riff.event[eventName].dyMin = 3;

			riff.event[eventName].checkExtentionMoveFlick = function( _evBf, _ev ) {
//d				if ( (!_evBf.status.touchstart)	|| ( (_evBf.status.prevX == 0) && (_evBf.status.prevY == 0) ) ) return false;
				if ( !_evBf.status.touchstart ) return false;
				return true;
			};
			riff.event[eventName].moveEventHandler = function( _ev, _evBf ) {
				_evBf.evEtc[eventName].dx = _evBf.status.curX - _evBf.status.prevX;
				_evBf.evEtc[eventName].dy = _evBf.status.curY - _evBf.status.prevY;
			};

			riff.event[eventName].checkExtentionEndFlick = function( _evBf, _ev ) {
//d				if ( (!_evBf.status.touchstart)	|| ( (_evBf.status.prevX == 0) && (_evBf.status.prevY == 0) ) ) return false;
				if ( !_evBf.status.touchstart || !_evBf.status.touchmove ) return false;
				if ((Math.abs(_evBf.evEtc[eventName].dy) > riff.event[eventName].dyMin) || (Math.abs(_evBf.evEtc[eventName].dx) > riff.event[eventName].dxMin)) return true;
				return false;
			};
			
			riff.event[eventName].endEventHandler = function( _ev, _evBf ) {
				var tdx = _evBf.evEtc[eventName].dx, tdy = _evBf.evEtc[eventName].dy, tAbsDx = 0, tAbsDy = 0;
				tAbsDx = Math.abs( tdx );
				tAbsDy = Math.abs( tdy );

				//h 방향 정하기
				if ( tAbsDx < tAbsDy ) {	
					//h 세로.
					if( tdy > 0 ) 
						_evBf.evEtc[eventName].flickDirection = riff.event.constString.directionD;
					else
						_evBf.evEtc[eventName].flickDirection = riff.event.constString.directionU;
				} else {
					//h 가로.
					if( tdx > 0 ) 
						_evBf.evEtc[eventName].flickDirection = riff.event.constString.directionR;
					else
						_evBf.evEtc[eventName].flickDirection = riff.event.constString.directionL;
				}
			};
		},

		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.isDisable[ "flick" ] == false ) return false;
				return true;
		},
		addEvent: function( _elm, _fn ) {

				var tg = riff.event.constString, te = riff.event, td = riff.data, tEventName = "flick",
					_elm = riff.elmCheck(_elm);

				function tFnFlick( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evEtc && tEvent.evEtc[tEventName] ) ) {
						if (!tEvent) tEvent = te.getEventBuffer(_el, tEvent);
						if (!tEvent.evEtc[tEventName] ) tEvent.evEtc[tEventName] = new Object();

						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );

						tEvent.evFnMove[ tEventName ] = [];
						tEvent.evFnMove[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkExtentionMoveFlick;
						tEvent.evFnMove[ tEventName ][riff.event.constString.execution] = riff.event[ tEventName ].moveEventHandler;

						tEvent.evFnEnd[ tEventName ] = [];
						tEvent.evFnEnd[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkExtentionEndFlick;
					}

//d					tEvent.evFnEtc[ tEventName ][riff.event.constString.execution] = _fn
					tEvent.evFnEnd[tEventName][riff.event.constString.execution] = function( _ev, _evBf ){
						riff.event[ tEventName ].endEventHandler( _ev, _evBf );
//d						_fn.call( this, _ev, _evBf, _evBf.evEtc[ tEventName ].dx, _evBf.evEtc[ tEventName ].dy, _evBf.evEtc[ tEventName ].flickDirection );
						_fn.call( this, _evBf.evEtc[ tEventName ].flickDirection, _ev, _evBf.evEtc[ tEventName ].dx, _evBf.evEtc[ tEventName ].dy, _evBf );
					}

					tEvent.destroy[ tEventName ] = function( _evBf ){
						delete _evBf.evEtc[ tEventName ].dx;
						delete _evBf.evEtc[ tEventName ].dy;
						delete _evBf.evEtc[ tEventName ].flickDirection;
					};
					tEvent = null;
				};

				_elm.forEach( tFnFlick );
				tg = te = td = null;
				return true;
		}
	}
});





