riff.extend({
	ajax : {
		getAjaxArgsObjInternal : function( _ajaxData ) {
			if ( !_ajaxData.openOption ) _ajaxData.openOption = new Object();
			if ( !_ajaxData.sendOption ) _ajaxData.sendOption = new Object();
			if ( !_ajaxData.success ) _ajaxData.success = new Object();
			if ( !_ajaxData.changeState ) _ajaxData.changeState = new Object();
			if ( !_ajaxData.error ) _ajaxData.error = new Object();
			if ( !_ajaxData.error.exception ) _ajaxData.error.exception = new Object();
			if ( !_ajaxData.error.timeout ) _ajaxData.error.timeout = new Object();
			if ( !_ajaxData.error.retry ) _ajaxData.error.retry = new Object();
			if ( !_ajaxData.error.abort ) _ajaxData.error.abort = new Object();
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
				this.destroy();
			};
			txhr = tRetry = tException = null;
			return true;
		},
		timeout : function() {	//n Timeout handle function.
			window.clearTimeout( this.timeoutID );
			this.xhr.abort();
			if (this.xhr) {		// not pc.
				var tTimeout = this.ajaxData.error && this.ajaxData.error.timeout;
				if (tTimeout && tTimeout.fn) 
					tTimeout.fn(this.xhr.readyState, tTimeout.args);
				this.retry();
				tTimeout = null;
			}
			return true;
		},
		abortByUser : function() {	//n Abort handle function.
			window.clearTimeout( this.timeoutID );
			var txhr = this.xhr,
				tAbort = this.ajaxData.error.abort,
				tException = this.ajaxData.error && this.ajaxData.error.exception;
			this.abortByUserWorked = true;
			txhr.abort();
			if ( this.xhr ) {		// not pc.
				if (tAbort.fn) 
					tAbort.fn(txhr.readyState, txhr.status, tAbort.args);
				if (tException && tException.fn) 
					tException.fn(txhr.readyState, txhr.status, tException.args);
			}
			tAbort = txhr = tException = null;
			return true;
		},
		request : function () {	//n Open and send data to server.
			var txhr = this.xhr,
				ajaxData = this.ajaxData
				, tOpenData = ajaxData.openOption
				, tSendOption = ajaxData.sendOption
				, tHeaderData = tSendOption && tSendOption.headerData
				, tSendData = tSendOption && tSendOption.sendData;
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
						riff.ajax.eraseConnectedList( this );
					} else {
						tSuccess.fn( txhr.readyState, txhr.status, txhr.responseText, txhr.responseXML, tSuccess.args );
						riff.ajax.eraseConnectedList( this );
					}
					this.destroy();
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
		eraseConnectedList: function( _this ) {
			var tIdx = riff.global.ajax.connectedList.indexOf( _this );
			if( tIdx > -1 ) {
				delete riff.global.ajax.connectedList[ tIdx ];
				riff.global.ajax.connectedList.splice( tIdx , 1 );
			} 
		},
		destroy : function( _this, _fnMore ) {		//n free the memory that used in the ajax.
			if( !_this ) _this = this;
			function tFnFree( _obj ) {
				if( !_obj ) return false;
				if( _obj.fnJudge ) delete _obj.fnJudge;
				if( _obj.fn ) delete _obj.fn;
				if( _obj.args ) delete _obj.args;
				if( _obj.value ) delete _obj.value;
				return true;
			};
			delete _this.xhr.onreadystatechange; delete _this.xhr;
			var tObj = _this.ajaxData;
			delete tObj.openOption;
			if( tObj.sendOption ) {
				delete tObj.sendOption.headerData;
				delete tObj.sendOption.sendData;
			};
			delete tObj.sendOption;
			tFnFree( tObj.success ); delete tObj.success;
			tFnFree( tObj.changeState ); delete tObj.changeState;
			tObj = _this.ajaxData.error;
			if( tObj ) {
				if( tFnFree( tObj.timeout ) ) delete tObj.timeout;
				if( tFnFree( tObj.retry ) ) delete tObj.retry;
				if( tFnFree( tObj.exception ) ) delete tObj.exception;
				if( tFnFree( tObj.abort ) ) delete tObj.abort; 
			};
			delete _this.ajaxData.error;
			delete _this.ajaxData;
			if( _fnMore ) _fnMore.call( _this );

			delete _this.request;
			delete _this.onReceive;
			delete _this.destroy;
			delete _this.retry;
			delete _this.timeout;
			delete _this.abortByUser;
			delete _this.retryWithNewXHR;
			delete _this.ajaxData;
			delete _this.retryCount;
			delete _this.xhr;
			//n erase from riff.global.ajax.connectedList array
			riff.ajax.eraseConnectedList( _this );
			_this = null;
			delete this;
			tObj = null;
			return true;
		},

		exec : function( _ajaxData ) {		//n constructor

			if( !_ajaxData ) return false;		//n if success callback is not passed by arguments, fail.
			if( !_ajaxData.success || !_ajaxData.success.fn ) return false;		//n if success callback is not passed by arguments, fail.
			if( !_ajaxData.openOption || !_ajaxData.openOption.url ) return false;		//n if  is not passed by arguments, fail.
			if( ! window.XMLHttpRequest ) return false;

			var len = riff.global.ajax.connectedList.length - 1;
			if( len < 0 ) len = 0;
			riff.global.ajax.connectedList.push( new riff.ajax.initInternal( _ajaxData ) );
			riff.global.ajax.connectedList[ riff.global.ajax.connectedList.length - 1 ].request();
			len = null;
		},

		initInternal : function( _ajaxData ) {		//n constructor
			
			riff.ajax.getAjaxArgsObjInternal( _ajaxData );
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

		textArray : function ( _elmOrXml, _s ) {
			var _elm;
			if( riff.util.isArray( _elmOrXml ) ) {	//n if _elmOrXml = Array of DOM Elements
				if( _s )
					_elm = riff.traversal.find( _elmOrXml, _s );
				else 
					_elm = _elmOrXml;
			} else {
				_elm = riff.ajax.xmlSelector( _elmOrXml, _s );
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
		},
		//n Abort all the communication. ( Call the abort() for all the ajax communication. ) 
		abortAllAjax : function()
		{
			var ajaxConn = null,
				list = riff.global.ajax.connectedList;
				len = riff.global.ajax.connectedList.length;
				isAbortWork = false;
			function tAbortAll( _el ) { _el.abortByUser(); };
			list.forEach( tAbortAll );
			
			while( list.length > 0 ) {
				if (list[list.length - 1] && list[list.length - 1].destroy) {
					list[list.length - 1].destroy();
				} else {
					list[list.length - 1] = null;
					list.pop();
				}
			};
			
			return true;
		}
	}
});

window.$a = riff.ajax;






