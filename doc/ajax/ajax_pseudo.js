/* **************************** riff.ajax.js **************************************** */

// Global 로 선언해야 할 변수들.
riff.global = {
...
	// 통신 상태 표시용 인자값.
	ajax : {				
		UNSENT : 0,		//e	open() 전.
		OPENED : 1,		//e	open() 후. 
		HEADERS_RECEIVED : 2,	//e	send() 시작.
		LOADING : 3,	//e	send 종료 + 데이터 수신중
		DONE : 4			//e	데이터 수신 종료
	}
...
}


// AJAX 관련 함수 :
riff.ajax : namespace.
	riff.ajax.init()
	riff.ajax.request()
	riff.ajax.retryWithNewXHR( readyState, status )	
	riff.ajax.onReceive()
	riff.ajax.retry( readyState, status )
	riff.ajax.timeout( )
	riff.ajax.abortByUser( )
	riff.ajax.destroy( _fn )

var tAjax = new riff.ajax.init( userData ) 를 통해 this에 추가되는 객체
tAjax.ajaxData : 사용자 입력 인자값.
tAjax.xhr : 통신용 XMLHttpRequest 객체.
tAjax.xhr.tThis : XMLHttpRequest.onreadystatechange() 안에서 ajax 객체를 사용하기 위한 값.
tAjax.TimeoutID : timeout 기능 구현용 변수. timeout 기능은 setTimeout() 함수로 구현되는데, 통신이 성공하면 이전에 등록했던 timeout 이벤트를 삭제해야 하므로, 이를 저장할 공간이 필요하다. 
tAjax.retryCount : Retry 기능( 재송신 기능 ) 때 현재 재송신을 몇 번 했는지를 센다.
tAjax.request : 데이터 통신용 함수.( 데이터 송신용 함수 )
tAjax.onReceive : XMLHttpRequest.onreadystatechange() 용 함수.
tAjax.timeout : 통신 제한 시간 만료 처리용 함수.
tAjax.retry : 통신 실패시 재송신 처리용 함수.
tAjax.abortByUser : 사용자 통신 취소 처리용 함수.
tAjax.retryWithNewXHR : 재송신 판단 및 에러 처리 함수.
tAjax.destroy : 메모리 해제용 함수.

// 객체 생성 함수. constructor.
// _ajaxData : 사용자 지정 객체.
riff.ajax.init( _ajaxData )
{
	// 통신 가능 여부 판단		
	통신을 위한 XHTTPRequest 객체 생성 가능 여부 판단.
	인자값 공백 판단
	// 필수인자 존재 여부 판단.
		사용자 지정 성공 함수( success.fn ) 존재 확인	// 사용자 지정 성공 함수 : 통신 성공하면 실행할 사용자 지정 함수.
		URL 있는지 확인
	// default value 가 설정되어야 하는 값들 판단 및 설정
		// open 관련 사용자 설정값 설정.
			기본값을 GET으로 하되, 사용자 통신 설정값을 따른다.
			기본값을 비동기 모드로 하되, 사용자 통신 설정값을 따른다.
	xHttpRequest 객체 생성 함수 실행.
	this.retry 객체에 retry 처리 함수 할당.
	현재의 retry 횟수를 0으로 초기화.		// 	_ajaxData.error.retry.current = 0;
	this.timeout 객체에 timeout 처리 함수 할당.
	this.abortByUser 객체에 abortByUser 처리 함수 할당.
}

//통신용 xHttpRequest 객체 생성 함수.
// readyState : xHttpRequest 의 readyState 값
// status : xHttpRequest 의 status 값
riff.ajax.getXMLHttpRequest( readyState, status )	
{
	XMLHttp 객체 생성.
	this.xhr 에 할당.
	this.xhr.tThis 에 this 할당. // XMLHttp.onreadystatechange 에서 사용하기 위해.
	XMLHttp.onreadystatechange 객체에 통신 수신 대기 함수 할당.
}

// 데이터 통신용 함수.
riff.ajax.request( )
{
	// 초기화 : 	this 아래에 있는 request 관련 변수를 local로 할당. 
	xhttp.open( open 관련 사용자 설정값. )	
	xhttp.setRequestHeader( 헤더 정보 사용자 설정값. );
//	timeout 기능을 위해, window.setTimeout() 설정
	if ( 사용자 설정 timeout 시간 > 0 ) {
		this.TimeoutID = window.setTimeout( timeout 관련 처리 함수, 사용자 설정 timeout 시간 );
	}
	xhttp.send( 서버에 송신할 사용자 데이터 )
}

// 재송신 판단 및 에러 처리 함수 
// readyState : xHttpRequest 의 readyState 값
// status : xHttpRequest 의 status 값
riff.ajax.retryWithNewXHR( readyState, status )	
{
	XMLHttp.onreadystatechange 객체에 통신 수신 대기 함수 할당.
	if( status 값이 존재하지 않으면 )	{	// !( xhr.status > 0 )
		xHttpRequest 객체 생성 함수 실행.
	}
	송수신 취소. // xHttp.abort() 
	retry 관련 처리 함수	// riff.ajax.retry( readyState, status  )

}

// 통신 수신 대기 함수.
riff.ajax.onReceive()
{
	if 통신 종료면 {	// readyState == 4 
		window.clearTimeout( this.TimeoutID );
		if 통신 성공이면 { // ( 200 <= status < 300 ) )
			통신 성공 함수 실행 // success.fn( xhr.readyState, xhr.staus, xhr.responseText, xhr.responseXML, success.args );
		} else {
			재송신 판단 및 에러 처리 함수 실행 
		}
	} else {
		통신 상태 변경 함수 실행		//	change.fn( txhr.readyState, txhr.status, change.args );		
		if ( txhr.status !== 200 ) {
			window.clearTimeout( this.TimeoutID );
			재송신 판단 및 에러 처리 함수 실행 
		}
	}
}

