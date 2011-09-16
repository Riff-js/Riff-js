riff.event.extend({
	"doubleTap" : {
		init : function( ) 
		{
			var eventName = "doubleTap";
			riff.event[eventName].interval = 600;

			riff.event[eventName].deleteDoubleTap = function( _evBf ) {
				_evBf.evEtc[ eventName ].startTime = 0;
			}
/*
			riff.event[eventName].checkExtentionStart = function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				return true;
			};
			
			riff.event[eventName].startEventHandler = function( _ev, _evBf ) {
			};
*/
			riff.event[eventName].checkExtentionMove = function( _evBf, _ev ) {
				if( !_evBf.status.touchstart ) return false;
				return true;
			};

			riff.event[eventName].moveEventHandler = function( _ev, _evBf ) {
				//h 움직였으니, 초기화하자. 
				riff.event[eventName].deleteDoubleTap(_evBf);
			};

//h 클릭 성공을 판정하자. 클릭이 성공하면
//h 이전 클릭 성공 시간을 보고, 시간차가 작으면 doubleclick 판정을 성공으로 하자.
//h 	성공하면, 시간을 소모한 걸로 보고 시간정보를 삭제하고 종료.
//h 마지막 클릭 시간을 기록하자.
//h 클릭이 실패하면	
//h 아무것도 하지 않는다.
			riff.event[eventName].checkExtentionEnd = function( _evBf, _ev  ) {
				var rv = false;
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				
				//h touchstart ~ touchend 이 한 번 완전하게 일어났는지 확인.
				if ( _evBf.status.touchstart && _evBf.status.touchend && !_evBf.status.touchmove ) {	//h tap 한번 혹은 두번 성공.
					if ( _evBf.evEtc[ eventName ].startTime > 0 ) {		//h 성공한 tap 이 두번째라는 뜻.

						if ( ( _evBf.status.endTime - _evBf.evEtc[ eventName ].startTime ) <= riff.event[eventName].interval ) { //h 시간 간격이 작으면
							//h 두 번 tap 했으니, 초기화하자. 
							riff.event[eventName].deleteDoubleTap( _evBf );
							rv = true;
						} else {
							_evBf.evEtc[ eventName ].startTime = _evBf.status.startTime;
							rv = false; 
						}
					} else {		//h 성공한 tap이 첫번째라는 뜻.
						_evBf.evEtc[ eventName ].startTime = _evBf.status.startTime; 
						rv = false;
					}
					
				} else {		//h tap 실패 
					// riff.event[eventName].deleteDoubleTap( _evBf )
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

					if( ! ( tEvent && tEvent.evEtc && tEvent.evEtc[tEventName] ) ) {
						
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

					tEvent.evFnEnd[tEventName][riff.event.constString.execution] = function( _ev, _evBf ){
						_fn.call( this, _ev, _evBf );
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





