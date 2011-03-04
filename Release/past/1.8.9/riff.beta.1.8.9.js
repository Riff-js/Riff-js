//
// Riff Beta 1.8.9
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


(
function(window) {



// Riff Global Object
// Riff object is used to set global variables.
// the variables for globalsetting() must be set first before the variables of riffglobal

var riffGlobal = new (function()
{

	// Used by $().buffer(). A global array to store actual data.
	this.buffer = new Array();
	// the $().buffer() within the class will have IDs that start at 1 and increase in order
	this.bufferID = 0;
	// the prefix of the ID attached to the class by $().buffer().
	this.prefixBufferID = "riffBufferID-";
	// the list that stores the timer list used by $.timer(), a function that is used make managing timers easy.
	this.timerList = new Array(); // timer list
	// A queue object used for Animation
	this.queueList = new Array();
	// Stores the ID of the popup shown on screen. It is used to indicate if the popup is activated or not.
	this.isPopup = "";
	// Whenever the screen changes, the stack() is used in order to enable the go / back functionality
	this.sceneStack = new Array();

	this.EndKeyType	= true;

	// Basic values of Transition Effects

	// When the scene changes
	// Scene transition types
	this.transitionEffect = "slideHor";
	// Motion speed
	this.transitionSecond = "0.5s";
	// Acceleration setting. The css attributes are used.
	this.transitionMotion = "ease";

	// When the Popup changes
	// Popup Type
	this.popupTransitionEffect = "popup";
	// Motion speed
	this.popupTransitionSecond = "0.5s";
	// Acceleration setting. The css attributes are used.
	this.popupTransitionMotion = "ease";
	// Transition direction
	this.transitionDirection = "on";


	// Softkey
	// Softkey type
	this.softkeyType = "type1";
	// Back button setting
	this.softkeyFunc = null;
	// the array value of the key and data
	this.softkeyData = null;

	// the array value of the key and data (the object which stores the softkey when it changes according to the component)
	this.softkeyDataGlobal = null;
	// Back button setting (the object which stores the softkey when it changes according to the component)
	this.softkeyFuncGlobal = null;

	// Array values for the key and data for the Setting screen
	this.softkeySetListData = null;
	// Back button settings for the Setting screen
	this.softkeySetListFunc = null;
	// Selected data on the Setting screen
	this.setListSelectData = null;

	this.ellipsisStringNum = 20;
	this.idleArticleEllipsisStringLength = 100;

	// Refresh and Auto refresh

	// AutoRefresh Time
	this.feedAutoRefreshTime = 0;
	// Data will always be refreshed, regardless of the flag set on refresh.
	this.isAlwaysNewScenePart = false;
	// Boolean value to indicate if AutoRefresh applies to other inactive sceneParts
	this.isAutoRefreshChangeOtherscenePart = true;
	// Boolean value to indicate if Refresh applies to other inactive sceneParts
	this.isRefreshChangeOtherscenePart = false;

	// When using refresh on a PC Debug mode or restarting a Widget on a mobile device,
	// displays the last screen prior to being turned off
	this.pageCache = false;
	// Name used to distinguish between widgets. (this is different from the settings within config.xml)
	this.name = "NoName";
	// Theme
	this.theme = "";

	this.ajaxTimeoutMillisecond = 90000;
	this.ajaxRetry = 1;

	// Idle width setting
	this.widgetIdleWidth = 440;
	// Idle height setting
	this.widgetIdleHeight = 258;

	// indicates if keyboard events or touch events should be used (used for debugging)
	this.eventType = null;

	// indicates data communcation and transition order within the Tab Component
	this.tabTransitionOrder = "after";

	// Ajax communication state names
	this.AJAXREADYSTATE = {
		"UNINIT"		: 0,
		"NOTSENT"		: 1,
		"SENDING"		: 2,
		"RECEIVING"		: 3,
		"DONE"			: 4
	};

	// event string of the addEventListener() object used by TouchEvent
	 this.EVENTSTRING = {
         FLICK_LEFT :    "flickLeft"     ,
         FLICK_RIGHT :   "flickRight"    ,
         FLICK_UP :       "flickUp"      ,
         FLICK_DOWN :     "flickDown"    ,
         DRAG :           "drag"   ,
         SWIPE :       "swipe"  ,
         TAP :            "tap"    ,
         LONG_TAP :       "longTap"      ,
         DOUBLE_TAP :     "doubleTap"    ,
         TOUCH_START :    "touchStart"   ,
         TOUCH_MOVE :     "touchMove"    ,
         TOUCH_END :      "touchEnd"
	 };
	 this.EVENTTYPE = {
         MOUSE :			"mouse" ,
         TOUCH :			"touch" ,
         ANDROIDB :			"androidBrowser"
	 };

	// detection interval of Flick, doubleTap, longTap of TouchEvent (in milliseconds)
	this.TouchTimer = {
        FLICK : 1000,
	    doubleTap : 600,
	    longTap : 1000
    };


	// used to shorten the name of the Riff Object to $.
	this.$ = window.$;

})();


// Interface for using selector within Riff
// e.g.) riff("selector")
var riff = function( _s ) {
	return new riff.fn.selector( _s );
};


// .fn is used by the plug-in of the function
riff.fn = riff.prototype = {

	selector : function ( _s )
	{

		// array to process DOM objects
		var cArray;

		if( !_s )
		{
			cArray = new Array();
		}

		// argument : function
		else if( typeof _s == "function" )
		{
			riff.load( _s );
			return;
		}
		// argument : DOM object(single unit)
		else if ( _s == window || _s == document || _s.nodeType )
		{
			cArray = new Array();
			cArray[0] = _s;
		}
		// argument : DOM object( multiple units )
		else if( typeof _s == "object" )
		{
			cArray = _s;
		}

		// else search dom elements
		else
		{
			cArray = document.querySelectorAll(_s);
		}

		this.componentContext = this.contextToComponent(cArray);
		this.length = this.componentContext.length;

		return this;
	},

	// Transforms the input object into its related riff object
	contextToComponent : function ( _cArray )
	{
		var rArray = new Array();

		for ( var i = 0; _cArray[i]; i++ )
		{
			var c = _cArray[i];
			var id = _cArray[i].id;
			var classname = " " + _cArray[i].className + " ";

			// If the clasName of the DOM element is a reserved word (component)
			// the DOM element is changed to a Component Object
			if ( classname )
			{
				if( classname.indexOf(" rf-component-idle " ) != -1 )
					rArray[i] = new ComponentIdle( c );
				else if ( classname.indexOf(" rf-component-header ") != -1 )
					rArray[i] = new ComponentHeader( c );
				else if ( classname.indexOf(" rf-component-header-setting ") != -1 )
					rArray[i] = new ComponentHeaderSetting( c );
				else if ( classname.indexOf(" rf-component-list ") != -1 )
					rArray[i] = new ComponentList( c );
				else if ( classname.indexOf(" rf-component-softkey ") != -1 )
					rArray[i] = new ComponentSoftKey( c );
				else if ( classname.indexOf(" rf-component-popup ") != -1 )
					rArray[i] = new ComponentPopup( c );
				else if ( classname.indexOf(" rf-component-scene ") != -1 )
					rArray[i] = new ComponentScene( c );
				else if ( classname.indexOf(" rf-component-tabmenu ") != -1 )
					rArray[i] = new ComponentTabMenu( c );
				else if ( classname.indexOf(" rf-component-busyindicator ") != -1 )
					rArray[i] = new ComponentBusyIndicator( c );
				else if ( classname.indexOf(" rf-component-datareceivetime ") != -1 )
					rArray[i] = new ComponentDataReceiveTime( c );
				else if ( classname.indexOf(" rf-component-btn ") != -1 )
					rArray[i] = new ComponentButton( c );
			}

			// If the clasName of the DOM element is not a reserved word (component)
			// the DOM element is changed to a riffBasic Object
			if( !rArray[i] )
				rArray[i] = new riffBasic( c );
		}
		return rArray;
	},

	size : function ()
	{
		return this.length;
	},

	each : function( _func )
	{
		// checks the argument of the function
		if( !_func || typeof( _func ) != 'function' ) return this;

		for (var k = 0; this.component(k); k++ )
			_func.call( this.dom(k), k );

		return this;
	},

	filter : function ( _s )
	{
		// checks the validity of the argument
		if(!_s || typeof _s != "string")
			return this;

		// Selector string is split by white-space (" ") and inserted to an array.
		var selectorItems = (riff.trim(_s.split(".").join(" .").split("#").join(" #"))).split( /\s+/ ),
			l = selectorItems.length,
			cArray = new Array(),
			j;
		for ( var i =0, e; e = this.dom(i); i++ )
		{
			for( j = 0; j < l; j++)
				if( ( selectorItems[j].substr(0,1) == "#"  // if #id
					&& e.id != selectorItems[j].substring(1, selectorItems[j].length) )
				|| (selectorItems[j].substr(0,1) == "." // if class
					&& !riff(e).hasClass( selectorItems[j].substring(1, selectorItems[j].length) ) )
				|| ( selectorItems[j].substr(0,1) != "#" && // if tag name
					selectorItems[j].substr(0,1) != "." &&
					e.nodeName.toString().toUpperCase() != selectorItems[j].toUpperCase() ) )
					break;

			if ( j == l )
				cArray.push( e );
		}

		return riff(cArray);
	},

	not : function ( _s )
	{
		// checks the validity of the argument
		if( _s == undefined || _s == null ) {
			return this;
		// If the argument is anumber, it is regarded as the index of the DOM element
		} else if ( typeof _s == "number" )
		{
			var cArray = new Array();

			for( var i = 0, e; e = this.dom(i); i++ )
				if( i != _s )
					cArray.push( e );

			return riff( cArray );
		}
		else if ( typeof _s == "object" )
		{
			// If the argument is a DOM element, it is regarded as the DOM element to exclude
			var cArray = new Array();

			for(var i = 0, e; e = this.dom(i); i++ )
				if( this.dom(i) != _s )
					cArray.push( e );

			return riff( cArray );
		}
		else if( typeof _s == "string" )
		{
			// Selector string is split by white-space (" ") and inserted to an array.
			var selectorItems = (riff.trim(_s.split(".").join(" .").split("#").join(" #"))).split( /\s+/ ),
				l = selectorItems.length,
				cArray = new Array(),
				j;

			for ( var i =0, e; e = this.dom(i); i++ )
			{
				for( j = 0; j < l; j++)
					if( ( selectorItems[j].substr(0,1) == "#"  // if #id
						&& e.id == selectorItems[j].substring(1, selectorItems[j].length) )
					|| (selectorItems[j].substr(0,1) == "." // if class
						&& riff(e).hasClass( selectorItems[j].substring(1, selectorItems[j].length) ) )
					|| ( selectorItems[j].substr(0,1) != "#" && // if tag name
						selectorItems[j].substr(0,1) != "." &&
						e.nodeName.toString().toUpperCase() == selectorItems[j].toUpperCase() ) )
						break;

				if ( j == l )
					cArray.push( e );
			}

			return riff( cArray );
		}

		return this;
	},


	hasClass : function ( _class )
	{
		// checks the validity of the argument
		if( !_class || typeof(_class) != 'string' ) return true;

		// removing white spaces
		var classNames = (_class || "").split( /\s+/ );
		for (var i =0; this.dom(i); i++)
			for(var j=0; j<classNames.length; j++)
				if( (" " + this.dom(i).className + " ").indexOf( " " + classNames[j] + " ") == -1)
					return false;

		return true;
	},

	addClass : function ( _class )
	{
		// checks the validity of the argument
		if( !_class || typeof(_class) != 'string' ) return this;

		// removing white spaces
		var classNames = (_class || "").split( /\s+/ );

		for ( var i = 0; this.component(i); i++ )
		{
			var c = this.dom(i);

		    // if the className does not exist, the _class is added and the function is terminated
			if ( !c.className )
		    	c.className = riff.trim(_class);
		    // if exist
		    else
		    {
		    	var className = " " + c.className + " ", setClass = c.className;
		    	for ( var k = 0, cl = classNames.length; k < cl; k++ )
		    		if ( className.indexOf( " " + classNames[k] + " " ) < 0 )
		    			setClass += " " + classNames[k];

		    	c.className = riff.trim(setClass);
		    }
		}

		return this;
	},

	removeClass : function ( _class )
	{
		if( !_class || typeof(_class) != 'string' ) return this;

		var classNames = (_class || "").split( /\s+/ );

		for ( var i = 0; this.component(i); i++ )
		{
			var c = this.dom(i);

		    if( !c.className || !_class)
				c.className = "";
		    else if( c.className )
		    {
		    	var className = (" " + c.className + " ").replace( /[\n\t]/g, " ");
		    	for ( var k = 0, cl = classNames.length; k < cl; k++ )
		    		className = className.replace(" " + classNames[k] + " ", " ");
		    	c.className = riff.trim( className );
		    }
		}

		return this;
	},

	toggleClass : function ( _class )
	{
		if( !_class || typeof(_class) != 'string' ) return this;

		var classNames = (_class || "").split( /\s+/ );
		for ( var i = 0; this.component(i); i++ )
		{
			var c = this.dom(i);

		    if( !c.className)
   				c.className = riff.trim(_class);
		    else
		    {
		    	for ( var k = 0, cl = classNames.length; k < cl; k++ )
		    	{
		    		if( riff(c).hasClass(classNames[k]) )
		    			riff(c).removeClass(classNames[k]);
		    		else
		    			riff(c).addClass(classNames[k]);
		    	}
		    }
		}

		return this;
	},

	buffer : function ( _name, _data )
	{
		// If _name does not exist or if it is not a string, the function will end
		if( !_name || typeof( _name ) != 'string' ) return;

		if( arguments.length == 2)				//set mode
		{
			return this.each( function()
			{
		    		var classNames = (this.className || "").split( /\s+/ );
				// If the class value of the selected DOM element has a prefix + id for buffer storage
		    		for ( var i = 0; i<classNames.length; i++)
		    		{
		    			if ( classNames[i].substr(0,riffGlobal.prefixBufferID.length) == riffGlobal.prefixBufferID)
		    			{
		    				var bufferID = window.parseInt( classNames[i].substring(
		    						classNames[i].indexOf( riffGlobal.prefixBufferID ) + riffGlobal.prefixBufferID.length,
		    						classNames[i].length ) );
		    				riffGlobal.buffer[bufferID][_name] = _data;
		    				break;
		    			}
		    		}

				// If the class value of the selected DOM element does not have a prefix + id for buffer storage
		    		if( i == classNames.length )
		    		{
					// Creates a prefix + ID for buffer storage
					var bufferID = ++riffGlobal.bufferID;
					// allocates array space for the newly created prefix + id, which becomes the index of the array.
		    			riffGlobal.buffer[ bufferID ] = {};
		    			riff(this).addClass( riffGlobal.prefixBufferID + riffGlobal.bufferID );
					// saving the value
		    			riffGlobal.buffer[bufferID][_name] = _data;
		    		}
	    		});
		}
		else if( arguments.length == 1)			//get mode
		{
			// When there are multiple selected DOM Elements, the data of the first DOM Element is used
			var c = this.dom();

		   	if( c && c.className )
		   	{
		   		var classNames = (c.className || "").split( /\s+/ );
		   		for ( var i = 0; i<classNames.length; i++)
		   		{
		   			if ( classNames[i].substr(0,riffGlobal.prefixBufferID.length) == riffGlobal.prefixBufferID)
		   			{
		   				var bufferID = window.parseInt(classNames[i].substring(
		   					classNames[i].indexOf( riffGlobal.prefixBufferID ) + riffGlobal.prefixBufferID.length,
		   					classNames[i].length ));

		   				return riffGlobal.buffer[bufferID][_name];
		   			}
		   		}
		   	}
			// when there are no relevent data to _name, "" is returned
		    return "";
		}
	},

	prev : function( _s )
	{
		var cArray = new Array();

		for ( var i = 0, e; e = this.dom(i); i++ )
		{
			cArray[i] = e.previousSibling;

			while(cArray[i] && cArray[i].nodeType != 1)
				cArray[i] = cArray[i].previousSibling;
		}

		return riff( cArray ).filter( _s );
	},

	next : function( _s )
	{
		var cArray = new Array();

		for ( var i = 0, e; e = this.dom(i); i++ )
		{
			cArray[i] = e.nextSibling;

			while(cArray[i] && cArray[i].nodeType != 1)
				cArray[i] = cArray[i].nextSibling;
		}

		return riff( cArray ).filter(_s);
	},

	parent : function( _s )
	{
		var cArray = new Array();

		for (var i = 0, e; e = this.dom(i); i++ )
		{
			// remove duplicated nodes
			var j, l = cArray.length;

			for ( j=0; j < l; j++)
				if( cArray[j] == e.parentNode)
					break;

			if( j == l )
				cArray.push( e.parentNode  );
		}

		return riff( cArray ).filter(_s);
	},

	contents : function( _s )
	{
		var cArray = new Array();

		for(var i =0, e; e = this.dom(i); i++ )
		{
			for(var j = 0, l = e.childNodes.length; j < l; j++)
				cArray.push( e.childNodes[j] );
		}

		return riff( cArray ).filter( _s );
	},

	children : function( _s )
	{
		var cArray = new Array();

		for(var i = 0, e; e = this.dom(i); i++ )
		{
			var childTemp = e.childNodes;
			for( var j =0; childTemp && childTemp[j]; j++ )
			{
				if ( childTemp[j].nodeType == 1 )
					cArray.push( childTemp[j] );
			}
		}

		return riff( cArray ).filter(_s);
	},

	siblings : function ( _s )
	{
		var cArray = new Array();

		for ( var i = 0, e; e = this.dom(i); i++ )
		{
			var p = e.previousSibling,
				n = e.nextSibling,
				tArray = new Array();

			// previous
			while( p )
			{
				if ( p.nodeType == 1)
				{
					var j,
						l = tArray.length;

					for( j = 0; j < l; j++)
						if ( tArray[j] == p )
							break;

					if( j == l)
						tArray.push(p);
				}

				p = p.previousSibling;
			}

			// reverse
			tArray.reverse();

			// next
			while( n )
			{
				if ( n.nodeType == 1)
				{
					var j,
						l = tArray.length;

					for( j = 0; j < l; j++)
						if ( tArray[j] == n )
							break;

					if( j == l)
						tArray.push(n);
				}

				n = n.nextSibling;
			}

			for( var j = 0; e = tArray[j]; j++)
			{
				var k,
					l = cArray.length;

				for( k = 0; k < l; k++)
					if ( cArray[k] == e )
						break;

				if( k == l)
					cArray.push(e);
			}

		}

		return riff( cArray ).filter( _s );
	},

	eq : function( _idx )
	{
		var cArray = new Array();

		var e = this.dom(_idx);
		if ( e )
			cArray.push( e );

		return riff( cArray );
	},

	add : function( _data )
	{
		if( typeof _data == "object" )
		{
			var cArray = new Array();

			for ( var i = 0, e; e = this.dom(i); i++ )
				cArray.push( e ) ;
			for ( var i = 0, e; e = _data.dom(i); i++ )
			{
				var j, tl = this.size();
				for ( j = 0; j < tl; j++ )
					if ( e == this.dom(j) )
						break;

				if( j == tl )
					cArray.push( e ) ;
			}

			return riff( cArray );
		}
		else if( typeof _data == "string" )
			return this.add( riff(_data) );

		return this;
	},

	attr : function ( _name, _attr )
	{
		if( arguments.length == 1 )
			return (this.dom())?this.dom().getAttribute(_name):"";
		else if ( arguments.length == 2 )
			return this.each( function()
			{
				this.setAttribute( _name, _attr );
			} );
	},

	dom : function ( _idx )
	{
		if ( isNaN( window.parseInt( _idx ) ) ) _idx = 0;

		return ((!this.componentContext[_idx]) ? null : this.componentContext[_idx].elementContext);
	},

	component : function ( _idx )
	{
		if ( isNaN( window.parseInt( _idx ) ) ) _idx = 0;

		return (!this.componentContext[_idx]) ? null : this.componentContext[_idx];
	},


	index : function ()
	{
		var c = this.dom();

		var i = 0;
		while( c )
		{
			c = c.previousSibling;
			if(c && c.nodeType==1) i++;
		}

		return i;
	},

	remove : function( _val )
	{
		var removeFunc = function()
		{
			this.parentNode.removeChild(this);
		};

		// number
		if ( typeof _val == "number" )
		{
			this.eq(_val).each( removeFunc );
		}
		// dom element
		else if ( typeof _val =="object")
		{
			for(var i =0, e; this.dom(i); i++)
			{
				if(this.dom(i) == _val)
					this.eq(_val).each( removeFunc );
			}
		}
		else
		{
			this.each( removeFunc );
		}

		return this;
	},

	css : function ( _name, _value )
	{
		if( arguments.length == 1 )
		{
			if( typeof _name == "object" )
			{
				for( var k in _name)
					this.css(k, _name[k] );

				return this;
			}
			else if( typeof _name == "string" )
			{
				var style = (_name == 'float') ? 'cssFloat' :riff.camelize(_name);
				var value = (this.dom())? this.dom().style[ style ] : null;
				if( !value || value=='auto' )
				{
					var css = document.defaultView.getComputedStyle(this.dom(), null);
					value = css ? css[style] : null;
				}

				return value;
			}
		}
		else if(arguments.length == 2)
		{
			// If the user does not input the css value string, the riff object is returned and the function ends
			if( typeof( _value ) != 'string' ) return this;
			return this.each( function()
			{
				if( this.style )
					this.style[ riff.trim(_name) ] = _value;
			});
		}

		return this;
	},

    top : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("top"));
			else
				return null;

		// If the user does not input the css value string, the riff object is returned and the function ends
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("top", window.parseFloat(_value) + "px" );
		});
	},

	left : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("left"));
			else
				return null;

		// If the user does not input the css value string, the riff object is returned and the function ends
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("left", window.parseFloat(_value) + "px" );
		});
	},

	width : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("width"));
			else
				return null;

		// If the user does not input the css value string, the riff object is returned and the function ends
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("width", window.parseFloat(_value) + "px" );
		});
	},

	height : function( _value )
	{
		if( !_value )
			if( this.dom() )
				return window.parseFloat(window.getComputedStyle(this.dom()).getPropertyValue("height"));
			else
				return null;

		// If the user does not input the css value string, the riff object is returned and the function ends
		if( isNaN( window.parseFloat(_value) ) ) return this;

		return this.each( function()
		{
			riff(this).css("height", window.parseFloat(_value) + "px" );
		});
	},

	html : function( _htmlCode )
	{
		if ( arguments.length == 0 ) {
			return (this.dom())?this.dom().innerHTML:"";
		} else {
			// If the user does not input the css value string, the riff object is returned and the function ends
			if( typeof( _htmlCode ) != 'string') return this;

			return this.each( function()
			{
				this.innerHTML = _htmlCode;
			});
		}
	},

	text : function ( _text )
	{
		if( _text )
		{
			// If the user does not input the css value string, the riff object is returned and the function ends
			if( typeof( _text ) == 'number' ) _text = _text.toString();
			if( typeof( _text ) != 'string' ) return this;

			return this.each( function ()
			{
				riff(this).contents().remove();
				this.appendChild(document.createTextNode(_text));
			});
		}

		var cArray = new Array();
		for(var i=0; this.dom(i); i++)
			cArray.push(this.dom(i));

		return this.getTextByRecursive( cArray );
	},

	getTextByRecursive : function ( _cArray )
	{
		var rText = "";

		for ( var i =0;  _cArray[i]; i++ )
		{
			var c = _cArray[i];

			if ( c.nodeType === 3 || c.nodeType === 4 )
				rText += c.nodeValue;
			else if ( c.nodeType !== 8 )
				rText += this.getTextByRecursive( c.childNodes );
		}

		return rText;
	},

	append : function ( _content )
	{
		// If the user does not input the _htmlCode string, the riff object is returned and the function ends
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var riffThis = riff(this),
				riffThisContents = riffThis.contents(),
				riffThisContentsSize = riffThisContents.size();

			if( riffThisContentsSize == 0)
				riffThis.html(_content);
			else
				riffThisContents.eq( riffThisContentsSize-1 ).after(_content);
		});
	},

	prepend : function ( _content )
	{
		// If the user does not input the _htmlCode string, the riff object is returned and the function ends
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var riffThis = riff(this),
				riffThisContents = riffThis.contents();

			if( riffThisContents.size() == 0)
				riffThis.html(_content);
			else
				riffThisContents.eq().before(_content);
		});
	},

	wrap : function ( _content )
	{
		// If the user does not input the _content string, the riff object is returned and the function ends
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var divNode = document.createElement("div");
			divNode.innerHTML = _content;
			var contentNode = divNode.childNodes[0];

			var cloneNode = this.cloneNode(true);
			riff(this).parent().dom().replaceChild(cloneNode, this);
			contentNode.appendChild(this);

			riff(cloneNode).parent().dom().replaceChild(contentNode, cloneNode);
		});
	},

	wrapAll : function( _content )
	{
		// If the user does not input the _content string, the riff object is returned and the function ends
		if( typeof( _content ) != 'string') return this;

		riff(this.dom()).wrap(_content);

		for( var i = 1; this.dom(i); i++)
			riff(this.dom()).parent().dom().appendChild(this.dom(i));

		return this;
	},

	after : function ( _content )
	{
		// If the user does not input the _content string, the riff object is returned and the function ends
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var nextNode = this.nextSibling;
			var divNode = document.createElement("div");
			divNode.innerHTML = _content;

			// if this is the last element (next node is null or undefiend) then insert last
			while(divNode.childNodes[0])
				riff(this).parent().dom().insertBefore(divNode.childNodes[0], nextNode);
		});
	},

	before : function ( _content )
	{
		// If the user does not input the _content string, the riff object is returned and the function ends
		if( typeof( _content ) != 'string') return this;

		return this.each( function()
		{
			var divNode = document.createElement("div");
			divNode.innerHTML = _content;

			while(divNode.childNodes[0])
				riff(this).parent().dom().insertBefore(divNode.childNodes[0], this);
		});
	},

	find : function ( _s )
	{
		var cArray = new Array();
		// If the user does not input the _s string, an empty object is returned.
		if( typeof( _s ) != 'string') return riff(cArray);

		for(var i=0; this.dom(i); i++)
		{
			var tArray = this.dom(i).querySelectorAll(_s);
			for(var j=0; tArray[j]; j++)
				cArray.push(tArray[j]);
		}

		return riff(cArray);
	},

	animate : function(_prop, _time, _func, _preFunc)
    {
        if(!_prop || !_time)
            return this;
        if(typeof _time != "number")
        {
            if(_time == "slow") _time = 1000;
            else if(_time == "nomal") _time = 600;
            else _time = 300;
        }
        if(!this.buffer("riffAnimateInitFlag"))
        {
            var thisObject = this;
            this.buffer("riffAnimateStopFlag",false);
            this.buffer("riffAnimateInitFlag",true);
            var timerCount = 0;
            this.buffer("riffAnimationTimerFirstSetting",true);
            var popupObj;
			// animations are registered to the timer function
			riff.timer(function()
			{(
		        function()
		        {
			        if( this.buffer("riffAnimateStopFlag"))
					{
						// stoping the animation effect
						riff.timer("riffAnimationTimer");
						this.buffer("riffAnimateStopFlag",false);
						this.buffer("riffAnimateInitFlag",false);
						return;
					}

					// Timer of the new animation. It is called only when the animation first starts
					if(this.buffer("riffAnimationTimerFirstSetting"))
					{
						// retrieves the animation queue that is reserved within the riffAnimationQueue
					    popupObj = riff.queue("riffAnimateQueue");
						// if there is no "riffAnimateQueue" within the animaiton queue
					    if(popupObj == null)
					    {
					        riff.timer("riffAnimationTimer");
						    this.buffer("riffAnimateInitFlag",false);
						    return;
					    }
						// executes if there is a preFunc that has been defined using "pre" within the queue
						if(popupObj["pre"]) popupObj["pre"].call(this);
						// Animation implementation (= sets the css attributes)
						var param = new Array();
						var risevalue = new Array();
						for(var p in popupObj["prop"])
						{
							param[p] = window.parseFloat(this.css(p));
							risevalue[p] = (popupObj["prop"][p] - param[p])/(popupObj["time"] / 16.0);
						}
						this.buffer("riffAnimationTimerParamInitValue",param);
						this.buffer("riffAnimationTimerParamRiseValue",risevalue);
						this.buffer("riffAnimationTimerFirstSetting",false);
					}
					for(var p in popupObj["prop"])
					{
						var str = this.css(p);
						if(str.indexOf("px") == -1)
						{
							str = "";
						} else {
							str = "px";
						}

						if(this.buffer("riffAnimationTimerParamInitValue")[p] > popupObj["prop"][p] ? (this.buffer("riffAnimationTimerParamRiseValue")[p] * timerCount + this.buffer("riffAnimationTimerParamInitValue")[p]) <= popupObj["prop"][p] : (this.buffer("riffAnimationTimerParamRiseValue")[p] * timerCount + this.buffer("riffAnimationTimerParamInitValue")[p]) >= popupObj["prop"][p])
						{
							this.css(p, popupObj["prop"][p] + str);
							continue;
						}
						this.css(p, this.buffer("riffAnimationTimerParamRiseValue")[p] * timerCount + this.buffer("riffAnimationTimerParamInitValue")[p] + str);
					}
					timerCount++;
					if( this.buffer("riffAnimationTimerParamInitValue")[p] > popupObj["prop"][p] ? parseFloat( this.css(p)) <= popupObj["prop"][p] : parseFloat( this.css(p)) >= popupObj["prop"][p])
					{
						for(var p in popupObj["prop"])
						{
							var str = this.css(p);
							if(str.indexOf("px") == -1) str = "";
							else str = "px";
							this.css(p, popupObj["prop"][p] + str);
						}
						if(popupObj["func"]) popupObj["func"].call(this);

						this.buffer("riffAnimationTimerFirstSetting",true);
						timerCount = 0;
					}
				}
			).call( thisObject ); }, 16,"riffAnimationTimer");
        }
        for(var p in _prop)
        {
            if(typeof _prop[p] == "number")
                continue;
            var str = _prop[p];
            if(str.indexOf("px"))
            {
                 _prop[p] = str.substring(0,str.indexOf("px"));
            }
        }
        riff.queue({"prop":_prop,"time":_time,"func":_func,"pre":_preFunc},"riffAnimateQueue");
        return this;
        // riff.queue
    },

	clearQueue : function()
    {
        riff.queue("clear","riffAnimateQueue");
        return this;
    },

    stop : function()
    {
        riff.queue("clear","riffAnimateQueue");
        this.buffer("riffAnimateStopFlag",true);
        return this;
    },

	show : function(_time, _func)
	{
	    return this.each( function()
	    {
	        var thisObj = riff(this);
		    if(!thisObj.buffer("riffEffectPreState"))
		    {
		        if(thisObj.css("display") == "none")
		        {
		            thisObj.css("display","block");
		            thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":"none",
		            "height":thisObj.css("height"),"width":thisObj.css("width"),"display":"none" });
		            thisObj.css("display","none");
		        }
		        else thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":thisObj.css("display"),"height":thisObj.css("height"),"width":thisObj.css("width"),"display":thisObj.css("display") });
		    }

		    if(!_time)
	        {
		        if(thisObj.buffer("riffEffectPreState")["absdisplay"] == "none")
		            thisObj.css("display","block");
		        else
		            thisObj.css("display",thisObj.buffer("riffEffectPreState")["absdisplay"]);
	            return this;
		    }

	        thisObj.animate({"height":thisObj.buffer("riffEffectPreState")["absheight"],"width":thisObj.buffer("riffEffectPreState")["abswidth"],"opacity":1.0 },
	        _time,function(){
	            thisObj.css("width",thisObj.buffer("riffEffectPreState")["abswidth"]);
	            thisObj.css("height",thisObj.buffer("riffEffectPreState")["absheight"]);
	            if(_func)_func.call(this);
	        },function(){
	            if(thisObj.css("display") == "none") thisObj.css("display","block");
	            else
	            {
	                thisObj.css("display",thisObj.buffer("riffEffectPreState")["absdisplay"]);
	            }
	            thisObj.css("width","0px");
	            thisObj.css("height","0px");
	            thisObj.css("opacity",0);
	        });
		});
	},

	hide : function(_time, _func)
	{
	    return this.each( function()
	    {
	        var thisObj = riff(this);

            if(!thisObj.buffer("riffEffectPreState"))
            {
                if(thisObj.css("display") == "none")
                {
                    thisObj.css("display","block");
                    thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":"none",
                    "height":thisObj.css("height"),"width":thisObj.css("width"),"display":"none" });
                    thisObj.css("display","none");
                }
                else thisObj.buffer("riffEffectPreState",{"absheight":thisObj.css("height"),"abswidth":thisObj.css("width"),"absdisplay":thisObj.css("display"),"height":thisObj.css("height"),"width":thisObj.css("width"),"display":thisObj.css("display") });
            }
            if(!_time)
	        {
			    thisObj.css("display","none");
			    return this;
		    }

            thisObj.animate({"height":0,"width":0,"opacity":0 },
            _time,function(){
                thisObj.css("width",thisObj.buffer("riffEffectPreState")["abswidth"]);
	            thisObj.css("height",thisObj.buffer("riffEffectPreState")["absheight"]);
                thisObj.css("display","none");
                if(_func)_func.call(this);
            },function(){
                if(thisObj.css("display") == "none") thisObj.css("display","block");
                else
                {
                    thisObj.css("display",thisObj.buffer("riffEffectPreState")["absdisplay"]);
                }
            });

        });
	},

	toggle : function ( _func1, _func2 )
	{
		return this.tap( function ()
		{
			if ( riff(this).buffer("riffToggleData") == "Func2" )
			{
				_func2.call(this);
				riff(this).buffer("riffToggleData", "Func1" );
			}
			else
			{
				_func1.call(this);
				riff(this).buffer("riffToggleData", "Func2" );
			}
		});
	},

    triggerExistEvent : function( _existEventName )
    {
        var i = 0, t = null;
        var domObject = this.dom(i);
        while( domObject )
        {
            // Handles triggering a single element
            // don't trigger events on text and comment nodes
            domObject[ _existEventName ] && domObject[ _existEventName ]();  // Text ��� �� Ŭ�� �̺�Ʈ�� Null or Undefined ��츦 ����
            domObject = this.dom(++i);
        };
    	return this;
    },

    triggerCustomEvent : function( _customEventName )
    {
        var i = 0, t = null;
        var domObject = this.dom(i);
        while( domObject )
        {
             // Handles triggering a single element
	     // do not use events on text and comment nodes
            domObject[ _customEventName ] && riffTouch.Send( _customEventName, domObject, "trigger", null );
            domObject = this.dom(++i);
        };
        return this;
    },

    trigger : function( _eventName )
    {
        if ( !_eventName ) {
            return this;
        }

        switch( _eventName )
        {
            case riffGlobal.EVENTSTRING.FLICK_LEFT :
            case riffGlobal.EVENTSTRING.FLICK_RIGHT :
            case riffGlobal.EVENTSTRING.FLICK_UP :
            case riffGlobal.EVENTSTRING.FLICK_DOWN :
            case riffGlobal.EVENTSTRING.TAP :
            case riffGlobal.EVENTSTRING.LONG_TAP :
            case riffGlobal.EVENTSTRING.DOUBLE_TAP :
            case riffGlobal.EVENTSTRING.TOUCH_START :
            case riffGlobal.EVENTSTRING.TOUCH_MOVE :
            case riffGlobal.EVENTSTRING.TOUCH_END :
                // If the event name is a Custom event, the riffTouch.send() funcation must be used to execute the CustomEvent object
				// use an artificial event ( eg: TAP ).
                this.triggerCustomEvent( _eventName );
                return this;
            default :
                // If the event name is not Custom Event, just like before, you can either use the addEventListener or you can activate it using the form within the domObject.eventName
				// use the existed event ( eg: onfocus ).
                this.triggerExistEvent( _eventName );
        }
        return this;
    },

    primaryEventRegist : function( domObject )
    {
		if( riffGlobal.eventType == riffGlobal.EVENTTYPE.TOUCH ) {
			// widget
			domObject.addEventListener( "touchstart", riffTouch.onTouchEvent, false );
	        domObject.addEventListener( "touchmove", riffTouch.onTouchEvent, false );
		    domObject.addEventListener( "touchend", riffTouch.onTouchEvent, false );
		} else if( riffGlobal.eventType == riffGlobal.EVENTTYPE.MOUSE ) {
			// PC, SDK
			domObject.addEventListener( "mouseup", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mousemove", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mousedown", riffTouch.onTouchEvent, false );
		} else {
			// android.
			domObject.addEventListener( "touchstart", riffTouch.onTouchEvent, false );
	        domObject.addEventListener( "touchmove", riffTouch.onTouchEvent, false );
		    domObject.addEventListener( "touchend", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mouseup", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mousemove", riffTouch.onTouchEvent, false );
			domObject.addEventListener( "mousedown", riffTouch.onTouchEvent, false );
		}

		return this;
	},

	enableEvent : function( _event )
    {
		// because the Swipe event is a combination of multiple events, it is handled differently
        if(_event == riffGlobal.EVENTSTRING.SWIPE)
        {
            var eventType = this.buffer("riffSaveEvent");
            eventType[riffGlobal.EVENTSTRING.FLICK_RIGHT] = true;
            eventType[riffGlobal.EVENTSTRING.FLICK_LEFT] = true;
            eventType[riffGlobal.EVENTSTRING.DRAG] = true;
            this.buffer("riffSaveEvent",eventType);
            return this;
        }
        var eventType = this.buffer("riffSaveEvent");
        eventType[_event] = true;
        this.buffer("riffSaveEvent",eventType);
        return this;
    },

	disableEvent : function( _event )
    {
		// because the Swipe event is a combination of multiple events, it is handled differently
        if(_event == riffGlobal.EVENTSTRING.SWIPE)
        {
            var eventType = this.buffer("riffSaveEvent");
            eventType[riffGlobal.EVENTSTRING.FLICK_RIGHT] = false;
            eventType[riffGlobal.EVENTSTRING.FLICK_LEFT] = false;
            eventType[riffGlobal.EVENTSTRING.DRAG] = false;
            this.buffer("riffSaveEvent",eventType);
            return this;
        }
        var eventType = this.buffer("riffSaveEvent");
        eventType[_event] = false;
        this.buffer("riffSaveEvent",eventType);
        return this;
    },

	drag : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.DRAG, riffTouch.dragMove);
        this.buffer("riffDragEventFunc",_fnEventHandle);
        return this;
    },

    flickLeft : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_LEFT, _fnEventHandle);
        return this;
    },

    flickRight : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_RIGHT, _fnEventHandle);
        return this;
    },

	flickUp : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_UP, _fnEventHandle);
        return this;
    },

	flickDown : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.FLICK_DOWN, _fnEventHandle );
        return this;
    },

    tap : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TAP, _fnEventHandle);
        return this;
	},

	longTap : function( _fnEventHandle, _touchTime )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.LONG_TAP, _fnEventHandle);
        if(!_touchTime) this.buffer("riffLongTapTime",riffGlobal.TouchTimer.longTap);
        else this.buffer("riffLongTapTime",_touchTime);
        return this;
    },

    doubleTap : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.DOUBLE_TAP, _fnEventHandle);
        return this;
    },

    touchStart : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TOUCH_START, _fnEventHandle);
        return this;
    },

    touchMove : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TOUCH_MOVE, _fnEventHandle);
        return this;
    },

    touchEnd : function( _fnEventHandle )
    {
        this.addEventByType( riffGlobal.EVENTSTRING.TOUCH_END, _fnEventHandle);
        return this;
    },

	swipe : function( _isFlickEnd ,_verlocityPercent,_fnEventHandle )
	{
		this.addEventByType( riffGlobal.EVENTSTRING.DRAG , riffTouch.dragForSwipe);
		this.addEventByType( riffGlobal.EVENTSTRING.FLICK_RIGHT, riffTouch.flickForSwipe);
		this.addEventByType( riffGlobal.EVENTSTRING.FLICK_LEFT,  riffTouch.flickForSwipe);

		this.buffer("riffSwipeFunc",_fnEventHandle);
		this.buffer("riffSwipeVerlocityPercent",_verlocityPercent);
		this.buffer("riffSwipeIsSwipeEnd",_isFlickEnd);
		return this;
	},

	addEventByType : function( _eventType, _fnEventHandle)
    {
		var i = 0;
        var domObject = this.dom(i);
        while( domObject )
        {
            this.primaryEventRegist( domObject );
            riffTouch.AddEvent( riffTouch, _eventType, domObject, _fnEventHandle );
            domObject = this.dom(++i);
        }
        this.addClass("rf-state-hand");
		return this;
    },

	makeStructs : function( )
	{
		return this.each( function()
		{
			var c = riff(this);
			if(c.component().makeStructs)
				c.component().makeStructs.call(this);
		});
	},

	setContents : function( _value )
	{
		if( arguments.length == 0 )
		{
			if(this.component().setContents)
				return this.component().setContents.apply(this.dom());

			return null;
		}

		var args = arguments;
		return this.each( function()
		{
			var c = riff(this);
			if(c.component().setContents)
				c.component().setContents.apply(this, args);
		});
	},

	count : function ()
	{
		if(this.component().count)
			return this.component().count.apply(this.dom());

		return null;
	},

	go : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().go)
				c.component().go.apply(this, args);
		});
	},

	scenePartLoad : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().scenePartLoad)
				c.component().scenePartLoad.apply(this, args);
		});
	},

	scenePartLoadFlag : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().scenePartLoadFlag)
				c.component().scenePartLoadFlag.apply(this, args);
		});
	},

	scenePartSelect : function()
	{
		var rriff = riff();

		for ( var i = 0, l = this.size(); i < l; i++ )
			if( this.component(i).scenePartSelect )
				rriff = rriff.add ( this.component(i).scenePartSelect.apply(this.dom(i), arguments) );

		return rriff;
	},

	refresh : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().refresh)
				c.component().refresh.apply(this, args);
		});
	},

	autoRefresh : function()
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().autoRefresh)
				c.component().autoRefresh.apply(this, args);
		});
	},

	option : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().option)
				c.component().option.apply(this, args);
		});
	},

	removeListItem : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().removeListItem)
				c.component().removeListItem.apply(this, args);
		});
	},

	okFunc : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().okFunc)
				c.component().okFunc.apply(this, args);
		});
	},

	getSettingValue : function( _value )
	{
		if( arguments.length == 0 )
		{
			if(this.component().getSettingValue)
				return this.component().getSettingValue.apply(this.dom());

			return null;
		}

		var args = arguments;
		return this.each( function()
		{
			var c = riff(this);
			if(c.component().getSettingValue)
				c.component().getSettingValue.apply(this, args);
		});
	},

	moveFEEDArticle : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().moveFEEDArticle)
				c.component().moveFEEDArticle.apply(this, args);
		});
	},

	setFeedComponent : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().setFeedComponent)
				c.component().setFeedComponent.apply(this, args);
		});
	},

	dataReceiveTime : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().dataReceiveTime)
				c.component().dataReceiveTime.apply(this, args);
		});
	},

	dataReceiveInfo : function( _value )
	{
		var args = arguments;

		return this.each( function()
		{
			var c = riff(this);
			if(c.component().dataReceiveInfo)
				c.component().dataReceiveInfo.apply(this, args);
		});
	},

	feed : function( _data )
	{
		//h _data가 없거나, object가 아니거나, array가 아니면 failed
		if ( !_data && typeof( _data ) != "object"  && !riff.isArray(_data.runs) )
		{
			return false;
		}

		var fnLayoutFunction				= null;										// layout function or values.
		var fnLayoutParams					= null;										// layout params
		var opts							= null;												// option (error Code)
		var successFnAfterXML				= null;						// successCallback Function
		var fnLayoutArray					= new Array();
		var listMode						= false;

		if ( riff.isArray( _data.layout ) ) {
			if ( typeof( _data.layout[0] ) == "function" )
			{
				fnLayoutFunction				= _data.layout[0];			// layout Function
				fnLayoutParams					= _data.layout[1];								// layout params
			} else {
				return false;
			}
		} else if ( typeof( _data.layout ) == "object" ) {
			fnLayoutFunction				= riff.frameworkTabMenu;						// layout function ( default ).
			fnLayoutParams					= [ _data.layout ];
		} else if ( typeof( _data.layout ) == "function" ) {
			fnLayoutFunction				= _data.layout;						// layout function ( default ).
			fnLayoutParams					= null;
		}

		opts							= _data.opts;									// option (error Code)
		successFnAfterXML				= _data.successFnAfterXML;						// successCallback Function
		fnLayoutArray					= new Array();
		listMode						= false;

		fnLayoutArray.push( fnLayoutParams );			// arguments[0] => layout params
		fnLayoutArray.push( _data.runs );					// arguments[1] => runs
		fnLayoutArray.push( opts );								// arguments[2] => ajaxOption
		fnLayoutArray.push( successFnAfterXML );		// arguments[3] => successCallback function

		fnLayoutFunction.apply( this, fnLayoutArray );
	},

	componentContext : null,
	length : 0
};