// retry 관련 처리 함수
riff.ajax.retry( readyState, status )
{
	현재 retry 횟수 + 1
	if ( 사용자 설정 retry 횟수 > 0 && 현재 retry 횟수 < 사용자 설정 retry 횟수 ) {
		사용자 지정 retry 함수 실행.	 // retry.fn( xhr.readyState, xhr.staus, retry.args )
		데이터 재송신	//  this.request() 
	} else 
		통신 실패 함수 실행 // exception.fn( xhr.readyState, xhr.staus, exception.args );
}

// timeout 관련 처리 함수
riff.ajax.timeout( )
{
	송수신 취소. // xHttp.abort() 
	사용자 지정 Timeout 함수 실행.	// timeout.fn( xhr.readyState, xhr.staus, timeout.args )
	retry 관련 처리 함수 실행 //	riff.ajax.retry( )
}

// abort 관련 처리 함수
riff.ajax.abortByUser( )
{
	window.clearTimeout( this.TimeoutID );
	송수신 취소. // xHttp.abort() 
	사용자 지정 abort 함수 실행.	// abort.fn( xhr.readyState, xhr.staus, abort.args )
	통신 실패 함수 실행 // exception.fn( xhr.readyState, xhr.staus, exception.args );
}

// 메모리 삭제용 함수.	
// _fn : 메모리 삭제를 위해 추가로 실행할 함수
riff.ajax.destroy( _fn )
{
	this 이하 변수 모두 = null;
	_fn 실행
}




/* **************************** user. js **************************************** */

//사용자가 활용하게될 코드 예제

// 통신 제어 내용 설정.
	var ajaxData = {};	// 통신 제어 내용 설정 변수.
	ajaxData.openOption = {};
	ajaxData.success = {};
	ajaxData.changeState = {};
	ajaxData.error = {};
	ajaxData.error.timeout = {};
	ajaxData.error.retry = {};
	ajaxData.error.exception = {};
	ajaxData.error.abort = {};
	ajaxData.openOption.url = "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world";
	ajaxData.openOption.type = "GET";
	ajaxData.openOption.isAsync = true;
	ajaxData.sendOption.headerData = { "RequestHeader1" : value1,"RequestHeader2" : value2 };
	ajaxData.sendOption.sendData = "id=abcd&pwd=abcde"
	ajaxData.success.fn = function( readyState, status, text, XML, args ) { console.log("success : text:" + text + " args:" + args);}
	ajaxData.success.args = " success args ";
	ajaxData.error.exception.fn = function( readyState, status, args ) { console.log("exception"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.exception.args = " exception args ";
	ajaxData.changeState.fn = function( readyState, status, args ) { console.log("changeState" + " args:" + args + " readyState:"+ readyState +  " status:[" +status +"]" );}
	ajaxData.changeState.args = " changeState args ";
	ajaxData.error.timeout.value = 10000;
	ajaxData.error.timeout.fn = function( readyState, status, args ) { console.log("timeout"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.timeout.args = " timeout args ";
	ajaxData.error.retry.value = 4;
	ajaxData.error.retry.fn = function( readyState, status, args ) { console.log("retry"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.retry.args = " retry args ";
	ajaxData.error.abort.fn = function( readyState, status, args ) { console.log("abort"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.abort.args = " abort args ";

// AJAX 객체 생성
	var tajax = new riff.ajax.init( ajaxData );
// 데이터 송신
	tajax.request();
// 데이터 통신 취소
	tajax.abortByUser();
// 메모리 해제
	tajax.destroy(); 
	tajax = null;




var ajaxData = {};	// 통신 제어 내용 설정 변수.

ajaxData.openOption = {};
ajaxData.success = {};
ajaxData.changeState = {};
ajaxData.error = {};
ajaxData.error.timeout = {};
ajaxData.error.retry = {};
ajaxData.error.exception = {};
ajaxData.error.abort = {};

ajaxData.openOption.url = "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world";
ajaxData.openOption.type = "GET";
ajaxData.openOption.isAsync = true;
ajaxData.sendOption.headerData = { "RequestHeader1" : value1,"RequestHeader2" : value2 };
ajaxData.sendOption.sendData = "id=abcd&pwd=abcde"
ajaxData.success.fn = function( readyState, status, text, XML, args ) { console.log("success : text:" + text + " args:" + args);}
ajaxData.success.args = " success args ";
ajaxData.error.exception.fn = function( readyState, status, args ) { console.log("exception"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
ajaxData.error.exception.args = " exception args ";
ajaxData.changeState.fn = function( readyState, status, args ) { console.log("changeState" + " args:" + args + " readyState:"+ readyState +  " status:[" +status +"]" );}
ajaxData.changeState.args = " changeState args ";
ajaxData.error.timeout.value = 10000;
ajaxData.error.timeout.fn = function( readyState, status, args ) { console.log("timeout"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
ajaxData.error.timeout.args = " timeout args ";
ajaxData.error.retry.value = 4;
ajaxData.error.retry.fn = function( readyState, status, args ) { console.log("retry"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
ajaxData.error.retry.args = " retry args ";
ajaxData.error.abort.fn = function( readyState, status, args ) { console.log("abort"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
ajaxData.error.abort.args = " abort args ";


