window.onload = function(){

	var example01Data = {

		cId: "example01",

		effectObj : {
			border : "<div class='rf-effect-border'></div>",
			bg : "<div class='rf-effect-bg'></div>"
		},

		fn: function(){
			$.manipulation.addClass(this.cId, "example01");
		},

		item: ["One", "Two", "Three", "Four", "Five"],

		event: function(){

			var tItem = this.listItem();
			tItem.forEach(function(_el, _idx, _arr){

				$.event.tap([_el], function(){
					alert("This item's Index is " + _idx);
				});
			})
		},

		sync : true
	};


	var example01 = new riff.component.list(example01Data);


	var example01FlowData = {

		type: "col",

		fn1: function(){

			$.manipulation.css("#back", "display", "block");

			alert(this.name + " is Start!");
		},

		fn2: function(){
			alert(this.name + " is End!");
		},

		activeComponent: [example01]
	};



	var example01Flow = new riff.flow(example01FlowData);


	$.event.tap("#ex_item01", function(){
		$.manipulation.css("#exampleList", "display", "none");
		example01Flow.run();
	});

	/*
	 * Example #02
	 */

	var example02 = new riff.component.list({
		cId: "example02",
		fn: function(){
			$.manipulation.addClass(this.cId, "example02");
		},
		item: ["1st Flow", "2nd Flow", "3rd Flow", "4th Flow"],
		event: function(){
			var tItem = this.listItem();
			tItem.forEach(function(_el, _idx, _arr){
				$.event.tap([_el], function(){
					$.manipulation.css("#example02", "display", "none");
					subFlowArray[_idx].run();
				});
			})
		}
	});

	var example02Flow = new riff.flow({
		name: "Example 02's Flow",
		type: "col",
		fn1: function(){
			$.manipulation.css("#back", "display", "block");

			subListArray.forEach(function(_el, _idx, _arr){
				$.manipulation.css(_el.cId, "display", "none");
			})
		},
		fn2: function(){

		},
		activeComponent: [example02]
	});


	var subFlowArray = new Array();
	var subListArray = new Array();

	for (var i = 0; i < 4; i++) {
		subListArray[i] = new riff.component.list({
			cId: "example02Sub" + i,
			fn: function(){
				$.manipulation.addClass(this.cId, "example02");
			},
			item: ["go Example02 List", "Sub List No." + (i + 1) + " item1", "Sub List No." + (i + 1) + " item2", "Sub List No." + (i + 1) + " item3", "Sub List No." + (i + 1) + " item4"],
			event: function(){
				var tId = this.cId;
				var tItem = this.listItem();
				tItem.forEach(function(_el, _idx, _arr){
					$.event.tap([_el], function(){
						if (_idx == 0) {

							example02Flow.run();
						} else {
							alert(tId + " item" + _idx);
						}
					});
				})
			}
		});

		subFlowArray[i] = new riff.flow({
			name: "Example 02's Sub Flow No." + i,
			type: "col",
			fn1: function(){
				$.manipulation.css("#back", "display", "block");
				subListArray.forEach(function(_el, _idx, _arr){
					$.manipulation.css(_el.cId, "display", "none");
				})
			},
			fn2: function(){


			},

			activeComponent: [subListArray[i]]
		});
	}

	$.event.tap("#back", function(){
		$.manipulation.css("#exampleList", "display", "block");
		$.manipulation.css(".example01", "display", "none");
		$.manipulation.css(".example02", "display", "none");
		$.manipulation.css("#back", "display", "none");
	});

	$.event.tap("#ex_item02", function(){
		$.manipulation.css("#exampleList", "display", "none");
		example02Flow.run();
	});


	$.manipulation.css($.selector("li"), "cursor","pointer")
}