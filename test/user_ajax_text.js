window.onload = function(){


/*
	var ajaxData = {
		openOption. : {
			url : "http://naver.com",

		}
	};

	var ajaxData = new getAjaxArgsObj();
*/

	var ajaxData = riff.ajax.getAjaxArgsObj();
	ajaxData.openOption.url = "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world";
	ajaxData.success.fn = function( readyState, status, text, XML, args ) { console.log("success : text:" + text + " args:" + args);}


/*
	var ajaxData = {};
	ajaxData.openOption = {};
	ajaxData.success = {};
	ajaxData.changeState = {};

	ajaxData.openOption.url = "http://175.125.20.219/xml/xml.php?url=http://rss.news.yahoo.com/rss/world";

	ajaxData.openOption.type = "GET";
	ajaxData.openOption.isAsync = true;

	//ajaxData.sendOption.headerData
	//ajaxData.sendOption.sendData
	
	ajaxData.error = {};
	ajaxData.error.timeout = {};
	ajaxData.error.retry = {};
	ajaxData.error.exception = {};
	ajaxData.error.abort = {};

	ajaxData.success.fn = function( readyState, status, text, XML, args ) { console.log("success : text:" + text + " args:" + args);}
	ajaxData.success.args = " success args ";
	ajaxData.error.exception.fn = function( readyState, status, args ) { console.log("exception"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.exception.args = " exception args ";

	ajaxData.changeState.fn = function( readyState, status, args ) { console.log("changeState" + " args:" + args + " readyState:"+ readyState +  " status:[" +status +"]" );}
	ajaxData.changeState.args = " changeState args ";
	ajaxData.error.timeout.value = 0;
	ajaxData.error.timeout.fn = function( readyState, status, args ) { console.log("timeout"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.timeout.args = " timeout args ";
	ajaxData.error.retry.value = 0;
	ajaxData.error.retry.fn = function( readyState, status, args ) { console.log("retry"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.retry.args = " retry args ";
	ajaxData.error.abort.fn = function( readyState, status, args ) { console.log("abort"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}
	ajaxData.error.abort.args = " abort args ";
*/


	var tajax = new riff.ajax.init( ajaxData );
	tajax.request();
	//tajax.abortByUser();


};
