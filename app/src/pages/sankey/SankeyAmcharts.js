import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const studios = ["Studio A", "Studio B", "Studio C", "Studio D", "Studio E", "Studio F", "Studio G", "Studio H", "Studio I", "Studio J"];

const genres = ["Action", "Adventure", "Comedy", "Fantasy", "Sci-Fi"];

const notes = ["5.0", "4.5", "4.0", "3.5", "3.0"];

const constructSankey = function () {
    var chart = am4core.create("chartdiv", am4charts.SankeyDiagram);
	chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

	var data = [];

	//studios.forEach(s => data.push({"from" : s, "disabled": true}));

	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	studios.forEach(function(s, i) {
		var currId = s.split("Studio ")[1];
		genres.forEach(function(g, j) {
			if(getRandomInt(5) > 0) {
				var RandNumber = getRandomInt(15);
				var currIdG = currId.concat(j.toString());
				data.push({from: s, to: g, value: RandNumber, id: currIdG.concat("-0"), color:"#111111"});

				var usedNotes = [];
				for(var k=0; k<notes.length; k++) {
						do{
							var randomNote = getRandomInt(notes.length);
						} while(usedNotes.includes(randomNote));
						usedNotes.push(randomNote);

					if(RandNumber > 0) {
						var randomV = getRandomInt(RandNumber+1);
						
						if(k === notes.length-1) 
							randomV = RandNumber;

						RandNumber -= randomV;
						data.push({from: g, to: notes[randomNote], value: randomV, id: currIdG.concat("-1"),color:"#EEEEEE"});
					}
				}
			} 
		})
	})

	chart.data = data;

	var title = chart.titles.create();
		title.text = "Sankey Diagram of notes per genre per studio";

	chart.dataFields.fromName = "from";
	chart.dataFields.toName = "to";
	chart.dataFields.value = "value";
	//chart.dataFields.color = "color";
	chart.paddingRight = 100;
	chart.paddingBottom = 40;
	chart.paddingLeft = 10;
	chart.paddingTop = 10;
	//chart.nodeAlign = "bottom";

	var links = chart.links.template;
	links.propertyFields.id = "id";
	links.colorMode = "gradient";
	links.fillOpacity = 0.2;
	links.tooltipText = "";

	// make nodes draggable
	var node = chart.nodes.template;
	node.width = 20;
	//node.clickable = false;
	node.draggable = false;
	//node.contentValign = "middle";
	//node.tooltipText = "{from} has done {value} animes";

	let hoverState = links.states.create("hover");
	hoverState.properties.fillOpacity = 1;

	// highlight all links with the same id beginning
	links.events.on("over", function(event){
		let link = event.target;
		let id = link.id.split("-")[0];
	
		chart.links.each(function(link){
			if(link.id.indexOf(id) !== -1){
				link.isHover = true;
			} else {
				//link.disabled = true;
			}
		})
	})
	
	links.events.on("out", function(event){  
		chart.links.each(function(link){
			link.isHover = false;
			link.disabled = false;
		})
	})
	/*
	node.events.on("down", function(event){
		let node = event.target;
	
		chart.nodes.each(function(n){
			if(node != n){
			} else {
			}
		})
	})*/

    return chart;
}

export { constructSankey }