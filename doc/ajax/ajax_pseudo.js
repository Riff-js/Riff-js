/* **************************** riff.ajax.js **************************************** */

// Global �� �����ؾ� �� ������.
riff.global = {
...
	// ��� ���� ǥ�ÿ� ���ڰ�.
	ajax : {				
		UNSENT : 0,		//e	open() ��.
		OPENED : 1,		//e	open() ��. 
		HEADERS_RECEIVED : 2,	//e	send() ����.
		LOADING : 3,	//e	send ���� + ������ ������
		DONE : 4			//e	������ ���� ����
	}
...
}


// AJAX ���� �Լ� :
riff.ajax : namespace.
	riff.ajax.init()
	riff.ajax.request()
	riff.ajax.retryWithNewXHR( readyState, status )	
	riff.ajax.onReceive()
	riff.ajax.retry( readyState, status )
	riff.ajax.timeout( )
	riff.ajax.abortByUser( )
	riff.ajax.destroy( _fn )

var tAjax = new riff.ajax.init( userData ) �� ���� this�� �߰��Ǵ� ��ü
tAjax.ajaxData : ����� �Է� ���ڰ�.
tAjax.xhr : ��ſ� XMLHttpRequest ��ü.
tAjax.xhr.tThis : XMLHttpRequest.onreadystatechange() �ȿ��� ajax ��ü�� ����ϱ� ���� ��.
tAjax.TimeoutID : timeout ��� ������ ����. timeout ����� setTimeout() �Լ��� �����Ǵµ�, ����� �����ϸ� ������ ����ߴ� timeout �̺�Ʈ�� �����ؾ� �ϹǷ�, �̸� ������ ������ �ʿ��ϴ�. 
tAjax.retryCount : Retry ���( ��۽� ��� ) �� ���� ��۽��� �� �� �ߴ����� ����.
tAjax.request : ������ ��ſ� �Լ�.( ������ �۽ſ� �Լ� )
tAjax.onReceive : XMLHttpRequest.onreadystatechange() �� �Լ�.
tAjax.timeout : ��� ���� �ð� ���� ó���� �Լ�.
tAjax.retry : ��� ���н� ��۽� ó���� �Լ�.
tAjax.abortByUser : ����� ��� ��� ó���� �Լ�.
tAjax.retryWithNewXHR : ��۽� �Ǵ� �� ���� ó�� �Լ�.
tAjax.destroy : �޸� ������ �Լ�.

// ��ü ���� �Լ�. constructor.
// _ajaxData : ����� ���� ��ü.
riff.ajax.init( _ajaxData )
{
	// ��� ���� ���� �Ǵ�		
	����� ���� XHTTPRequest ��ü ���� ���� ���� �Ǵ�.
	���ڰ� ���� �Ǵ�
	// �ʼ����� ���� ���� �Ǵ�.
		����� ���� ���� �Լ�( success.fn ) ���� Ȯ��	// ����� ���� ���� �Լ� : ��� �����ϸ� ������ ����� ���� �Լ�.
		URL �ִ��� Ȯ��
	// default value �� �����Ǿ�� �ϴ� ���� �Ǵ� �� ����
		// open ���� ����� ������ ����.
			�⺻���� GET���� �ϵ�, ����� ��� �������� ������.
			�⺻���� �񵿱� ���� �ϵ�, ����� ��� �������� ������.
	xHttpRequest ��ü ���� �Լ� ����.
	this.retry ��ü�� retry ó�� �Լ� �Ҵ�.
	������ retry Ƚ���� 0���� �ʱ�ȭ.		// 	_ajaxData.error.retry.current = 0;
	this.timeout ��ü�� timeout ó�� �Լ� �Ҵ�.
	this.abortByUser ��ü�� abortByUser ó�� �Լ� �Ҵ�.
}

//��ſ� xHttpRequest ��ü ���� �Լ�.
// readyState : xHttpRequest �� readyState ��
// status : xHttpRequest �� status ��
riff.ajax.getXMLHttpRequest( readyState, status )	
{
	XMLHttp ��ü ����.
	this.xhr �� �Ҵ�.
	this.xhr.tThis �� this �Ҵ�. // XMLHttp.onreadystatechange ���� ����ϱ� ����.
	XMLHttp.onreadystatechange ��ü�� ��� ���� ��� �Լ� �Ҵ�.
}

