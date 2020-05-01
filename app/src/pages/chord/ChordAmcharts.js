import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const constructChord = function () {

	var chart = am4core.create("chartdiv", am4charts.ChordDiagram);
	chart.hiddenState.properties.opacity = 0;

	var data = [];
	var actors = ["Actor A", "Actor B", "Actor C", "Actor D", "Actor E", "Actor F", "Actor G", "Actor H", "Actor I", "Actor J",
		"Actress A", "Actress B", "Actress C", "Actress D", "Actress E", "Actress F", "Actress G","Actress H"]

	function randomActor(except) {
		var actor = actors[Math.floor(Math.random() * actors.length - 1)];
		if (actor === except) {
			return randomActor(except);
		}
		else {
			return actor;
		}
	}

	function colorByGenre(name) {
		var color = ""
		if (name.includes("Actor")) {
			color = "#93B5C6";
		} else if (name.includes("Actress")) {
			color = "#BD4F6C";
		} else {
			color = "#111111";
		}
		return color;
	}

	actors.forEach(actor => data.push({"from" : actor, "nodeColor": colorByGenre(actor), "info": actor}))

	actors.forEach(actor => {
		var randomSize = Math.floor(Math.random() * (actors.length/2));
		
		var usedActors = [];
		for (var o = 0; o < randomSize; o++) {
			do{
				var randomAct = randomActor(actor);
			} while(usedActors.includes(randomAct));
			usedActors.push(randomAct);

			data.push({ "from": actor, "to": randomAct, "value": 1});
		}
	})

	chart.data = data;

	var title = chart.titles.create();
	title.text = "Chord Diagram of voice actors and actresses";
	title.marginBottom = 20;

	chart.dataFields.fromName = "from";
	chart.dataFields.toName = "to";
	chart.dataFields.value = "value";
	chart.dataFields.color = "nodeColor";
	chart.nonRibbon = true;
	chart.sortBy = "name";
	chart.startAngle = 90;
	chart.endAngle = 450;
	chart.height = am4core.percent(80);

	var node = chart.nodes.template;
	node.fillOpacity = 0.4;
	node.showSystemTooltip = true;
	node.tooltipText = "This is {info} with {total} connections";
	node.clickable = false;
	node.draggable = false;

	var label = node.label;
	label.relativeRotation = 90;
	label.fillOpacity = 0.2;

	var slice = chart.nodes.template.slice;
	slice.stroke = am4core.color("#000");
	slice.strokeOpacity = 0.5;
	slice.strokeWidth = 1;
	slice.cornerRadius = 8;
	slice.innerCornerRadius = 4;

	var link = chart.links.template;
	link.opacity = 0.05;
	link.strokeWidth = 2
	link.colorMode = am4core.color("#000");
	link.defaultState.properties.opacity = 0.1;
	link.tooltipText = "{from} & {to}";

	let labelHS = label.states.create("hover");
	labelHS.properties.fillOpacity = 1;
	
	var hoverState = node.states.create("hover");
	hoverState.properties.fillOpacity = 1;

	var linkHoverState = link.states.create("hover");
	linkHoverState.properties.opacity = 1;
	
	node.events.on("over", function (event) {
		var node = event.target;
		node.outgoingDataItems.each(function (dataItem) {
			if(dataItem.toNode){
				dataItem.link.isHover = true;                
				dataItem.toNode.label.isHover = true;
			}
		})
		node.incomingDataItems.each(function (dataItem) {
			if(dataItem.fromNode){
				dataItem.link.isHover = true;                
				dataItem.fromNode.label.isHover = true;
			}
		})
		node.label.isHover = true; 
	})

	node.events.on("out", function (event) {
		var node = event.target;
		node.outgoingDataItems.each(function (dataItem) {
			if(dataItem.toNode){
				dataItem.link.isHover = false;                
				dataItem.toNode.label.isHover = false;
			}
		})
		node.incomingDataItems.each(function (dataItem) {
			if(dataItem.fromNode){
				dataItem.link.isHover = false;                
				dataItem.fromNode.label.isHover = false;
			}
		})
		node.label.isHover = false; 
	})

    return chart;
}

export { constructChord }