// Global APIs


riff.trim = function ( _s )
{
	if( typeof _s == "string" ) {
		return _s.replace(/^\s+|\s+$/g, "");
	}
};

riff.camelize = function ( _s )
{
	if( typeof _s == "string" ) {
		return _s.replace(/-+(.)?/g, function(match, chr) {
			return chr ? chr.toUpperCase() : '';
		});
	}
};

riff.openURL = function ( _url )
{
	if( typeof _url == "string" ) {
		try
		{
			var t = widget.getFullmodeSize();
			if ( t )
				widget.openURL(_url);
			else
				window.location.href = _url;

		}
		catch ( e )
		{
			window.location.href = _url;
		}
		return true;
	}
	return false;
};

riff.toID = function ( _str )
{
	if( typeof _str == "string" ) {
		var strTrim = riff.trim(_str);
		return (strTrim.substr(0,1) == "#" ) ? strTrim : "#" + strTrim;
	}
	return "";
};

riff.isEmulator = function ( )
{
	// if the widget object does not exist, it will execute on the PC - false
	if ( typeof widget == "undefined" ) {
		return false;
	}

	try {
		// the widget.addEventListener function does not exist within the SDK
		if ( widget.addEventListener ) {
			return false;
		} else {
			return true;
		}
	} catch( e ) {
		return true;
	}
};

