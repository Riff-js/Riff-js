//Sofykey 
riff.component.softkey = function(_userSet){
	this.className = riff.ui.global.component.className.softkey;
	this.backkey = _userSet.backkey || "visible";
	riff.component.call(this,_userSet);
};

riff.component.softkey.prototype = new riff.component();

riff.component.softkey.prototype.createBackkey = function(){
	//Create the DOM Element.
	var tlistItem = riff.manipulation.createElem("li",{"class":riff.ui.global.component.className.softBackkey});
	var tBack = riff.manipulation.createElem("div",{"class":riff.ui.global.component.className.softBackkeyEle});
	riff.manipulation.appendNode([tlistItem],tBack);
	riff.manipulation.appendNode(this.bodyId,tlistItem);
	tlistItem = null;
	
	//Added property
	this.backKey = this.cId+" ."+riff.ui.global.component.className.softBackkey;
	
	//Event Binding
	riff.event.tap(this.backKey, function(){
		riff.ui.global.objs.flow.back.run("back");	
	})	
};


//n Argument
//n number = index
//n string = Select query
//n objet = DOM Element array

riff.component.softkey.prototype.disableEnable = function(_item,_s){
	var tItems = riff.selector(this.bodyId+" ."+riff.ui.global.component.className.item);
	
	if(typeof _item == "number" ){
		var tEle = [tItems[_item]];	
	}
	if(typeof _item == "string" ){
		var tEle = riff.selector(this.bodyId+" "+_item);
	}
	if(typeof _item == "object" ){
		var tEle = _item;
	}

	if(_s == "disable"){
		riff.manipulation.addClass(tEle,"rf-status-dim");
		riff.event.enableDisable(tEle,"tap","disable");
	}
	if(_s == "enable"){
		riff.manipulation.removeClass(tEle,"rf-status-dim");
		riff.event.enableDisable(tEle,"tap","enable");
	}
}

riff.component.softkey.prototype.disable = function(_item){
	this.disableEnable(_item,"disable")
}

riff.component.softkey.prototype.enable = function(_item){
	this.disableEnable(_item,"enable")
}

riff.component.softkey.prototype.compsAddObj = function(){
	if (this.backkey == "visible"){
		this.createBackkey();
	}
}
riff.component.softkey.prototype.failedFn = function(){
	if (this.failedFnFlag == true){
		this.disable(riff.traversal.filtering(this.item(),".rf-component-softBackkey","not"))
	}
}
