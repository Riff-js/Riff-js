
riff.extend(
{
	event : {
		constString : {
			/*
			touchstartOrMouseDown : "touchstart" ,
			touchmoveOrMouseMove : "touchmove" ,
			touchendOrMouseUp : "touchend" ,
			*/
			
			touchstartOrMouseDown : "mousedown" ,
			touchmoveOrMouseMove : "mousemove" ,
			touchendOrMouseUp : "mouseup" ,
			bfName : "rf-buffer-event",

			judgement : "rf-eventJudgement",
			execution : "rf-eventExecution",

			directionR : "right",
			directionL : "left",
			directionU : "up",
			directionD : "down",
			
			touchStart : "touchStart",
			touchMove : "touchMove",
			touchEnd : "touchEnd"
		},
		//n enable, disable DOM Element.
		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_eventType {String} eventType to enable / disable.
		//n @_enableDisable {String} disable event if _enableDisable == "disable". Otherwise, enable the event.
		//n @return {Array} an array of DOM nodes
		enableDisable: function ( _elm, _eventType, _enableDisable )
		{
			var tg = riff.event.constString, td = riff.data, _elm = riff.elmCheck(_elm);
			var flag = ( _enableDisable && _enableDisable == "disable" ) ? false : true;
			function tFnEnableDisable( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );
				if( tEvent ) tEvent.status.isDisable[ _eventType ] = flag;
				tEvent = null;
			};

			_elm.forEach( tFnEnableDisable );
			tg = td = null;
			return _elm;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_eventType {String} eventType to trigger( execute ).
		trigger : function ( _elm, _eventType )
		{
			var tg = riff.event.constString, td = riff.data, _elm = riff.elmCheck(_elm);

			function tFnTrigger( _el )
			{
				var tEvent = td.bufferSingle( _el, tg.bfName );
				if( tEvent && tEvent.evFnStart[ _eventType ] && tEvent.evFnStart[ _eventType ][riff.event.constString.execution] ) tEvent.evFnStart[ _eventType ][riff.event.constString.execution].call( _el );
				if( tEvent && tEvent.evFnMove[ _eventType ] && tEvent.evFnMove[ _eventType ][riff.event.constString.execution] ) tEvent.evFnMove[ _eventType ][riff.event.constString.execution].call( _el );
				if( tEvent && tEvent.evFnEnd[ _eventType ] && tEvent.evFnEnd[ _eventType ][riff.event.constString.execution] ) tEvent.evFnEnd[ _eventType ][riff.event.constString.execution].call( _el );
				tEvent = null;
			};
			
			_elm.forEach( tFnTrigger );
			td = null;
			return _elm;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_fn { function } event function handler to run by touchstart event.
		touchStart : function ( _elm, _fn )
		{
			var tg = riff.event.constString, te = riff.event, td = riff.data, _elm = riff.elmCheck(_elm);
			function tFnTouchStart( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				//n if there is no "touchStart" event, register "touchstart" and "touchStart" event.
				if( ! ( tEvent && tEvent.evFnRunFirst && tEvent.evFnRunFirst[ tg.touchStart ] ) ) {
//n get a buffer object for the event.
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
//n primary event ("touchstart") register.
					te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
//n event ("touchStart") execution-check-function register.
					tEvent.evFnRunFirst[ tg.touchStart ] = [];
					tEvent.evFnRunFirst[ tg.touchStart ][riff.event.constString.judgement] = te.checkTouchStartEnable;
				}
//n event ("touchStart") execution( event handler ) register.
				tEvent.evFnRunFirst[ tg.touchStart ][riff.event.constString.execution] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchStart );
			tg = te = td = null;
			return true;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query 
		//n @_fn { function } event function handler to run by touchmove event.
		touchMove : function ( _elm, _fn )
		{
			var tg = riff.event.constString, te = riff.event, td = riff.data, _elm = riff.elmCheck( _elm );
			function tFnTouchMove( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				if( ! ( tEvent && tEvent.evFnRunFirst && tEvent.evFnRunFirst[ tg.touchMove ] ) ) {
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					te.addPrimaryEvent( _el, tEvent, tg.touchMoveOrMouseDown, te.primaryTouchMove );
					tEvent.evFnRunFirst[ tg.touchMove ] = [];
					tEvent.evFnRunFirst[ tg.touchMove ][riff.event.constString.judgement] = te.checkTouchMoveEnable;
				}
				tEvent.evFnRunFirst[ tg.touchMove ][riff.event.constString.execution] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchMove );
			tg = te = td = null;
			return true;
		},

		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_fn { function } event function handler to run by touchend event.
		touchEnd : function ( _elm, _fn )
		{
			var tg = riff.event.constString, te = riff.event, td = riff.data, _elm = riff.elmCheck(_elm);
			function tFnTouchEnd( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				if( ! ( tEvent && tEvent.evFnRunFirst && tEvent.evFnRunFirst[ tg.touchEnd ] ) ) {
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					te.addPrimaryEvent( _el, tEvent, tg.touchEndOrMouseDown, te.primaryTouchEnd );
					tEvent.evFnRunFirst[ tg.touchEnd ] = [];
					tEvent.evFnRunFirst[ tg.touchEnd ][riff.event.constString.judgement] = te.checkTouchEndEnable;
				}
				tEvent.evFnRunFirst[ tg.touchEnd ][riff.event.constString.execution] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchEnd );
			tg = te = td = null;
			return true;
		},

		//n internal Function
		getEventBuffer : function( _el, _evBf )
		{
			_evBf = riff.data.bufferSingle( _el, riff.event.constString.bfName, {} ) ;
			_evBf.primary = [];
			_evBf.evFnRunFirst = [];					//n touchStart
			_evBf.evFnStart = [];					//n touchStart
			_evBf.evFnMove = [];					//n touchMove
			_evBf.evFnEnd = [];					//n touchEnd
			_evBf.status = {};
			_evBf.status.isDisable = [];

			_evBf.evEtc = [];
			_evBf.evFnEtc = [];
			_evBf.destroy = [];

			return _evBf;
		},

		//n internal Function
		evBfFree: function( _evfn )
		{
			for( var k in _evfn ) {
				delete _evfn[k][riff.event.constString.judgement];
				delete _evfn[k][riff.event.constString.execution];
			}
		},

		//n internal Function
		eventMemoryFree : function( _evBf )
		{
			var tg = riff.event.constString, te = riff.event;
			delete _evBf.primary;

			te.evBfFree( _evBf.evFnStart ); delete _evBf.evFnStart;
			te.evBfFree( _evBf.evFnMove ); delete _evBf.evFnMove;
			te.evBfFree( _evBf.evFnEnd ); delete _evBf.evFnEnd;
			te.evBfFree( _evBf.evFnRunFirst ); delete _evBf.evFnRunFirst;

			for( var k in _evBf.destroy ) {
				_evBf.destroy[ k ]( _evBf );
				delete _evBf.destroy[ k ]; 
			}
			delete _evBf.evEtc;
			delete _evBf.evFnEtc;

			tg = te = null;
			if (_evBf.status) {
				for (var k in _evBf.status.isDisable) {
					delete _evBf.status.isDisable[k];
				};
			}
			delete _evBf.status;
			delete _evBf.toggle;
			delete _evBf.destroy;
		},

		//n internal Function
		addPrimaryEvent : function( _el, _evBf,  _primaryEventType, _primaryEventFn )
		{
			if ( ! _evBf.primary[ _primaryEventType ] ) {
				_el.addEventListener( _primaryEventType, _primaryEventFn, false );
				_evBf.primary[ _primaryEventType ] = true;
			}
		},

		//n internal Function
		checkTouchStartEnable : function( _evBf, _ev ) {
			if (_evBf.status.isDisable[riff.event.constString.touchStart ] == false ) return false;
			if( _evBf.status.isDisable[ riff.event.constString.touchStart ] )
				return ( _evBf.evFnRunFirst[ riff.event.constString.touchStart ][riff.event.constString.execution] && _evBf.status.touchstart );
			return true;
		},
		//n internal Function
		checkTouchMoveEnable : function( _evBf, _ev ) {
			if (_evBf.status.isDisable[riff.event.constString.touchMove] == false ) return false;
			if (_evBf.status.isDisable[riff.event.constString.touchMove] )
				return (_evBf.evFnRunFirst[riff.event.constString.touchMove][riff.event.constString.execution] && _evBf.status.touchmove);
			return true; 
		},
		//n internal Function
		checkTouchEndEnable : function( _evBf, _ev ) {
			if (_evBf.status.isDisable[riff.event.constString.touchEnd ] == false ) return false;
			if( _evBf.status.isDisable[ riff.event.constString.touchEnd ] )
				return ( _evBf.evFnRunFirst[ riff.event.constString.touchEnd ][riff.event.constString.execution] && _evBf.status.touchend );
			return true; 
		},

		getXYByDevice : function( _evBf, _ev ) 
		{
			if( _ev.touches && _ev.touches.length ) 
			{
				_evBf.status.curX = _ev.touches[0].clientX;
				_evBf.status.curY = _ev.touches[0].clientY;
			} else {
				_evBf.status.curX = _ev.clientX;
				_evBf.status.curY = _ev.clientY;
			}
		},

		//n internal function
		//n touchstart function for primary "touchstart" ( or mousedown etc ) function.
		primaryTouchStart : function( _ev ) {
			_ev.stopPropagation();
			var tg = riff.event.constString, tEvent = riff.data.bufferSingle( this, tg.bfName );
			tEvent.status.startTime = ( new Date() ).getTime();
			tEvent.status.touchstart = true;
			tEvent.status.touchmove = false;
			tEvent.status.touchend = false;
			riff.event.getXYByDevice( tEvent, _ev );
			tEvent.status.prevX = tEvent.status.curX;
			tEvent.status.prevY = tEvent.status.curY;
			if( tEvent.evFnRunFirst[ tg.touchStart ] && tEvent.evFnRunFirst[ tg.touchStart ][riff.event.constString.judgement]( tEvent, _ev ) ) tEvent.evFnRunFirst[ tg.touchStart ][riff.event.constString.execution].call( this, _ev, tEvent.status );
			var tEvFn = tEvent.evFnStart;

			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][riff.event.constString.judgement] && tEvFn[ k ][riff.event.constString.execution] && tEvFn[ k ][riff.event.constString.judgement].call( this, tEvent, _ev  ) ) tEvFn[ k ][riff.event.constString.execution].call( this, _ev, tEvent.status, tEvent );
			}
			tg = tEvFn = tEvent = null;
			return true;
		},
		//n internal function
		//n touchstart function for primary "touchmove" ( or mousemove etc ) function.
		primaryTouchMove : function( _ev ) {
			_ev.stopPropagation();
			var tg = riff.event.constString, tEvent = riff.data.bufferSingle( this, tg.bfName );
			tEvent.status.moveTime = ( new Date() ).getTime();
			tEvent.status.touchmove = true;
			tEvent.status.prevX = tEvent.status.curX;
			tEvent.status.prevY = tEvent.status.curY;
			riff.event.getXYByDevice( tEvent, _ev );
			if( tEvent.evFnRunFirst[ tg.touchMove ] && tEvent.evFnRunFirst[ tg.touchMove ][riff.event.constString.judgement]( tEvent, _ev ) ) tEvent.evFnRunFirst[ tg.touchMove ][riff.event.constString.execution].call( this, _ev, tEvent.status, tEvent );
			var tEvFn = tEvent.evFnMove;

			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][riff.event.constString.judgement] && tEvFn[ k ][riff.event.constString.execution] && tEvFn[ k ][riff.event.constString.judgement].call( this, tEvent, _ev  ) ) tEvFn[ k ][riff.event.constString.execution].call( this, _ev, tEvent.status, tEvent );
			}
			tg = tEvFn = tEvent = null;
			return true;
		},
		//n internal function
		//n touchstart function for primary "touchup" ( or mouseup etc ) function.
		primaryTouchEnd : function( _ev ) {
			_ev.stopPropagation();
			var tg = riff.event.constString, tEvent = riff.data.bufferSingle( this, tg.bfName );
			tEvent.status.endTime = ( new Date() ).getTime();
			tEvent.status.touchend = true;
			tEvent.status.prevX = tEvent.status.curX;
			tEvent.status.prevY = tEvent.status.curY;
			riff.event.getXYByDevice( tEvent, _ev );
			if( tEvent.evFnRunFirst[ tg.touchEnd ] && tEvent.evFnRunFirst[ tg.touchEnd ][riff.event.constString.judgement]( tEvent, _ev ) ) tEvent.evFnRunFirst[ tg.touchEnd ][riff.event.constString.execution].call( this, _ev, tEvent.status, tEvent );
			var tEvFn = tEvent.evFnEnd;
			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][riff.event.constString.judgement] && tEvFn[ k ][riff.event.constString.execution] && tEvFn[ k ][riff.event.constString.judgement].call( this, tEvent, _ev  ) ) tEvFn[ k ][riff.event.constString.execution].call( this, _ev, tEvent.status, tEvent );
			}

			if (tEvent && tEvent.status) {
				tEvent.status.touchstart = false;
				tEvent.status.touchmove = false;
				tEvent.status.touchend = false;
				tEvent.status.prevX = tEvent.status.curX = 0
				tEvent.status.prevY = tEvent.status.curY = 0;
			}

			tg = tEvFn = tEvent = null;
			return true;
		},

		extend : function( _newEvent ) {
			for( var k in _newEvent )
			{
				riff.event[k] = new Object();
				riff.event[k] = _newEvent[k].addEvent;
				if( _newEvent[k].init ) _newEvent[k].init();
				riff.event[k].checkEventEnable = _newEvent[k].checkEventEnable;
			}
		}
	}
});

window.$e = riff.event;