riff.queue = function( _data, _id )
{
    if( _data == "clear")
    {
        riffGlobal.queueList[_id] = null;
        return null;
    }
    if(arguments.length == 1)
    {
		// When there is a saved Animation Effect originating from an input key value
		if(typeof arguments[0] != "string" || !riffGlobal.queueList[_data])
			return null;

		// When there is no saved Animation Effect originating from an input key value
		if(riffGlobal.queueList[_data].length != 0)
		{

			// using the relevant key values to retrieve the animation stack
			// the very last element is retrieved and returned

			var queue = riffGlobal.queueList[_data];
			queue.reverse();
			var reValue = queue.pop();
			queue.reverse();
			riffGlobal.queueList[_data] = queue;
			return reValue;
		}
		else
			return null;
    }
    if(!riffGlobal.queueList[_id])
    {
		// adding "_data" to the "_id" queue
        var queue = new Array();
        queue.push(_data);
        riffGlobal.queueList[_id] = queue;
    }
    else
    {
		// if the "_id" queue does not exist, the "_id" queue is created and the "_data" is added
		var queue = riffGlobal.queueList[_id];
        queue.push(_data);
        riffGlobal.queueList[_id] = queue;
    }

	return null;
};

riff.isWidget = function ( )
{
	// the widget object exist == phone.  not exist == Desktop
	// widget object existing means it is a phone.  Not existing means it is a desktop
	if( riff.isEmulator() ) return false;
	return ( typeof widget == "undefined" ) ? false : true;
};

riff.go = function( _page, _option  )
{
	if( typeof _page == "string" ) {
		var page = riff.toID(_page),
			pageriff = riff( page );

		// separating between when a popup exists or not
		if( pageriff.size() !=0 && pageriff.component().type == "popup" ) {
			return riff.popup.apply(this, arguments);
		}else {
			return riff.scene.apply(this, arguments);
		}
	}

	return false;
};

riff.back = function( _option )
{
	if( typeof _option == "object" || typeof _option =="undefined" ) {
		return riff.scene.apply( null, _option );
	}

	return false;
};

riff.scene = function( _scene, _option)
{
	if( typeof _scene == "object" || typeof _scene =="undefined" ) {
		return riff.scene.back.apply(this, arguments);
	} else {
		return riff.scene.go.apply(this, arguments);
	}
};

