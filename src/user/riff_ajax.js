//
// Framework TrialVersion 1.0.60
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


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