// ������ ��ſ� �Լ�.
riff.ajax.request( )
{
	// �ʱ�ȭ : 	this �Ʒ��� �ִ� request ���� ������ local�� �Ҵ�. 
	xhttp.open( open ���� ����� ������. )	
	xhttp.setRequestHeader( ��� ���� ����� ������. );
//	timeout ����� ����, window.setTimeout() ����
	if ( ����� ���� timeout �ð� > 0 ) {
		this.TimeoutID = window.setTimeout( timeout ���� ó�� �Լ�, ����� ���� timeout �ð� );
	}
	xhttp.send( ������ �۽��� ����� ������ )
}

// ��۽� �Ǵ� �� ���� ó�� �Լ� 
// readyState : xHttpRequest �� readyState ��
// status : xHttpRequest �� status ��
riff.ajax.retryWithNewXHR( readyState, status )	
{
	XMLHttp.onreadystatechange ��ü�� ��� ���� ��� �Լ� �Ҵ�.
	if( status ���� �������� ������ )	{	// !( xhr.status > 0 )
		xHttpRequest ��ü ���� �Լ� ����.
	}
	�ۼ��� ���. // xHttp.abort() 
	retry ���� ó�� �Լ�	// riff.ajax.retry( readyState, status  )

}

// ��� ���� ��� �Լ�.
riff.ajax.onReceive()
{
	if ��� ����� {	// readyState == 4 
		window.clearTimeout( this.TimeoutID );
		if ��� �����̸� { // ( 200 <= status < 300 ) )
			��� ���� �Լ� ���� // success.fn( xhr.readyState, xhr.staus, xhr.responseText, xhr.responseXML, success.args );
		} else {
			��۽� �Ǵ� �� ���� ó�� �Լ� ���� 
		}
	} else {
		��� ���� ���� �Լ� ����		//	change.fn( txhr.readyState, txhr.status, change.args );		
		if ( txhr.status !== 200 ) {
			window.clearTimeout( this.TimeoutID );
			��۽� �Ǵ� �� ���� ó�� �Լ� ���� 
		}
	}
}

// retry ���� ó�� �Լ�
riff.ajax.retry( readyState, status )
{
	���� retry Ƚ�� + 1
	if ( ����� ���� retry Ƚ�� > 0 && ���� retry Ƚ�� < ����� ���� retry Ƚ�� ) {
		����� ���� retry �Լ� ����.	 // retry.fn( xhr.readyState, xhr.staus, retry.args )
		������ ��۽�	//  this.request() 
	} else 
		��� ���� �Լ� ���� // exception.fn( xhr.readyState, xhr.staus, exception.args );
}

// timeout ���� ó�� �Լ�
riff.ajax.timeout( )
{
	�ۼ��� ���. // xHttp.abort() 
	����� ���� Timeout �Լ� ����.	// timeout.fn( xhr.readyState, xhr.staus, timeout.args )
	retry ���� ó�� �Լ� ���� //	riff.ajax.retry( )
}

// abort ���� ó�� �Լ�
riff.ajax.abortByUser( )
{
	window.clearTimeout( this.TimeoutID );
	�ۼ��� ���. // xHttp.abort() 
	����� ���� abort �Լ� ����.	// abort.fn( xhr.readyState, xhr.staus, abort.args )
	��� ���� �Լ� ���� // exception.fn( xhr.readyState, xhr.staus, exception.args );
}

// �޸� ������ �Լ�.	
// _fn : �޸� ������ ���� �߰��� ������ �Լ�
riff.ajax.destroy( _fn )
{
	this ���� ���� ��� = null;
	_fn ����
}




/* **************************** user. js **************************************** */

//����ڰ� Ȱ���ϰԵ� �ڵ� ����

// ��� ���� ���� ����.
	var ajaxData = {};	// ��� ���� ���� ���� ����.
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

// AJAX ��ü ����
	var tajax = new riff.ajax.init( ajaxData );
// ������ �۽�
	tajax.request();
// ������ ��� ���
	tajax.abortByUser();
// �޸� ����
	tajax.destroy(); 
	tajax = null;




var ajaxData = {};	// ��� ���� ���� ���� ����.

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