riff.scene.go = function ( _scene, _option )
{
	if( typeof _scene == "string" ) {

		// checking an argument
		var scene = riff.toID(_scene);
		var riffThis = riff( scene );

		// When moving using Idle (going back to the first screen)
		if( riffThis.component().type == "idle" ){
			// because when on the phone we have to change the screen size
			if( riff.isWidget() || riff.isEmulator() )
			{
				riff.resize(riffGlobal.widgetIdleWidth, riffGlobal.widgetIdleHeight);
			}

			var beforeIdle = riffGlobal.sceneStack.pop();
		    if( beforeIdle ) {
				riff( beforeIdle[0] ).hide();

				if( riffGlobal.EndKeyType ){
					riffGlobal.sceneStack.push( [ beforeIdle[0], null ] );
				}else{
					riffGlobal.sceneStack = new Array();
				}

				var tabID = riff(".rf-component-idle").buffer("ComponentDataFEEDComponentID");

				// feedTab Index
				var tabMenuIndex = riff(tabID).buffer("ComponentTabMenuIndex");
				// change feedTab Index
				riff(".rf-component-idle").buffer("ComponentDataFEEDKey", tabMenuIndex);

				var feedComponent = riff(".rf-component-idle").buffer("ComponentDataFEEDComponent");
				if ( feedComponent )
				{
					// title
					var reduceTitleText = riff.ellipsisString( feedComponent.children("ul").children("li").eq(tabMenuIndex).text(), 15 );
					riff(".rf-idle-category").text( reduceTitleText );

					// article
					var idleSet = feedComponent.scenePartSelect(tabMenuIndex).find(".rf-component-list").buffer("ComponentDataIdleSet");
					var reduceArticleText = riff.ellipsisString( idleSet[0].txtHead, riffGlobal.idleArticleEllipsisStringLength );
					riff(".rf-idle-article").text( reduceArticleText );

					// dataReceivedTime
					var dataReceiveTimeComponent = riff('.rf-component-datareceivetime');
					riff(".rf-component-idle").dataReceiveTime( dataReceiveTimeComponent.buffer("feedDataReceiveTime" ), dataReceiveTimeComponent.buffer("feedDataReceiveText") );
				}
			}

			riff(".rf-wrapper-all").hide();
			riff(scene).show();

			riffGlobal.sceneStack.push( [ scene, null ] );
			return true;
		}

		// In order to show the original screen after a reset, when the pageCache is set, the screen ID is set.
		if( riffGlobal.pageCache == true ) {
			riff.storage("riffPageCacheData", scene);
		}

		// resizing when a Widget or emulator
		if( riff.isWidget() || riff.isEmulator() ) {
			riff.resize();
		}

		// get Current Scene
		var curScene = riffGlobal.sceneStack.pop();
		if(curScene[0] == scene) {
			riffGlobal.sceneStack.push(curScene);
			return true;
		}

		if( riff('.rf-component-idle').buffer("ComponentIdleGoByEndKey") && scene == "#index" ){
			if(riffGlobal.sceneStack.length > 0){
				beforeScene = riffGlobal.sceneStack.pop();
				scene = beforeScene[0];

				riff('.rf-component-idle').buffer("ComponentIdleGoByEndKey", false);
			}
		}

		var isTabMenu = riff( scene ).find(".rf-wrapper-scene").children(".rf-component-tabmenu") ;
		if ( isTabMenu.size() && !isTabMenu.buffer("ComponentTabMenuFirstLoad") ){
			    isTabMenu.go(0);
		}


		// when each soft key value changes
		// when there is a setList and the softkey changes
		var riffScene = riff(scene),
			riffSceneSetList = riffScene.find('.setList');

		if( riffSceneSetList.size() > 0 )	{
			riff(".rf-effect-dropshadow-header").hide();
			riffGlobal.setListSelectData = riffSceneSetList.getSettingValue();
			riff.softkey( riffGlobal.softkeySetListData );
			riff.softkey( riffGlobal.softkeySetListFunc );
			riff(".rf-component-header-setting").show();
			riff(".rf-component-header").hide();
		}else if ( riff(scene).buffer("ComponentSceneComponentDataSoftkey") ) {
			riff.softkey( riff(scene).buffer("ComponentSceneComponentDataSoftkey") );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
		}else{
			riff.softkey( riffGlobal.softkeyDataGlobal );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
			riff(".rf-component-header").show();
			riff(".rf-component-header-setting").hide();
		}

		// when the datareceivetime exists and the softkey changes
		// dataReceiveTime
		// The below .tab, .list are Components of the FEED Component
		var strTime = "",
			riffSceneTabMenu = riffScene.find('.rf-component-tabmenu'),
			riffSceneTabMenuList = riffSceneTabMenu.scenePartSelect().find(".rf-component-list"),
			riffSceneList = riffScene.find(".rf-component-list");

		var tTabMenu = riffScene.find(".rf-component-tabmenu"),
			tList = riffScene.find(".rf-component-list"),
			tabMenuIndex = tTabMenu.buffer("ComponentTabMenuIndex");

		if ( ( tTabMenu.size() > 0 ) && ( tTabMenu.buffer("feedDataReceiveTime" + tabMenuIndex ) ) ) {
			var currentTabIndex = tTabMenu.buffer("ComponentTabMenuComponentDataCurTabMenu");
			riff.dataReceiveTime( tTabMenu.buffer("feedDataReceiveTime" + currentTabIndex ) );
		} else if ( (tList.size() > 0) && tList.buffer("feedDataReceiveTime") ) {
			riff.dataReceiveTime( tList.buffer("feedDataReceiveTime") );
		} else {
			// If there is no Component using FEED, the dataReceiveTime is hidden
			riff.dataReceiveTime();
		}

		// covering the screen in order to not allowing screen clicks
		riff(".rf-wrapper-all").show();
		// Hiding the "more" soft key if it exists on the screen
		riff.softkey.softKeyMoreHide();
		// new scenese are adjustd to match the screen size
		riff.adjustSceneSize();

		// If the screen prior to a screen change contained nothing, (eg: activation screen on start up) a scene will be shown on the screen based off the relevant ID that was passed in
		if( !curScene ) {
			riff(scene).show();
			riffGlobal.sceneStack.push( [scene, null] );
			return true;
		} else if( riff(curScene[0]).component().type == "idle" ) {
			// if the screen prior to a screen change was the ideal screen
			// the previous screen will be hidden, the new screen will be shown
			riff(curScene[0]).hide();
			riff(scene).show();
			riffGlobal.sceneStack.push( [scene, null] );
			return true;
		}

		// option setting
		var option = new Array();
		for(var k in _option)
			option[k] = _option[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.transitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.transitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.transitionMotion;
		option.transitionDirection = "on";

		riff.transition( riff(scene), riff(curScene[0]), option );

		option.transitionDirection = null;
		option.transitionFunc = null;
		riffGlobal.sceneStack.push( curScene);
		riffGlobal.sceneStack.push( [scene, option] );

		return true;
	}

	return false;
}

riff.scene.back = function ( _option )
{
	if( typeof _option == "object" || typeof _option == "undefined" ) {

		// if a pop up exists, closes it and end
		if( riffGlobal.popup )
		{
			riff.popup();
			return true;
		}

		// in order to bring over the current scene name
		var curScene = riffGlobal.sceneStack.pop();
		var backScene = riffGlobal.sceneStack.pop();

		// when there is no background scene or if ideal
		if( !backScene || riff( backScene[0] ).component().type == "idle" )
		{
			// if idle
			if(riff(".rf-component-idle").size() != 0)
			{
				riff(curScene[0]).hide();
				riff.go("idle");

				var tabID = riff(".rf-component-idle").buffer("ComponentDataFEEDComponentID");

				// feedTab Index
				var tabMenuIndex = riff(tabID).buffer("ComponentTabMenuIndex");
				// change feedTab Index
				riff(".rf-component-idle").buffer("ComponentDataFEEDKey", tabMenuIndex);

				var feedComponent = riff(".rf-component-idle").buffer("ComponentDataFEEDComponent");
				if( feedComponent ) {
					// title
					var reduceTitleText = riff.ellipsisString( feedComponent.children("ul").children("li").eq(tabMenuIndex).text(), 15 );
					riff(".rf-idle-category").text( reduceTitleText );

					// article
					var idleSet = feedComponent.scenePartSelect(tabMenuIndex).find(".rf-component-list").buffer("ComponentDataIdleSet");
					var reduceArticleText = riff.ellipsisString( idleSet[0].txtHead, riffGlobal.idleArticleEllipsisStringLength );
					riff(".rf-idle-article").text( reduceArticleText );
					// datetime
					var dataReceiveTimeComponent = riff('.rf-component-datareceivetime');
					riff(".rf-component-idle").dataReceiveTime( dataReceiveTimeComponent.buffer("feedDataReceiveTime" ), dataReceiveTimeComponent.buffer("feedDataReceiveText") );
				}
			}
			// if there is nothing further to go back to
			else
				riffGlobal.sceneStack.push(curScene);

			return true;
		}

		// when a setList exists and the soft key changes
		var riffScene = riff(backScene[0]),
			riffSceneSetList = riffScene.find('.setList');
		if( riffSceneSetList.size() > 0 )
		{
			riffGlobal.setListSelectData = riffSceneSetList.getSettingValue();
			riff.softkey( riffGlobal.softkeySetListData );
			riff.softkey( riffGlobal.softkeySetListFunc );
			riff(".rf-component-header-setting").show();
			riff(".rf-component-header").hide();
		}
		else if ( riff(backScene[0]).buffer("ComponentSceneComponentDataSoftkey") )
		{
			riff.softkey( riff(backScene[0]).buffer("ComponentSceneComponentDataSoftkey") );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
		}
		else
		{
			riff.softkey( riffGlobal.softkeyDataGlobal );
			riff.softkey( riffGlobal.softkeyFuncGlobal );
			riff(".rf-component-header").show();
			riff(".rf-component-header-setting").hide();
		}

		var tTabMenu = riffScene.find(".rf-component-tabmenu"),
			tList = riffScene.find(".rf-component-list"),
			tabMenuIndex = tTabMenu.buffer("ComponentTabMenuIndex");

		if ( ( tTabMenu.size() > 0 ) && ( tTabMenu.buffer("feedDataReceiveTime" + tabMenuIndex ) ) ) {
			var currentTabIndex = tTabMenu.buffer("ComponentTabMenuComponentDataCurTabMenu");
			riff.dataReceiveTime( tTabMenu.buffer("feedDataReceiveTime" + currentTabIndex ) );
		} else if ( (tList.size() > 0) && tList.buffer("feedDataReceiveTime") ) {
			riff.dataReceiveTime( tList.buffer("feedDataReceiveTime") );
		} else {
			// If there is no Component using FEED, the dataReceiveTime is hidden
			riff.dataReceiveTime();
		}

		riff.softkey.softKeyMoreHide();
		riff.adjustSceneSize();

		// option setting
		var appOption = (_option)?_option:curScene[1],
			option = new Array();
		for(var k in appOption)
			option[k] = appOption[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.transitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.transitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.transitionMotion;
		option.transitionDirection = "off";

		riff.transition(  riff(backScene[0]), riff(curScene[0]), option );
		riffGlobal.sceneStack.push(backScene);

		return true;
	}
}

riff.popup = function(_popup, _option)
{
	if( typeof _popup == "object" || typeof _popup =="undefined" )
		return riff.popup.back.apply(this, arguments);
	else
		return riff.popup.go.apply(this, arguments);
};

riff.popup.go = function ( _popup, _option )
{
	if( typeof _popup == "string" ) {
		// the _popup will be made through the CSS ID
		var popup = riff.toID(_popup);

		// removing the "more" soft key
		riff.softkey.softKeyMoreHide();

		// closing a popup if it exists
		if( riffGlobal.popup )
			riff.popup();

		riff.softkey.softKeyMoreHide();
		// making the background behind the popup black so that user cannot click there
		riff(".rf-effect-dim-dark").show();

		// option setting
		var option = new Array();
		for(var k in _option)
			option[k] = _option[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.popupTransitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.popupTransitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.popupTransitionMotion;
		option.transitionDirection = "on";

		riff(popup).show();
		// effect for having a selected popup appear when there is nothing on the screen
		riff.transition( riff(popup).children(".rf-area-contents-popup"), null, option );

		option.transitionDirection = null;
		option.transitionFunc = null;
		// indicating that a popup already exists on the screen
		riffGlobal.popup = [popup, option];

		return true;
	}
}

riff.popup.back = function ( _option )
{
	if( typeof _option == "object" || typeof _option == "undefined" ) {
		// if it does not exist
		if( !riffGlobal.popup )
			return true;

		// checking the arguments
		var popup = riffGlobal.popup[0];
		riff.softkey.softKeyMoreHide();

		// option setting
		var appOption = (_option)?_option:riffGlobal.popup[1],
			option = new Array();
		for(var k in appOption)
			option[k] = appOption[k];
		if( !option.transitionEffect ) option.transitionEffect = riffGlobal.popupTransitionEffect;
		if( !option.transitionSecond ) option.transitionSecond = riffGlobal.popupTransitionSecond;
		if( !option.transitionMotion ) option.transitionMotion = riffGlobal.popupTransitionMotion;
		option.transitionDirection = "off";

		// manditory opperations for when a popup is closed
		option.transitionFunc = function () {
			// replacing the black background with the original screen
			riff(".rf-effect-dim-dark").hide();
			riff(popup).hide();
			// when the popup is removed, if there is a registered function, that function is activated
			if( _option && _option.transitionFunc)
			{
				_option.transitionFunc();
			}
		}

		riff.transition( null, riff(popup).children(".rf-area-contents-popup"), option );
		riffGlobal.popup = null;


		return true;
	}
}

riff.transition = function ( _on, _off, _opts )
{
	var effect = null,
		motion = null,
		second = null,
		direction = null,
		func = null;

	for (var k in _opts)
	{
		if( k == "transitionEffect" ) effect = _opts[k];
		else if( k == "transitionSecond" ) second = _opts[k];
		else if( k == "transitionMotion" ) motion = _opts[k];
		else if( k == "transitionDirection" ) direction = _opts[k];
		else if( k == "transitionFunc" ) func = _opts[k];
	}

	if( !effect ) effect = riffGlobal.transitionEffect;
	if( !second ) second = riffGlobal.transitionSecond;
	if( !motion ) motion = riffGlobal.transitionMotion;
	if( !direction ) direction = riffGlobal.transitionDirection;

	if( effect == "none" )
	{
		if ( _off ) _off.hide();
		if ( _on ) _on.show();
		if( func ) func();

		return true;
	}

	if ( direction == "on" ) direction = "Activity";
	else if ( direction == "off" ) direction = "Inactivity";

	riff(".rf-effect-dim-light").show();

	if( _off )
	{
		_off.addClass("rf-state" + effect + direction + "Current");
		_off.css("-webkit-animation-timing-function", motion );
		_off.css("-webkit-animation-duration", second );

	}

	if( _on )
	{
		_on.show();
		_on.addClass("rf-state" + effect + direction + "Next");
		_on.css("-webkit-animation-timing-function", motion );
		_on.css("-webkit-animation-duration", second );
	}

	window.setTimeout(
		function(){

			if( _off )
			{
				_off.hide();
				_off.removeClass("rf-state" + effect + direction + "Current");
				_off.css("-webkit-animation-duration", "" );
				_off.css("-webkit-animation-timing-function", "" );
			}

			if( _on )
			{
				_on.removeClass("rf-state" + effect + direction + "Next");
				_on.css("-webkit-animation-duration", "" );
				_on.css("-webkit-animation-timing-function", "" );
			}

			riff(".rf-effect-dim-light").hide();

			if( func )
				func();
		},
		window.parseFloat(second)*1000);

	return true;
}

riff.ellipsisString = function ( _str, _num )
{
	if( typeof _str == "string" ) {
		var num = ( typeof _num == "number" )?_num:
			(( typeof _num == "string" )?window.parseInt(_num):
				riffGlobal.ellipsisStringNum);

		return (_str.length > num)?_str.substring(0,num-3)+"...":_str;
	}

	return null;
};

riff.resize = function ( _width, _height )
{
	if(arguments.length == 0 || arguments.length == 1){
		_width = 480;
		_height = 800;
	}

	if( riff.isWidget() || riff.isEmulator() ){

		widget.window.resizeWindow(_width, _height);
	}else{
		window.resizeTo(_width, _height);
	}

	return true;
}


riff.storage = function ( _key, _value )
{
	if( !_key ) {
		return null;
	}

	if( arguments.length == 2 ) {
		if( riff.isWidget() )
			riff.storage.preference( _key, _value );
		else {
			riff.storage.localStorage( _key, _value );
		}
		return true;
	} else if(arguments.length == 1 ) {
		if( riff.isWidget() ) {
			return riff.storage.preference( _key );
		} else {
			return riff.storage.localStorage( _key );
		}
	}
};


riff.storage.preference = function (_key, _value)
{
	if ( !riff.isWidget() || !_key )
	{
		return null;
	}

	if ( arguments.length == 1 )
		return widget.preferenceForKey( _key );
	else if( arguments.length == 2 )
		return widget.setPreferenceForKey( _value, _key );
}


riff.storage.localStorage = function ( _key, _value )
{
	if ( !_key )
		return null;
	// if the local storage does not exists it is an error
	var storageObj = window.localStorage;
	if ( !storageObj ) {
		riff.alert(" the localStorage() Object is not exist.");
		return null;
	}

	if( arguments.length == 1) {
		// returning the saved value
		return storageObj.getItem( _key );
	} else if( arguments.length == 2 ) {
		// saving
		storageObj.setItem( _key, _value );
		return true;
	}
	return null;
};

// users can set the settable values of riffGlobal using the globalSetting() function

riff.globalSetting =  riff.option = function( )
{
	var setting = {};

	//if first argument is string
	if(typeof arguments[0] == "string")
		setting[ arguments[0] ] = arguments[1];
	else if(typeof arguments[0] == "object")
		setting = arguments[0];

	for(var k in setting)
	{
		if( k == "transitionEffect" || k == "transitionSecond"  || k == "transitionMotion"
			|| k == "isAlwaysNewScenePart" || k == "isAutoRefreshChangeOtherScenePart"  || k == "isRefreshChangeOtherScenePart"
			|| k == "useFeedCache" || k == "feedAutoRefreshTime"
			|| k == "popupTransitionEffect" || k == "popupTransitionSecond"  || k == "popupTransitionMotion"
			|| k == "softkeySetListData"  ||  k == "softkeySetListFunc"
			|| k == "idleArticleEllipsisStringLength" )
		{
			riffGlobal[k] = setting[k];
		}
		else if(k =="theme" )
		{
			riffGlobal.theme = setting[k];
			var cssLink = riff('head').children('link').each(
				function()
				{
					if ( riff(this).attr('href').indexOf('theme.css') != -1 )
						riff(this).remove();
				});

			if( riffGlobal.theme != "none" )
				riff('head').append('<link rel="stylesheet" href="theme/'+riffGlobal.theme+'/theme.css" type="text/css">');
		}
		else if( k == "softkeyType" || k == "softkeyFunc" || k == "softkeyData" )
		{
			if( setting[k] == "none" || k == "softkeyData" )
				riffGlobal.softkeyDataGlobal = setting[k];
			if( k == "softkeyFunc" )
				riffGlobal.softkeyFuncGlobal = setting[k];

			riff.softkey(setting[k]);
		}
		else if ( k =="eventType" )
		{
			riffGlobal.eventType = setting[k];
		}
		else if( k == "pageCache" )
		{
			if( setting[k] == true && riff.storage("riffPageCacheData") )
				riff.go( riff.storage("riffPageCacheData") );

			riffGlobal.pageCache = setting[k];
		}
		else if ( k == "transitionEffectNone" )
		{
			riff.transitionEffectNone( setting[k] );
		}
		else if( k == "setting" )
		{
			if( setting[k] == "autoRefresh5m" ) {
				riff('.rf-component-tabmenu').autoRefresh( 300000 );
			}else if( setting[k] == "autoRefresh10m" ) {
				riff('.rf-component-tabmenu').autoRefresh( 600000 );
			}
		}
		else if ( k == "widgetName" )
		{
			riffGlobal.widgetName = setting[k];
			riff(".rf-idle-logo").text( riffGlobal.widgetName );
		}
	}
	return true;
};

riff.softkey = function ()
{
	if( riff(".rf-component-softkey").size() == 0 )
		riff('.rf-wrapper-scene-all').after('<div class="rf-component-softkey"></div>');

	for( var i = 0; arguments[i]; i++ )	{

		if( typeof arguments[i] == "object" ) {			// softkey data
			riffGlobal.softkeyData = arguments[i];
		}else if( typeof arguments[i] == "string" ){	 		// softkey type
			if( arguments[i] == "none" ){
				riff('.rf-component-softkey').remove();
				break;
			}
			riffGlobal.softkeyType = arguments[i];
		} else if ( typeof arguments[i] == "function" )	{		// softkey function
			riffGlobal.softkeyFunc = arguments[i];
		}

		riff(".rf-component-softkey").setContents( riffGlobal.softkeyData, riffGlobal.softkeyType, riffGlobal.softkeyFunc  );
	}

	riff.adjustSceneSize();

	return true;
};


riff.softkey.softKeyMoreHide = function()
{
	if( riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more').size() !=0 && riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more').css('bottom') == '70px' )
	{
		var morekeyHeight = Math.abs(70-riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more').height());
		riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more').css('bottom','-'+morekeyHeight+'px');
	}
	return true;
};


riff.ajax = function ( _url, _fnSuccess, _option )
{
	if( !_url || typeof _url != "string" )  {
		return false;
	}
	if( _fnSuccess && typeof _fnSuccess != "function" )  {
		return false;
	}
	if( _option && typeof _option != "object" )  {
		return false;
	}

	return new riffAJAX( _url, _fnSuccess, _option  );
}


riff.xml = function ( _url, _fnSuccess, _opts  )
{
	if( arguments.length == 2 && typeof _url =="string" && typeof _fnSuccess == "object") {
		var opts = _fnSuccess,
			funcLoad = opts["load"],
			funcAttach = opts["attach"],
			funcOpts = opts["option"];

		return new riffXML( _url, function( _xml, _xmlObject, _xmlString ){
			var r;
			if( typeof funcLoad  == "function" )
				r = funcLoad.call(_xml, _xml, _xmlObject, _xmlString );
			if ( typeof funcAttach == "function" )
				funcAttach.call(_xml, r );
			},	funcOpts
		);
	}else {
		return new riffXML( _url, _fnSuccess, _opts  );
	}
}

riff.load = function( _func )
{

	// The executable functions are selected after the window object is totally loaded.
	// end if the h_func does not exist
	if( !_func || typeof( _func ) != 'function' )
	{
		return true;
	}
	// if the previously set onload function does not exist, the _func function will be immediately set
	var loadFunc = window.onload;
	if( !loadFunc )
	{
		window.onload = _func;
		return true;
	}

	// if an already set window.onload function exists, first execute the relevant functions, and then set it so that the _func will be executed next
	var setFunc = function()
	{
		loadFunc.call( window );
		_func.call( this );
	}
	window.onload = setFunc;
	return true;
};


riff.noConflict = function ()
{
	window.$ = riffGlobal.$;

	return riff;
};


riff.currentTime = function ( )
{
	var	timeCur = new Date();

	return (1900 + timeCur.getYear()) + "-" + (1 + timeCur.getMonth()) + "-" + timeCur.getDate() + " " + timeCur.getHours() + ":" + timeCur.getMinutes();
};

// time values of when the pubData or Recieved Data, ect, of FEED Component are outputed as html
riff.dataReceiveTime = function ( _showTime, _showText )
{
	var localShowTime = _showTime;
	var localShowText = _showText;

	var tBuf = riff(".rf-component-datareceivetime");

	if ( typeof( localShowTime ) == 'undefined' || !localShowTime ) { localShowTime = ""; } ;
	if ( typeof( localShowText ) == 'undefined' || !localShowText ) { localShowText = ""; };

	var idleShowTime = localShowTime;
	var idleShowText = localShowText;

	if ( arguments.length == 0 )
	{
		tBuf.hide();
		tBuf.html("");
	} else if( arguments.length == 1 ) {
		localShowText = tBuf.buffer("feedDataReceiveText") ;
		if ( !localShowText ) { localShowText = "" };
		tBuf.html( localShowTime + "<span class='rf-style-recieveinfo'>" + localShowText +"</span>" );
		tBuf.show();
		tBuf.buffer("feedDataReceiveTime", localShowTime );
		idleShowText = tBuf.buffer("feedDataReceiveText");
	} else if( arguments.length == 2 ) {
		tBuf.html( localShowTime + "<span class='rf-style-recieveinfo'>" + localShowText +"</span>" );
		tBuf.show();
		tBuf.buffer("feedDataReceiveTime", localShowTime );
		tBuf.buffer("feedDataReceiveText", localShowText );
	};

	var tIdle = riff(".rf-component-idle");
	if ( tIdle ) { tIdle.dataReceiveTime( idleShowTime, idleShowText ) };

	return true;
};

riff.dataReceiveInfo = function ( _showText )
{
	var tBuf = riff(".rf-component-datareceivetime");
	riff.dataReceiveTime( tBuf.buffer( "feedDataReceiveTime" ) , _showText );
	return true;
}


// When the composition of each screen differ,
// the Scene composition will automatically calculate the place and height of the object
// this function will execute whenever there is a screen transition or when necessary
riff.adjustSceneSize = function ()
{
	// Scene Height Controller
	var h = 16; // Margin-top

	// header Management. Even if the scene is in the Top Position, effects will be given.
	if(riff('.rf-wrapper-all').find('.rf-component-header').size() != "0" && riff('.rf-wrapper-all').find('.rf-component-header').css('display') != "none"){
		var headerH = riff('.rf-wrapper-all').find('.rf-component-header').height();
		h = h + headerH;

		riff('.rf-wrapper-all').find('.rf-wrapper-scene-all').css('top',h+"px");
	}

	if(riff('.rf-wrapper-all').find('.rf-component-header-setting').size() != "0" && riff('.rf-wrapper-all').find('.rf-component-header-setting').css('display') != "none"){
		var headerSettingH = riff('.rf-wrapper-all').find('.rf-component-header-setting').height();
		h = h + headerSettingH;
		riff('.rf-wrapper-all').find('.rf-wrapper-scene-all').css('top',h+"px");
	}

	if(riff('.rf-wrapper-all').find('.rf-component-softkey').size() != "0" && riff('.rf-wrapper-all').find('.rf-component-softkey').css('display') != "none")
		h = h + riff('.rf-wrapper-all').find('.rf-component-softkey').height();

	if(riff('.rf-wrapper-all').find('.rf-component-datareceivetime').size() != "0" && riff('.rf-wrapper-all').find('.rf-component-datareceivetime').css('display') != "none")
		h = h + riff('.rf-wrapper-all').find('.rf-component-datareceivetime').height();

	// maximum height of the widget is 762px
	var sceneH = 762-h+"px";

	riff('.rf-wrapper-all').find('.rf-wrapper-scene-all').css('height',sceneH);
	riff('.rf-wrapper-all').find('.rf-component-scene').css('height',sceneH);
	riff('.rf-wrapper-all').find('.rf-effect-scene-background').css('height',sceneH);
	riff('.rf-wrapper-all').find('.rf-wrapper-scene').css('height',sceneH);

	//ScenePart
	var tabMenuH = window.parseInt(riff('.rf-component-tabmenu').css('height'))+window.parseInt(riff('.rf-component-tabmenu').css('border-top-width'))+window.parseInt(riff('.rf-component-tabmenu').css('border-bottom-width'))+window.parseInt(riff('.rf-component-tabmenu').css('padding-top'))+window.parseInt(riff('.rf-component-tabmenu').css('padding-bottom'))+window.parseInt(riff('.rf-component-tabmenu').css('margin-bottom'))+window.parseInt(riff('.rf-component-tabmenu').css('margin-top')),
		 tabMenuScenePartH = window.parseInt(sceneH)-tabMenuH;

	 riff('.rf-component-tabmenu').parent().find('.rf-component-scenepart').css('height',tabMenuScenePartH+"px");

	 return true;
}

riff.xmlSelector = function ( _xml, _queryString )
{
	if ( !_xml || typeof( _xml ) != 'object' || !_xml.documentElement ) {
		return null;
	}

	var rv = new Array();
	var len = 0;
	var t3 = _xml.documentElement.querySelectorAll( _queryString );

	// when there is no xml search results
	if( (len = t3.length) < 0 &&  (len = (_xml.getElementsByTagName( _queryString )).length) < 0 ){
		return riff();
	}

	// the entire XML Element search results are placed within an Array
	for( var lp = 0; lp < len; lp++ )	{
		rv.push( t3[ lp ] );
	}

	return riff( rv );
};

// plug-in additional functions (extension functions)
riff.extend = function ( _name, _function )
{
	// when multiple number of functions are recieved, each one is called one by one and regiestered using extent().
	if( typeof _name == "object" ) {
		for ( var k in _name ) {
			riff.extend(k, _name[k]);		// extend recall
		}
	}else if (typeof _name == "string" && typeof _function == "function" ) {
		riff.fn[_name] = _function;
	}
	return true;
};

// Riff Components for the design and additional functions for the JaveScript alert window
// it cannot do too many calls
riff.alert = function ( _str, _opts )
{
	var opts = {};

	opts.cancelFunc = function(){ riff.back(); };

	for ( var k in _opts )
		opts[k] = _opts[k];
	opts.html = _str;

	// management of the popup markup creation
	riff("#alert").setContents( opts );

	// if no alert window is present on the screen, one is created and shown
	if( !(riffGlobal.popup && riffGlobal.popup[0] == "#alert")  ) {
		riff.go("alert");
	}

	return true;
};

// function to help easily manage the timer
riff.timer = function( _func, _time, _id )
{
    if(arguments.length == 1 && typeof arguments[0] =="string")
    {
		if ( riffGlobal.timerList[_func] )
		{
			clearInterval( riffGlobal.timerList[_func] );
			riffGlobal.timerList[_func] = null;
		}

		return true;
    }
	else if ( typeof _func == "number")
	{
		clearInterval( _func );

		for( var k in riffGlobal.timerList )
		{
			if( riffGlobal.timerList[k] == _func )
				riffGlobal.timerList[k] = null;
		}

		return true;
	}
    else if( typeof _func == "function" )
    {
		if( _id && riffGlobal.timerList[_id])
			riff.timer(_id);
        var count = 0;
        var ti = ( _time ) ? setInterval(function(){ _func.call(this, ++count);},_time) : setTimeout(_func, 0);
		if( _id) riffGlobal.timerList[_id] = ti;

		return ti;
    }
};


riff.changeScenePartFlag = function( _maxLength, _currentIndex, _dataSet, _isGoRun, _isAutoRefreshRun, _isRefreshRun )
{
	// does not tell the other TABs if they should or should not renew the current TAB
	function DontCareTheOtherScenePart()
	{
		_dataSet[ _currentIndex ].isScenePartNew = true ;
	};

	// tell the other TABs if they should or should not renew the current TAB
	function TheOtherScenePartMakeOld()
	{
		for( var lp = 0; lp < _maxLength; lp++ )
		{
			_dataSet[ lp ].isScenePartNew = false;
		}
		_dataSet[ _currentIndex ].isScenePartNew = true ;
	};

	// the current screen flag is set to always false.  Whenever the screen changes, data is pulled from the server to recreate the new screen
	if ( true == riffGlobal.isAlwaysNewScenePart )
	{
		TheOtherScenePartMakeOld();
		return true;
	}


	// If the screen is renewed because of component.go()
	// if the values for _isAutoRefreshRun / _isAutoRefreshRun does not exist
	if ( ( _isGoRun && (true == _isGoRun) )
		|| ( typeof( _isAutoRefreshRun ) == 'undefined' && typeof( _isRefreshRun ) == 'undefined' )
		)
	{
		// only the current TAB is refreshed and ends
		DontCareTheOtherScenePart();
		return true;
	};

	if ( !riffGlobal.isAutoRefreshChangeOtherScenePart && !riffGlobal.isRefreshChangeOtherScenePart )
	{
		DontCareTheOtherScenePart();
	} else if ( true == riffGlobal.isAutoRefreshChangeOtherScenePart && true == riffGlobal.isRefreshChangeOtherScenePart )
	{
		TheOtherScenePartMakeOld();
	} else if ( true == riffGlobal.isAutoRefreshChangeOtherScenePart && !riffGlobal.isRefreshChangeOtherScenePart )
	{
		if ( true == _isAutoRefreshRun )
		{
			TheOtherScenePartMakeOld();
		} else if ( true == _isRefreshRun )
		{
			DontCareTheOtherScenePart();
		}
	} else if ( !riffGlobal.isAutoRefreshChangeOtherScenePart && true == riffGlobal.isRefreshChangeOtherScenePart )
	{
		if ( true == _isAutoRefreshRun )
		{
			DontCareTheOtherScenePart();
		} else if ( true == _isRefreshRun )
		{
			TheOtherScenePartMakeOld();
		}
	}

	return true;
}


riff.isArray = function()
{
	if( arguments.length > 0)
	{
		 if ( arguments[0].push )
		 {
			return true;
		 }
		 else
		{
			 return false;
		}
	} else {
		return false;
	}
}

riff.transitionEffectNone = function( _bool )
{
	if(_bool)
	{
		riffGlobal.transitionEffect = "none";
		riffGlobal.transitionSecond = "0.0s";
		riffGlobal.popupTransitionEffect = "none";
		riffGlobal.popupTransitionSecond = "0.0s";
	}

	return true;
}

riff.settingList = function( _id, _data )
{
	riff("body").children(".rf-wrapper-all").children(".rf-wrapper-scene-all").append("<div class='rf-component-scene' id='"+_id+"'><div class='rf-component-list setList' id='"+_id+ "List" + "'></div></div>");
	riff("#"+_id).makeStructs();
	riff("#"+_id+ "List").makeStructs();
	riff("#"+_id+ "List").setContents( _data );

	return true;
}

riff.frameworkTabMenu = function ()
{
	var layoutParamsArray		= arguments[0];
	var scenePartArray			= arguments[1];
	var opts							= arguments[2];
	var xmlSuccessCallback	= arguments[3];

	var dataSetFEED = new Array();

	var dataSet = new Array();
	//n 객체 안에 url 값이 실제로 존재하는지를 확인.
	var urlExistCount = 0;

	for( var k in scenePartArray )
	{
		dataSet[k] = ["<div class='rf-component-list' id='ComponentTabMenuFEEDList"+k+"'><div class='rf-style-nodata' style='display:none;'>No data to display</div></div>",
			function ( idx )
			{
				var riffThis = riff(this);
				var riffThisDataSetFeed = riffThis.buffer("ComponentTabMenuComponentDataSetFeed");

				riff.xml(
					riffThisDataSetFeed[idx].url,
					function( _xml, _xmlObject, _xmlString ) {

						var _xmlCache = _xmlObject;
						var args = new Array();
						args.push( _xml );
						args.push( idx );
						args.push( riffThisDataSetFeed[idx].tagOpts );
						args.push( riffThisDataSetFeed[idx].opts );

						if( !riffThisDataSetFeed[idx].scenePartFunction || typeof riffThisDataSetFeed[idx].scenePartFunction != "function" )
						{
							riffThis.scenePartSelect(idx).find(".rf-component-list").setContents( args );

							var feedComponent = riffThis.buffer("ComponentDataFEEDIdle");
							if( feedComponent ) {
								feedComponent.moveFEEDArticle(0);
							}
						}

						if( riffThisDataSetFeed[idx].scenePartFunction && typeof riffThisDataSetFeed[idx].scenePartFunction == "function" ){
							riffThisDataSetFeed[idx].scenePartFunction.apply( riffThis, args );

							var feedComponent = riffThis.buffer("ComponentDataFEEDIdle");
							if( feedComponent ) {
								feedComponent.moveFEEDArticle(0);
							}
						}
						var tTime = riff.currentTime();
						riffThis.buffer( "feedDataReceiveTime" + idx, tTime );
						riff.dataReceiveTime( riffThis.buffer( "feedDataReceiveTime" + idx ) );
						// datetime
						var dataReceiveTimeComponent = riff('.rf-component-datareceivetime');
						dataReceiveTimeComponent.buffer( "feedDataReceiveTime", tTime );
						riff(".rf-component-idle").dataReceiveTime( tTime, dataReceiveTimeComponent.buffer("feedDataReceiveText") );
					}
					,  opts && opts.ajaxOption );
			},
			function ( idx )
			{
				var riffThis = riff(this);
				var tTime = riffThis.buffer( "feedDataReceiveTime" + idx );
				// datetime
				var dataReceiveTimeComponent = riff('.rf-component-datareceivetime' );
				dataReceiveTimeComponent.buffer( "feedDataReceiveTime", tTime );
				riff(".rf-component-idle").dataReceiveTime( tTime, dataReceiveTimeComponent.buffer("feedDataReceiveText") );
				riff.dataReceiveTime( tTime );

			}
		];
			var dataSetFEEDCur = {};
			dataSetFEEDCur.url							= scenePartArray[k];
			dataSetFEEDCur.scenePartFunction	= scenePartArray[k][1];
			dataSetFEEDCur.tagOpts					= scenePartArray[k][2];
			dataSetFEEDCur.opts						= opts;
			dataSetFEEDCur.xmlSuccessCallBackSet = xmlSuccessCallback;
			dataSetFEED.push(dataSetFEEDCur);

			urlExistCount++;
		}

		if ( urlExistCount <= 0 )	
		{
			riff.alert( "Check Feed URL in JS file." );
			var tIdleIndicator = riff(".rf-idle-busyindicator");
			if ( tIdleIndicator )
			{
				riff(".rf-idle-section1").hide();
				riff(".rf-idle-busyindicator").show();
				riff(".rf-idle-busyindicator").text("Check Feed URL in JS file.");
			}
			return false;
		};

		this.buffer("ComponentTabMenuComponentDataSet", dataSet )
			.buffer("ComponentTabMenuComponentDataSetFeed", dataSetFEED)
			.setContents( dataSet );

		return true;
};

riff.feedRefresh = function ()
{
	if( riff(".rf-component-scene").css("display") == "block" ){
		riff(".rf-component-scene").each( function () {
			if( riff(this).find(".rf-component-tabmenu").size() != 0 ) {
				var tabID= riff(this).find(".rf-component-tabmenu").dom().id;
				riff("#"+tabID).refresh( true );
				return true;
			}

			if( riff(this).find(".rf-component-list").size() != 0 ) {
				var listID= riff(this).find(".rf-component-list").dom().id;
				riff("#"+listID).refresh( true );
				return true;
			}
		});
	}
}


riff.fn.selector.prototype = riff.fn;
window.riff = window.$ = riff;
window.riffGlobal = riffGlobal;


// Basic riff Object Component

// If the className is not a reserved name and is a DOM Element, using a call the type object is set
var riffBasic = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "object";
}

// riff Idle Component
// If className = idle, the DOM element's type is set to idle
var ComponentIdle = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "idle";
}

// dynamically create DOM elements of idle
ComponentIdle.prototype.makeStructs = function ()
{
	var riffThis = riff(this);

	if( riff('.rf-component-idle').buffer("isIdleFlag") == true ) {
		riffThis.append("<div class='rf-idle-logo'></div>");
		riffThis.append("<div class='rf-idle-refresh'></div>");
		riffThis.append("<div class='rf-idle-go'></div>");
		riffThis.append("<div class='rf-idle-section1'></div>");
		riffThis.append("<div class='rf-idle-section2'></div>");
		riffThis.append("<div class='rf-idle-busyindicator'></div>");
		riffThis.append("<div class='rf-idle-datareceivetime'></div>");
		// Idle Category Logic
		riffThis.children(".rf-idle-section1").append("<div class='rf-idle-artcle-back'>Back</div><div class='rf-idle-article'></div><div class='rf-idle-artcle-forward'>Forward</div>")
		// Idle Content Logic
		riffThis.children(".rf-idle-section2").append("<div class='rf-idle-category-left'>&lt;</div><div class='rf-idle-category'></div><div class='rf-idle-category-right'>&gt;</div>")
		riff(".rf-idle-go").tap( function() { riff.go("#index"); } );
		riff(".rf-idle-article").tap( function() { riffThis.moveFEEDArticle("article"); } );
		riff(".rf-idle-category-left").tap( function () { riffThis.moveFEEDArticle("categoryLeft") } );
		riff(".rf-idle-category-right").tap( function () { riffThis.moveFEEDArticle("categoryRight") } );
		riff(".rf-idle-artcle-back").tap( function () { riffThis.moveFEEDArticle("articleLeft") } );
		riff(".rf-idle-artcle-forward").tap( function () { riffThis.moveFEEDArticle("articleRight") } );
		riff(".rf-idle-refresh").tap( function () { riffThis.moveFEEDArticle("refresh") } );
	}

}

ComponentIdle.prototype.setContents = function ()
{

}

ComponentIdle.prototype.option = function ( _data )
{
	for ( var k in _data){
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}
	}
}


