
riff.extend({
	ajax : {
		getAjaxArgsObj : function( ) {
			this.openOption = {};
			this.sendOption = {};
			this.success = {};
			this.changeState = {};
			this.error = {};
			this.error.exception= {};
			this.error.timeout = {};
			this.error.retry = {};
			this.error.exception = {};
			this.error.abort = {};
		},
		retry : function( _readyState, _status ) {	//n Retry handle function.
			var txhr = this.xhr
				, tRetry = this.ajaxData.error.retry
				, tException = this.ajaxData.error && this.ajaxData.error.exception;

			if( typeof( _readyState ) == undefined || typeof( _readyState ) == null ) {
				_readyState = txhr.readyState;
				try { _status = txhr.status; } catch ( e ) { _status = -1; };
			};
			if ( ( tRetry.value > 0 ) && ( this.retryCount < tRetry.value ) ) {
				++ this.retryCount;
				if( tRetry.fn ) tRetry.fn( _readyState, _status, tRetry.args );
				this.request();
			} else {
				if( tException && tException.fn ) tException.fn( _readyState, _status, tException.args );
			};
			txhr = tRetry = tException = null;
			return true;
		},
		timeout : function() {	//n Timeout handle function.
			this.xhr.abort();
			window.clearTimeout( this.timeoutID );
			var tTimeout = this.ajaxData.error && this.ajaxData.error.timeout;
			if( tTimeout && tTimeout.fn ) tTimeout.fn( this.xhr.readyState, tTimeout.args );
			this.retry();
			tTimeout = null;
			return true;
		},
		abortByUser : function() {	//n Abort handle function.
			window.clearTimeout( this.timeoutID );
			var txhr = this.xhr,
				tAbort = this.ajaxData.error.abort,
				tException = this.ajaxData.error && this.ajaxData.error.exception;
			this.abortByUserWorked = true;
			txhr.abort();
			if( tAbort.fn ) tAbort.fn( txhr.readyState, txhr.status, tAbort.args );
			if( tException && tException.fn ) tException.fn( txhr.readyState, txhr.status, tException.args );
			tAbort = txhr = tException = null;
			return true;
		},
		request : function () {	//n Open and send data to server.
			var txhr = this.xhr,
				ajaxData = this.ajaxData
				, tOpenData = ajaxData.openOption
				, tSendOption = ajaxData.sendOption
				, tHeaderData = tSendOption && tSendOption.headerData
				, tSendData = tSendOption && tSendOption.tSendData;
			txhr.open( tOpenData.type, tOpenData.url, tOpenData.isAsync );
			txhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
			for ( var k in tHeaderData ) {
				txhr.setRequestHeader( k, ( typeof( tHeaderData[k] ) == "function" ) ? tHeaderData[k]() : tHeaderData[k] );
			};
			//n For the timeout function
			var tThis = this;
			var tTime = this.ajaxData.error && this.ajaxData.error.timeout && this.ajaxData.error.timeout.value;
			var tFnTimeout = this.timeout;
			if( tTime > 0 ) {
				this.timeoutID = setTimeout( function( ) { tFnTimeout.call( tThis ); tThis = tTime = tFnTimeout = null; }, tTime );
			};
			txhr.send( tSendData );
			txhr = ajaxData = tOpenData = tSendOption = tHeaderData = null;
			return true;
		},
		getXMLHttpRequest : function ()	{	//n  Create the XMLHttpRequest object.
			this.xhr = new XMLHttpRequest();
			if ( this.xhr.overrideMimeType ) this.xhr.overrideMimeType( 'text/xml' );
			this.xhr.tThis = this;			//n for the XHttp.onreadystatechange()
			return true;
		},
		retryWithNewXHR : function( readyState, status )		//n create new XMLHttpRequest if needed.
		{
			if ( !( status > 0 ) ) {
				this.xhr.tThis = null;
				delete this.xhr; this.xhr = null;
				riff.ajax.getXMLHttpRequest.call( this );
				this.xhr.onreadystatechange = function(){ this.tThis.onReceive(); };
			}
			this.xhr.abort();
			this.retry( readyState, status );
			return true;
		},

		onReceive : function( ) {		//n receiving data from server.
			var status,
				txhr = this.xhr,
				ajaxData = this.ajaxData,
				tSuccess = ajaxData.success,
				tChange = ajaxData.changeState,
				tException = this.ajaxData.error && this.ajaxData.error.exception ;
			if ( this.abortByUserWorked ) return;		//n if user aborts the transmitting data, DO NOT working by onReceive(). Handle by abortByUser().
			if( txhr.readyState == riff.global.ajax.DONE ) {	//n if the receving ends.
				window.clearTimeout( this.timeoutID );
				if ( ( 200 <= txhr.status && txhr.status < 300 ) ) {	//n the condition of the success.
					if ( tSuccess.resultTextOnly ) {
						tSuccess.fn( txhr.readyState, txhr.status, txhr.responseText, tSuccess.args );
					} else {
						tSuccess.fn( txhr.readyState, txhr.status, txhr.responseText, txhr.responseXML, tSuccess.args );
					}
				} else {
					this.retryWithNewXHR( txhr.readyState, txhr.status );
				}
			} else {
				try { status = txhr.status; } catch ( e ) { status = -1; }
				if ( tChange && tChange.fn ) tChange.fn( txhr.readyState, status, tChange.args );
				if ( !( status == 0 || status == 200 || status == -1 ) ) {		//n if the transmitting failed
					this.retryWithNewXHR( txhr.readyState, status );
				}
			}
			return true;
		},
		destroy : function( _this, _fnMore ) {		//n free the memory that used in the ajax.
			if( !_this ) _this = this;
			function tFnFree( _obj ) {
				if( !_obj ) return;
				if( _obj.fnJudge ) _obj.fnJudge = null;
				if( _obj.fn ) _obj.fn = null;
				if( _obj.args ) _obj.args = null;
				if( _obj.value ) _obj.value= null;
			};
			delete _this.xhr;
			_this.xhr = null;
			var tObj = this.ajaxData;
			tObj.openOption = null;
			if( tObj.sendOption ) {
				tObj.sendOption.headerData = null;
				tObj.sendOption.sendData = null;
			};
			tFnFree( tObj.success );
			tFnFree( tObj.changeState );
			tObj = this.ajaxData.error;
			if( tObj ) {
				tFnFree( tObj.timeout );
				tFnFree( tObj.retry );
				tFnFree( tObj.exception );
				tFnFree( tObj.abort );
			};
			if( _fnMore ) _fnMore.call( this );
			tObj = null;
			return true;
		},

		init : function( _ajaxData ) {		//n constructor
			if( !_ajaxData ) return false;		//n if success callback is not passed by arguments, fail.
			if( !_ajaxData.success || !_ajaxData.success.fn ) return false;		//n if success callback is not passed by arguments, fail.
			if( !_ajaxData.openOption || !_ajaxData.openOption.url ) return false;		//n if  is not passed by arguments, fail.
			if( ! window.XMLHttpRequest ) return false;

			var tThisOpts , tUserOpts;

			//n setup default or use setting data by argument.
			this.ajaxData = _ajaxData;
			tThisOpts = this.ajaxData.openOption;
			tUserOpts = _ajaxData.openOption;
			tThisOpts.type = tUserOpts.type || "GET";
			tThisOpts.isAsync = ( typeof( tUserOpts.isAsync ) == "undefined" ) ? true : tUserOpts.isAsync ;
			tThisOpts = this.ajaxData.success;
			this.retryCount = 0;	//n For the retry function, retry counter set to 0.

			riff.ajax.getXMLHttpRequest.call( this );
			this.request = riff.ajax.request;
			this.onReceive = riff.ajax.onReceive;
			this.destroy = riff.ajax.destroy;
			this.retry = riff.ajax.retry;
			this.timeout = riff.ajax.timeout;
			this.abortByUser = riff.ajax.abortByUser;
			this.retryWithNewXHR = riff.ajax.retryWithNewXHR;
			this.xhr.onreadystatechange = function(){ this.tThis.onReceive(); };

			return true;
		},

		//n search from XML by queryString( _s )
		//n @_xml { XML Object } XML object.
		//n @_s { string } queryString to search from XML object
		//n @return { Array } Array of DOM Elements by searching with _s.
		xmlSelector : function( _xml, _s ) {
			if( !_xml || !_xml.documentElement || !_s ) return null;
			var result = _xml.documentElement.querySelectorAll( _s );
			if( result.length > 0 ) {
				return riff.util.toArray( result );
			} else {
				return [];
			}
		},

		//n Search from XML or DOM Elements List( _elmOrXml ) by queryString( _s ) and return the texts as array.
		//n @_elmOrXml { XML Object or Array } XML object OR Array of DOM Elements.
		//n @_s { string } queryString to search from XML object or Array of DOM Elements.
		//n @return { Array } Array of text from the Array( of DOM Elements ) or searched Nodes by XML( _elmOrXml ) and queryString( _s ).
		textArray : function ( _elmOrXml, _s ) {
			var _elm;
			if ( arguments.length > 1 ) {
				if( _s )	//n if _elmOrXml = xml and queryString( _s ) exists.
					_elm = riff.ajax.xmlSelector( _elmOrXml, _s ) ;			
				else 
					return [];
			} else {	//n if _elmOrXml = Array of DOM Elements 
				if( ! riff.util.isArray( _elmOrXml ) ) return [];	//n _elmOrXml != Array of DOM Elements -> finish.
				_elm = _elmOrXml;
			}
			//n under this code, _eml is always Array of DOM Elements 
			var tm = riff.manipulation,
				rArr = [];
			function tFn( _el ) {
				rArr.push( tm.text( [ _el ] ) );
			};
			_elm.forEach( tFn );
			tm = null;
			return rArr;
		}
	}
});






