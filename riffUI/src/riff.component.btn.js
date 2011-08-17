riff.component.btn = function(_userSet){
	this.className = riff.ui.global.component.className.btn;
	riff.component.call(this,_userSet);
	this.parent = _userSet.parent;
};

riff.component.btn.prototype = new riff.component();

riff.component.btn.prototype.initFirst = function(){
	if(this.parent){
	 this.parent.children.push(this);
	}
		
	
};

riff.component.btn.prototype.disable = function(){
	riff.manipulation.addClass(this.cId,"rf-status-dim");	
 	riff.event.enableDisable(this.cId,"tap","disable");
};

riff.component.btn.prototype.enable = function(){
	riff.manipulation.removeClass(this.cId,"rf-status-dim");
	riff.event.enableDisable(this.cId,"tap","enable");
};


riff.component.btn.prototype.compsSFn = function(){
	riff.manipulation.removeClass(this.cId,"rf-status-focus");
}