//  @param
//    _move : "articleLeft", "articleRight", "categoryLeft", "categoryRight", (number)
ComponentIdle.prototype.moveFEEDArticle = function ( _move )
{
	var riffThis = riff(this);

	var feedComponent = riffThis.buffer("ComponentDataFEEDComponent");
	if( !feedComponent )
		return;

	var componentObject = feedComponent.component();
	if( !componentObject )
		return;

	// if type is tab
	if ( componentObject.type == "tabMenu" )
	{
		// article click event
		if(_move == "article"){
			var tabID = riffThis.buffer("ComponentDataFEEDComponentID");
			var parentID = $(tabID).parent().parent().dom().id;
			riff.go( parentID );
		}

		// refresh event
		if(_move == "refresh")	{
			var tabID = riffThis.buffer("ComponentDataFEEDComponentID");
			riff(tabID).refresh(false);
		}

		var dataSet = feedComponent.buffer("ComponentTabMenuComponentDataSet");
		if( !dataSet )
			return;

		var FEEDKey = riffThis.buffer("ComponentDataFEEDKey");
		if ( typeof FEEDKey !="number" && !FEEDKey )
			riffThis.buffer("ComponentDataFEEDKey", FEEDKey = null);

		var FEEDIndex = riffThis.buffer("ComponentDataFEEDIndex");
		if ( typeof FEEDIndex !="number" && !FEEDIndex )
			riffThis.buffer("ComponentDataFEEDKey", FEEDIndex = null);

		if ( FEEDKey == null ){
			FEEDKey = 0;
		}else {
			if ( _move == "categoryLeft" )	{
				if (--FEEDKey < 0) {
					FEEDKey = dataSet.length - 1;
				}
			}else if ( _move == "categoryRight" )	{
				if ( ++FEEDKey >= dataSet.length) {
					FEEDKey = 0;
				}
			}
		}

		riffThis.buffer("ComponentDataFEEDKey",FEEDKey);

		var idleSet = feedComponent.scenePartSelect(FEEDKey).find(".rf-component-list").buffer("ComponentDataIdleSet");

		if( !idleSet )
			FEEDIndex = null;

		if( typeof _move == "number"){
			FEEDIndex = _move;
		}else if ( FEEDIndex == null ||  _move == "categoryLeft" ||  _move == "categoryRight" ){
			feedComponent.go(FEEDKey);
			FEEDIndex = 0;
		}else{
			if ( _move == "articleLeft" ){
				if (--FEEDIndex < 0) {
					FEEDIndex = idleSet.length - 1;
				}
			}else if ( _move == "articleRight" ){
				if ( ++FEEDIndex >= dataSet.length) {
					FEEDIndex = 0;
				}
			}
		}

		riffThis.buffer("ComponentDataFEEDIndex",FEEDIndex);

		// idle title, ouput text to the article section
		if( FEEDIndex != null ){
			if ( idleSet[FEEDIndex] ){
				var reduceTitleText = riff.ellipsisString( feedComponent.children("ul").children("li").eq(FEEDKey).text(), 15 );
				riff(".rf-idle-category").text( reduceTitleText );
				var reduceArticleText = riff.ellipsisString( idleSet[FEEDIndex].txtHead, riffGlobal.idleArticleEllipsisStringLength );
				riff(".rf-idle-article").text( reduceArticleText );
				// dataReceivedTime
				var dataReceiveTimeComponent = riff('.rf-component-datareceivetime');
				riff(".rf-component-idle").dataReceiveTime( dataReceiveTimeComponent.buffer("feedDataReceiveTime" ), dataReceiveTimeComponent.buffer("feedDataReceiveText") );
			}
		}
	}
};
// sets feedComponent.
ComponentIdle.prototype.setFeedComponent = function ( _component )
{

	if ( typeof _component  == "string" ){
		riff(this).buffer("ComponentDataFEEDComponentID", _component );
		riff(this).setFeedComponent( riff( _component ) );
	}else if ( typeof _component == "object" ){
		_component.buffer("ComponentDataFEEDIdle", riff(this) );
		riff(this).buffer("ComponentDataFEEDComponent", _component );
		_component.go(0);
	}

}
// time values of when the pubData or Recieved Data, ect, of FEED Component are outputed as html
ComponentIdle.prototype.dataReceiveTime = function ( _showTime , _showText )
{
	var tBuf = riff('.rf-idle-datareceivetime');
	if ( !_showTime ) _showTime = "";
	if ( !_showText ) _showText = "";

	if ( arguments.length == 0 )
	{
		tBuf.hide();
		tBuf.html("");
	} else if ( arguments.length == 1 )
	{
		tBuf.html( _showTime + " " + tBuf.buffer("feedDataReceiveText") );
		tBuf.show();
	} else {
		tBuf.html( _showTime + " <br>" + _showText );
		tBuf.show();
	};
	return true;
};

// riff Button Component
// when the className is btn, using a call the type is set to btn
var ComponentButton = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "btn";
}

// button option setting
// params  : _data => { property : value }
ComponentButton.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		// applying size, color, btnImage to relavent buttons
		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","32px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","28px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","24px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		if(k == "btnImage"){
			riff(this).css("-webkit-border-image" ,"url('"+_data[k]+"') 15 stretch stretch");
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// riff datareceivetime Component
var ComponentDataReceiveTime= function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "dataReceiveTime";
}

// datareceivetime option setting
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentDataReceiveTime.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		// applying size, color, btnImage to relavent buttons
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf(" from ") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","24px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","18px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","14px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// riff Scene Component
// when the className equals scene, the type is set to scene
var ComponentScene = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "scene";
}

// scene option setting
// params : _data = > 1. { property : value }
ComponentScene.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "backgroundImage"){
			if (_data[k] == "rf-resourceImg1"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg1');
			} else if (_data[k] == "rf-resourceImg2"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg2');
			} else if (_data[k] == "rf-resourceImg3"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg3');
			} else if (_data[k] == "rf-resourceImg4"){
				riff(this).children('.rf-effect-scene-background').addClass('rf-resourceImg4');
			} else if (_data[k] == "none"){
				riff(this).children('.rf-effect-scene-background').css("background-image","none");
			} else {
				riff(this).children('.rf-effect-scene-background').css("background-image","url("+_data[k]+")");
			}
		}

		if(k == "opacity"){
			riff(this).children('.rf-effect-scene-background').css("opacity",_data[k]);
		}

		if(k == "backgroundColor"){
			riff(this).css("backgroundColor",_data[k]);
		}

		if(k == "softkeyData" ) {
			riff(this).buffer("ComponentSceneComponentDataSoftkey", _data[k] );
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// scene setting
// Blank DIV Element for BackgroundImage
// using sceneWrape, the infrastructure object <div class="rf-wrapper-scene"> wraps all elements
// place <div class="rf-wrapper-scene"> at the front to compose the frame and background
ComponentScene.prototype.makeStructs = function ()
{
	// Scene Component Default Setting
	// every elements has a class equals "scene"

	var riffThis = riff(this);
	riffThis.children().wrapAll("<div class='rf-wrapper-scene'></div>");
	riffThis.prepend("<div class='frameTop'></div><div class='frameBottom'></div><div class='rf-effect-scene-background'></div>");
	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// riff popup Component
// when the class name is popup the type is set to popup and is callable
var ComponentPopup = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "popup";
}

// popup option setting
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentPopup.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find('.rf-area-contents-popup').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.rf-area-contents-popup').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('.rf-area-contents-popup').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor"){
			riff(this).find('.rf-area-contents-popup').css("color",_data[k]);
		}

		if(k == "borderColor"){
			riff(this).find('.rf-area-contents-popup').css("border-color",_data[k]);
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).find('.rf-area-contents-popup').css("font-size","28px");
			} else if (_data[k] == "normal"){
				riff(this).find('.rf-area-contents-popup').css("font-size","24px");
			} else if (_data[k] == "small"){
				riff(this).find('.rf-area-contents-popup').css("font-size","20px");
			} else {
				riff(this).find('.rf-area-contents-popup').css("font-size",_data[k]);
			}
		}

		if(k == "btnAreaBackground"){
			if (_data[k][0] == "color"){
				riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// popup structure settings
ComponentPopup.prototype.makeStructs = function ( )
{
	// popup Component Default Setting
	// every element has a class equals "rf-component-popup"

	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentPopupComponentDataSet");	// getMode

	// when buffer has no values, setMode is used to save the buffer
	if ( !dataSet )
		riffThis.buffer("ComponentPopupComponentDataSet", dataSet = {} );	 // setMode

	// additional elements of popup
	riffThis.contents().not(".rf-area-btn-popup").wrapAll('<div class="rf-area-txt-popup"></div>');
	riffThis.contents().wrapAll('<div class="rf-area-contents-popup"></div>');

	// when setting the riff.js alert default button ( riff.back() ) through the okFunc function
	if ( typeof dataSet.okFunc == "function" ) {
		riffThis.children('.rf-area-contents-popup').children('.rf-area-btn-popup').children(".popupOK").tap( dataSet.okFunc );
	}

	// when setting the riff.js alert default button ( riff.back() ) through the cancelFunc function
	if ( typeof dataSet.cancelFunc == "function" ) {
		riffThis.children('.rf-area-contents-popup').children('.rf-area-btn-popup').children(".popupCancel").tap( dataSet.cancelFunc );
	}

	// editing or removing the focus class when a button on a popup is either touched or released
	riffThis.find('.rf-component-btn').touchStart(function(){ riff(this).addClass("rf-state-onfocus")})
				.touchEnd(function(){ riff(this).removeClass("rf-state-onfocus")})

	// popup option function call
	riffThis.option( riffThis.buffer("ComponentDataOption") );

}

// popup markup and data setting
// params : _data => { html : string }, { okFunc : function() {} } or { cancelFunc : function() {} }
ComponentPopup.prototype.setContents = function ( _data )
{
	var riffThis = riff(this),
		dataSet = {},
		inHTML = "",
		btnHTML = "";

	for( var k in _data ) 	{
		if( k == "html" )
			dataSet.html = _data[k];
		else if( k =="okFunc")
			dataSet.okFunc = _data[k];
		else if( k =="cancelFunc" )
			dataSet.cancelFunc = _data[k];
	}
	inHTML += dataSet.html;

	// Creating markups based off the button events within the riff.alert() function
	if( dataSet.okFunc ) {
		btnHTML += '<button class="rf-component-btn popupOff popupOK">OK</button>';
	}
	if( dataSet.cancelFunc ) {
		btnHTML += ' <button class="rf-component-btn popupOff popupCancel">Cancel</button>';
	}
 	if ( btnHTML != "" )  {
		inHTML += '<div class="rf-area-btn-popup">' + btnHTML + '</div>';
	}

 	riffThis.buffer("ComponentPopupComponentDataSet", dataSet);	// buffer setMode
	riffThis.html(inHTML);
 	riffThis.makeStructs();
}

// riff list Component
// when className equals list, the type is set to list and callable
var ComponentList = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="list";
}

// riff list AutoRefresh
// params _time : number
ComponentList.prototype.autoRefresh = function ( _time )
{
	var riffThis = riff(this),
		dataTimer = riffThis.buffer("ComponentListComponentDataTimer");

	if( dataTimer && typeof dataTimer == "number" ){
		riff.timer( dataTimer );
		dataTimer = null;
	}

	if( !_time || _time <= 0 )
		return;

	dataTimer = riff.timer( function() {
		if ( ( riffThis.parent().parent().css( "display" ) == 'block' )
			|| ( riff( ".rf-component-idle" ).css( "display" ) == 'block' ) ) {
			riffThis.refresh();
		}
	}, _time );

	riffThis.buffer("ComponentListComponentDataTimer", dataTimer);
}

// riff list refresh
ComponentList.prototype.refresh = function ()
{
	var riffThis = riff(this);

	var feedRefresh = riffThis.buffer("ComponentListComponentDataFEEDRefresh");

	if( feedRefresh && typeof feedRefresh == "function")
	{
		feedRefresh();
	}
}

// riff list Option
// params : _data = > 1. { property : value } , 2. { property : [key,value] }
ComponentList.prototype.option = function ( _data )
{
	for ( var k in _data){
		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).find('ul > li > .rf-effect-half-glow').show();
			} else if (_data[k] == "false"){
				riff(this).find('ul > li > .rf-effect-half-glow').hide();
			}
		}

		if(k == "lineTopColor"){
			riff(this).find('ul > li .rf-effect-line-top').css('display','block');
			riff(this).find('ul > li .rf-effect-line-top').css('border-color',_data[k]);
		}

		if(k == "lineBottomColor"){
			riff(this).find('ul > li .rf-effect-line-bottom').css('display','block');
			riff(this).find('ul > li .rf-effect-line-bottom').css('border-color',_data[k]);
		}

		if(k == "lineTopOpacity"){
			riff(this).find('ul > li .rf-effect-line-top').css('opacity',_data[k]);
		}

		if(k == "lineBottomOpacity"){
			riff(this).find('ul > li .rf-effect-line-bottom').css('opacity',_data[k]);
		}

		if(k == "fontColor"){
			riff(this).find('ul > li').css("color",_data[k]);
		}

		if(k == "subTextFontColor"){
			riff(this).find('ul > li .rf-style-txt-desc').css("color",_data[k]);
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find("li").css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).find("li").css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find("li").addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "maxLen")	{
			riff(this).buffer("ComponentListComponentDataMaxLen", _data[k]);
			riff(this).setContents( riff(this).buffer("ComponentListComponentDataInput") );
		}

		if(k == "SettingComponentPosition"){
			riff('.rf-obj-component-setting').css('float',_data[k]);
		}

        	// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)

		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// list count
