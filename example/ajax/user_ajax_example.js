// New Riff
// Ajax Function Example
// Require Version : 0.2.0

$.load( function(){


	function ajaxFunction() {
		$.selector("#div1-wrap")[0].innerHTML = "Loading...";
		var tAjaxData = new $.ajax.getAjaxArgsObj();

		tAjaxData.openOption.url = $.selector("#inputUrl")[0].value;
		tAjaxData.success.fn = function( readyState, status, text, XML, args ) {
			var elm = $.selector("#div1-wrap");
			elm[0].innerHTML = text;
			tAjax.destroy( );
			tAjax = null;
			elm = null;
		};

		var tAjax = new $.ajax.init( tAjaxData );
		tAjax.request();
	};


	function ajaxFunction2() {
		$.selector("#div1-wrap")[0].innerHTML = "Loading...";
		var tAjaxData = new $.ajax.getAjaxArgsObj();

		tAjaxData.openOption.url = $.selector("#inputUrl")[0].value;
		tAjaxData.success.fn = function( readyState, status, text, XML, args ) {
			var elm = $.selector("#div1-wrap");
			elm[0].innerHTML = text;
			alert("args:" + tAjaxData.success.args );

			tAjax.destroy( );
			tAjax = null;
			elm = null;
		};


		tAjaxData.openOption.type = "GET";
		tAjaxData.openOption.isAsync = true;
		tAjaxData.success.args = " success args ";


		tAjaxData.error.exception.fn = function( readyState, status, args ) {
			alert("exception"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );
			$.selector("#div1-wrap")[0].innerHTML = "Fail to communicate to the Server.";
			tAjax.destroy( );
			tAjax = null;
			elm = null;
		};
		tAjaxData.error.exception.args = " exception args ";

		tAjaxData.changeState.fn = function( readyState, status, args ) { alert("changeState" + " args:" + args + " readyState:"+ readyState +  " status:[" +status +"]" );}

		tAjaxData.changeState.args = " changeState args ";

		tAjaxData.error.timeout.value = 60000;

		tAjaxData.error.timeout.fn = function( readyState, status, args ) { alert("timeout"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}

		tAjaxData.error.timeout.args = " timeout args ";

		tAjaxData.error.retry.value = 3;

		tAjaxData.error.retry.fn = function( readyState, status, args ) { alert("retry"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}

		tAjaxData.error.retry.args = " retry args ";

		tAjaxData.error.abort.fn = function( readyState, status, args ) { alert("abort"  + " args:" + args + " readyState:"+ readyState +  " status:" +status  );}

		tAjaxData.error.abort.args = " abort args ";

		var tAjax = new $.ajax.init( tAjaxData );
		tAjax.request();
	};

	$.event.tap( "#button1", ajaxFunction );
	$.event.tap( "#button2", ajaxFunction2 );


} );
