riff.component.list = function(_userSet){
	riff.component.call(this,_userSet);			
	this.className = riff.widget.global.component.className.list	
	this.init = function(_this){
		_this.classInit.call(_this);	
		riff.widget.global.objs.allComps.push(_this);			
	}(this);
};

riff.component.list.prototype = new riff.component();