// return number
ComponentList.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}

// list structs setting
ComponentList.prototype.makeStructs = function ()
{
	// List Component Default Setting
	var riffThis = riff(this),
		listRow = riffThis.children('ul').children('li');

	listRow.prepend("<div class='rf-effect-line-top'></div>"+		// Blank DIV Element for LineTop
				"<div class='rf-effect-line-bottom'></div>"+					// Blank DIV Element for LineBottom
				"<div class='rf-effect-half-glow'></div>"); 								// Blank DIV Element for Gradient

	listRow.touchStart(	function() { riff(this).addClass('rf-state-onfocus'); })
		.touchEnd( function() { riff(this).removeClass('rf-state-onfocus'); });

	// if there is no data, markups data will be read and saved
	if( !riffThis.buffer("ComponentListComponentDataSet") )
	{
		// array of the buffer dataSet
		riffThis.buffer("ComponentListComponentDataSet", new Array() );

		// retrieve the buffer's dataset
		listRow.each ( function () {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
				dataSetCur = {},
				listType = [ "radio", "check", "onoff", "rf-style-thumnail2", "rf-style-thumnail" ];

			// if there is a relevant class for the scene list listType
			// the dataSet.type will be used for setting
			for ( var i = 0, l = listType.length; i < l; i++)
			{
				if( riffThis.hasClass(listType[i]))
				{
					dataSetCur.type = listType[i];
					break;
				}
			}

			// when there is no listType, the type will be set through text
			if( i == l)
				dataSetCur.type = "text";

			dataSet.push( dataSetCur );
		});
	}


	listRow.each( function() {
		var riffThis = riff(this);

		riffThis.children('.rf-style-txt-desc').parent().addClass("rf-style-row-multi"); //add multiline class

		if( riffThis.children('.rf-wrapper-thumnail').size() != "0")
		{
			riffThis.addClass("rf-style-thumnail");

			if( !riffThis.children('.rf-wrapper-thumnail').next().hasClass('rf-style-txt-head') )
			{
				riffThis.addClass("rf-style-thumnail2");
			}
		};
	});

	listRow.filter('.rf-style-row-multi.rf-style-thumnail').each(function(){
		var riffThis = riff(this);

		if(riffThis.children('.rf-wrapper-thumnail').children('rf-style-thumnail').size()!=0){
		riffThis.children('.rf-style-txt-desc').css("width", (430- riffThis.children('.rf-wrapper-thumnail').children('rf-style-thumnail').width()) + "px");
		} else{
		riffThis.children('.rf-style-txt-desc').css("width", (430- riffThis.children('.rf-wrapper-thumnail').width()) + "px");
		}
	})

	listRow.filter('.rf-style-thumnail').each(function(){
		var riffThis = riff(this);
		riffThis.css("line-height", (riffThis.children('.rf-wrapper-thumnail').children('img').height() + 28) +"px")
	})

	// Checkbox Component Default Setting
	listRow.filter('.check').prepend('<div class="rf-obj-component-setting"><div class="rf-component-checkbox"><div class="rf-obj-checkbox-1"></div><div class="rf-obj-checkbox-2"></div></div></div>')
			.tap( function() {

		var	riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.rf-obj-component-setting').children('.rf-component-checkbox');

		liSym.toggleClass('rf-state-on');
		listDataSet[ idx ].selectFlag = liSym.hasClass('rf-state-on');
	});

	// onoff Component Default Setting
	listRow.filter('.onoff').prepend('<div class="rf-obj-component-setting"><div class="rf-component-onoff"><div class="rf-obj-bg-onoff"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.rf-obj-component-setting').children('.rf-component-onoff');

		liSym.toggleClass('rf-state-on');
		listDataSet[ idx ].selectFlag = liSym.hasClass('rf-state-on');
	});

	// radio Component Default Setting
	listRow.filter('.radio').prepend('<div class="rf-obj-component-setting"><div class="rf-component-radio"><div class="rf-obj-radio"></div><div class="rf-obj-radio-shadow"></div></div>')
			.tap( function() {

		var riffThis = riff(this),
			listDataSet = riffThis.parent().parent().buffer("ComponentListComponentDataSet"),
			idx = riffThis.index(),
			liSym = riffThis.children('.rf-obj-component-setting').children('.rf-component-radio'),
			liThisRow = riffThis.parent().children('li');

		for( var k in listDataSet ){
			if( listDataSet[k].type == "radio" ){
				listDataSet[k].selectFlag = false;
				liThisRow.eq(k).children('.rf-obj-component-setting').children('.rf-component-radio').removeClass('rf-state-on');
			}
		}

		listDataSet[idx].selectFlag = true;
		liSym.addClass('rf-state-on');

		if ( typeof listDataSet[idx].scenePartLoad == "function" ){
			listDataSet[idx].scenePartLoad.apply(this, listDataSet[idx].funcArgs);
		}
	});

	// when the Radio exists, the list value is adjusted
	listRow.children(".innerCom").each( function(){
		var riffThis = riff(this),
			riffThisParent = riffThis.parent();

		// Adjust Sub Text width
		riffThis.siblings('.rf-style-txt-desc').css('width','390px');

		// the components position is adjust when there's only one line
		if(! riffThisParent.hasClass('rf-style-row-multi'))
		{
			var pH = window.parseInt(riffThisParent.css("line-height"));
			riffThis.css("margin-top",(pH-(pH/2+20))+"px");
		}

		// setting the left and right margins
		if(riffThis.css('float') == "left")
			riffThis.css('margin-right','10px');
	});

	// list option function call
	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// list structs setting
ComponentList.prototype.setContents = function ( _data, _type )
{
	var riffThis = riff(this);

	if( riffThis.hasClass('setList') )
	{
		// setttingList Component Default Setting

		if( !_data ) {
			return riffThis.buffer("ComponentListComponentDataSet");
		}

		var inHTML = "<ul>",
			dataSet = new Array(),
			data;

		if( typeof _data[1] == "function" ) {
			data = _data[0];
			riffThis.buffer( "ComponentListComponentDataFunc", _data[1] );
		} else {
			data = _data;
		}

		// make markup
		for( var k in data ) {

			var dataSetCur = {},
				i = 0;

			dataSetCur.key = k;

			dataSetCur.type = data[k][i++];

			if( dataSetCur.type == "rf-style-thumnail" || dataSetCur.type == "rf-style-thumnail2" ) {
				dataSetCur.img = data[k][i++];
			}else if( typeof data[k][i] == "boolean" ) {
				dataSetCur.selectFlag =data[k][i++];
			}

			dataSetCur.header = data[k][i++];

			if( typeof data[k][i] == "string" ) {
				dataSetCur.headerList = data[k][i++];
			}
			dataSet.push(dataSetCur);

			inHTML += '<li' + ((dataSetCur.type=="radio" || dataSetCur.type=="check" || dataSetCur.type=="onoff")?' class="'+ dataSetCur.type+'"':'') + '>';

			if( dataSetCur.img ) {
				if(dataSetCur.type=="rf-style-thumnail") {
					inHTML += '<div class="rf-wrapper-thumnail"><img src="' + dataSetCur.img + '"></div>' + '<div class="rf-style-txt-head">' + dataSetCur.header + '</div>';
				}else {
					inHTML += '<div class="rf-style-txt-head">' + dataSetCur.header + '</div>' + '<div class="rf-wrapper-thumnail"><img src="' + dataSetCur.img + '"></div>';
				}
			}else {
				inHTML += '<div class="rf-style-txt-head">' + dataSetCur.header + '</div>';
			}

			if( dataSetCur.headerList ) 	{
				inHTML += '<div class="rf-style-txt-desc">' + dataSetCur.headerList + '</div>';
			}
			inHTML += '</li>';
		}
		inHTML += "</ul>";

		riffThis.buffer("ComponentListComponentDataSet", dataSet );
		riffThis.html(inHTML);
		riffThis.makeStructs();

		for( var k in dataSet ) {
			if( dataSet[k].selectFlag ) {
				riffThis.getSettingValue( dataSet[k].key );
			}
		}
	}
	else if( _type != "setting")
	{
		var _xml			= "";
		var _fnIndex	= 0;
		var _tagOpts	= "";
		var _opts			= "";
		var args			= "";

		riff.popup.back();

		if( arguments.length == 1 && typeof arguments[0] == "object" )
		{
			args			= arguments[0];
			_xml			= args[0];
			_fnIndex	= args[1];
			_tagOpts = args[2];
			_opts		= args[3];
		}

		// opts Setting
		var opts = {};
		opts.iterator			= "item";
		opts.imageType	= "img";

		for ( var k in _opts )
			opts[k] = _opts.ajaxOption[k];

		var tagInfo = {};
		tagInfo.title = "title";
		tagInfo.description = "description";
		tagInfo.link = "link";
		tagInfo.image = "image";

		for( var k in _tagOpts )
		{
			if( k == "title" )
				tagInfo.title = _tagOpts[k];
			else if(k=="description")
				tagInfo.description = _tagOpts[k];
			else if(k == "link")
				tagInfo.link = _tagOpts[k];
			else if(k == "image")
				tagInfo.image = _tagOpts[k];
		}

		var dataArray = new Array();
		var itemElem = _xml.selector(opts.iterator);
		var inHTML = "<ul>";
		var urlArray = new Array();

		var dataSetFEED = new Array();

		for ( var i=0, l=itemElem.size(); i<l; i++ )
		{
			var dataType = "";
			var dataImgUrl = "";
			var dataTitle = "";
			var dataDescription = "";
			var dataLink = "";
			var moveUrl = "";

			if( tagInfo.image )
			{
				var elem = itemElem.eq(i).find(tagInfo.image);

				if( elem.size() != 0 )
				{
					var strSelect = riff.trim(tagInfo.image);		// ex thumbnail[url]

					if( strSelect.substr(strSelect.length-1, strSelect.length) == ']' )
					{
						var attr = riff.trim( strSelect.substring( strSelect.lastIndexOf("[")+1 , strSelect.lastIndexOf("]") ) ),
							imgSrc = elem.attr(attr);

						if( imgSrc )
						{
							dataType = "rf-style-thumnail";
							dataImgUrl = imgSrc;
						}
					}
					else if ( riff.trim(elem.text()) )
					{
						dataType = "rf-style-thumnail";
						dataImgUrl = riff.trim( elem.text());
					}
				}

				if( opts.description != "none" ) {
					dataDescription = itemElem.eq(i).find(tagInfo.description).text();
				}

				if( opts.link != "none" && riff.trim(itemElem.eq(i).find(tagInfo.link).text()) )
				{
					dataLink = itemElem.eq(i).find(tagInfo.link).text();
					moveUrl = [function ( _url ) { riff.openURL( _url ); }, dataLink];
					urlArray.push([function ( _url ) { riff.openURL( _url ); }, dataLink] );
				}

				var txtHead = itemElem.eq(i).find(tagInfo.title).text();

				inHTML += '<li' + ((dataType =="radio" || dataType=="check" || dataType=="onoff" || dataType=='accordion')?' class="'+ dataType+'"':'') + '>';

				if( imgSrc )
					if(dataType =="rf-style-thumnail")
						inHTML += '<div class="rf-wrapper-thumnail"><img src="' + dataImgUrl + '"></div>' + '<div class="rf-style-txt-head">' + txtHead + '</div>';
					else
						inHTML += '<div class="rf-style-txt-head">' + txtHead + '</div>' + '<div class="rf-wrapper-thumnail"><img src="' + dataImgUrl + '"></div>';
				else if(dataType == "accordion")
					inHTML += txtHead;
				else
					inHTML += '<div class="rf-style-txt-head">' + txtHead + '</div>';

				if( dataDescription )
					inHTML += '<div class="rf-style-txt-desc">' + dataDescription + '</div>';

				if( dataType == "accordion" )
					inHTML += '<div class="accCon"><div class="rf-component-list"></div></div>';

				inHTML += '</li>';

				var dataSetFEEDCur = {};
				dataSetFEEDCur.dataImgUrl = dataImgUrl;
				dataSetFEEDCur.txtHead = txtHead;
				dataSetFEEDCur.dataDescription = dataDescription;
				dataSetFEEDCur.dataLink = dataLink;
				dataSetFEED.push( dataSetFEEDCur );
			}
		}
		inHTML += "</ul>";

		riffThis.html(inHTML);

		riffThis.find("ul > li").each(
			function ( eachIndex ) {
				var riffThis = riff(this);
				riffThis.tap( function () { urlArray[eachIndex][0](urlArray[eachIndex][1] );  } ) ;
		});


		riffThis.buffer("ComponentDataIdleSet", dataSetFEED );

		riffThis.makeStructs();
	}
}

// list func
// params -> _data : object
ComponentList.prototype.scenePartLoad = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");

	if( !dataSet ) {
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );
	}

	if( typeof _data == "object" ) {
		for ( var k in _data) {
			dataSet[k].scenePartLoad = _data[k];
		}
	}
}

// list sub
// params -> _key : number or string
ComponentList.prototype.scenePartSelect = function ( _key )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	// returns elements that are relevant to the key values
	// if the key is not a number or string, it will return the entire li element
	if( typeof _key == "string" )	{
		for ( var k in dataSet) {
			if( dataSet[k].key == _key ) {
				return riffThis.scenePartSelect( window.parseInt(k) );
			}
		}
	}else if ( typeof _key == "number") {
		return riffThis.children('ul').children('li').eq(_key);
	}else {
		return riffThis.children('ul').children('li').eq();
	}
}

// list removeListItem
// params -> _key : string or number
ComponentList.prototype.removeListItem = function ( _key )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentListComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentListComponentDataSet", dataSet = new Array() );

	// if the _key type is a string, the remove() function is called
	// if the _key type is a number, the _key'ed list position will be deleted from the dataSet array
	if( typeof _key == "string" ) {
		for ( var k in dataSet) {
			if( dataSet[k].key == _key ) {
				riffThis.remove( window.parseInt(k) );
			}
		}
	}else if ( typeof _key == "number") {
		var dataSetTemp = new Array();

		for( var i = 1, l = dataSet.length - _key; i< l; i++) {
			dataSetTemp.push( dataSet.pop() );
		}
		for( var i = 0, l = dataSetTemp.length; i< l; i++) {
			dataSet.push( dataSetTemp.pop() );
		}

		// deletes the keyed list
		riffThis.scenePartSelect(_key).remove();
	}
}

// the number within the setting list
ComponentList.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}


// when pressing the OK button inside of the settings, the executable arguments based on chosen keys are placed in an array.
ComponentList.prototype.okFunc = function ()
{
	var riffThis = riff(this),
		func = riffThis.buffer("ComponentListComponentDataFunc");

	if( typeof func == "function" ){
		func.call(this, riffThis.getSettingValue() );
	}
}

// the key values from selected items within setting are returned as an array
ComponentList.prototype.getSettingValue = function ( _key, _value )
{
	var riffThis = riff(this),
	dataSet = riffThis.buffer("ComponentListComponentDataSet");

	// when the _key type is a string, it will pass the indexNo as a parameter, and call back the getStringValue function
	// and change the _key to a number
	if( !dataSet ){
		return null;
	}
	else if( typeof _key == "string" ){
		for( var i = 0; dataSet[i]; i++)
			if( dataSet[i].key == _key )
				riffThis.getSettingValue(i, _value);
	}else if ( typeof _key == "number" && dataSet[_key]){
		var liAll = riffThis.children('ul').children('li'),
			liSelect = liAll.eq(_key),
			liSym;

		// checks to see what kind of type and divides it
		if( dataSet[_key].type == "check" ){
			liSym = liSelect.children('.rf-obj-component-setting').children('.rf-component-checkbox');
		}else if ( dataSet[_key].type == "onoff" ){
			liSym = liSelect.children('.rf-obj-component-setting').children('.rf-component-onoff');
		}else if ( dataSet[_key].type == "radio" ){
			for( var i = 0; dataSet[i]; i++){
				if( dataSet[i].type == "radio"){
					dataSet[i].selectFlag = false;
				}
			}
			liAll.children('.rf-obj-component-setting').children('.rf-component-radio').removeClass('rf-state-on');
			liSym = liSelect.children('.rf-obj-component-setting').children('.rf-component-radio');
		}

		// where there is an already checked type, will edit or remove the attribute, and change the flag value
		if ( liSym ){
			if(_value == "off"){
				liSym.removeClass('rf-state-on');
				dataSet[ _key ].selectFlag = false;
			}else{
				liSym.addClass('rf-state-on');
				dataSet[ _key ].selectFlag = true;
			}
		}
	}else{
		var rArray = new Array();

		for ( var k in dataSet)
			if( dataSet[k].selectFlag == true)
				rArray.push( dataSet[k].key );

		return rArray;
	}
}

// riff Tab Component
var ComponentTabMenu = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "tabMenu";
}

// option settings for the tab component
ComponentTabMenu.prototype.option = function ( _data )
{
	for ( var k in _data)
	{

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).find('li').not('.on').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('li').not('.on').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).find('li').not('.on').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "focusBackground")
		{
			if (_data[k][0] == "color"){
				riff(this).find('li.on').css("background",_data[k][1]);
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1)
				{
					riff(this).find('li.on').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				}
				else
				{
					riff(this).find('li.on').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor")
		{
			riff(this).find('li').not('.on').css("color",_data[k]);
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).find('li').css("font-size","32px");
			} else if (_data[k] == "normal"){
				riff(this).find('li').css("font-size","28px");
			} else if (_data[k] == "small"){
				riff(this).find('li').css("font-size","24px");
			} else {
				riff(this).find('li').css("font-size",_data[k]);
			}
		}

		if(k == "focusFontColor")
		{
			riff(this).find('li.on').css("color",_data[k]);
		}


		if(k == "glow")
		{
			if (_data[k] == "true"){
				riff(this).find('.rf-effect-half-glow').show();
			} else if (_data[k] == "false"){
				riff(this).find('.rf-effect-half-glow').hide();
			}
		}

		if(k == "lineOpacity")
		{
			riff(this).find(".rf-obj-border-tab").css("opacity",_data[k]);

		}

		if(k == "lineColorLight")
		{
			riff(this).find('.rf-obj-border-tab').css("border-left-color",_data[k]);
		}


		if(k == "lineColorDark")
		{
			riff(this).find('.rf-obj-border-tab').css("border-right-color",_data[k]);
		}

		if( k =="maxLen" )
		{
			riff(this).parent().find('.list').option( { "maxLen" : _data[k] } );
		}

		if( k == "transitionOption" )
		{
			riff(this).buffer("ComponentTabMenuComponentDataTransitionOption", _data[k] );
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}

}

// tab menu number
ComponentTabMenu.prototype.count = function ()
{
	return riff(this).children('ul').children('li').size();
}

