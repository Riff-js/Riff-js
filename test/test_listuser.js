//
// Cheese Framework 0.97
//
// Copyright 2010, Licensed under the MIT license.
// http://innovator.samsungmobile.com/
//
//


/*

- 폰에서 TC위젯을 돌리면, AJAX 안되는 부분
  (폰에서 로컬 XML을 못가져오니, H9쪽에서 서버에 올려주시고 URL을 알려주시도록.)

=> 폐사 서버( 주소 : http://175.125.20.219/xml/xml.php ) 에 proxy 기능을 추가하였으므로, 
	주소를 경유하시면 테스트가 가능합니다.
예를 들어, $.xml("http://feeds.bbci.co.uk/news/uk/rss.xml?edition=uk") 의 경우, 
	$.xml("http://175.125.20.219/xml/xml.php?url=http://feeds.bbci.co.uk/news/uk/rss.xml%3Fedition%3Duk") 
와 같은 형식을 사용하시면 됩니다. 

- List쪽 가이드가 부족한 부분
  (임의의 XML 형식의 feed에서도 개발자가 for문으로 코딩안해도 , 전체 XML 데이터를 List로 갖고오는 예제 명시.
   임의의 리스트 항목에 접근해서 내용을 바꾸는 예제 명시.)
	코드를 참조해 주시기 바랍니다.

	$(".list").sub( idx ) 
		해당 list의 item 선택
		find로 아래의 객체를 검색하여 사용하시면 편합니다.
	$(".list").removeItem( idx ) 
		해당 list의 Item 삭제
*/

$( function (){
	
	$.globalSetting(
	{
		"softkeyData" : {
			"Color" : function() { 
				var idx = 1; //적용할 Item의 Index
				$("#indexList").sub(idx).find(".txt").css("color", "#007733");
			},
			"Remove" : function() { 
				var idx = 1; //적용할 Item의 Index
				$("#indexList").removeItem(0);
			}
		}
	});

	$("#idlego").tap(function(){ $.go("#index"); });

	$("#indexList").data(
	[
		["text", "Callback Function", "해당 Item의 콜백함수는 이렇게 정합니다.",
				function () { alert("Callback Function call"); } ],
		["text", "Modify Style", "Item 안의 내용은 다음과 같이 스타일을 변경할 수 있습니다.", 
				function () { 
					Cheese("#indexList").sub( Cheese(this).index() ).find(".subTxt").css("color","#000000"); 
				} ],
		["text", "Index", "List의 Item Index는 이렇게 구할 수 있습니다.", 
				function () { alert(Cheese(this).index()); } ],
		["text", "Remove", "List Item 삭제는 다음과 같이 진행합니다.", 
				function () { Cheese("#indexList").removeItem( Cheese(this).index() ); } ]
	]);


});


