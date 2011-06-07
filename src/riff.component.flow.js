riff.flow = function( _data ){
	this.name = _data.name;
	this.type = _data.type || riff.global.flowType;
	this.fn1 = _data.fn1;
	this.fn2 = _data.fn2;
	this.activeComponent = _data.activeComponent;
	
	// _obj : a component data
	this.show = function( _obj ){
		if( _obj ){
			$.manipulation.css(_obj.cId, "display", "block");
		} else {
			function tFnShow(_el, _idx, _arr){
				$.manipulation.css(_el.cId, "display","block");
			};
		
			this.activeComponent.forEach(tFnShow);
		}
	};
	
	this.componentInit = function( _obj ){
		if(_obj){
			if(_obj.sync) _obj.makeItem();
			//_obj.init.call
			if (!_obj.effect) {
				$.manipulation.prepend(_obj.cId, _obj.effectObj.border);
				$.manipulation.prepend(_obj.cId, _obj.effectObj.bg);
				$.manipulation.addClass(_obj.cId, _obj.className);
				
				_obj.effect = true;
			}
			
			if(_obj.event){
				if(typeof _obj.event == "function"){
					_obj.event.call(_obj);
				} else if(riff.util.isArray(_obj.event)){
					function tFnObjEvent(_el, _idx, _arr){
						_el.call(_el);
					};
					
					_obj.event.forEach(tFnObjEvent);
				}
			}
		} else {
			function tFnInit(_el, _idx, _arr){
				if(_el.sync) _el.makeItem();
				if (!_el.effect) {
					$.manipulation.prepend(_el.cId, _el.effectObj.border);
					$.manipulation.prepend(_el.cId, _el.effectObj.bg);
					$.manipulation.addClass(_el.cId, _el.className);
					
					_el.effect = true;
				}
				if(_el.event){
					if(typeof _el.event == "function"){
						_el.event.call(_el);
					} else if(riff.util.isArray(_el.event)){
						function tFnNotObjEvent(_elNotObjEvent, _idxNotObjEvent, _arrNotObjEvent){
							_elNotObjEvent.call(_elNotObjEvent);
						};
						
						_el.event.forEach(tFnNotObjEvent);
					}
				}
			};
			
			this.activeComponent.forEach(tFnInit);
		}
	};
	
	this.componentEachFn = function(_obj){
		if(_obj){
			if (_obj.fn) {
				if (typeof _obj.fn == "function") {
					_obj.fn.call(_obj.fn)
				} else if(riff.util.isArray(_obj.fn)) {
					function tFnObj(_el, _idx, _arr){
						_el.call(_el);
					};
					_obj.fn.forEach(tFnObj);
				}
			}
		} else {
			
			function tFnNotObj(_el, _idx, _arr){
				if (_el.fn) {
					if (typeof _el.fn == "function") {
						_el.fn.call(_el);
					} else {
						function tFnNotObjArr(_chdEl, _chdIdx, _chdArr){
							_chdEl.call(_chdEl);
						};
						_el.fn.forEach(tFnNotObjArr);
					}
				}
			};
			
			this.activeComponent.forEach(tFnNotObj);
		}
	};
	
	this.run = function(_obj){
		
		var tThis = this;
		
		if(_obj){
			this.componentEachFn(_obj);
			this.componentInit(_obj);
			this.show(_obj);
		} else {
			
			if(this.fn1 && typeof this.fn1 == "function"){
				this.fn1.call(this);
			}
			
			if(this.type == "row"){
				function tFnRow(_el, _idx, _arr){
					tThis.componentEachFn(_el);
					tThis.componentInit(_el);
					tThis.show(_el);
				};
				
				this.activeComponent.forEach(tFnRow);
			} else {
				this.componentEachFn();
				this.componentInit();
				this.show();
			}
			
			if(this.fn2 && typeof this.fn2 == "function"){
				this.fn2.call(this);
			}			
		}
	};
};
