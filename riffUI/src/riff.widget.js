riff.extend({
	widget : {
		isWidget : function(){
			return (typeof widget == "undefined") ? false : true;
		},
		resize : function(_width, _height, _work){
			if(arguments.length < 2){
				_width = riff.ui.global.w;
				_height = riff.ui.global.h;
			}
			if(riff.widget.isWidget()){
				widget.window.resizeWindow(_width, _height);
			} else {
				if(_work == true){ 
					window.resizeTo(_width, _height);
				} 
			}
		},
		openURL : function( _url ) {
			try
			{
				var t = widget && widget.getFullmodeSize();
				if ( t )
					widget.openURL(_url);
				else
					window.location.href = _url;
				t = null;
			}
			catch ( e )
			{
				window.location.href = _url;
			}
			return true;
		},
		currentTimeParsing : function ( _timeString )
		{
			try{
				if(_timeString){
					var ymdmds = _timeString.split( 'T' );
					var ymd = ymdmds[0].split( '-' );
					var YYYY = ymd[0].toString();
					var MM = ymd[1].toString();
					var DD = ymd[2].toString();
					var mds = ymdmds[1].substring( 0, _timeString.indexOf( 'Z' ) );
					ds = mds.split( ':' );
					var hh = mds[0].toString();
					var mm = mds[1].toString();
					
					return riff.widget.convertDate( new Date( YYYY, MM - 1, DD, hh, mm ) );
				}
			} catch( ec ) {
				return _timeString;
			}
		},
		endKeyfn : function(){
			riff.ajax.abortAllAjax();
			flowInit.run("back");
			busyindicator.stop();
			function tFn(_el){
				if(_el.disable){
					console.log(_el);
					_el.disable();
				}	
			}
			flowIdle3.comps.forEach( tFn );
		}
	}
});


//n if Widget, riff.data.storage overwrite
if(riff.widget.isWidget()){
	//Widget Endkey
	widget.addEventListener("widgetendkey", riff.widget.endKeyfn, false);
	
	//n widget storage(overwrite riff.data.storage) : dummy code
	riff.extend( { 
		data : {
 			storage : function(_key, _value){
				if (!_key) {
					return null;
				};
				function setf1(_key, _value ){	
					var t = widget.setPreferenceForKey( _value, _key );
					return t;
				};
				function getf1( _key ){	
					var t = widget.preferenceForKey( _key );
					return t;
				};
				if (arguments.length == 1) {
					return getf1( _key );
				}
				else {
					return setf1( _key, _value );
				}
			}
		}
	}, true );
 
};