// tab structure settings
ComponentTabMenu.prototype.makeStructs = function ( )
{
	var riffThis		= riff(this);
	var riffThisUl		= riffThis.children('ul');
	var lis				= riffThisUl.children('li');

	lis.prepend("<div class='rf-effect-shadow-inner'></div>"+		// Blank DIV Element for Border
				"<div class='rf-obj-border-tab'></div>"); 			// Blank DIV Element for Border

	riffThis.prepend("<div class='rf-effect-half-glow'></div>");	// Blank DIV Element for Glow

	// when there's no dataset in the buffer (just like feed function does not dynamically create elements, when the component uses a tab creates an indext.html element and uses it)
	if ( !riffThis.buffer("ComponentTabMenuComponentDataSet") )
	{
		riffThis.buffer("ComponentTabMenuComponentDataSet", new Array() );

		riffThis.children('ul').children('li').each ( function () {
			var riffThis = riff(this),
				dataSet = riffThis.parent().parent().buffer("ComponentTabMenuComponentDataSet"),
				dataSetCur = {};

			dataSetCur.key = riff.trim( riffThis.text() );

			dataSetCur.enable = true;
			dataSet.push( dataSetCur );
		});
	}

	lis.tap( function() {
		var liThis	= riff(this);
		var tabMenuRiff = riff(this).parent().parent();

		tabMenuRiff.go( liThis.index() );
	});

	if(lis.size() =="1"){
		lis.css("width","100%");
	} else if (lis.size() =="2"){
		lis.css("width","50%");
	} else if (lis.size() =="3"){
		lis.css("width","33.3%");
	} else if (lis.size() >="4"){
		lis.css("width","25%");
	}

	riff('.rf-component-scenepart').parent().css("overflow","hidden");

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}


// tabMenu control markup and tabMenu scenePart list markup create
ComponentTabMenu.prototype.setContents = function ( _data )
{
	var riffThis = riff(this);
	if( !_data )
		return riffThis.buffer("ComponentTabMenuComponentDataSet");

	var dataSet = new Array(),
		inHTML = "<ul>",
		sceneHTML = "";

	// detailed settings for each tab
	for( var k in _data )
	{
		var dataSetCur = {};

		dataSetCur.feedTitle = k;
		dataSetCur.enable = true;

		if( typeof _data[k] == "string" )
		{
			dataSetCur.scenePartInnerList = _data[k];
		}
		else if( typeof _data[k] == "object" )
		{
			// applying div Element to beneath the subScene List class
			dataSetCur.scenePartInnerList = _data[k][0];
			// applying the called function when approaching a relavant tab
			dataSetCur.scenePartLoadFlag = _data[k][1];
			// calling the calling time renewal function when approaching a relevant tab
			dataSetCur.scenePartLoad = _data[k][2];
		}

		dataSet.push( dataSetCur );

		inHTML += "<li>" + dataSetCur.feedTitle + "</li>";
		sceneHTML += "<div class='rf-component-scenepart'>" + dataSetCur.scenePartInnerList + "</div>";
	}

	inHTML += "</ul>";

	riffThis.html(inHTML);			// TabMenu control markup
	riffThis.after(sceneHTML);	// TabMenu scenePart markup

	riffThis.buffer("ComponentTabMenuComponentDataSet", dataSet);
	riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu", null);
	riffThis.makeStructs();
}

// TabMenu move event function
// trigging funcation when a tab is clicked
ComponentTabMenu.prototype.go = function ( _tab, _opts )
{
	if (typeof _tab == "number")
	{
		var riffThis = riff(this),
			dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet"),
			curTabMenu = riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu"),
			scenePart = riffThis.siblings('.rf-component-scenepart'),
			tabMenuList = riffThis.children('ul').children('li');

		riffThis.buffer("ComponentTabMenuFirstLoad", true);

		// when selecting the curent tab
		if(  curTabMenu === _tab )
			return;

		riffThis.buffer("ComponentTabMenuIndex", _tab);

		// no dataSet tab
		if( !dataSet )
			riffThis.buffer("ComponentTabMenuComponentDataSet", dataSet = new Array() );

		// deleting the current tab mark
		tabMenuList.removeClass('on');
		// when moving to another tab, marking the current tab
		tabMenuList.eq(_tab).addClass('on');

		// saving the current tab number into the buffer
		riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu", _tab);


		// calculating the number of milliseconds
		var second = 0;
		if( typeof curTabMenu != "number" || riffGlobal.tabTransitionOrder == "after")
		{
			second = 0;
		}
		else if ( _opts )
		{
			if( _opts.transitionEffect == "none" ) second = 0;
			else second = window.parseFloat( _opts.transitionSecond );
		}
		else if ( riffThis.buffer("ComponentTabMenuComponentDataTransitionOption") )
		{
			if ( riffThis.buffer("ComponentTabMenuComponentDataTransitionOption").transeffect == "none" ) second = 0;
			else second = window.parseFloat( riffThis.buffer("ComponentTabMenuComponentDataTransitionOption").transitionSecond );
		}
		else
		{
			if ( riffGlobal.transeffect == "none" ) second = 0;
			else second = window.parseFloat( riffGlobal.transitionSecond );
		}

		window.setTimeout( function() {
			if ( dataSet[_tab] )
			{
				if ( riff.isWidget() && ( !riff.widget.sysInfo_network_getIsNetworkAvailable() ) )
				{
					riff.alert( "Network unavailable" );
				} else {
					if ( !dataSet[_tab].isScenePartNew && dataSet[_tab].scenePartLoadFlag )
					{
						dataSet[_tab].scenePartLoadFlag.call( riffThis.dom(), _tab );

						// screen renewal policies are applied based off the autoRefresh, refresh settings
						// when moving using the component.move() function, the flag is renewed
						riff.changeScenePartFlag( dataSet.length, _tab, dataSet, true );
					}
				}
				if ( dataSet[_tab].scenePartLoad )
					dataSet[_tab].scenePartLoad.call( riffThis.dom(), _tab );
			}
		}, second*1000 );


		// when the current tab type is not a number, it will show the tabbed subScene
		if( typeof curTabMenu != "number")
		{
			scenePart.hide();
			scenePart.eq(_tab).show();
		}
		else
		{
			// will show an effect based off h _tab = on, curTab = off
			riff.transition(
				scenePart.eq(_tab),
				scenePart.eq(curTabMenu),
				(_opts)?_opts:riffThis.buffer("ComponentTabMenuComponentDataTransitionOption") );
		}
	}
}

// renewal function for the tab subScene screen
ComponentTabMenu.prototype.scenePartLoad = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet");
	if( !dataSet )
		return true;

	if( typeof _data == "object" )
		for ( var k in _data)
			dataSet[k].scenePartLoad = _data[k];
}


// When the tab changes if the flag is set to true, the screen is renewed
ComponentTabMenu.prototype.scenePartLoadFlag = function ( _data )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet");
	if( !dataSet )
		riffThis.buffer("ComponentTabMenuComponentDataSet", dataSet = new Array() );

	if( typeof _data == "object" )
		for ( var k in _data)
		{
			dataSet[k].scenePartLoadFlag = _data[k];
			dataSet[k].isScenePartNew = false;
		}
}


// the next relevent element after this is set to 0 and retrieved.
ComponentTabMenu.prototype.scenePartSelect = function ( _idx )
{
	var riffThis= riff(this),
		idx = ( typeof _idx == "undefined" )? riffThis.buffer("ComponentTabMenuComponentDataCurPage") : _idx ;
	return riff(this).siblings(".rf-component-scenepart").eq( idx );
}

// tab refresh function
ComponentTabMenu.prototype.refresh = function ( _isCallByAutoRefresh )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet"),
		curTabMenu = riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu");

	if ( dataSet && dataSet[curTabMenu] )
	{
		if ( dataSet[curTabMenu].scenePartLoadFlag )
		{
			dataSet[curTabMenu].scenePartLoadFlag.call( this, curTabMenu );
			if ( _isCallByAutoRefresh )
			{
				// when renewing the screen using Autorefresh() function, the flag is also renewed
				riff.changeScenePartFlag( dataSet.length, curTabMenu, dataSet, false, true, false );
			} else {
				// when renewing the screen using refresh() function, the flag is also renewed
				riff.changeScenePartFlag( dataSet.length, curTabMenu, dataSet, false, false, true );
			}
		}

		if ( dataSet[curTabMenu].scenePartLoad )
			dataSet[curTabMenu].scenePartLoad.call( this, curTabMenu );
	}
}

// tab autorefresh function
ComponentTabMenu.prototype.autoRefresh = function ( _time )
{
	var riffThis = riff(this),
		dataSet = riffThis.buffer("ComponentTabMenuComponentDataSet"),
		curTabMenu = riffThis.buffer("ComponentTabMenuComponentDataCurTabMenu");

	if( dataSet && typeof dataSet.timer == "number" )
	{
		riff.timer( dataSet.timer );
		dataSet.timer = null;
	}

	if( !_time )
		return;

	dataSet.timer = riff.timer( function() {
		if ( ( riffThis.parent().parent().css( "display") == 'block' )
			|| ( riff(".rf-component-idle").css( "display") == 'block' ) ) {
			riffThis.refresh( true );
		}
	}, _time );
}




// riff Softkey Component
var ComponentSoftKey = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="softkey";
}


// softkey setContents and markStructs
ComponentSoftKey.prototype.setContents = function( _data, _type, _func )
{
	var riffThis = riff(this);
	riffThis.html("");

	if (!_data)
		return;

	if(!_type)
		_type = riffGlobal.softkeyType;

	if(!_func)
		_func = riffGlobal.softkeyFunc;

	if(_type == "type1")
		_type = "rf-type-softkey-1";

	riffThis.removeClass("rf-type-softkey-1").addClass(_type);
	var dataSet = new Array();

	if( _type == "rf-type-softkey-1" )
	{
		var softKeyHTML = '<div class="rf-effect-dropshadow"></div><div class="rf-area-key-normal">'
						+'<div class="rf-area-backbtn"></div><ul class="rf-style-key-normal">';
		var moreHTML = "";

		var k = 0;
		for ( var curdata in _data )
		{
			// data
			var dataSetCur= new Array();
			dataSetCur.push( curdata ); // key value
			dataSetCur.push( _data[curdata] ); // function
			dataSet.push(dataSetCur);

			if( k<2 )
				softKeyHTML += ( "<li>" + curdata + "</li>" );
			else
				moreHTML += ( "<li>" + curdata + "</li>" );

			k++;
	    }

		softKeyHTML += ( dataSet.length > 3 )?'<li>More</li></ul></div><ul class="rf-area-key-more">'+moreHTML : moreHTML;
	    softKeyHTML += "</ul>";

	    riffThis.html(softKeyHTML);
	    riffThis.buffer("riffSoftKeyData", dataSet);

		riffThis.children(".rf-area-key-more").children("li").tap( function()
		{
			var softkeydata = riffThis.buffer("riffSoftKeyData");

			var func = softkeydata[riff(this).index()+2][1];
			func.call(this, riff(this).index()+2 );
			riff.softkey.softKeyMoreHide();
		});

		//Softkey Width Set
		var keyObj =riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-style-key-normal li');
		var keyNum = keyObj.size();

		if(keyNum == 3 ){
			keyObj.css("width","131px");
		} else if (keyNum == 2 ){
			keyObj.css("width","198px");
		} else if (keyNum == 1 ){
			keyObj.css("width","398px");
		}

		var moreList=riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more');
		var moreObj = riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li');
		var moreNum = moreObj.size();

		if (moreNum%2 == 0){
			moreObj.css("width","238px");
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:last-child').addClass('evenLast')
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:nth-last-child(2)').addClass('evenLast2')

		} else {
			moreObj.css("width","238px");
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:last-child').css("width","478px");
			riff('.rf-component-softkey.rf-type-softkey-1 ul.rf-area-key-more li:last-child').addClass('oddLast')
		}

		//Softkey more function
		riff( this ).find(".rf-style-key-normal > li").not( (dataSet.length>3)?2:null ).tap( function() {
			var softkeydata = riff(".rf-component-softkey").buffer("riffSoftKeyData");

			var func = softkeydata[riff(this).index()][1];
			func.call( this, riff(this).index() );
			riff.softkey.softKeyMoreHide();
		});

		if( dataSet.length  > 3 )
			riff( this ).find(".rf-style-key-normal > li").eq(2).tap(function(){
				if( rf-area-key-more.css('bottom') == '70px')
				{
					var morekeyHeight = Math.abs(70-moreList.height());
					moreList.css('bottom','-'+morekeyHeight+'px');
				}
				else
				{
					moreList.css('bottom','70px');
				}
			});

		riff('.rf-component-softkey .rf-area-key-normal .rf-area-backbtn').tap(function(){
			_func.call(this, -1);
		})

		riff('.rf-component-softkey li').touchStart( function() { riff(this).addClass('rf-state-onfocus'); })
					.touchEnd(function() { riff(this).removeClass('rf-state-onfocus'); });
	}
}


// riff header Component
var ComponentHeader = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="header";
}

