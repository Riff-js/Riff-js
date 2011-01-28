//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


var riffTouch = {
	theTarget:null,				// this variable is used to identity the triggering element
	fingerCount:0,				// for multi-touch detect		
	startX:0,					// mouse(touch) start coordinate 
	startY:0,
	curX:0,						// current coordinate 
	curY:0,
	preX: 0,					// previous coordinates ( for mouse/touch move etc ) 
	preY: 0,
	FLICKDX: 0,					// previous~current movement distance of x-axis 
	FLICKDY: 0,					
	FLICKLength: 0,				// distance of mouse/touch start ~ mouse/touch end 
	FLICKAngle: null,			// FLICK angle 
	currentTouchStartTime : 0,  // time of touchStart. 
	beforeTouchEndTime : 0,     // previous touch/mouse time of toucnEnd. not current time. 
	lastTouchMoveTime : 0,      // latest touch/mouse move time  
	lastMoveLength : 0,         // latest touch move length 
	isDoubleFired : false,		// can "double tap" fired? 		
	isLongTapFired : false,     // can "long tap" fired? 
	eventNodeObj : null,        // save the event-fired element( DOM node elements ) for window.setTimeout() event  
	FLICKMinLength: 3,			// the last FLICK distance by touchmove 
    
	// send the artifitial event @_eventType to the @_target with @_data.
    Send : function( _eventType, _target, _data )
    {
		var saveEvent = riff(_target).buffer("riffSaveEvent");
        if( saveEvent && saveEvent[_eventType] == false)    
            return;

		// create event object 
        if ( document.createEvent )
        {
            var e = document.createEvent("Events");
            e.initEvent( _eventType, true, false );
        }
        else
        {
            return;
        }
        e.data = _data;
		
		// Fire the event.
        if ( _target.dispatchEvent )
        {
            _target.dispatchEvent( e );	
        }
        else if ( _target.fireEvent )
        {
            _target.fireevent( 'on' + _eventType, e );
        } 
        else
        {
		}
    },

	// receives the artifitial event @_eventType , @_target and runs @_handle( : function ). 
	Receive : function( _eventType, _target, _handle )
    {
        if ( _target.addEventListener )
            _target.addEventListener( _eventType, _handle, false );
        else if ( _target.attachEvent )                             // IE
            _target.attachEvent( "on" + _eventType , _handle );
    },

	// caluculates the angle( between @_startx, @_starty, @_currentx, @_currenty )
	caluculateAngle : function( _obj, _startx, _starty, _currentx, _currenty ) 
	{
		var X = _startx - _currentx;
		var Y = _currenty - _starty;
		var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
		var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
        _obj.FLICKAngle = Math.round(r*180/Math.PI); //angle in degrees
		if ( _obj.FLICKAngle < 0) 
		{ 
			_obj.FLICKAngle =  360 - Math.abs( _obj.FLICKAngle );
		}
	},

	// determines the swip direction by @_FLICKAngle
	determineFLICKDirection : function ( _FLICKAngle ) {
		if ( ( _FLICKAngle <= 45) && ( _FLICKAngle >= 0) ) {
			return 'left';
		} 
		else if ( ( _FLICKAngle <= 360) && ( _FLICKAngle >= 315) ) {
			return 'left';
		} 
		else if ( ( _FLICKAngle >= 135) && ( _FLICKAngle <= 225) ) {
			return 'right';
		} 
		else if ( ( _FLICKAngle > 45) && ( _FLICKAngle < 135) ) {
			return 'down';
		} 
		else {
			return 'up';
		}
	},

	// reset the variables to the default state.
	touchcancel : function( _obj, _eventNodeObj ) {
		_obj.startX = 0;
		_obj.startY = 0;
		_obj.curX = 0;
		_obj.curY = 0;
		_obj.preX = 0;
    	_obj.preY = 0;
		_obj.FLICKLength = 0;
		_obj.FLICKDX = 0;
		_obj.FLICKDY = 0;
		_obj.lastMoveLength = 0;
		_obj.isLongTapFired = false;
		_obj.FLICKAngle = null;
	},

	// the timeout event for check "tap" event. 
	// if the "tap" happens, 
	// wait the "fixed duration" for detecting "double tap"
	// if there is no other "tap" event fired during the "fixed duration"
	// event ends as the "tap" event.
    tapFirstCheck : function( )
    {
        if ( !riffTouch.isDoubleFired )
        { 
			// if the "double tap" can work.
            riffTouch.Send( riffGlobal.EVENTSTRING.TAP, riffTouch.eventNodeObj, { x: riffTouch.startX, y:riffTouch.startY } );
        }
        riffTouch.isDoubleFired = false;
	},

	// the timeout event for check "long tap" event. 
	// if the "tap" happens, 
	// wait the "fixed duration" ~ fired during the "fixed duration",
	// event ends as the "long tap" event.
    longTapCheck : function( )
    {
        
        if( riffTouch.isLongTapFired == true )
        {
			// if the "long tap" can work.
            riffTouch.Send( riffGlobal.EVENTSTRING.LONG_TAP, riffTouch.eventNodeObj, { x: riffTouch.startX, y:riffTouch.startY } );
        }
        riffTouch.isLongTapFired = false;
    },

	// check for the "tap" event.
	// there is difference between phone and desktop to fired the "tap" event.
	// on phone, the tap event fires by "touchstart->touchend".
	// on desktop, the tap event fires by "touchstart->touchend->touchmove".
	// on phone, the currentX / currentY values are the "undefined" after the touchend.
	// on desktop, the currentX / currentY values have values(coordinates) after the touchend.
	// so, the judgement for the "tap" event between desktop and phone should be different.
	isTapWorkOnTouchEnd : function ( _eventNodeObj, _touchObj, _isEventRun ) 
	{
		if ( ( ! _eventNodeObj[riffGlobal.EVENTSTRING.TAP] )  // no "tap" event binded
			|| ( _isEventRun ) )		// previous event is worked. 
		{
			return false;		// do not fire the tap event.
		}
		
		var rv = false;
		if ( !riff.isWidget() )	// Desktop state ?
		{	
			// no movement between "mousedown" and "mouseup" for the tap event ?
			if ( riff(_eventNodeObj).buffer("riffTouchStartX") == riff(_eventNodeObj).buffer("riffTouchCurX") && riff(_eventNodeObj).buffer("riffTouchStartY") == riff(_eventNodeObj).buffer("riffTouchCurY") )		
			{	
				rv = true;
			}
		} 
		else
		{	
			// there is no "touchmove" event.
			if ( riff(_eventNodeObj).buffer("riffTouchCurX") == 0 && riff(_eventNodeObj).buffer("riffTouchCurY") == 0 )
			{
				rv = true;
			}
		}
		return rv;
	} ,

	dataCopy : function(_eventNodeObj,_touchObj)
	{	
		riff(_eventNodeObj).buffer("riffTouchStartX",_touchObj.startX);  
		riff(_eventNodeObj).buffer("riffTouchStartY",_touchObj.startY);  
		riff(_eventNodeObj).buffer("riffTouchCurX",_touchObj.curX);  
		riff(_eventNodeObj).buffer("riffTouchCurY",_touchObj.curY);  
		riff(_eventNodeObj).buffer("riffTouchPreX",_touchObj.preX);  
		riff(_eventNodeObj).buffer("riffTouchPreY",_touchObj.preY);  
		riff(_eventNodeObj).buffer("riffTouchFLICKLength",_touchObj.FLICKLength);  
		riff(_eventNodeObj).buffer("riffTouchFLICKDX",_touchObj.FLICKDX);  
		riff(_eventNodeObj).buffer("riffTouchFLICKDY",_touchObj.FLICKDY);  
		riff(_eventNodeObj).buffer("riffTouchLastMoveLength",_touchObj.lastMoveLength);  
		riff(_eventNodeObj).buffer("riffTouchFLICKAngle",_touchObj.FLICKAngle);  
		riff(_eventNodeObj).buffer("riffTouchLastTouchMoveTime",_touchObj.lastTouchMoveTime); 
		riff(_eventNodeObj).buffer("riffTouchCurrentTouchStartTime",_touchObj.currentTouchStartTime);   
		riff(_eventNodeObj).buffer("riffTouchBeforeTouchEndTime",_touchObj.beforeTouchEndTime);	
	},
	// touch event processing
	procTouch : {
		// if mouse event worked( for PC ) 
		mousedown: function( ev, _eventNodeObj, _touchObj, coors )
		{
			// match mouse event to touch event.
			_touchObj.procTouch[ "touchstart" ]( ev, _eventNodeObj, _touchObj, coors );	
		},
		touchstart: function( ev, _eventNodeObj, _touchObj, coors )
		{
			// single touch( one finger touch ) 
			if ( _touchObj.fingerCount == 1 )
			{						
			    // get a time-date for the "long tap/FLICK" event;
			    
			    _touchObj.isLongTapFired = true;
			    _touchObj.currentTouchStartTime = new Date().getTime();	
				// the "tap" / "long tap" event node element for the window.setTimeout() event.
				_touchObj.eventNodeObj = _eventNodeObj;		
				// get the coordinates of the touch
    			_touchObj.startX = coors[0];
	    		_touchObj.startY = coors[1];
				// if this is the first "touchmove"
	    		if ( ( riff(_eventNodeObj).buffer("riffTouchPreX") <= 0 ) && ( riff(_eventNodeObj).buffer("riffTouchPreY") <= 0 ) ) 
	    		{  
					 // set the coordinates.
					_touchObj.preX = coors[0];
	        		_touchObj.preY = coors[1];
                }

				// "TOUCHSTART" event attached?
                if( _eventNodeObj[riffGlobal.EVENTSTRING.TOUCH_START] )
                {
                    _touchObj.Send( riffGlobal.EVENTSTRING.TOUCH_START, _eventNodeObj, { x: _touchObj.startX, y:_touchObj.startY } );
                }

				// "LONG_TOUCH" event attached?
                if( _eventNodeObj[riffGlobal.EVENTSTRING.LONG_TAP] )
                {                    
					// the "tap" event detection needs the fixed duration. so set a timer.
                    //riff.timer("riffLongTapTimer");
                    riff.timer(function(value) 
                    { 
                        riffTouch.longTapCheck(); 
                        if(value == 1)
                            riff.timer("riffLongTapTimer");
                    },riff(_eventNodeObj).buffer("riffLongTapTime"),"riffLongTapTimer");
                }
                
                _touchObj.dataCopy(_eventNodeObj,_touchObj);
			}
			else
			{
				// not the single touch?
				// cancel event.
				_touchObj.touchcancel();
			}
			
		},

		mousemove: function( ev, _eventNodeObj, _touchObj, coors )
		{
			// if mouse event worked( for PC ) 
			// matches mouse event to touch event.
			_touchObj.procTouch[ "touchmove" ]( ev, _eventNodeObj, _touchObj, coors ) ;
		},
		touchmove: function( ev, _eventNodeObj, _touchObj, coors ) 
		{	
			// for the single touch( single finger )		
			if ( _touchObj.fingerCount == 1 ) 
			{
			    
				// current coordinates by touchmove.
				_touchObj.curX = coors[0];
				_touchObj.curY = coors[1];
				_touchObj.lastTouchMoveTime = new Date().getTime();
				_touchObj.isLongTapFired = false;           
                if( _eventNodeObj[riffGlobal.EVENTSTRING.TOUCH_MOVE] ) 
                {
                	// "TOUCH_MOVE" event attached?
                    _touchObj.Send( riffGlobal.EVENTSTRING.TOUCH_MOVE, _eventNodeObj, { x: _touchObj.curX, y:_touchObj.curY  } );
                }
				// "drag" event attached?
				// does "touchstart" started?
				
                if( _eventNodeObj[riffGlobal.EVENTSTRING.DRAG] 
				&& ( riff(_eventNodeObj).buffer("riffTouchStartX") != 0 
				&& riff(_eventNodeObj).buffer("riffTouchStartX") != null 
				&& riff(_eventNodeObj).buffer("riffTouchStartY") != 0 ) 
				&& (riff(_eventNodeObj).buffer("riffTouchStartX") != riff(_eventNodeObj).buffer("riffTouchCurX")
				|| riff(_eventNodeObj).buffer("riffTouchStartY") != riff(_eventNodeObj).buffer("riffTouchCurY")))  
				{
                    _touchObj.Send( riffGlobal.EVENTSTRING.DRAG, _eventNodeObj, { x: _touchObj.curX, y:_touchObj.curY, preX: riff(_eventNodeObj).buffer("riffTouchPreX"), preY: riff(_eventNodeObj).buffer("riffTouchPreY") , EventState : "dragMove"} );
                }

			    if ( _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_LEFT]
    			    || _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_RIGHT]
    			    || _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_UP]
    			    || _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_DOWN] )   
			    {   
                    _touchObj.lastMoveLength = Math.round(Math.sqrt(Math.pow( _touchObj.curX - riff(_eventNodeObj).buffer("riffTouchPreX"),2)
                    						 + Math.pow( _touchObj.curY - riff(_eventNodeObj).buffer("riffTouchPreY"),2)));				
                    						 
                    _touchObj.caluculateAngle( _touchObj, riff(_eventNodeObj).buffer("riffTouchPreX"), riff(_eventNodeObj).buffer("riffTouchPreY"), _touchObj.curX, _touchObj.curY );
                    
                    _touchObj.FLICKDX = _touchObj.curX - riff(_eventNodeObj).buffer("riffTouchPreX");
                    _touchObj.FLICKDY = _touchObj.curY - riff(_eventNodeObj).buffer("riffTouchPreY");
					// only records the distance between moved-coordinates. do not fire event here.
                }

				_touchObj.preX = _touchObj.curX;
				_touchObj.preY = _touchObj.curY;
			} 
			else 
			{
				_touchObj.touchcancel();
			}
			_touchObj.dataCopy(_eventNodeObj,_touchObj);
		},

		//if mouse event worked( for PC ) 
		mouseup: function( ev, _eventNodeObj, _touchObj, coors ) 
		{
			// matches mouse event to touch event.
			_touchObj.procTouch[ "touchend" ]( ev, _eventNodeObj, _touchObj, coors );
		},		
		touchend: function( ev, _eventNodeObj, _touchObj, coors )
		{
			_touchObj.curX = coors[0];
			_touchObj.curY = coors[1];
    	   	var	isEventRun = false;
		    _touchObj.currentTouchEndTime = new Date().getTime();
			_touchObj.isLongTapFired = false;      
            
            if ( _eventNodeObj[riffGlobal.EVENTSTRING.TOUCH_END] )
            {		
            	// the "TOUCH_END" should fired before "tap / double tap / flick / FLICK " start.
                _touchObj.Send( riffGlobal.EVENTSTRING.TOUCH_END, _eventNodeObj, { x: riff(_eventNodeObj).buffer("riffTouchCurX"), y:riff(_eventNodeObj).buffer("riffTouchCurY")} );	
            }
			if ( _eventNodeObj[riffGlobal.EVENTSTRING.DOUBLE_TAP] ) 
			{		
				// does "double tap" attached?
			    if ( ( _touchObj.currentTouchEndTime - riff(_eventNodeObj).buffer("riffTouchBeforeTouchEndTime")) < riffGlobal.TouchTimer.doubleTap ) 
			    {	
			    	// the time-duration between "tap" and "double tap" is small enough
                    _touchObj.isDoubleFired = true;
    				isEventRun = true;
                    _touchObj.Send( riffGlobal.EVENTSTRING.DOUBLE_TAP, _eventNodeObj, 
                    { x: riff(_eventNodeObj).buffer("riffTouchCurX"), y:riff(_eventNodeObj).buffer("riffTouchCurY") });
                }
            }
          
            if( _eventNodeObj[riffGlobal.EVENTSTRING.DRAG] 
				&& ( riff(_eventNodeObj).buffer("riffTouchStartX") != 0 
				&& riff(_eventNodeObj).buffer("riffTouchStartX") != null 
				&& riff(_eventNodeObj).buffer("riffTouchStartY") != 0 ) 
				&& (riff(_eventNodeObj).buffer("riffTouchStartX") != riff(_eventNodeObj).buffer("riffTouchCurX")
				|| riff(_eventNodeObj).buffer("riffTouchStartY") != riff(_eventNodeObj).buffer("riffTouchCurY"))) 
			{
                _touchObj.Send( riffGlobal.EVENTSTRING.DRAG, _eventNodeObj, 
               		{ x: _touchObj.curX, y:_touchObj.curY, preX: riff(_eventNodeObj).buffer("riffTouchPreX"), preY: riff(_eventNodeObj).buffer("riffTouchPreY"),EventState : "dragEnd" } );
            }

			// the "FLICK" event exists ? 
			// the time-duration between "touchmove" and "touchend" is small enough
			// the distance of "touchmove" is small enough.	
			if ( ( _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_LEFT]
			    || _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_RIGHT]
			    || _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_UP]
			    || _eventNodeObj[riffGlobal.EVENTSTRING.FLICK_DOWN] )
			    && ( ( _touchObj.currentTouchEndTime - riff(_eventNodeObj).buffer("riffTouchLastTouchMoveTime") ) < riffGlobal.TouchTimer.FLICK )
			    && ( ( _touchObj.curX !=  _touchObj.startX ) && ( _touchObj.curY != _touchObj.startY ) )
			    && ( riff(_eventNodeObj).buffer("riffTouchLastMoveLength") > _touchObj.FLICKMinLength ) )
            	{	
    			// get the distance and direction. 
    			_touchObj.FLICKLength = Math.round(Math.sqrt( Math.pow( riff(_eventNodeObj).buffer("riffTouchCurX") - riff(_eventNodeObj).buffer("riffTouchStartX"), 2 ) + Math.pow( riff(_eventNodeObj).buffer("riffTouchCurY") - riff(_eventNodeObj).buffer("riffTouchStartY"), 2 ) ) );
	    		var direction = _touchObj.determineFLICKDirection( riff(_eventNodeObj).buffer("riffTouchFLICKAngle"));
	    		isEventRun = true;
			    switch( direction ) 
			    {
			        case 'left' :
			            direction = riffGlobal.EVENTSTRING.FLICK_LEFT ;
			            break;
			        case 'right' :
			            direction = riffGlobal.EVENTSTRING.FLICK_RIGHT ;
			            break;
			        case 'up' :
			            direction = riffGlobal.EVENTSTRING.FLICK_UP ;
			            break;
			        case 'down' :
			            direction = riffGlobal.EVENTSTRING.FLICK_DOWN ;
			            break;
			        default :
			            break;
			    }
			    
                _touchObj.Send( direction, _eventNodeObj,
                	 { startT:riff(_eventNodeObj).buffer("riffTouchCurrentTouchStartTime") , endT:_touchObj.currentTouchEndTime, x: riff(_eventNodeObj).buffer("riffTouchStartX"), y:riff(_eventNodeObj).buffer("riffTouchStartY"),x: riff(_eventNodeObj).buffer("riffTouchCurX"), y:riff(_eventNodeObj).buffer("riffTouchCurY"),  dx:riff(_eventNodeObj).buffer("riffTouchFLICKDX"), dy:riff(_eventNodeObj).buffer("riffTouchFLICKDY"),length:_touchObj.FLICKLength } );
            }

			// can the "tap" event fire?
            if ( _touchObj.isTapWorkOnTouchEnd( _eventNodeObj, _touchObj, isEventRun ) )		
            {
				// if there is "double tap" attated, use the timeout() for determine between "tap" and "double tap"
                if ( _eventNodeObj[riffGlobal.EVENTSTRING.DOUBLE_TAP] )
                {	
					_touchObj.eventNodeObj = _eventNodeObj;		
					_touchObj.userEvent = ev;					
                    window.setTimeout( function () { riffTouch.tapFirstCheck(); }, riffGlobal.TouchTimer.doubleTap );
				}
				else
				{
					_touchObj.Send( riffGlobal.EVENTSTRING.TAP, _eventNodeObj, { x: riff(_eventNodeObj).buffer("riffTouchStartX"), y:riff(_eventNodeObj).buffer("riffTouchStartY") } );	
                }
            }

			// clear the event-related values for next event.
			
            _touchObj.touchcancel( _touchObj );	
            _touchObj.beforeTouchEndTime = _touchObj.currentTouchEndTime;
            _touchObj.dataCopy(_eventNodeObj,_touchObj);
		}
		
	},


	// touch event listener
	onTouchEvent : function( ev )
	{
	    var _obj = riffTouch;

		var coors = [];
		if (ev.touches && ev.touches.length)
		 { 	
		 	// webkit
			coors[0] = ev.touches[0].clientX;
			coors[1] = ev.touches[0].clientY;
		} 
		else 
		{
			// all others
			coors[0] = ev.clientX;
			coors[1] = ev.clientY;
		}

		try
		{
			_obj.fingerCount = ev.touches.length;
		}
		catch ( e )
		{
			_obj.fingerCount = 1;
		}
        var tevType = ev.type;
        if ( _obj.procTouch[ tevType ] )
        {
            _obj.procTouch[ tevType ]( ev, this, _obj, coors )
        } 
        else
        {
        }
	},
	AddEvent : function( _touchObj, _eventType, _nodeObject, _func )		// add event
    {
        switch( _eventType )
        {  
            case riffGlobal.EVENTSTRING.FLICK_LEFT :
            case riffGlobal.EVENTSTRING.FLICK_RIGHT :
            case riffGlobal.EVENTSTRING.FLICK_UP :
            case riffGlobal.EVENTSTRING.FLICK_DOWN :
            case riffGlobal.EVENTSTRING.TAP :
            case riffGlobal.EVENTSTRING.LONG_TAP :
            case riffGlobal.EVENTSTRING.DOUBLE_TAP :
            case riffGlobal.EVENTSTRING.DRAG :
            case riffGlobal.EVENTSTRING.TOUCH_START :
            case riffGlobal.EVENTSTRING.TOUCH_MOVE :
            case riffGlobal.EVENTSTRING.TOUCH_END :
            {
                _nodeObject[_eventType] = _func;
                
                var eventType;
                if(!riff(_nodeObject).buffer("riffSaveEvent"))
                {   
                    eventType = {};
                    riff(_nodeObject).buffer("riffSaveEvent",eventType);
                }   
                eventType = riff(_nodeObject).buffer("riffSaveEvent");              
                eventType[_eventType] = true;
                riff(_nodeObject).buffer("riffSaveEvent",eventType);
                _touchObj.Receive( _eventType, _nodeObject, _func );
                break;
            }
            default :
                break;
        }

        if ( ! _nodeObject[ _eventType ] )
        {
        	// usual( existed ) event
            _nodeObject.addEventListener( _eventType, _func, false );
        }
    },
    dragForSwipe : function( ev )
	{	
	    var thisObj = riff(this);
	    var func = thisObj.buffer("riffSwipeFunc");
	    var isSwipeEnd = thisObj.buffer("riffSwipeIsSwipeEnd"); 
	    
	    var dragX = window.parseInt( thisObj.css("left") );
    
        if(thisObj.css("left") == "auto" && thisObj.css("right") == "auto") { dragX = 0;}
        else
        {   
            if(thisObj.css("right") != "auto" && thisObj.css("left") == "auto")
                dragX = thisObj.parent().width() - window.parseInt( thisObj.css("right")) - thisObj.width();
        }
	    var dx = ( ev.data.preX > 0 ) ? ( ev.data.x - ev.data.preX ) : 0 ;		
		var thisWidth = window.parseInt( thisObj.css("width"));
        
        if(thisObj.parent().width() > thisObj.width())
        {
            if((dragX < 0 || dragX > thisObj.parent().width() - thisObj.width()) && isSwipeEnd)	
            {
                if(dragX < 0)
	                thisObj.css( "left", 0 + "px" );
                else
	                thisObj.css( "left", (thisObj.parent().width()) - thisObj.width() + "px" ); 
                return;
            }
            else
                thisObj.css( "left", dragX + dx + "px" );
        }
        else
        {
            if((dragX > 0 || dragX * -1 > thisObj.width() - thisObj.parent().width()) && isSwipeEnd)	
		    {
			    if(dragX > 0)
				    thisObj.css( "left", 0 + "px" );
			    else
				    thisObj.css( "left", -1 * (thisObj.width() - thisObj.parent().width()) + "px" ); 
			    return;
		    }
	        else
   	    	    thisObj.css( "left", dragX + dx + "px" );
        }
		if( func )
			func.call(this,"dragMove",thisObj.css("left"),thisObj.css("top"));
	},
	flickForSwipe : function(ev)
	{   
		riff(this).buffer("riffSwipeTimerCount",0);

		riff.timer("riffSwipeTimer");
	    var currentLeft = window.parseInt( riff(this).css("left") );
			
	    var dx = ev.data.dx;
	    var movePositionLift = currentLeft + ( ( ev.data.x - ev.data.startX ) * 2 ); 
		var len = ev.data.x - ev.data.startX;
	
		var verlocity = dx * riff(this).buffer("riffSwipeVerlocityPercent") / 100;
		var position = currentLeft;

		riff(this).buffer("riffSwipeVerlocity",verlocity);
		riff(this).buffer("riffSwipeObjPosition",position);
	
		var thisObject = this;	
		riff.timer(function() { riffTouch.swipeTimer.call( thisObject,ev ); },16, "riffSwipeTimer");
	},
	swipeTimer : function(ev)
	{	
	    if(ev.data.length == 0)
	        return;
		
		var func = riff(this).buffer("riffSwipeFunc");
		var isSwipeEnd = riff(this).buffer("riffSwipeIsSwipeEnd"); 
		var isEventStop = riff(this).buffer("riffSwipeEventStop");
		
		var m_currentPositionX = window.parseInt( riff(this).css("left") );
		var m_currentPositionY = window.parseInt( riff(this).css("top") );

		if(isEventStop)
		{
            riff(this).buffer("riffSwipeTimerCount",0);
            riff.timer("riffSwipeTimer");
            if( func )
				func.call(this,"end",m_currentPositionX,m_currentPositionY);
		    riff(this).buffer("riffSwipeEventStop",false);
			return;
		}
		var swipeTimerCount = riff(this).buffer("riffSwipeTimerCount");
		swipeTimerCount++;
		
		riff(this).buffer("riffSwipeTimerCount",swipeTimerCount);
		
		if(swipeTimerCount == 1)
		    if( func ) {func.call(this,ev.data.EventType == "FLICK_LEFT" ? "leftMove" : "rightMove" ,m_currentPositionX,m_currentPositionY);}
		
        if(riff(this).parent().width() > riff(this).width())
        {    
		    if((m_currentPositionX < 0 || m_currentPositionX > riff(this).parent().width() - riff(this).width())&& isSwipeEnd)
		    {
			    riff.timer("riffSwipeTimer");
			    if(m_currentPositionX < 0) riff(this).css('left', 0 + "px" );
			    else riff(this).css( "left", (riff(this).parent().width()) - riff(this).width() + "px" ); 	
			    if( func )func.call(this,m_currentPositionX < 0 ? "leftEnd":"rightEnd",m_currentPositionX,m_currentPositionY);
			    return;
		    }

		    else if(30 > swipeTimerCount)
		    {
			    riff(this).buffer("riffSwipeObjPosition",riff(this).buffer("riffSwipeObjPosition") +  riff(this).buffer("riffSwipeVerlocity")); //TouchVar_position += TouchVar_verlocity;
			    riff(this).css('left', riff(this).buffer("riffSwipeObjPosition") + "px" );
		    }
		    else if(swipeTimerCount == 50)
		    //swipe timer end 
		    {
			    riff.timer("riffSwipeTimer");
			    riff(this).buffer("riffSwipeTimerCount",0);
			    if( func )func.call(this,"end",m_currentPositionX,m_currentPositionY);
			    return;
		    }
		    else
		    {
			    riff(this).buffer("riffSwipeVerlocity",riff(this).buffer("riffSwipeVerlocity") - riff(this).buffer("riffSwipeVerlocity")/20);//TouchVar_verlocity -= TouchVar_verlocity / 20;
			    riff(this).buffer("riffSwipeObjPosition",riff(this).buffer("riffSwipeObjPosition") +  riff(this).buffer("riffSwipeVerlocity"));
			    riff(this).css('left', riff(this).buffer("riffSwipeObjPosition") + "px" );
		    }//
        }
        else
        {
		    if((m_currentPositionX > 0 || m_currentPositionX * -1 > riff(this).width() - riff(this).parent().width()) && isSwipeEnd)
		    {
			    riff.timer("riffSwipeTimer");
			    if(m_currentPositionX > 0) riff(this).css('left', 0 + "px" );
			    else riff(this).css('left',-1* (riff(this).width() - riff(this).parent().width()) + "px" );
			    if( func ) func.call(this,m_currentPositionX > 0 ? "leftEnd":"rightEnd",m_currentPositionX,m_currentPositionY);
			    return;
		    }

		    else if(30 > swipeTimerCount)
		    {
			    riff(this).buffer("riffSwipeObjPosition",riff(this).buffer("riffSwipeObjPosition") +  riff(this).buffer("riffSwipeVerlocity")); //TouchVar_position += TouchVar_verlocity;
			    riff(this).css('left', riff(this).buffer("riffSwipeObjPosition") + "px" );
		    }
		    else if(swipeTimerCount == 50)
		    //swipe timer end 
		    {
			    riff.timer("riffSwipeTimer");
			    riff(this).buffer("riffSwipeTimerCount",0);
			    if( func ) func.call(this,"end",m_currentPositionX,m_currentPositionY);
			    return;
		    }
		    else
		    {
			    riff(this).buffer("riffSwipeVerlocity",riff(this).buffer("riffSwipeVerlocity") - riff(this).buffer("riffSwipeVerlocity")/20);//TouchVar_verlocity -= TouchVar_verlocity / 20;
			    riff(this).buffer("riffSwipeObjPosition",riff(this).buffer("riffSwipeObjPosition") +  riff(this).buffer("riffSwipeVerlocity"));
			    riff(this).css('left', riff(this).buffer("riffSwipeObjPosition") + "px" );
		    }  
        }
		if( func )
			func.call(this,"move",m_currentPositionX,m_currentPositionY);
	},
	
	dragMove : function(ev)
	{
	    var thisObj = riff(this);
	    var state = "dragMove";
	    
	    if(!thisObj.buffer("riffDragFirstCheckFlag"))
	    {
	        thisObj.buffer("riffDragFirstCheckFlag",true);
	        state = "dragStart";
	    }
	    
	    if(ev.data.EventState == "dragEnd")
	    {
	        thisObj.buffer("riffDragFirstCheckFlag",false);
	        state = "dragEnd";
	    }
    
	    var dragX = window.parseInt( thisObj.css("left") );
        var dragY = window.parseInt( thisObj.css("top") );
        
        if(thisObj.css("left") == "auto" && thisObj.css("right") == "auto") { dragX = 0;}
        else
        {   
            if(thisObj.css("right") != "auto" && thisObj.css("left") == "auto")
                dragX = thisObj.parent().width() - window.parseInt( thisObj.css("right")) - thisObj.width();
        }
            
        if(thisObj.css("top") == "auto" && thisObj.css("bottom") == "auto") { dragY = 0; }
        else
        {
            if(thisObj.css("bottom") != "auto" && thisObj.css("top") == "auto")
            {
                dragY = thisObj.parent().height() - window.parseInt( thisObj.css("bottom")) -thisObj.height();
            }    
        }   
	    var dx = ( ev.data.preX > 0 ) ? ( ev.data.x - ev.data.preX ) : 0 ;
	    var dy = ( ev.data.preY > 0 ) ? ( ev.data.y - ev.data.preY ) : 0 ;
		
        thisObj.css( "left", dragX + dx + "px" );
        thisObj.css( "top", dragY + dy  + "px" );
        
	    var func = thisObj.buffer("riffDragEventFunc");
        if( func )
			func.call(this,state,dragX,dragY,state);
	}
};
