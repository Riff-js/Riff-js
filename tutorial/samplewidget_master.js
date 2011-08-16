$.load(function(){
	
/*
 * Master
 */

idleMaster = new riff.master.basicIdle({
	cId : "idleMaster",
	w : riff.widget.global.idleW,
	h : riff.widget.global.idleH,		
});


fullMaster = new riff.master.basicFull({
	cId : "fullMaster",
	scene : scene,	
	w : riff.widget.global.fullW,
	h : riff.widget.global.fullH,
	sFn : function(){
		this.readjust();
		initAutoScroll();
	}
});


});