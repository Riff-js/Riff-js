riff.component.header = function(_userSet){
	this.className = riff.widget.global.component.className.header;		
	riff.component.call(this,_userSet);			
	this.selectContent = _userSet.selectContent;
};

riff.component.header.prototype = new riff.component();
riff.component.header.prototype.run = function(_s){
	if (this.sFn) this.sFn();
	if (this.addObj) this.addObj();
	if (this.event) this.event();
	if(_s == "visible"){
		this.visible();	
	};
}

riff.component.header.prototype.createContent = function(){
	if(this.content[this.selectContent]){
		riff.manipulation.appendStr(this.bodyId, this.content[this.selectContent]);
	} else {
		riff.manipulation.appendStr(this.bodyId, this.selectContent);
	}
}


