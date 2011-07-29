
riff.extend({
	widget : {
		global : {
			fullW : "480",					
			fullH : "800",
			idleW : "300",
			idleH : "200",
			msgStoptime : 2000,
			effObj : {
				border : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-border"});
				},
				bg : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-bg"});
				},
				arrLeft : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-arrL"});
				},
				arrRight : function(){
					return riff.manipulation.createElem("div",{"class":"rf-effect-arrR"});
				},
			},
			componentSync : false,
			flowType : "row",
			theme : {
				dir : "http://dev.h9works.com/riff/newriff_mirror/branches/plugin_themeBasic",
				name : "src"
			},
			objs : {
				allMasters : [],
				allComps : [],
				
				fixedComps : [],
				
				master : null,
				comps : [],
				flow : null,
				refreshComps : [],
			},
			className : {
				act : "rf-temp-act",
				actQ : ".rf-temp-act",
			},
			component : {
				className : {
					base : "rf-component",
					header : "rf-component-header",
					list : "rf-component-list",
					item : "rf-component-item",
					tab : "rf-component-tab",
					navigation : "rf-component-navigation",
					softkey : "rf-component-softkey",
					subinfo : "rf-component-subinfo",
					softBackkey : "rf-component-softBackkey",
					softBackkeyEle : "rf-component-softBackkey-ele",
					container : "rf-component-container",
					modal : "rf-component-modal",
					button : "rf-component-button",
					textBox : "rf-component-textBox",
					dim : "rf-component-dim",
					btn : "rf-component-btn",
					ordering : "rf-component-ordering",
					orderingList : "rf-component-ordering-list",
					orderingUp : "rf-component-orderingUp",
					orderingDown : "rf-component-orderingDown",
					checkbox : "rf-component-checkbox",
					checklist : "rf-component-checklist",
					selectAll : "rf-component-selectAll",
					radio : "rf-component-radio",
					radioList : "rf-component-radioList",
					idlePrev : "rf-component-idlePrev",
					idleNext : "rf-component-idleNext",
					idleList : "rf-component-idleList",
					idleIndicator : "rf-component-idleIndicator",
				},
				blankMsg : "No data to display",
				selectAllStr : "Select all",
				failed : "Connection failed",
				changed : "Changed",
				portrait: "Portrait view only",
				atLeast: "At least 1 characters required",
				unavailable : "Network unavailiable",
				noDefaultCategory : "Selected category has been deleted. Tap to set default news category",
				noDcFull : "Selected category has<br>been deleted. You need to<br> select category in settings",
				notRegion : "Yahoo! News could not detect your country - tap to choose your preferred News edition.",
				loadingStr : "Loading...",
			},
			master : {
				className : {
					base : "rf-master",
					basicFull : "rf-master-basicFull",
					basicIdle : "rf-master-basicIdle"					
				},
			},
			exceptionFlag : null,
			ajaxUI : {
				timeout : {
					value : 90000 
				},
				//_destroyObj = Ajax Object;
				failed : function(_readyState,_status,_args,_destroyObj){
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.run("failed");						
						if(_destroyObj) _destroyObj.destroy;		
									
					} else if (riff.widget.global.objs.master.type == "full"){						
						if( riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") ){
							busyindicator.stop();
						}
						var tScene = riff.widget.global.objs.master.scene.cId;
						var tComps = riff.widget.global.objs.flow.comps;
						var tFn = function(_el){
							if(_el.failedFn) _el.failedFn();
						}
						tComps.forEach(tFn);
						//var tCompInScene = riff.selector(".rf-component.rf-status-visible");
						
						msg.start(riff.widget.global.component.failed);						
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				nu : function(_readyState,_status,_args,_destroyObj){
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.run("network");						
						if(_destroyObj) _destroyObj.destroy;		
									
					} else if (riff.widget.global.objs.master.type == "full"){						
						if( riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") ){
							busyindicator.stop();
						}
						msg.start(riff.widget.global.component.unavailable);						
						var tScene = riff.widget.global.objs.master.scene.cId;
						var tComps = riff.widget.global.objs.flow.comps;
						var tFn = function(_el){
							if(_el.failedFn) _el.failedFn(); 
						}
						tComps.forEach(tFn);
						//var tCompInScene = riff.selector(".rf-component.rf-status-visible");
						
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				busyStart : function(_readyState,_status,_args,_destroyObj){
					
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.run("loading");						
						if(_destroyObj) _destroyObj.destoy;					
					} else if (riff.widget.global.objs.master.type == "full"){						
						
						if(riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") == false){						
							busyindicator.start(riff.widget.global.component.loadingStr);				
						}													
						if(_destroyObj) _destroyObj.destroy;
					}
					
				},
				busyEnd : function(_readyState,_status,_args,_destroyObj){
					
					if(riff.widget.global.objs.master.type == "idle"){
						idleIndicator.stop();
						if(idleIndicator.disableObj){
							for( _k in idleIndicator.disableObj){								
								if(idleIndicator.disableObj[_k].enable){
									idleIndicator.disableObj[_k].enable();
								}								
							}
							
							for( _k in idleIndicator.stopObj){								
								idleIndicator.stopObj[_k].start();
							}
						}						
						if(_destroyObj) _destroyObj.destroy;
					
					} else if (riff.widget.global.objs.master.type == "full"){						
						
						busyindicator.stop();																		
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				
			},

			
		},
		isWidget : function(){
			return (typeof widget == "undefined") ? false : true;
		},
		resize : function(_width, _height){
			if(arguments.length < 2){
				_width = riff.widget.global.w;
				_height = riff.widget.global.h;
			}
			if(riff.widget.isWidget()){
				widget.window.resizeWindow(_width, _height);
			} else {
				window.resizeTo(_width, _height);
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
		convertDate : function(_dateObj){
			if(!_dateObj) _dateObj = new Date();
			var timeCur  = _dateObj;
			 var rv = "";
			
			 var YYYY = (1900 + timeCur.getYear());
			 var MM = (1 + timeCur.getMonth());
			 var DD = timeCur.getDate();
			 var hh24 = timeCur.getHours();
			 var hh = ( hh24 > 12 ) ? hh24 - 12 : hh24;
			 var mm = timeCur.getMinutes();
			 var ampm = ( hh24 >= 12 ) ? "PM" : "AM";
			
			 MM = riff.util.cipherZero( MM ) ;
			 DD = riff.util.cipherZero( DD ) ;
			 hh = riff.util.cipherZero( hh ) ;
			 mm = riff.util.cipherZero( mm ) ;
			
			 var tMcc = riff.widget.global.yahoo.MCC ? Number( riff.widget.global.yahoo.MCC ) : 0;
			
			 switch( riff.widget.global.yahoo.MCC )
			 {
			  case "310" : // us
			  case "311" :
			  case "312" :
			  case "313" :
			  case "314" :
			  case "315" :
			  case "316" :
			   rv = MM + "-" + DD + "-" + YYYY + " " + hh + ":" + mm + " " + ampm;
			   break;
			  case "460" :  // cn
			  case "461" :
			  case "450" : // kr
			  case "" :  
			   rv = YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + " " + ampm;
			   break;
			  default :  
			   rv = DD + "-" + MM + "-" + YYYY + " " + hh + ":" + mm + " " + ampm;
			 }
			 return rv;
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
					 mds = mds.split( ':' );
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