// option settings for the Title
ComponentHeader.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "radius"){
			if (_data[k] == "normal"){
				riff(this).addClass('rf-effect-border-radius');
			} else if (_data[k] == "big"){
				riff(this).addClass("rf-effect-border-radius big");
			} else if (_data[k] == "small"){
				riff(this).addClass("rf-effect-border-radius small");
			} else if (_data[k] == "false"){
				riff(this).removeClass("rf-effect-border-radius");
			} else {
				riff(this).css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
				riff(this).children('.gradient').css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
			}
		}

		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).children(".rf-effect-half-glow").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-half-glow").hide();
			}
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background",_data[k][1]);
			}


			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")");
				} else {
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "pattern"){
			if (_data[k] == "true"){
				riff(this).children(".rf-effect-pattern").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-pattern").hide();
			}
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","38px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","34px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","30px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		if(k == "textAlign"){
			riff(this).css("text-align",_data[k]);
		}

		if(k == "shadow"){
			if (_data[k] == "true"){
				riff(this).next(".rf-effect-dropshadow-header").show();
			} else if (_data[k] == "false"){
				riff(this).next(".rf-effect-dropshadow-header").hide();
			}
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// Setting for Title structure
ComponentHeader.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.append("<div class='rf-effect-pattern'></div>"		// Blank DIV Element for Pattern
					+"<div class='rf-effect-half-glow'></div>") 		// Blank DIV Element for Gradient
				.after('<div class="rf-effect-dropshadow-header"></div>'); // Shadow Element

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// Header setContents
ComponentHeader.prototype.setContents = function( _string )
{
    riff(this).text(_string).makeStructs();
}


//  Setting Title Component
var ComponentHeaderSetting = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type="headerSetting";
}

// setting Title option
ComponentHeaderSetting.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "radius"){
			if (_data[k] == "normal"){
				riff(this).addClass('rf-effect-border-radius');
			} else if (_data[k] == "big"){
				riff(this).addClass("rf-effect-border-radius big")
			} else if (_data[k] == "small"){
				riff(this).addClass("rf-effect-border-radius small")
			} else if (_data[k] == "false"){
				riff(this).removeClass("rf-effect-border-radius")
			} else {
				riff(this).css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
				riff(this).children('.gradient').css({
					"-webkit-border-top-left-radius" : _data[k],
					"-webkit-border-top-right-radius" : _data[k]
				});
			}
		}

		if(k == "glow"){
			if (_data[k] == "true"){
				riff(this).children(".rf-effect-half-glow").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-half-glow").hide();
			}
		}

		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).css("background-color",_data[k][1]);
			}


			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+"!important)");
				} else {
					riff(this).addClass("rf-resource-color-"+_data[k][1]);
				}

			}

		}

		if(k == "pattern"){
			if (_data[k] == "true"){
				riff(this).children(".rf-effect-pattern").show();
			} else if (_data[k] == "false"){
				riff(this).children(".rf-effect-pattern").hide();
			}
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).css("font-size","40px");
			} else if (_data[k] == "normal"){
				riff(this).css("font-size","36px");
			} else if (_data[k] == "small"){
				riff(this).css("font-size","32px");
			} else {
				riff(this).css("font-size",_data[k]);
			}
		}

		if(k == "fontColor"){
			riff(this).css("color",_data[k]);
		}

		if(k == "textAlign"){
			riff(this).css("text-align",_data[k]);
		}
		if(k == "display")
		{
			if (_data[k] == "true"){
				riff(this).css("display","block");
			} else if (_data[k] == "false"){
				riff(this).css("display","none");
			}
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// structure setting for the title
ComponentHeaderSetting.prototype.makeStructs = function ()
{
	var riffThis = riff(this);
	riffThis.append("<div class='rf-effect-pattern'></div>"		// Blank DIV Element for Pattern
						+"<div class='rf-effect-half-glow'></div>") 		// Blank DIV Element for Gradient
				.after('<div class="rf-effect-dropshadow-setting"></div>'); 	// Shadow Element

	riffThis.option( riffThis.buffer("ComponentDataOption") );
}

// Settings for the string used in the title
ComponentHeaderSetting.prototype.setContents = function( _string )
{
    riff(this).text(_string).makeStructs();
}

// riff BusyIndicator Component
var ComponentBusyIndicator = function ( _elementContext )
{
	this.elementContext = _elementContext;
	this.type = "busyIndicator";
}


// busyIndicator option
ComponentBusyIndicator.prototype.option = function ( _data )
{
	for ( var k in _data)
	{
		if(k == "background"){
			if (_data[k][0] == "color"){
				riff(this).parent().parent().css("background",_data[k][1])
			}

			if (_data[k][0] == "gradient"){

				if(_data[k][1].indexOf("from") != -1){
					riff(this).parent().parent().css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")")
				} else {
					riff(this).parent().parent().addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}

		if(k == "fontColor"){
			riff(this).parent().parent().css("color",_data[k])
		}

		if(k == "borderColor"){
			riff(this).parent().parent().css("border-color",_data[k])
		}

		if(k == "fontSize"){
			if (_data[k] == "big"){
				riff(this).parent().parent().css("font-size","28px")
			} else if (_data[k] == "normal"){
				riff(this).parent().parent().css("font-size","24px")
			} else if (_data[k] == "small"){
				riff(this).parent().parent().css("font-size","20px")
			} else {
				riff(this).parent().parent().css("font-size",_data[k])
			}
		}

		if(k == "btnAreaBackground"){
			if (_data[k][0] == "color"){
				riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background",_data[k][1])
			}

			if (_data[k][0] == "gradient"){
				if(_data[k][1].indexOf("from") != -1){
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').css("background","-webkit-gradient(linear, 0% 0%, 0% 100%,"+_data[k][1]+")")
				} else {
					riff(this).find('.rf-area-contents-popup .rf-area-btn-popup').addClass("rf-resource-color-"+_data[k][1]);
				}
			}
		}


		if(k == "busyIndicatorStyle"){
			if (_data[k] == "1"){
				riff(this).removeClass().addClass('rf-component-busyindicator rf-resource-busyindicator-1');
			} else if (_data[k] == "2"){
				riff(this).removeClass().addClass('rf-component-busyindicator rf-resource-busyindicator-2');
			} else if (_data[k] == "3"){
				riff(this).removeClass().addClass('rf-component-busyindicator rf-resource-busyindicator-3');
			}
		}

		if(k == "busyIndicatorSpeed"){
			riff(this).css("-webkit-animation-duration",_data[k])
		}

		// saving the option data into the buffer.  (additional options are given if Elements were dynamically created after reset)
		var optionData = riff(this).buffer("ComponentDataOption");
		if( !optionData )
			riff(this).buffer("ComponentDataOption", optionData = {} );
		optionData[k] = _data[k];
	}
}

// The componentSetting.js will reconstruct markups that match elements found within the DOM Element className

riff(function () {

// Widget Basic Default Setting
// If the user does not use the headerSetting Component, headerSetting will be added automatically. (headerSetting Component is neccasary for the setting function)
( riff('body').find('.rf-component-header-setting').size() == 0 && riff('body').append('<div class="rf-component-header-setting">Setting</div>') );
// If the user does not use the feedReceiveTime Component, feedReceiveTime will be added automatically. (in order to visulize the data, the feedReceiveTime Component is for the RSS Feed)
( riff('body').find('.rf-component-datareceivetime').size() == 0 && riff('body').append('<div class="rf-component-datareceivetime"></div>') );

// Adds a DIV over the background when a popup appears, so the background objects will no longer be clickable
riff('body').append('<div class="rf-effect-dim-dark"></div>'); // Black Blank Element
riff('body').append('<div class="rf-effect-dim-light"></div>'); // Black Blank Element
riff('body').append("<div class='rf-component-popup' id='ajaxPopup'>AjaxPopup<div class='rf-area-btn-popup'><button class='rf-component-btn popupOff popupOK'>Ok</button></div></div>");

if(riff('.rf-component-idle').size() == 0){
	riff('body').prepend("<div id='idle' class='rf-component-idle'></div>");
	riff('.rf-component-idle').buffer("isIdleFlag",true);
} else {
	riff('.rf-component-idle').attr("id","idle");
}
// Adds a markup to differentiate the IDLE screen and the fullcreen that shows when the widget runs.
riff('body').contents().not( riff(".rf-component-idle").dom() )
			.wrapAll('<div class="rf-wrapper-all"></div>'); // Widget Wrapping
// When applying the scene to the fullscreen, the scene is wrapped and the screen size, ect are automatically set
riff('body').find('.rf-component-scene').wrapAll('<div class="rf-wrapper-scene-all"></div>');

// inserts the busy indicator and sets it
// Busy Indicator Default Setting
riff('.rf-effect-dim-dark')
.before('<div class="rf-component-popup" id="busyIndicator"><div class="rf-component-busyindicator rf-resource-busyindicator-1"></div><div class="rf-area-txt-busyindicator">Loading, Please wait...</div></div>')
.before('<div class="rf-component-popup" id="alert"></div>');

// navigator.userAgent : returns the name of the current browser
var agent = navigator.userAgent;
if( agent.indexOf("Android") != -1) {		// Android Broswer mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.ANDROIDB );
	riff("head").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=device-dpi"/>');
} else if( agent.indexOf("WVGA") != -1) {			// BIG size mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.TOUCH );
	riff("head").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=120"/>');
} else if( agent.indexOf("WQVGA") != -1) {			// Small size mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.TOUCH );
	riff("head").before('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=120"/>');
} else if( riff.isEmulator() ) { // SDK mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.MOUSE );
} else if( riff.isWidget() ) { // SMASUNG BADA widget mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.TOUCH );
} else { 											// PC mode
	riff.option( "eventType", riffGlobal.EVENTTYPE.MOUSE );
}

// Defines the softkey form, function, ect
riff.option( {
	"softkeySetListData" : {
		"OK" : function() {
			var sceneInfo = riffGlobal.sceneStack.pop();
				riffGlobal.sceneStack.push(sceneInfo);

			riff.back();
			riff(sceneInfo[0]).find(".setList").okFunc();
		}
	},
	"softkeySetListFunc" : function() {
		var sceneInfo = riffGlobal.sceneStack.pop(),
			selectData = riffGlobal.setListSelectData,
			setList = riff(sceneInfo[0]).find(".setList"),
			setListDataSet = setList.buffer("ComponentListComponentDataSet");
		riffGlobal.sceneStack.push(sceneInfo);

		for( var k in setListDataSet )
			setList.scenePartSelect(setListDataSet[k].key, "off");

		for( var k in selectData )
			setList.scenePartSelect(selectData[k], "on");

		riff.back();
	},
	"softkeyFunc" : function () { riff.back(); },
	"softkeyType" : "type1",
	"softkeyData" : {}
});

// Resets markup for scene, header, headerSetting, list, setList, tab, popup Component
riff('.rf-component-idle').makeStructs();
riff('.rf-component-scene').makeStructs();
riff('.rf-component-header').makeStructs();
riff('.rf-component-header-setting').makeStructs();
riff('.rf-component-list').makeStructs();
riff(".rf-component-tabmenu").makeStructs();
riff(".rf-component-popup").makeStructs();
riff("#ajaxPopup").setContents( { "okFunc" : function(){ $.popup.back(); } } );

// Widget end key
if( riff.isWidget() && !riff.isEmulator() )
{
	widget.addEventListener("widgetendkey",
	function()	{
		// if the widget enkey was clicked to move to idle, the value is changed to true.
		riff('.rf-component-idle').buffer("ComponentIdleGoByEndKey", true);
		$.go(riff('.rf-component-idle').dom().id );
	}, false);
}


// If AutoRefresh is set, show AutoRefresh.
if ( riffGlobal.feedAutoRefreshTime > 0 )
{
	riff('.rf-component-tabmenu').autoRefresh( riffGlobal.feedAutoRefreshTime );
	riff('.rf-component-list').autoRefresh( riffGlobal.feedAutoRefreshTime );
};

// Idle Scene is shown as the first Scene.
riff.go( riff(".rf-component-idle").dom().id );

}); //End Load



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


var riffAJAX = function ( _url, _fnSuccess, _theOtherSet, _functionTossAgumentSet )
{

	var tAjaxForTimeout = this;
	this.__xhr = null;
	this.__successFunction = _fnSuccess;
	this.__errorHandler = _theOtherSet && _theOtherSet.e;
	this.__abortHandler = _theOtherSet && _theOtherSet.a;
	this.__retryHandler = _theOtherSet && _theOtherSet.r;
	this.__timeoutHandler = _theOtherSet && _theOtherSet.t;				// timeout handler
	this.__timeoutMillisec = _theOtherSet && _theOtherSet.timeout;		// millisec
	this.__timeoutObject = null;					// window.setTimeout Object
	this.__retry = _theOtherSet && _theOtherSet.retry;
	this.__retryCount = 0;
	this.__sendData = _theOtherSet && _theOtherSet.sendData;	// mouse move
	this.__option = {
		type : "GET",
		isAsync : true,
		contentType : "TEXT"
	};

	// If there is no succesful callback or if there is an error
	if( !this.__successFunction || typeof( this.__successFunction ) != 'function' )
	{
		return false;
	}

	// executes when the data communication has finally failed
	function actionOnFail()
	{
		riff.popup.back( "#busyIndicator" );
		riff(".rf-component-list > .rf-style-nodata").css("display", "block");
		riff(".rf-idle-section1").hide();
		riff(".rf-idle-busyindicator").show();
		riff(".rf-idle-busyindicator").text("Loading Failed");

	}

	// on termination, all data are set to null, requesting memory deallocation
	this.__destroy = function( )
	{
		try
		{
			window.clearTimeout( this.__timeoutObject );
			this.timeout = null;
			tAjaxForTimeout = null;
			this.__xhr = null;
			this.__errorHandler = null;
			this.__abortHandler = null;
			this.__retry = null;
			this.__retryCount = null;
			this.__timeoutObject = null;
		}
		catch ( e )
		{
			return null;
		}
	};

	// If data transmit/recieve is cancelled, terminate
	this.abort = function( ) {
		// If HTTP request exists
		if ( this.__xhr )
		{
			this.__xhr.abort();
		}
		// If a handler exists during abort
		if ( this.__abortHandler && typeof( this.__abortHandler ) == 'function' )
		{
			this.__abortHandler( this, this.retryCount );
		}
	};

	// function that allaws the user to manually abort
	this.abortByUser = function ( )
	{
		// removes the timeout
		window.clearTimeout( this.__timeoutObject );
		this.__timeoutObject = null;
		this.__retryCount = 0 ;
		this.abort();
	};

	// retry retransmits XMLHttpRequest.Request
	this.retry = function( ) {
		// abort executes the abortCallBack() function
		this.abort();

		// if HTTP request exists
		if ( this.__xhr )
		{
			// Retransmit Request.
			this.Request( );

			// execute if retry Handler exists
			if ( this.__retryHandler && typeof( this.__retryHandler ) == 'function' )
			{
				this.__retryHandler( this, this.__retryCount );
			}
		}
	};

	this.retryOnError = function( ) {

		// Status assignment. If error, set to -1.
		var	readystate = this.__xhr.readyStatus;
		if ( typeof( readystate ) == "undefined" )
		{
			readystate = -1;
		}

		var status = -1;
		try
		{
			status = this.__xhr.status;
		}
		catch ( e )
		{
			status = -1;
		}

		// execute retry count up
		this.__retryCount++;

		// if the retry number exceed the designated number of times, quit
		if ( this.__retryCount > this.__retry )
		{
			actionOnFail();
			// if error handler exists, execute.
			if ( this.__errorHandler && typeof( this.__errorHandler ) == 'function' )
			{
				this.__errorHandler( readystate, status, "ajax.retryOnError :: retry over. " );
			}
		} else {
			this.retry( );
		}
	};

	// if timeout occurs, check the retry condition. (because it means that the time as passed)
	// checks if readyState == 4 && status == 0 or 200( checks for normal communication termination )
	// if communication fails
	// check if the retry conditions are correct
	// if it is, XMLHttpRequest.Request is executed again, and then Timeout CallBack() is executed.
	// if not, abort() is executed and then abort CallBack() is executed.
	// when everything is complete, timeoutHandler is executed.
	this.timeout = function( ) {
		// First checks the timeout condition.  If there is no timeoutMillisec value or if the value is below 0, then nothing is done as this is not considered valid.
		if ( ! this.__timeoutMillisec || typeof( this.__timeoutMillisec ) != 'number' || this.__timeoutMillisec <= 0 ) { return null; }
		// Checks the retry condition.  If there is no retry condition or if the value is negative, no retry will be attempted
		if ( ! this.__retry || typeof( this.__retry ) != 'number' || this.__retry < 0 )	{	return null;	}

		this.__retryCount++;
		// quits if the retry number has exceeded it's set value
		if ( this.__retryCount > this.__retry )
		{
			actionOnFail();
			// abortCallBack is activated by abort
			this.abort( );
			// executes if an error handler exists.
			if ( this.__errorHandler && typeof( this.__errorHandler ) == 'function' )
			{
				this.__errorHandler( this.__xhr.readyStatus, -1, "ajax.timeout :: retry over. " );
			}

		} else {
			// abort executes abortCallBack() for retransmission.
			this.retry( );
		}

		// execute if the handler exists.
		if ( this.__timeoutHandler && typeof( this.__timeoutHandler ) == 'function' )
		{
			this.__timeoutHandler( );
		}
	};

	// Checks if data exchange was successful.
	// Checks if readyState == 4, status == 0 && 200, responseText and responseXML exists.
	// The AJAX object provided by the framework requires that the data is recieved.
	// Therefore, if this function was to be used for transmission only, it will need to be modified.
	this.__receiveSuccessCheck = function() {
		if (
				( riffGlobal.AJAXREADYSTATE.DONE == this.__xhr.readyState )			// readyState = 4 üũ
				&& ( ( 0 === this.__xhr.status ) || ( 200 === this.__xhr.status ) )		// readyStatus = 0 / 200 üũ
				&& ( this.__xhr.responseText || this.__xhr.responseXml )				// return value �� �ִ��� üũ
			)
		{
			return true;
		}

		return false;
	};

	// Things to do when transmission is successful
	this.requestSuccess = function( ) {
		// removes busy Indicator.
		riff.popup.back( "#busyIndicator" );

		// idle article and indicator section.
		riff('.rf-idle-busyindicator').hide();
		riff('.rf-idle-section1').show();


		window.clearTimeout( this.__timeoutObject );
		this.__timeoutObject = null;
		this.__retryCount = 0 ;
	};

	// error processing function (used as default function when callback is not specified)
	this.defaultError = function( _readyState, _status, _description )
	{
		riff( "#ajaxPopup" ).children().children(".rf-area-txt-popup").text( "Connection failed" );
		riff.go("#ajaxPopup");
		function show3sec()
		{
			riff.popup.back( );
			riff.timer( "_ajaxDefaultError3Sec" );
		};
		riff.timer( show3sec , 3000, "_ajaxDefaultError3Sec" );
	};

	// ajax::Request
	this.Request = function ( ) {
		if ( this.__xhr == null) {
			actionOnFail();
			this.__errorHandler( -1, -1, "ajax.Request :: Object initialization failed." );
			return false;
		} else {

			this.__xhr.open( this.__option.type, _url, this.__option.isAsync );
			this.__xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.__xhr.send( this.__sendData );

			// TimeoutSetting
			if ( this.__timeoutMillisec > 0 )
			{
				this.__timeoutObject = window.setTimeout(
					function( ) {
						tAjaxForTimeout.timeout( );
					}
					, this.__timeoutMillisec );
			}
		}
	};

	// ajax::Constructor
	{
		// shows the bussy Indicator.
		riff.popup( "#busyIndicator" );

		// idle article and indicator section.
		riff('.rf-idle-section1').hide();
		riff(".rf-idle-busyindicator").show();
		riff(".rf-idle-busyindicator").text("Loading, Please wait...");

		// the option settings of fnSuccess
		if ( _theOtherSet )
		{
			this.__option.type = _theOtherSet.type || "GET";
			this.__option.isAsync = ( typeof( _theOtherSet.isAsync ) == "undefined" ) ? true : _theOtherSet.isAsync ;
			this.__option.contentType = _theOtherSet.contentType || "TEXT";
			// convert to capital letters
			this.__option.type = this.__option.type.toUpperCase();
			this.__option.contentType = this.__option.contentType.toUpperCase();
		}

		// retry setting
		// retry == 1 -> execute
		// retry == undefined -> execute default
		// retry == null -> does not execute
		// retry == 0 -> does not execute
		// retry setting in case communication fails
		if ( typeof( this.__retry ) == 'undefined' || this.__retry < 0 )
		{
			this.__retry = riffGlobal.ajaxRetry;
		}

		// timeout duration setting
		// timeout == 1 -> execute
		// timeout == undefined -> execute default
		// timeout == null -> does not execute
		// timeout == 0 -> does not execute
		// timeout setting in case communication fails
		if ( typeof( this.__timeoutMillisec ) == 'undefined' || this.__timeoutMillisec < 0 )
		{
			// default timeout setting of data communication
			this.__timeoutMillisec = riffGlobal.ajaxTimeoutMillisecond;
		}

		// error function setting
		if ( !this.__errorHandler || typeof( this.__errorHandler ) != 'function' )
		{
			this.__errorHandler = this.defaultError;
		}

		if ( window.XMLHttpRequest ) {
			// Mozilla, Safari,...
			this.__xhr = new XMLHttpRequest();
			if ( this.__xhr.overrideMimeType )
			{
				 this.__xhr.overrideMimeType('text/xml');
			}
		} else {
			this.__destroy( );
			return false;
		}

		if (! this.__xhr ) {
			actionOnFail();
			this.__errorHandler( -1, -1, "ajax.Constructor :: Cannot create an XMLHTTP instance" );
			return false;
		}

        this.__xhr.ajax = this;
		// register the event if readyState = 4
		this.__xhr.handlers	= [];
		this.__xhr.datas	= [];
		this.__xhr.handlers[ riffGlobal.AJAXREADYSTATE.DONE ] = this.__successFunction;

        this.__xhr.onreadystatechange = function ( ) {
	// this is not an ajax object but is a xhttp (xhr) object
        // but if you wish to use an ajax object, use this.ajax

			// this section executes regardless of error (regardless of __xhr.status value)
			// If the status value is not 0 or 200, it is considered an error. Communication is retried then.

			try
			{
				if ( this.status !== 0 && this.status !== 200 )
				{
					// If retry is set, and retryCount has been completely expired, it will activate the errorHandler() function
					// if timeout is set, it is deleted.
					window.clearTimeout( this.ajax.__timeoutObject );
					this.ajax.retryOnError();
					return;
				}
			}
			catch ( e )
			{
			}

			if ( riffGlobal.AJAXREADYSTATE.DONE == this.readyState ) {
				// if normal
				if ( this.ajax.__receiveSuccessCheck() )
				{
					// delete timeout timer
					this.ajax.requestSuccess();
					// extract XML from text
					if( !this.responseXml ) {
						this.responseXml = ( new DOMParser() ).parseFromString( this.responseText, "application/xml" );
					};
					this.ajax.__successFunction( this.responseXml, this.responseText, this.ajax, _functionTossAgumentSet );
				} else {
					// In case of alzajira,
					// if status value is returned, data communication has been completed in any form.
					// if readyState changes from 3 to 4, status value is set to 0, 200, or 404.

					// retry with error Handler() + retry handler()
					// if retry is set, communication is retried, if retryCount has expired, errorHander() is executed.

					// if timeout is set, it is cleared.
					window.clearTimeout( this.ajax.__timeoutObject );
					this.ajax.retryOnError();
				}

			}
		};
		// data transmission
		this.Request( ) ;
	};

};



var riffXML = function( _urlStr, _fnSuccess, _theOtherSet )
{

	this.selector = function( _querySelector )
	{
		return riff.xmlSelector( this.xmlLocal, _querySelector );
	};

	this.xpathSelector = function( _querySelector )
	{
		return riff.xpath( this.xmlLocal, _querySelector );
	};

	this.xpath = function( _querySelector )
	{
		return riff.xpath( this.xmlLocal, _querySelector );
	};

	this.__setOption = function( target, source )
	{
		target.e = source.e;
		target.a = source.a;
		target.t = source.t;
		target.r = source.r;
		target.timeout = source.timeout;
		target.retry = source.retry;
		target.sendData = source.sendData;
		target.type = source.type;
		target.isAsync = source.isAsync;
		target.contentType = source.contentType;

	};

	this.loadXML = function( _setting )
	{
		var xmlThis = this;
		this.__ajax = new riffAJAX ( _urlStr, function( _xml, _text ) {
			xmlThis.textLocal = _text;
			xmlThis.xmlLocal = _xml;
			_fnSuccess.call( xmlThis, xmlThis, this.xmlLocal, this.textLocal );
		}, _theOtherSet );
	};

	// cunstructor
	{
		this.loadXML( _theOtherSet );
	}
	return true;
}


riff.widget= {
    sysInfo_network_getIsNetworkAvailable : function()
    {
        try{
            return widget.sysInfo.network.getIsNetworkAvailable();
        }
        catch(e) {

            return true;
        }
    },

    sysInfo_getLanguage : function()
    {
        try {
            return window.widget.sysInfo.getLanguage();
        }
        catch(e) {

            return null;
        }
    },
    widgetMode : function()
    {
		try
		{
			return widget.widgetMode;
		}
		catch (e)
		{
			return null;
		}
    },
    onClose : function()
    {
        if(!riff.isWidget())
            return;
    },
    sysInfo_memory_getMemoryAvailable : function()
    {
        try{
            return widget.sysInfo.memory.getMemoryAvailable();
        }
        catch(e){

            return null;
        }
    },
    application_launcher_memoryStatusView : function()
    {
        try{
           return widget.application.launcher.memoryStatusView();
        }
        catch(e){
            return null;
        }
    },
    sysInfo_getHashedIMEI : function()
    {
        try{
            return widget.sysInfo.getHashedIMEI();
        }
        catch(e){
            return null;
        }
    },
    getFullmodeSize : function()
    {
        try {
            return widget.getFullmodeSize().split(",");
        }
        catch (e) {
            return null;
        }
    },
    getIndicatorColor : function()
    {
        try{
            return widget.getIndicatorColor().split(",");
        }
        catch (e){
            return null;
        }
    },
    sysInfo_getLanguageList : function()
    {
        try {
            return window.widget.sysInfo.getLanguageList();
        }
        catch (e){
            return null;
        }
    },
    window_getCurrentDirection : function()
    {
        try{
            return widget.window.getCurrentDirection();
        }
        catch(e){
            return null;
        }
    },
    error_notify : function(_param)
    {
        try{
            widget.window.error.notify(_param);
            return true;
        }catch(e){
            return false;
        }
    },
    window_setScroll : function( _isScroll )
    {
        try {
            widget.window.setScroll(_isScroll);
            return true;
        }catch(e) {
            return false;
        }
    },
    application_launcher_openDailyBriefing : function(_appMode)
    {
        try {
            widget.application.launcher.openDailyBriefing(_appMode);
            return true;
        }
        catch(e) {
            return false;
        }
    },
    application_launcher_openCalendarDetailWnd : function()
    {
        try{
            widget.application.launcher.openCalendarDetailWnd("DayView","");
            return true;
        } catch (e){
            return false;
        }
    },
    SNS_launchApplication : function()
    {
        try {
            widget.SNS.launchApplication('GoogleMap','','','');
            return true;
        }
        catch(e){
            return false;
        }
    },
    openURL : function( _url )
    {
		try {
            widget.openURL(_url);
            return true;
        }
        catch(e){
			window.location.href = _url;
            return true;
        }
    },
    window_resizeWindow : function( _width, _height)
    {
        try {
            widget.window.resizeWindow(_width, _height);
            return true;
        }
        catch(e){
			window.resizeTo(_width, _height);
            return true;
        }
    },
    setPreferenceForKey : function(_key, _value)
    {
        try {
            widget.setPreferenceForKey( _value, _key );
			return true;
        }
        catch(e){
			return riff.storage.localStorage( _key, _value );
        }
    },
    preferenceForKey : function(_key)
    {
        try {
			return widget.preferenceForKey( _key );
        }
        catch(e){
			return riff.storage.localStorage( _key );
        }
    }
};

}
)(window);
