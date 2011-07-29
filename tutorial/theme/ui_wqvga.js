//List
riff.component.list.prototype.themeFn = function(){	
	
	//Only Title
	riff.manipulation.each(this.item(),function(){
		if(riff.traversal.find([this],".rf-component-list .rf-component-item-text").length == 0 ){
			riff.manipulation.addClass(riff.traversal.find([this],".rf-component-item-tit"),"rf-status-oneItem")
		}	
	})
	
	//Img +List
	riff.manipulation.each(this.item(),function(){
		if(riff.traversal.find([this],".rf-component-list .rf-component-item-img").length > 0 ){
			riff.manipulation.addClass(riff.traversal.find([this],".rf-component-item-text"),"rf-status-hasImg")
		}	
	})
	
	//Img + List ( Idle )
	riff.manipulation.each(this.item(),function(){
		if(riff.traversal.find([this],".rf-component-idleList .rf-component-item-img").length > 0 ){
			riff.manipulation.addClass(riff.traversal.find([this],".rf-component-item-tit"),"rf-status-hasImg")
		}	
	})
};

//Softkey
riff.component.softkey.prototype.themeFn = function(){	
	var tComp = this;
	var tItems = riff.selector(this.bodyId+" ."+riff.widget.global.component.className.item);
	
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
	var tEle = riff.widget.global.effObj.border();
	riff.manipulation.appendNode(tItems,tEle);
	
};