riff.component.list = function(_userSet){
	this.className = "rf-component-list";
	this.cId = "#" + _userSet.cId;
	this.effect = _userSet.effect;
	this.sync = _userSet.sync || riff.widget.global.componentSync;
	this.fn = _userSet.fn;
	this.event = _userSet.event;
	this.item = (typeof _userSet.item == "function") ? _userSet.item.call(_userSet.item) : _userSet.item;
	
	this.markupFlag = false;
	this.effectFlag = false;
	
	this.listItem = function( _num ){
		if(!this.markupFlag) this.makeMarkup.call(this);
		
		if( typeof _num == "number" ){
			return $.selector(this.cId + " li")[_num];
		} else {
			return $.selector(this.cId + " li");
		}
	};
	
	this.makeMarkup = function(){
		
		var tStr = "<ul>";
		
		//_userSet.item is Array.
		for(k in this.item)
			tStr += "<li>" + this.item[k] +"</li>";
			
		tStr += "</ul>";
		
		$.manipulation.append(this.cId, tStr);
		
		tStr = null;
		
		this.markupFlag = true;
	};
	
	this.updateContents = function(){
		
	};
	
	this.insertItem = function(_obj, _pos, _type){
		
	};
	
	this.deleteItem = function(_obj){
		var tElm =this.listItem(); 
		
		if($.util.isArray(_obj)){
			 
			 
		} else {
			var tTypeObj = typeof _obj;//,
				;
			
			if(tTypeObj == "number"){
				
			} 

		}
	};
	
	this.classInit = function(){
		$.manipulation.addClass(this.cId, this.className);
	};
	
	this.init = function(_this){
		_this.classInit.call(_this);
		if(!_this.sync){
			_this.makeMarkup.call(_this);
		}
	}(this);
};

