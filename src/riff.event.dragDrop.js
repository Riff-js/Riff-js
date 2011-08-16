riff.event.extend({
	"dragDrop" : {
		init : function( ) 
		{
			var eventName = "dragDrop";

			riff.event[eventName].getXY = function( _dom,  _xy )
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

			riff.event[eventName].checkStartdragDrop = function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				return true;
			};
			riff.event[eventName].startEventHandler = function( _ev, _evBfStatus, _evBf ) {
				var evBfEtc = _evBf.evEtc[eventName];
				var txy = { x:0, y :0 };
				riff.event[eventName].getXY( this, txy );
				evBfEtc.startX = evBfEtc.curX = txy.x;
				evBfEtc.startY = evBfEtc.curY = txy.y;
				evBfEtc = null;
			};

			riff.event[eventName].checkMovedragDrop = function( _evBf, _ev ) {
				
				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				if( !_evBf.status.touchstart ) return false;
				return true;
			};
			riff.event[eventName].moveEventHandler = function( _ev, _evBfStatus, _evBf ) {
				var evBfEtc = _evBf.evEtc[eventName];
				evBfEtc.curX = evBfEtc.curX + ( _evBf.status.curX - _evBf.status.prevX );
				evBfEtc.curY = evBfEtc.curY + ( _evBf.status.curY - _evBf.status.prevY );
				riff.manipulation.css( [this], "left", evBfEtc.curX + "px" )
				riff.manipulation.css( [this], "top", evBfEtc.curY + "px" )

				evBfEtc = null;
			};

			riff.event[eventName].checkEnddragDrop = function( _evBf, _ev ) {

				if( _evBf.status.isDisable[ eventName ] == false ) return false;
				if( !_evBf.status.touchstart ) return false;

				var rv = false, prevX = _evBf.status.prevX , prevY = _evBf.status.prevY , curX = _evBf.status.curX, curY = _evBf.status.curY, evBfEtc = _evBf.evEtc[eventName];
				var txy = { x:0, y :0 };
				var txyDrag = { x:0, y :0 }, txyDrop = { x:0, y:0 }, tDrag , tDrop ;
				riff.event[eventName].getXY( this, txyDrag );					// Drag

				tDrag = {
					x1 : txyDrag.x, y1 : txyDrag.y,
					x2 : txyDrag.x + parseInt( riff.manipulation.css( [this], "width" ) ), y2 : txyDrag.y + parseInt( riff.manipulation.css( [this], "height" ) )
				};
				
				for( var lp = 0, tLen = evBfEtc.domDrop.length; lp < tLen; lp++ ) {

					riff.event[eventName].getXY( evBfEtc.domDrop[lp], txyDrop );		// Drop

					tDrop = {
						x1 : txyDrop.x,
						y1 : txyDrop.y,
						x2 : txyDrop.x + parseInt( riff.manipulation.css( [ evBfEtc.domDrop[lp] ], "width" ) ),
						y2 : txyDrop.y + parseInt( riff.manipulation.css( [ evBfEtc.domDrop[lp] ], "height" ) )
					} ;
					
					if( evBfEtc.isInside &&
						( tDrop.x1 <= tDrag.x1 ) && ( tDrag.x1 <= tDrop.x2 ) && ( tDrop.y1 <= tDrag.y1 ) && ( tDrag.y1 <= tDrop.y2 )
						&& ( tDrop.x1 <= tDrag.x2 ) && ( tDrag.x2 <= tDrop.x2 ) && ( tDrop.y1 <= tDrag.y2 ) && ( tDrag.y2 <= tDrop.y2 )
					) {
						rv = true;
					} else if (
						( ( (tDrop.x1<=tDrag.x1)&&(tDrag.x1<=tDrop.x2) ) || ( (tDrop.x1<=tDrag.x2)&&(tDrag.x2<=tDrop.x2) ) )
						&& ( ( (tDrop.y1<=tDrag.y1)&&(tDrag.y1<=tDrop.y2) ) || ( (tDrop.y1<=tDrag.y2)&&(tDrag.y2<=tDrop.y2) ) ) 
					) {
						rv = true;
					}
				};

				if( !rv )	{
					if( evBfEtc.isReturn ) {
						riff.manipulation.css( [this], "left", evBfEtc.startX + "px" );
						riff.manipulation.css( [this], "top", evBfEtc.startY + "px" );
					};
				} 

				if ( ( tDrop.x1 <= tDrag.x1 ) && ( tDrag.x1 <= tDrop.x2 ) && ( tDrop.y1 <= tDrag.y1 ) && ( tDrag.y1 <= tDrop.y2 )
					&& ( tDrop.x1 <= tDrag.x2 ) && ( tDrag.x2 <= tDrop.x2 ) && ( tDrop.y1 <= tDrag.y2 ) && ( tDrag.y2 <= tDrop.y2 )
				) {
					_evBf.status.dragDropIsInside = true;
				} else {
					_evBf.status.dragDropIsInside = false;
				};

				prevX = prevY = curX = curY = evBfEtc = txy = txyDrag = txyDrop = tDrag = tDrop = null;
				return rv;
			};

		},

		checkEventEnable :
			function( _evBf, _ev ) {
				if( _evBf.status.isDisable[ "dragDrop" ] == false ) return false;
				return true;
		},
		addEvent: function( _elmDrag, _domDrop, _fn, _isInside, _isReturn ) {
				var tg = riff.event.constString, te = riff.event, td = riff.data, tEventName = "dragDrop",
					_elmDrag = riff.elmCheck( _elmDrag );
					_domDrop = riff.elmCheck( _domDrop );

				if( !_domDrop.length ) return false; 
				
				function tFndragDrop( _el ) {
					var tEvent = td.bufferSingle( _el, tg.bfName );

					if( ! ( tEvent && tEvent.evFnEnd && tEvent.evFnEnd[ tEventName ] ) ) {
						if (!tEvent) tEvent = te.getEventBuffer(_el, tEvent);
						if (!tEvent.evEtc[tEventName] ) tEvent.evEtc[tEventName] = new Object();

						te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
						te.addPrimaryEvent( _el, tEvent, tg.touchmoveOrMouseMove, te.primaryTouchMove );
						te.addPrimaryEvent( _el, tEvent, tg.touchendOrMouseUp, te.primaryTouchEnd );

						tEvent.evFnStart[ tEventName ] = [];
						tEvent.evFnStart[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkStartdragDrop;
						tEvent.evFnStart[ tEventName ][riff.event.constString.execution] = riff.event[ tEventName ].startEventHandler;

						tEvent.evFnMove[ tEventName ] = [];
						tEvent.evFnMove[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkMovedragDrop;
						tEvent.evFnMove[ tEventName ][riff.event.constString.execution] = riff.event[ tEventName ].moveEventHandler;

						tEvent.evFnEnd[ tEventName ] = [];
						tEvent.evFnEnd[ tEventName ][riff.event.constString.judgement] = riff.event[ tEventName ].checkEnddragDrop;
					};

					tEvent.evEtc[tEventName].isInside = _isInside;
					tEvent.evEtc[tEventName].isReturn = _isReturn;
					tEvent.evEtc[tEventName].domDrop = _domDrop; 
					tEvent.evFnEnd[tEventName][riff.event.constString.execution] = function( _ev, _evBfStatus, _evBf ){

						if( _fn ) _fn.call( this, _ev, _evBfStatus, _evBf );
					}

					tEvent.destroy[ tEventName ] = function( _evBf ){
						delete _evBf.evEtc[tEventName].domDrop;
					};
					tEvent = null;
				};

				_elmDrag.forEach( tFndragDrop );
				tg = te = td = null;
				return true;
		}
	}
});





