riff.event.extend({
	"swipe" : {
		init : function( ) 
		{
			var eventName = "swipe";
			riff.event[eventName].frameRate = 17;		//h 초당 1000/17 = 60 프레임.
			riff.event[eventName].duration = 3500;		//h sliding 이 3.5초간 계속
			riff.event[eventName].decreaseSpeedPeriod = 6.0;		//h 3500 ms 동안 7단계로 속도 경감.
			riff.event[eventName].dxMin = 3;		//h swipe이 작동할 최소 속도.. 
			riff.event[eventName].dyMin = 3;		//h swipe이 작동할 최소 속도 
			riff.event[eventName].innerBoxList = [];		//h swipe이 실행중인 DOM LIST. 

			//h CSS상의 현재 위치를 가져오는 함수. 필요하다.
			riff.event[eventName].getXY = function( _dom, _xy )
			{
				var txrv = tx1 = parseInt( riff.manipulation.css( [_dom], "left" ) ), tyrv = ty1 = parseInt( riff.manipulation.css( [_dom], "top" ) ), 
					tx2 =parseInt( riff.manipulation.css( [_dom], "right" ) ), ty2 = parseInt( riff.manipulation.css( [_dom], "bottom" ) )

				if( tx1 == "auto" && tx2 == "auto" ) {
					txrv = 0; 
				} else {
					if( tx1 =="auto" && tx2 != "auto" ) txrv = parseInt( riff.manipulation.css( [_dom.parentNode] , "width" ) ) - parseInt( riff.manipulation.css( [_dom] , "right" ) ) - parseInt( riff.manipulation.css( [_dom], "width" ) );
				}

				if( ty1 == "auto" && ty2 == "auto" ) {
					tyrv = 0; 
				} else {
					if( tx1 =="auto" && tx2 != "auto" ) txrv = parseInt( riff.manipulation.css( [_dom.parentNode] , "height" ) ) - parseInt( riff.manipulation.css( [_dom] , "bottom" ) ) - parseInt( riff.manipulation.css( [_dom], "height" ) );
				}
				
				_xy.x = txrv; 
				_xy.y = tyrv; 
			};

			//h innerBox 인 현재의 DOM을 riff.event[eventName] 에 등록하되, 비어있는 곳을 찾아서 등록한다.
			riff.event[eventName].setDomToSwipeGlobal = function( _domInnerBox ) {
				var tEventGlobal = riff.event[eventName];
				for( var k in tEventGlobal.innerBoxList )
				{
					if( !tEventGlobal.innerBoxList[k] ) {
						tEventGlobal.innerBoxList[k] = _domInnerBox;
						tEventGlobal = null;
						return k;
					}  
				};
				
				tEventGlobal.innerBoxList.push( _domInnerBox );
				tEventGlobal = null;
				return 0;
			};

			riff.event[eventName].fixPositionToEdge = function( _dom, _evBf )
			{
				var evBfEtc = _evBf.evEtc[ eventName ], te = riff.event.constString;
				switch( evBfEtc.swipeDirection )
				{
					case te.directionL :
						riff.manipulation.css( [ _dom ], "left", "0px" );
						break;
					case te.directionR :
						riff.manipulation.css( [ _dom ], "left", evBfEtc.outerBoxWidth - evBfEtc.curWidth + "px" );
						break;
					case te.directionU :
						riff.manipulation.css( [ _dom ], "top", "0px" );
						break;
					case te.directionD :
						riff.manipulation.css( [ _dom ], "top", ( evBfEtc.outerBoxHeight - evBfEtc.curHeight ) + "px" );
						break;
					default :
						break;
				}
				
				te = evBfEtc = null;
				return true;
			};
			
			//h swipe timer 가 발생할때, 일괄적으로 swipe 관련 이동과 edge check 를 처리
			riff.event[eventName].swipeIntervalWork = function( ) {
				var td = riff.data, te = riff.event.constString;
				function tFnSwipeInterval( _el, _idx )
				{
					var tEventGlobal = riff.event[eventName];
					var evBf = td.bufferSingle( _el, te.bfName ),
						evBfEtc = evBf.evEtc[eventName],
						tDecreaseSpeed = evBfEtc.decreaseSpeed * evBfEtc.decreaseSpeedCount;
/*
					if (
					( tEventGlobal.frameRate * evBfEtc.currentFrame > tEventGlobal.duration )		//h 충돌 안 했어도 시간이 다 됐거나  
					|| ( 0.0 == tDecreaseSpeed )				//h 움직일 거리가 없거나.
					|| ( tEventGlobal.contectJudgement( _el, evBf ) ) )			//h 충돌하면
					{
						evBf.status.swipeState = "end";
						evBf.evFnEtc[eventName].call( _el, null, evBf.status, evBf );
						//h 움직임 중지.
						tEventGlobal.freeSwipe( evBf, _idx );
						tEventGlobal = evBf = evBfEtc = null;
						return true;
					};
*/
					if (
					( tEventGlobal.frameRate * evBfEtc.currentFrame > tEventGlobal.duration )		//h 충돌 안 했어도 시간이 다 됐거나  
					|| ( 0.0 == tDecreaseSpeed )				//h 움직일 거리가 없거나.
					|| tEventGlobal.contectJudgement( _el, evBf ) )			//h 충돌하면
					{
						evBf.status.swipeState = "end";
						evBf.evFnEtc[eventName].call( _el, null, evBf );
						//h 움직임 중지.
						tEventGlobal.freeSwipe( evBf, _idx );
						tEventGlobal = evBf = evBfEtc = null;
						return true;
					};

					switch( evBfEtc.swipeDirection )
					{
						case te.directionL :
						case te.directionR :
							evBfEtc.curLeft += tDecreaseSpeed;
							riff.manipulation.css( [ _el ], "left", parseInt( evBfEtc.curLeft ) + "px" );
							break;
						case te.directionU :
						case te.directionD :
							evBfEtc.curTop += tDecreaseSpeed;
							riff.manipulation.css( [ _el ], "top", parseInt( evBfEtc.curTop ) + "px" );
							break;
						default :
							break;
					}

					if( 0 == (evBfEtc.currentFrame % tEventGlobal.decreaseSpeedPeriod ) ) evBfEtc.decreaseSpeedCount -= 1.0;

					evBf.evFnEtc[eventName].call( _el, null, evBf );
					++evBfEtc.currentFrame;
					evBf = evBfEtc = tEventGlobal = null;
				};
				riff.event[eventName].innerBoxList.forEach( tFnSwipeInterval );
				td = te = null;
				return true;
			};

			//h moving 을 위한 시작 위치 지정.
			riff.event[eventName].checkStartSwipe = function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				//h 이미 작동중인 swipe 이벤트가 있다면, 지우자.
				clearInterval( _evBf.evEtc[ eventName ].timerID );
				riff.event[eventName].freeSwipe( _evBf );
				return true;
			};
			riff.event[eventName].startEventHandler = function( _ev, _evBf ) {
				var evBfEtc = _evBf.evEtc[eventName];
				var txy = { x:0, y :0 };
				riff.event[eventName].getXY( this, txy );
				evBfEtc.curX = txy.x;
				evBfEtc.curY = txy.y;
				
				evBfEtc.innerBoxIndex = riff.event[eventName].setDomToSwipeGlobal( this ); 
				riff.event[eventName].getXY( this.parentNode , txy );
				evBfEtc.outerBoxWidth = parseInt( riff.manipulation.css( [this.parentNode], "width" ) );
				evBfEtc.outerBoxHeight = parseInt( riff.manipulation.css( [this.parentNode], "height" ) );
				evBfEtc = txy = null;
			};

			riff.event[eventName].checkMoveSwipe = function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				if( !_evBf.status.touchstart ) return false;
				return true;
			};
			riff.event[eventName].moveEventHandler = function( _ev, _evBf ) {
				var evBfEtc = _evBf.evEtc[eventName];
				//h dx, dy 를 구한다.
				evBfEtc.dx = _evBf.status.curX - _evBf.status.prevX;
				evBfEtc.dy = _evBf.status.curY - _evBf.status.prevY;
				//h 좌표 이동 
				evBfEtc.curX = evBfEtc.curX + ( _evBf.status.curX - _evBf.status.prevX );
				evBfEtc.curY = evBfEtc.curY + ( _evBf.status.curY - _evBf.status.prevY );
				riff.manipulation.css( [this], "left", evBfEtc.curX + "px" );
				riff.manipulation.css( [this], "top", evBfEtc.curY + "px" );

				evBfEtc = null;
			};

			//h 상자를 벗어나지 않았으면 false, 상자를 벗어나면 true,
			//h 상자를 벗어나건 벗어나지 않건, _evBf.evEtc[eventName].flickEnd == false 면 무조건 false  
			riff.event[eventName].contectJudgement = function( _dom, _evBf ){
				if ( ( _evBf.evEtc[eventName].flickEnd == false ) && ( _evBf.status.swipeState == "outside" ) ) return false;
				if (_evBf.status.swipeState == "edge") {
					_evBf.status.swipeState = "outside";
					return false;
				}

				var rv = false, evBfEtc = _evBf.evEtc[eventName],
					ox1 = 0, oy1 = 0, ox2 = evBfEtc.outerBoxWidth, oy2 = evBfEtc.outerBoxHeight,
					ix1 = evBfEtc.curLeft, iy1 = evBfEtc.curTop, ix2 = evBfEtc.curLeft + evBfEtc.curWidth, iy2 = evBfEtc.curTop + evBfEtc.curHeight;

				switch( evBfEtc.swipeDirection )
				{
					case riff.event.constString.directionL :
						if ( ix1 < ox1 ) rv = true;  
						break;
					case riff.event.constString.directionR :
						if ( ox2 < ix2 ) rv = true;  
						break;
					case riff.event.constString.directionU :
						if ( iy1 < oy1 ) rv = true;  
						break;
					case riff.event.constString.directionD :
						if ( oy2 < iy2 ) rv = true;  
						break;
					default :
						break;
				};

//d				if (rv && _evBf.evEtc[eventName].flickEnd == false ) riff.event[eventName].fixPositionToEdge(_dom, _evBf);
				if (rv) _evBf.status.swipeState = "edge";
				if ( evBfEtc.flickEnd == false) { evBfEtc = null; return false; }
				if (rv) riff.event[eventName].fixPositionToEdge(_dom, _evBf);
				return rv;
			};

			riff.event[eventName].freeSwipe = function( _evBf, _idx ){
				var evBfEtc = _evBf.evEtc[eventName];
				clearInterval( evBfEtc.timerID ); 
				delete riff.event[eventName].innerBoxList[ _idx ];
				evBfEtc = null;
				return false
			};

			riff.event[eventName].checkEndSwipe = function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				if( !_evBf.status.touchstart || !_evBf.status.touchmove ) return false;
				var evBfEtc = _evBf.evEtc[ eventName ];
				if ( ( riff.event[ eventName ].dxMin > Math.abs( _evBf.evEtc[eventName].dx ) ) 
					&& ( riff.event[ eventName ].dxMin > Math.abs( _evBf.evEtc[eventName].dy ) ) ) {
					return false;
				};

				return true;
			};

			riff.event[eventName].endEventHandler = function( _ev, _evBf ) {
				var evBfEtc = _evBf.evEtc[eventName], tEventGlobal = riff.event[eventName];
				var te = riff.event.constString;
				var tdx = evBfEtc.dx, tdy = evBfEtc.dy, tAbsDx = Math.abs( tdx ), tAbsDy = Math.abs( tdy ), tCurXY = {};  
				var decreaseSpeed = 0.0; 
				evBfEtc.decreaseSpeedCount = tEventGlobal.decreaseSpeedPeriod;
				//h 방향을 구한다.
				if ( tAbsDx < tAbsDy ) {	
					//h 세로.
					if( tdy > 0 ) 
						evBfEtc.swipeDirection = te.directionD;
					else
						evBfEtc.swipeDirection = te.directionU;
					//h 감속 비율 계산 2
					evBfEtc.decreaseSpeed = parseFloat( tdy ) / tEventGlobal.decreaseSpeedPeriod;
				} else {
					//h 가로.
					if( tdx > 0 ) 
						evBfEtc.swipeDirection = te.directionR;
					else
						evBfEtc.swipeDirection = te.directionL;
					//h 감속 비율 계산 2
					evBfEtc.decreaseSpeed = parseFloat( tdx ) / tEventGlobal.decreaseSpeedPeriod;
				};
				
				//h 현재 위치 획득+저장
				tEventGlobal.getXY( this, tCurXY );
				evBfEtc.curLeft = parseFloat( tCurXY.x );
				evBfEtc.curTop = parseFloat( tCurXY.y );
				evBfEtc.curWidth = parseInt( riff.manipulation.css( [this], "width" ) );
				evBfEtc.curHeight = parseInt( riff.manipulation.css( [this], "height" ) );
				//h 현재 프레임 설정
				evBfEtc.currentFrame = 1;

				evBfEtc.timerID = setInterval( tEventGlobal.swipeIntervalWork, tEventGlobal.frameRate );
				tdx = tdy = tAbsDx = tAbsDy = tCurXY = null;
				return true;
			};

		},

		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ "swipe" ] == false ) return false;
				return true;
		},
		addEvent: function( _elmInnerBox, _fn, _isFlickEnd ) {
				var tg = riff.event.constString, te = riff.event, td = riff.data, tEventName = "swipe",
					_elmInnerBox = riff.elmCheck( _elmInnerBox );

				function tFnSwipe( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evEtc && tEvent.evEtc[tEventName] ) ) {
						if (!tEvent) tEvent = te.getEventBuffer(_el, tEvent);
						if (!tEvent.evEtc[tEventName] ) tEvent.evEtc[tEventName] = new Object();

						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );

						tEvent.evFnStart[ tEventName ] = [];
						tEvent.evFnStart[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkStartSwipe;
						tEvent.evFnStart[ tEventName ][riff.event.constString.execution] = riff.event[ tEventName ].startEventHandler;

						tEvent.evFnMove[ tEventName ] = [];
						tEvent.evFnMove[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkMoveSwipe;
						tEvent.evFnMove[ tEventName ][riff.event.constString.execution] = riff.event[ tEventName ].moveEventHandler;

						tEvent.evFnEnd[ tEventName ] = [];
						tEvent.evFnEnd[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkEndSwipe;
					};

					tEvent.evFnEtc[ tEventName ] = _fn;
					tEvent.evEtc[ tEventName ].flickEnd = _isFlickEnd;		//h true: 끝에서 멈춘다. false : 멈추지 않는다. default : true.
					tEvent.evFnEnd[ tEventName ][riff.event.constString.execution] = function( _ev, _evBf ){
						riff.event[ tEventName ].endEventHandler.call( this, _ev, _evBf );
						_evBf.status.swipeState = "start";
						if( _fn ) _fn.call( this, _ev, _evBf );
						_evBf.status.swipeState = "move";
					}

					tEvent.destroy[ tEventName ] = function( _evBf ){
//d						delete _evBf.evEtc[tEventName].decreaseSpeed;
//d						delete _evBf.evEtc[tEventName].decreaseSpeedCount;
//d						delete _evBf.evEtc[tEventName].currentFrame;
//d						delete _evBf.evEtc[tEventName].swipeDirection;
//d						delete _evBf.evEtc[tEventName].curX;
//d						delete _evBf.evEtc[tEventName].curY;
//d						delete _evBf.evEtc[tEventName].innerBoxIndex;
//d						delete _evBf.evEtc[tEventName].outerBoxWidth;
//d						delete _evBf.evEtc[tEventName].outerBoxHeight;
//d						delete _evBf.evEtc[tEventName].curLeft;
//d						delete _evBf.evEtc[tEventName].curTop;
//d						delete _evBf.evEtc[tEventName].curWidth;
//d						delete _evBf.evEtc[tEventName].curHeight;
						clearInterval( _evBf.evEtc[tEventName].timerID );
						delete _evBf.evEtc[tEventName];
						delete _evBf.evFnEtc[tEventName];
					};
					tEvent = null;
				};


				_elmInnerBox.forEach( tFnSwipe );
				tg = te = td = null;
				return true;
		}
	}
});





