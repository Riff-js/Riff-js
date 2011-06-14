
riff.extend(
{
	event : {
		//n enable, disable DOM Element.
		//n @_elm {Array|String} an array of DOM nodes || CSS selector query
		//n @_eventType {String} eventType to enable / disable.
		//n @_enableDisable {String} disable event if _enableDisable == "disable". Otherwise, enable the event.
		//n @return {Array} an array of DOM nodes
		enableDisable: function ( _elm, _eventType, _enableDisable )
		{
			var tg = riff.global.event, td = riff.data, _elm = riff.elmCheck(_elm);
			var flag = ( _enableDisable && _enableDisable == "disable" ) ? false : true;
			function tFnEnableDisable( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );
				if( tEvent ) tEvent.isDisable[ _eventType ] = flag;
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
			var tg = riff.global.event, td = riff.data, _elm = riff.elmCheck(_elm);

			function tFnTrigger( _el )
			{
				var tEvent = td.bufferSingle( _el, tg.bfName );
				if( tEvent && tEvent.evFnStart[ _eventType ] && tEvent.evFnStart[ _eventType ][1] ) tEvent.evFnStart[ _eventType ][1].call( _el );
				if( tEvent && tEvent.evFnMove[ _eventType ] && tEvent.evFnMove[ _eventType ][1] ) tEvent.evFnMove[ _eventType ][1].call( _el );
				if( tEvent && tEvent.evFnEnd[ _eventType ] && tEvent.evFnEnd[ _eventType ][1] ) tEvent.evFnEnd[ _eventType ][1].call( _el );
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
			var tg = riff.global.event, te = riff.event, td = riff.data, _elm = riff.elmCheck(_elm);
			function tFnTouchStart( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				//n if there is no "touchStart" event, register "touchstart" and "touchStart" event.
				if( ! ( tEvent && tEvent.evFnRiff && tEvent.evFnRiff[ tg.touchStart ] ) ) {
//n get a buffer object for the event.
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
//n primary event ("touchstart") register.
					te.addPrimaryEvent( _el, tEvent, tg.touchstartOrMouseDown, te.primaryTouchStart );
//n event ("touchStart") execution-check-function register.
					tEvent.evFnRiff[ tg.touchStart ] = [];
					tEvent.evFnRiff[ tg.touchStart ][0] = te.checkTouchStartEnable;
				}
//n event ("touchStart") execution( event handler ) register.
				tEvent.evFnRiff[ tg.touchStart ][1] = _fn;
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
			var tg = riff.global.event, te = riff.event, td = riff.data, _elm = riff.elmCheck( _elm );
			function tFnTouchMove( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				if( ! ( tEvent && tEvent.evFnRiff && tEvent.evFnRiff[ tg.touchMove ] ) ) {
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					te.addPrimaryEvent( _el, tEvent, tg.touchMoveOrMouseDown, te.primaryTouchMove );
					tEvent.evFnRiff[ tg.touchMove ] = [];
					tEvent.evFnRiff[ tg.touchMove ][0] = te.checkTouchMoveEnable;
				}
				tEvent.evFnRiff[ tg.touchEnd ][1] = _fn;
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
			var tg = riff.global.event, te = riff.event, td = riff.data, _elm = riff.elmCheck(_elm);
			function tFnTouchEnd( _el ) {
				var tEvent = td.bufferSingle( _el, tg.bfName );

				if( ! ( tEvent && tEvent.evFnRiff && tEvent.evFnRiff[ tg.touchEnd ] ) ) {
					if( !tEvent ) tEvent = te.getEventBuffer( _el, tEvent );
					te.addPrimaryEvent( _el, tEvent, tg.touchEndOrMouseDown, te.primaryTouchEnd );
					tEvent.evFnRiff[ tg.touchEnd ] = [];
					tEvent.evFnRiff[ tg.touchEnd ][0] = te.checkTouchEndEnable;
				}
				tEvent.evFnRiff[ tg.touchEnd ][1] = _fn;
				tEvent = null;
			};

			_elm.forEach( tFnTouchEnd );
			tg = te = td = null;
			return true;
		},

		//n internal Function
		getEventBuffer : function( _el, _evBf )
		{
			_evBf = riff.data.bufferSingle( _el, riff.global.event.bfName, {} ) ;
			_evBf.primary = [];
			_evBf.evFnRiff = [];					//n touchStart
			_evBf.evFnStart = [];					//n touchStart
			_evBf.evFnMove = [];					//n touchMove
			_evBf.evFnEnd = [];					//n touchEnd
			_evBf.status = {};
			_evBf.toggle = [];
			_evBf.isDisable = [];
			_evBf.destroy = riff.event.eventMemoryFree;
			return _evBf;
		},

		//n internal Function
		evBfFree: function( _evfn )
		{
			for( var k in _evfn ) {
				_evfn[k][0] = null;
				_evfn[k][1] = null;
			}
		},

		//n internal Function
		eventMemoryFree : function( _evBf )
		{
			var tg = riff.global.event, te = riff.event, tevfn;
			_evBf.primary = null;
			te.evBfFree( _evBf.evFnStart ); _evBf.evFnStart = null;
			te.evBfFree( _evBf.evFnMove ); _evBf.evFnMove = null;
			te.evBfFree( _evBf.evFnEnd ); _evBf.evFnEnd = null;
			tg = te = tevfn = null;
			_evBf.status = null;
			_evBf.toggle = null;
			_evBf.isDisable = null;
			_evBf.destroy = null;
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
			if( _evBf.isDisable[ riff.global.event.touchStart ] )
				return ( _evBf.evFnStart[ riff.global.event.touchStart ][1] && _evBf.status.touchstart && _evBf.status.touchend );
			return true; },
		//n internal Function
		checkTouchMoveEnable : function( _evBf, _ev ) { return true; },
		//n internal Function
		checkTouchEndEnable : function( _evBf, _ev ) { return true; },

		//n internal function
		//n touchstart function for primary "touchstart" ( or mousedown etc ) function.
		primaryTouchStart : function( _ev ) {
			var tg = riff.global.event, tEvent = riff.data.bufferSingle( _ev.target, tg.bfName );
			tEvent.startTime = ( new Date() ).getTime();
			tEvent.status.touchstart = true;
			tEvent.prevX = tEvent.curX = _ev.clientX;
			tEvent.prevY = tEvent.curY = _ev.clientY;

			if( tEvent.evFnRiff[ tg.touchStart ] && tEvent.evFnRiff[ tg.touchStart ][0]( tEvent, _ev ) ) tEvent.evFnRiff[ tg.touchStart ][1].call( _ev.target, _ev );
			var tEvFn = tEvent.evFnStart;

			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][0]( tEvent, _ev  ) ) tEvFn[ k ][1].call( _ev.target, _ev );
			}
			tg = tEvFn = tEvent = null;
			return true;
		},
		//n internal function
		//n touchstart function for primary "touchmove" ( or mousemove etc ) function.
		primaryTouchMove : function( _ev ) {
			var tg = riff.global.event, tEvent = riff.data.bufferSingle( _ev.target, tg.bfName );
			tEvent.moveTime = ( new Date() ).getTime();
			tEvent.status.touchmove = true;
			tEvent.prevX = tEvent.curX;
			tEvent.prevY = tEvent.curY;
			tEvent.curX = _ev.clientX;
			tEvent.curY = _ev.clientY;

			if( tEvent.evFnRiff[ tg.touchMove ] && tEvent.evFnRiff[ tg.touchMove ][0]( tEvent, _ev ) ) tEvent.evFnRiff[ tg.touchMove ][1].call( _ev.target, _ev );
			var tEvFn = tEvent.evFnMove;

			for( var k in evfn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][0]( tEvent, _ev  ) ) tEvFn[ k ][1].call( _ev.target, _ev );
			}
			tg = tEvFn = tEvent = null;
			return true;
		},
		//n internal function
		//n touchstart function for primary "touchup" ( or mouseup etc ) function.
		primaryTouchEnd : function( _ev ) {
			var tg = riff.global.event, tEvent = riff.data.bufferSingle( _ev.target, tg.bfName );
			tEvent.endTime = ( new Date() ).getTime();
			tEvent.status.touchend = true;
			tEvent.prevX = tEvent.curX;
			tEvent.prevY = tEvent.curY;
			tEvent.curX = _ev.clientX;
			tEvent.curY = _ev.clientY;

			if( tEvent.evFnRiff[ tg.touchEnd ] && tEvent.evFnRiff[ tg.touchEnd ][0]( tEvent, _ev ) ) tEvent.evFnRiff[ tg.touchEnd ][1].call( _ev.target, _ev );
			var tEvFn = tEvent.evFnEnd;
			for( var k in tEvFn )
			{
				if( tEvFn[ k ] && tEvFn[ k ][0]( tEvent, _ev ) ) tEvFn[ k ][1].call( _ev.target, _ev );
			}

			tg = tEvFn = tEvent = null;
			return true;
		},

		extend : function( _newEvent ) {
			for( var k in _newEvent )
			{
				riff.event[k] = _newEvent[k].addEvent;
				riff.event[k].checkEventEnable = _newEvent[k].checkEventEnable;
			}
		}
	}
});









