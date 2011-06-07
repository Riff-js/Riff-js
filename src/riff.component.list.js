riff.component.list = function(_userSet){
	this.className = "rf-component-list";
	this.cId = "#" + _userSet.cId;
	this.effectObj = _userSet.effectObj || riff.global.effectObj;
	this.sync = _userSet.sync || false;
	this.fn = _userSet.fn;
	this.event = _userSet.event;
	this.item = (typeof _userSet.item == "function") ? _userSet.item.call(_userSet.item) : _userSet.item;
	
	this.markup = false;
	this.effect = false;
	
	this.listItem = function( _num ){
		if(!this.markup) this.makeItem.call(this);
		
		if( typeof _num == "number" ){
			return $.selector(this.cId + " li")[_num];
		} else {
			return $.selector(this.cId + " li");
		}
	};
	
	this.makeItem = function(){
		
		var tStr = "<ul>";
		
		//_userSet.item is Array.
		for(k in this.item)
			tStr += "<li>" + this.item[k] +"</li>";
			
		tStr += "</ul>";
		
		$.manipulation.append(this.cId, tStr);
		
		this.markup = true;
	};
	
	this.init = function(_this){
		if(!_this.sync){
			_this.makeItem();
		}
	}(this);
};
