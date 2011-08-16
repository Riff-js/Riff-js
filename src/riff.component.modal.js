riff.component.modal = function(_userSet){
	this.className = riff.ui.global.component.className.modal	
	riff.component.call(this,_userSet);			
	this.okFn = _userSet.okFn
	this.cancelFn = _userSet.cancelFn
};

riff.component.modal.prototype = new riff.component();

riff.component.modal.prototype.visible = function(){
	if(riff.ui.global.objs.master) riff.ui.global.objs.master.dimVisible();	
	riff.ui.global.objs.comps.push(this);
	riff.manipulation.addClass(this.cId,"rf-status-visible");
	riff.manipulation.addClass(this.cId,"rf-status-act");
	if(this.children[0]){
		riff.manipulation.addClass(this.children[0].cId,"rf-status-visible");
		riff.manipulation.addClass(this.children[0].cId,"rf-status-act");
	}
};

riff.component.modal.prototype.invisible = function(){
	riff.util.pop(riff.ui.global.objs.comps,this)
	
	riff.manipulation.removeClass(this.cId,"rf-status-visible")
	
	
	riff.manipulation.removeClass(this.cId,"rf-status-act");
	
	if(this.children[0]){		
		riff.manipulation.removeClass(this.children[0].cId,"rf-status-visible");
		riff.manipulation.removeClass(this.children[0].cId,"rf-status-act");
	}
	if(riff.ui.global.objs.master) riff.ui.global.objs.master.dimInvisible();
};


