riff.master.basicFull = function(_userSet){
	this.className = riff.widget.global.master.className.basicFull;
	riff.master.call(this,_userSet);
	this.type = "full";
};	

riff.master.basicFull.prototype = new riff.master();



riff.master.basicIdle = function(_userSet){
	this.className = riff.widget.global.master.className.basicIdle;
	riff.master.call(this,_userSet);
	this.type = "idle";	
}	

riff.master.basicIdle.prototype = new riff.master();
