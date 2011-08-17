
function resolutionSetting(){
	var r = resolutionList.getValue();
	riff.ui.global.theme.resolution = r.value;
	if(riff.ui.global.theme.resolution == "wvga"){
		riff.extend({
			ui : {
				global : {			
					fullW : "480",
					fullH : "800",
					marginH : "38",
					idleW : "447",
					idleH : "252"
				},
			}
		});
		$m.attr("body","id","wvga")
	} else if (riff.ui.global.theme.resolution == "wqvga"){
		riff.extend({
			ui : {
				global : {			
					fullW : "240",
					fullH : "400",
					marginH : "19",
					idleW : "226",
					idleH : "123"
				}
			}
		})
		$m.attr("body","id","wqvga")
	} else if (riff.ui.global.theme.resolution == "hvga"){
		riff.extend({
			ui : {
				global : {			
					fullW : "320",
					fullH : "480",
					marginH : "23",
					idleW : "268",
					idleH : "151"
				}
			}
		})
		$m.attr("body","id","hvga")
	}
	fullMaster.w = riff.ui.global.fullW; 
	fullMaster.h = riff.ui.global.fullH;
	
	riff.ui.global.objs.flow.back.run("back");
}

function languageSet(){
	$l.langReg("en", langEN);
	$l.langReg("fr", langFR);
	$l.langReg("ko", langKO);
	$l.translateTableIndexing();
};

function widgetinfo(){
	if(riff.widget.isWidget() == true){
		var mode = "Mobile Widget"
	} else {
		var mode = "PC"	
	}
	
	
	
}