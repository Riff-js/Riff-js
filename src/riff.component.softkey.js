riff.component.softkey = function(_userSet){
	riff.component.call(this,_userSet);
	this.className = riff.widget.global.component.className.softkey;
	this.init(this,_userSet);	
	 
};
riff.component.softkey.prototype = new riff.component();
riff.component.softkey.prototype.init = function(_this,_userSet){
	_this.classInit.call(_this);
	riff.widget.global.objs.allComps.push(_this);			
}; 



//Sofykey Back Key
riff.component.softBackkey = function(_userSet){
	riff.component.call(this,_userSet);	
	this.className = riff.widget.global.component.className.softBackkey;
	this.parent = _userSet.parent;	
	this.init(this,_userSet); 
};
riff.component.softBackkey.prototype = new riff.component();
riff.component.softBackkey.prototype.init = function(_this,_userSet){

	//add child property to parent object
	_this.parent.child = _this;		

	//append element to parent object
	var tEle = riff.manipulation.createElem("div",{"class":_this.className,"id":_userSet.cId});
	riff.manipulation.appendNode(_this.parent.cId,tEle);
	riff.widget.global.objs.allComps.push(_this);
}


 

