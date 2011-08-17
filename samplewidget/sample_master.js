$.load(function(){
	
/*
 * Master
 */

idleMaster = new riff.master.basicIdle({
	cId : "idleMaster",
	w : riff.ui.global.idleW,
	h : riff.ui.global.idleH,		
});

fullMaster = new riff.master.basicFull({
	cId : "fullMaster",
	scene : scene,	
	w : riff.ui.global.fullW,
	h : riff.ui.global.fullH,
	sFn : function(){
		this.readjust();
		
	}
});

});