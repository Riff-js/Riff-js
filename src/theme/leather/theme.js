//
// Theme: Leather
//
// Copyright 2010, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//

function themeFn(){

	$('.multiLine.img').each(function(){
	var cheeseThis = Cheese(this);
	if(cheeseThis.children('.img').children('img').size()!=0){
	cheeseThis.children('.subTxt').css("width", (370- cheeseThis.children('.img').children('img').width()) + "px");
	} else{
	cheeseThis.children('.subTxt').css("width", (370- cheeseThis.children('.img').width()) + "px");
	}
})


}




