
/* Theme Initialize */

if(riff.ui.global.theme.resolution == "auto"){
	var windowSize = riff.widget.getFullmodeSize();
	if (windowSize) {
	    var tSize = windowSize;
		if (tSize[0] == "480") {
	 		riff.ui.global.theme.resolution = "wvga";
	 		riff.ui.global.theme.imgSrc = "theme/basic/img_wvga/";
		}
		else if (tSize[0] == "240") {
	  		riff.ui.global.theme.resolution = "wqvga";
	  		riff.ui.global.theme.imgSrc = "theme/basic/img_wqvga/";
	 	} else if (tSize[0] == "320") {
	   		riff.ui.global.theme.resolution = "hvga";
	   		riff.ui.global.theme.imgSrc = "theme/basic/img_hvga/";
	    };
	  } else {
	   riff.ui.global.theme.resolution = "wvga";
	   riff.ui.global.theme.imgSrc = "theme/basic/img_wvga/";
  	}
}


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
} 

riff.load(function(){
	if(riff.ui.global.theme.resolution == "wvga"){
		riff.manipulation.attr("body","id","wvga")
	} else if (riff.ui.global.theme.resolution == "wqvga"){
		riff.manipulation.attr("body","id","wqvga")
	} else if (riff.ui.global.theme.resolution == "hvga"){
		riff.manipulation.attr("body","id","hvga")
	}
})


/* Theme function of Components */

//List
riff.component.list.prototype.themeFn = function(){	
	riff.manipulation.each(this.item(),function(){
		//Only Title
		if(riff.traversal.find([this],".rf-component-list .rf-component-item-text").length == 0 ){
			riff.manipulation.addClass(riff.traversal.find([this],".rf-component-item-tit"),"rf-status-oneItem")
		}	

		//Img +List
		if(riff.traversal.find([this],".rf-component-list .rf-component-item-img").length > 0 ){
			riff.manipulation.addClass(riff.traversal.find([this],".rf-component-item-text"),"rf-status-hasImg")
		}	
	
		//Img + List ( Idle )
		if(riff.traversal.find([this],".rf-component-idleList .rf-component-item-img").length > 0 ){
			riff.manipulation.addClass(riff.traversal.find([this],".rf-component-item-tit"),"rf-status-hasImg")
		}
		
		//ellipsis
		
		var tItem = riff.traversal.find([this],'.rf-component-item-text.rf-status-hasImg')
		var tNotImg = riff.traversal.filtering(riff.traversal.find([this],'.rf-component-item-text'),'.rf-status-hasImg','not');
		var tTit = riff.traversal.find([this],'.rf-component-item-tit');
		
		riff.string.ellipsisText(tItem,riff.ui.global.factory.imgSummaryEllipsis);
		riff.string.ellipsisText(tNotImg,riff.ui.global.factory.summaryEllipsis);
		riff.string.ellipsisText(tTit,riff.ui.global.factory.titleEllipsis);
				
	})
	
	//ellipsis
	
};

//Softkey
riff.component.softkey.prototype.themeFn = function(){	
	var tComp = this;
	var tItems = riff.selector(this.bodyId+" ."+riff.ui.global.component.className.item);
	
	//Auto width of items
	riff.manipulation.each(tItems,function(){
		if(tItems.length == 1){
			riff.manipulation.addClass([this],"rf-status-oneItem");
		}
		if(tItems.length == 2){
			riff.manipulation.addClass([this],"rf-status-twoItem");
		}
		if(tItems.length == 3){
			riff.manipulation.addClass([this],"rf-status-threeItem");
		}
		if(tItems.length == 4){
			riff.manipulation.addClass([this],"rf-status-fourItem");
		}
	})
	
	if(this.backkey == "invisible"){
		riff.manipulation.each(tItems,function(){
			var tC = parseInt(riff.manipulation.css([this],"width"));
			riff.manipulation.css([this],"width",tC+40+"px");
		});
	}
	
	//Add Border	
	var tEle = riff.ui.global.effObj.border();
	riff.manipulation.appendNode(tItems,tEle);
	
};


/* API */

riff.extend({
	widget : {
		convertDate : function(_dateObj){
			if(!_dateObj) _dateObj = new Date();
			var timeCur  = _dateObj;
			var rv = "";
			
			var YYYY = (1900 + timeCur.getYear());
			var MM = (1 + timeCur.getMonth());
			var DD = timeCur.getDate();
			var hh24 = timeCur.getHours();
			var hh = ( hh24 > 12 ) ? hh24 - 12 : hh24;
			var mm = timeCur.getMinutes();
			var ampm = ( hh24 >= 12 ) ? "PM" : "AM";
			
			MM = riff.util.cipherZero( MM ) ;
			DD = riff.util.cipherZero( DD ) ;
			hh = riff.util.cipherZero( hh ) ;
			mm = riff.util.cipherZero( mm ) ;
			
			var tMcc = riff.ui.global.yahoo.MCC ? Number( riff.ui.global.yahoo.MCC ) : 0;
			
			switch( riff.ui.global.yahoo.MCC )
			{
				case "310" : // us
				case "311" :
				case "312" :
				case "313" :
				case "314" :
				case "315" :
				case "316" :
					rv = MM + "-" + DD + "-" + YYYY + " " + hh + ":" + mm + " " + ampm;
					break;
				case "460" :  // cn
				case "461" :
				case "450" : // kr
				case "" :  
					rv = YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + " " + ampm;
					break;
				default :  
					rv = DD + "-" + MM + "-" + YYYY + " " + hh + ":" + mm + " " + ampm;
			}
			return rv;
		},	

	}
})