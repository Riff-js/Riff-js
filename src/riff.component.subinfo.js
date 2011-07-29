riff.component.subinfo = function(_userSet){
	this.className = riff.widget.global.component.className.subinfo;		
	riff.component.call(this,_userSet);
	this.prefix = _userSet.prefix;
};

riff.component.subinfo.prototype = new riff.component();


riff.component.subinfo.prototype.createStr = function(tCon,tType){
	//var tContent = riff.widget.convertDate();
	if(this.prefix){
		var tPreEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-prefix" });
		var tPre = riff.manipulation.appendStr([tPreEl],this.prefix);
		riff.manipulation.appendNode(this.bodyId,tPreEl);
	}
	var tConEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-con" });
	if(tType == "node"){
		var tConText = riff.manipulation.createText(tCon);
		riff.manipulation.appendNode([tConEl],tConText);
	} else {
		riff.manipulation.appendStr([tConEl], tCon);
	}
	riff.manipulation.appendNode(this.bodyId,tConEl);
};


	
riff.component.subinfo.prototype.createContent = function(){

	var tContent = riff.widget.convertDate();
	if(this.prefix){
		var tPreEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-prefix" });
		var tPre = riff.manipulation.appendStr([tPreEl],this.prefix);
		riff.manipulation.appendNode(this.bodyId,tPreEl);
	}
	
	var tConEl = riff.manipulation.createElem("span",{ "class":"rf-component-subinfo-con" });
	var tCon = riff.manipulation.createText(tContent);
	riff.manipulation.appendNode([tConEl],tCon);
	
	riff.manipulation.appendNode(this.bodyId,tConEl);
}



riff.component.subinfo.prototype.failedFn = function(){
	if(this.failedFnFlag == true){
		this.clear();
	}
}
