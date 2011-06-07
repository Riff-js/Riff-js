riff.component.tab = function(_userSet){
	this.className = "rf-component-tab";
	this.cId = "#" + _userSet.cId;
	this.effectObj = _userSet.effectObj || riff.global.effectObj;
	this.sync = _userSet.sync || false;
	this.fn = _userSet.fn;
	this.event = _userSet.event;
	this.item = (typeof _userSet.item == "function") ? _userSet.item.call(_userSet.item) : _userSet.item;
	
	this.listItem = function( _num ){
		if( typeof _num == "number" ){
			return this.item[_num];
		} else {
			return this.item;
		}
	};
	this.makeItem = function(){
		
		var tStr = "";
		
		//_userSet.item is Array.
		for(k in this.item){
			if(typeof this.item[k] == "object"){
				tStr += "<div class='rf-component-tab-btn'>" + this.item[k].text +"</div>";
			} else {
				tStr += "<div class='rf-component-tab-btn'>" + this.item[k] +"</div>";
			}
		}
		
		$.manipulation.append(this.cId, tStr);
	};
	
	this.init = function(_this){
		if(!_this.sync){
			_this.makeItem();
		}
	}(this);
}