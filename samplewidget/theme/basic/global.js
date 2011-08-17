riff.extend({
	ui : {
		global : {			 
			theme : {
				resolution : "auto",
				eventUse : null
			},
			component : {
				blankMsg : "No data to display",
				failed : "Connection failed",
				loadingStr : "Loading...",
			},
			ajaxUI : {
				timeout : {
					value : 90000 
				},
				//_destroyObj = Ajax Object;
				failed : function(_readyState,_status,_args,_destroyObj){
					if(riff.ui.global.objs.master.type == "idle"){
						idleIndicator.run("failed");						
						if(_destroyObj) _destroyObj.destroy;		
									
					} else if (riff.ui.global.objs.master.type == "full"){						
						if( riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") ){
							busyindicator.stop();
						}
						var tScene = riff.ui.global.objs.master.scene.cId;
						var tComps = riff.ui.global.objs.flow.comps;
						var tFn = function(_el){
							if(_el.failedFn) _el.failedFn();
						}
						tComps.forEach(tFn);
						//var tCompInScene = riff.selector(".rf-component.rf-status-visible");
						
						//console.log(riff.data.buffer(tCompInScene,"data"));												
						msg.start(riff.ui.global.component.failed);						
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				nu : function(_readyState,_status,_args,_destroyObj){
					if(riff.ui.global.objs.master.type == "idle"){
						idleIndicator.run("network");						
						if(_destroyObj) _destroyObj.destroy;		
									
					} else if (riff.ui.global.objs.master.type == "full"){						
						if( riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") ){
							busyindicator.stop();
						}
						msg.start(riff.ui.global.component.unavailable);						
						var tScene = riff.ui.global.objs.master.scene.cId;
						var tComps = riff.ui.global.objs.flow.comps;
						var tFn = function(_el){
							if(_el.failedFn) _el.failedFn(); 
						}
						tComps.forEach(tFn);
						//var tCompInScene = riff.selector(".rf-component.rf-status-visible");
						
						//console.log(riff.data.buffer(tCompInScene,"data"));												
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				busyStart : function(_readyState,_status,_args,_destroyObj){
					
					if(riff.ui.global.objs.master.type == "idle"){
						idleIndicator.run("loading");						
						if(_destroyObj) _destroyObj.destoy;					
					} else if (riff.ui.global.objs.master.type == "full"){						
						
						if(riff.manipulation.hasClass(busyindicator.cId,"rf-status-visible") == false){						
							busyindicator.start(riff.ui.global.component.loadingStr);				
						}													
						if(_destroyObj) _destroyObj.destroy;
					}
					
				},
				busyEnd : function(_readyState,_status,_args,_destroyObj){
					
					if(riff.ui.global.objs.master.type == "idle"){
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
					
					} else if (riff.ui.global.objs.master.type == "full"){						
						
						busyindicator.stop();																		
						if(_destroyObj) _destroyObj.destroy;
					}
				},
				
			},	
		}	
	}
})


