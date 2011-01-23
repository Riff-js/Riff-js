//
// Framework TrialVersion 1.0.32 
//
// Copyright 2011, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

/* @Framework_Ver  TrialVersion 1.0.32  */


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

	//h 성공 callback이 없거나, 에러이면
	if( !this.__successFunction || typeof( this.__successFunction ) != 'function' )	
	{
		return false;
	}

	//h 종료시에 각종 데이터를 null 해서, 메모리 해제를 요청하자.
	this.__destroy = function( )
	{
    //d alert( "destroy start: _ajax:" + _ajax );
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

	//h 데이터 송수신 취소하면, 그냥 끝내자.
	this.abort = function( ) {
        //d alert( "Abort start: _ajax:" + _ajax.__retryCount );
		//h HTTP request가 존재하면
		if ( this.__xhr )
		{
			this.__xhr.abort();
		}
		//h abort할 때 handler가 존재하면
		if ( this.__abortHandler && typeof( this.__abortHandler ) == 'function' )
		{
			this.__abortHandler( this, this.retryCount );
		}
		//h abort니까, 선언했던 변수들 다 날리자.
		//h 날릴려고 했는데, retry에서도 abort -> retry하기 때문에 날리면 안된다.
        //d		this.__destroy();
        //d		return null;
	};
	
	//h 사용자가 강제로 취소시키는 함수.
	this.abortByUser = function ( )
	{
		//h timeout 을 제거하고
		window.clearTimeout( this.__timeoutObject );
		this.__timeoutObject = null;
		//h retryCount 도 초기화.
		this.__retryCount = 0 ;
		this.abort();
	};

	//h retry는, XMLHttpRequest.Request 를 재송하자.
	this.retry = function( ) {
        //d alert( "retry start: _ajax:" + _ajax );
		//h 이때의 abort 는 abortCallBack()을 실행하고
		this.abort();	

		//h HTTP request가 존재하면
		if ( this.__xhr )
		{
			//h Request 재송.
			this.Request( );
		
			//h retry Handler 있으면 실행
			if ( this.__retryHandler && typeof( this.__retryHandler ) == 'function' )
			{
				this.__retryHandler( this, this.__retryCount );
			} 
		}
	};

	this.retryOnError = function( ) {

		//h status 할당. 에러나면 -1 로. 
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

		//h retry count up 해 주고
		this.__retryCount++;

		//h retry 횟수를 넘었으니, 종료.
		if ( this.__retryCount > this.__retry )
		{
			//h error handler가 있으면 실행.
			if ( this.__errorHandler && typeof( this.__errorHandler ) == 'function' )
			{
				this.__errorHandler( readystate, status, "ajax.retryOnError :: retry over. " );
			}
		} else {
			this.retry( );
		}
	};

	//h timeout이 발생하면, retry 조건을 검색한다.
	//h 이미 시간이 경과했다는 거니까. 
	//h readyState == 4 && status == 0 or 200인지 확인( 통신 정상 성공 종료 확인 )
	//h 통신이 이미 성공했다면 사용자가 clearTimeout을 잊은 거니까, 그냥 종료
	//h 통신이 실패했다면 
	//h retry 조건이 맞는지 확인하고.
	//h 맞다면, XMLHttpRequest.Request 재실행 후 Timeout CallBack()실행.  
	//h 틀리다면, abort() 실행 후 abort CallBack() 실행.
	//h 작업 다 끝나고 나면, timeoutHandler 실행.
	this.timeout = function( ) {
        //d alert( "timeout start: _ajax:" + _ajax + " readyState: " + _ajax.readyState );
		//h timeout조건 체크 먼저. timeoutMillisec 값이 없거나 0 이하면, 정상이 아닌 걸로 취급해 아무 것도 안한다.
		if ( ! this.__timeoutMillisec || typeof( this.__timeoutMillisec ) != 'number' || this.__timeoutMillisec <= 0 ) { return null; }
		//h retry 조건 체크. retry 조건이 없거나 음수값이면, retry 안한다.
		if ( ! this.__retry || typeof( this.__retry ) != 'number' || this.__retry < 0 )	{	return null;	}

		this.__retryCount++;
		//h retry 횟수를 넘었으니, 종료.
		if ( this.__retryCount > this.__retry )
		{
			//h 이때의 abort 는 abortCallBack()을 실행하고
			this.abort( );
			//h error handler가 있으면 실행.
			if ( this.__errorHandler && typeof( this.__errorHandler ) == 'function' )
			{
				this.__errorHandler( this.__xhr.readyStatus, -1, "ajax.timeout :: retry over. " );
			}

		} else {
			//h 재송을 위해서도, abort는 abortCallBack()을 실행한다.
			this.retry( );
		}

		//h handler가 있으면 실행.
		if ( this.__timeoutHandler && typeof( this.__timeoutHandler ) == 'function' )
		{
			this.__timeoutHandler( );
		}
	}; 

	//h 데이터 교환이 성공했는지를 확인한다.
	//h readyState가 4 + status 0/200 + responseText / responseXML이 존재하는지를 확인한다.
	//h framework에서 제공하는 ajax 객체는, [데이터 수신] 이 대전제이다.
	//h 즉, 사용자가 framework 의 ajax 객체를 사용한다면, 반드시 데이터 수신이 발생한다는 전제 하에 코드가 작성이 되어 있으므로
	//h 전송만이 목적인 경우로 사용한다면, 이 함수를 변경하여야 한다.
	this.__receiveSuccessCheck = function() {
		if (
				( riffGlobal.AJAXREADYSTATE.DONE == this.__xhr.readyState )			// readyState = 4 체크
				&& ( ( 0 === this.__xhr.status ) || ( 200 === this.__xhr.status ) )		// readyStatus = 0 / 200 체크
				&& ( this.__xhr.responseText || this.__xhr.responseXml )				// return value 가 있는지 체크
			)
		{
			return true;
		}

		return false;
	};

	//h 전송이 성공했을 때에 할 일들.
	//h Ajax객체를 삭제할 때와 다른 것이, 다른 데이터로 통신할 때를 위해 설정값은 유지하고, 
	//h retry 값만 지운다. -> 성공했으니까.
	//h timeout 객체를 지운다. -> 성공했으니까.
	this.requestSuccess = function( ) {
		window.clearTimeout( this.__timeoutObject );
		this.__timeoutObject = null;
		this.__retryCount = 0 ;
	};

	//h 에러 처리 함수( callback 이 없을때 쓸 default )
	this.defaultError = function( _readyState, _status, _description )
	{
		var s = "Error occured: readyState:" + _readyState + " status:" +_status;
		if ( _description )	{	s += " " + _description;	}
        //d	x.pop('#popup99');
		riff.alert( s );
	};

	// ajax::Request 
	this.Request = function ( ) {
		if ( this.__xhr == null) {
			this.__errorHandler( -1, -1, "ajax.Request :: Object initialization failed." );
			return false;
		} else {

			this.__xhr.open( this.__option.type, _url, this.__option.isAsync );
			this.__xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.__xhr.send( this.__sendData );
			
			// TimeoutSetting
            //d	tAjaxForTimeout.__timeoutObject = window.setTimeout( 
			if ( this.__timeoutMillisec > 0 )
			{
				this.__timeoutObject = window.setTimeout( 
					function( ) { 
						//d	alert(" timeout alert. rssText:" + this.rssText + "|" + tAjaxTest ); 
						//d tAjaxForTimeout.timeout( tAjaxForTimeout.__xhr.ajax ); 
						tAjaxForTimeout.timeout( ); 
					}
					, this.__timeoutMillisec );
			}
			//h Sync 모드일때 ( isAync = false ) 실행되게 하려고 넣은 코드인데. 이거 빼고 실행해 봐야 겠네.
		}
	};

	// ajax::Constructor 
	{
		//h fnSuccess의 option 설정
		if ( _theOtherSet )
		{
			this.__option.type = _theOtherSet.type || "GET";
			this.__option.isAsync = ( typeof( _theOtherSet.isAsync ) == "undefined" ) ? true : _theOtherSet.isAsync ;
			this.__option.contentType = _theOtherSet.contentType || "TEXT";
			//h 대문자 변환
			this.__option.type = this.__option.type.toUpperCase();
			this.__option.contentType = this.__option.contentType.toUpperCase();
		}

		//h connection fail 났을 때의 retry 설정
		if ( typeof( this.__retry ) == 'undefined' || this.__retry < 0 )
		{
			this.__retry = 1; 
            //d	this.__retry = getDataFromDefault(); 
		}	

		//h timeout 시간 설정
		//h tm = 1 -> 실행
		//h tm = undefined -> 기본 실행
		//h tm = null -> 미실행
		//h tm = 0 -> 미실행
		if ( typeof( this.__timeoutMillisec ) == 'undefined' || this.__timeoutMillisec < 0 )
		{
			this.__timeoutMillisec = 5000; 
            //d	this.__timeout = getDataFromDefault(); 
		}

		//h 에러 함수 설정.
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
			//h IE 라면, 아예 실행 안되는 게 맞지.
			this.__destroy( );
			return false;
		}

		if (! this.__xhr ) {
			this.__errorHandler( -1, -1, "ajax.Constructor :: Cannot create an XMLHTTP instance" );
			return false;
		}

        this.__xhr.ajax = this;
		//h readyState = 4 일때의 이벤트 등록
		this.__xhr.handlers	= [];
		this.__xhr.datas	= [];
		this.__xhr.handlers[ riffGlobal.AJAXREADYSTATE.DONE ] = this.__successFunction;

        this.__xhr.onreadystatechange = function ( ) {
        //h 여기서의 this 는 ajax 객체가 아니고 xhttp 객체( xhr ) 다. 
        //h 만일 ajax객체를 사용하고 싶으면, this.ajax를 이용할것.

			//h 이 구역은, 에러 발생과 관계없이( __xhr.status 값과 관계없이 ) 실행한다.
			//h retry 를 이용하려면 에러인지 아닌지를 판단해야 하므로
			//h 에러의 기준은 status 값이 0 , 200 이 아닌 경우이다. 이 경우만 retry 하자.

			try
			{
				if ( this.status !== 0 && this.status !== 200 )
				{
					//h retry 가 설정되어 있으면 retry를 하고, retryCount를 전부 소비했으면 errorHandler() 를 실행.
					//h timeout 이 설정되어 있다면, 일단 지우자.
					window.clearTimeout( this.ajax.__timeoutObject );
					this.ajax.retryOnError();
					return;
				}
			}
			catch ( e )
			{

			}
		
//d			if ( this.status &&	( this.status !== 0 && this.status !== 200 ) )
//d			{
//d				this.ajax.__errorHandler( this.readyState, this.status, " ajax.status :: status(" + this.status + ") is error." );
//d			}

			if ( riffGlobal.AJAXREADYSTATE.DONE == this.readyState ) {

				//h 정상이라면
				if ( this.ajax.__receiveSuccessCheck() )
				{
					//h timeout 용 타이머 지우자.
					this.ajax.requestSuccess();
					//h text에서 xml 을 추출.
					if( !this.responseXml ) { 
						this.responseXml = ( new DOMParser() ).parseFromString( this.responseText, "application/xml" );   
					};
					this.ajax.__successFunction( this.responseXml, this.responseText, this.ajax, _functionTossAgumentSet );
				} else {
					//h 정리. alzajira의 경우
					//h status값이 반환되었다는 것은, 어떤 형태로든 데이터 통신이 종결되었다는 뜻이다
					//h 즉, readyState 4 / status = 0 -> readyState 4 / status = 200 의 형태로 변하는 것이 아니라
					//h readyState가 3 -> 4 로 될 때, status값은 한방에 0 , 200, 404 등으로 정해지는 것이다.
						
					//h retry with error Handler() + retry handler()
					//h retry 가 설정되어 있으면 retry를 하고, retryCount를 전부 소비했으면 errorHandler() 를 실행.

					//h timeout 이 설정되어 있다면, 일단 지우자.
					window.clearTimeout( this.ajax.__timeoutObject );
					this.ajax.retryOnError();					
				}

			}
		};
		//h 데이터 전송
		this.Request( ) ;
	};

};

