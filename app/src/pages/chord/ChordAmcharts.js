import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const constructChord = function () {

	var chart = am4core.create("chartdiv", am4charts.ChordDiagram);
	chart.hiddenState.properties.opacity = 0;
	
	am4core.useTheme(am4themes_animated);
	
	var actors = ["Actor A", "Actor B", "Actor C", "Actor D", "Actor E", "Actor F", "Actor G", "Actor H", "Actor I", "Actor J",
		"Actress A", "Actress B", "Actress C", "Actress D", "Actress E", "Actress F", "Actress G","Actress H"]
	const languages = ["Japanese", "English", "French"]

	const colorMale = "#93B5C6"
	const colorFemale = "#BD4F6C"

	var chart = am4core.create("chartdiv", am4charts.ChordDiagram);
	chart.hiddenState.properties.opacity = 0;

	var data = [];
	var dataJp = [];
	var dataFr = [];
	var dataEn = [];
	
	var isColorByGenre = true;
	var actualLanguage = "Japanese"

	function randomActor(except) {
		var actor = actors[Math.floor(Math.random() * (actors.length))];
		if (actor == except) {
			return randomActor(except);
		}
		else {
			return actor;
		}
	}

	function colorByGenre(name) {
		var color = ""
		if (name.includes("Actor")) {
			color = colorMale;
		} else if (name.includes("Actress")) {
			color = colorFemale;
		} else {
			color = "#111111";
		}
		return color;
	}

	function colorByPopu() {
		var popu = Math.floor(Math.random() * 1000)
		var color = "white"
		if(popu < 250)
			color = "green"
		else if(popu < 500)
			color = "yellow"
		else if(popu < 750)
			color = "orange"
		else 
			color = "red"
		return color
	}

	function randomLanguage() {
		return languages[Math.floor(Math.random() * (languages.length))];
	}
	
	function changeColor() {
		chart.invalidateData()
		if(isColorByGenre) {
			chart.dataFields.color = "colorByPopu";
		} else {
			chart.dataFields.color = "colorByGender";
		}

		isColorByGenre = !isColorByGenre;
	}

	function changeLanguage(lang) {
		switch(lang) {
			case "Japanese": 
				chart.data = data
				break
			case "English":
				chart.data = dataJp
				break;
			default:
				chart.data = data
		}
		actualLanguage = lang
		chart.invalidateData();
	}

	function sortData(db) {
		db.sort(function(x, y) {
			if ("number" in x && !("number" in y)) {
			  return -1;
			} else if ("number" in y && !("number" in x)) {
			  return 1;
			}
			if (x["number"] < y["number"]) {
			  return -1;
			}
			if (x["number"] > y["number"]) {
			  return 1;
			}
			return 0;
		  })
		return db
	}

	actors.forEach(function(actor, i) {
		 data.push({
		 "from" : actor, 
		 "colorByGender": colorByGenre(actor), 
		 "colorByPopu": colorByPopu(), 
		 "number": 50-i,
		 "info": actor
		})})

	actors.forEach(function(actor, i) {
		var randomSize = Math.floor(Math.random() * (actors.length/2));
		
		var usedActors = [];
		for (var o = 0; o < randomSize; o++) {
			do{
				var randomAct = randomActor(actor);
			} while(usedActors.includes(randomAct));
			usedActors.push(randomAct);

			data.push({ "from": actor, "to": randomAct, "value": 50-i});
		}
	})

	data = sortData(data)
//---------------------------------------------------
	actors.forEach(function(actor, i) {
		dataJp.push({
			"from" : actor, 
			"colorByGender": colorByGenre(actor), 
			"colorByPopu": colorByPopu(), 
			"number": i,
			"info": actor
		})})

	actors.forEach(function(actor, i) {
		var randomSize = Math.floor(Math.random() * (actors.length/2));
		
		var usedActors = [];
		for (var o = 0; o < randomSize; o++) {
			do{
				var randomAct = randomActor(actor);
			} while(usedActors.includes(randomAct));
			usedActors.push(randomAct);

			dataJp.push({ "from": actor, "to": randomAct, "value": i});
		}
	})
	dataJp = sortData(dataJp)
//-----------------------------------------------------

	changeLanguage(actualLanguage)

	var title = chart.titles.create();
	title.text = "";
	title.marginBottom = 20;

	chart.dataFields.fromName = "from";
	chart.dataFields.toName = "to";
	chart.dataFields.value = "value";
	chart.dataFields.color = "colorByGender";
	chart.nonRibbon = true;
	chart.startAngle = 270;
	chart.endAngle = 630;
	chart.height = am4core.percent(80);

	var node = chart.nodes.template;
	node.fillOpacity = 0.4;
	node.showSystemTooltip = true;
	node.tooltipText = "";
	node.clickable = false;
	node.draggable = false;
	node.cursorOverStyle = am4core.MouseCursorStyle.default

	var nodeLabel = node.label;
	nodeLabel.relativeRotation = 90;
	nodeLabel.fillOpacity = 0.2;

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
	link.defaultState.properties.opacity = 0.05;
	link.tooltipText = "{from} & {to}";
	
	var circleBullet = node.createChild(am4charts.CircleBullet);
	circleBullet.setStateOnChildren = true 
	circleBullet.locationY = 0.8
	circleBullet.fill = "black"
	circleBullet.circle.radius = 15;
	circleBullet.adapter.add("fill", function(fill, target) {
		if (!target.dataItem) {
		  return fill;
		}
		return isColorByGenre? 
			target.dataItem.dataContext["colorByPopu"] : target.dataItem.dataContext["colorByGender"]
	});
	
	var CBlabel = circleBullet.createChild(am4core.Label);
	CBlabel.text = "{number}";
	CBlabel.horizontalCenter = "middle";
	CBlabel.verticalCenter = "middle";
	CBlabel.fill = "black"
	CBlabel.fillOpacity = 0.9
	
	var legend = new am4charts.Legend();
	legend.clickable = false
	legend.toggable = false
	legend.parent = chart.chartContainer;
	legend.width = 320;
	legend.align = "left";
	legend.data = [{
		"name": "Male",
		"fill": colorMale,
		"fillOpacity": 0.2
	}, {
		"name": "Female",
		"fill": colorFemale
	}, {
		"name": "Poularity below 250",
		"fill": "green"
	}, {
		"name": "Popularity between 251 and 500",
		"fill": "yellow"
	}, {
		"name": "Popularity between 501 and 750",
		"fill": "orange",
	}, {
		"name": "Popularity over 750",
		"fill": "red"
	}]

	var button = chart.chartContainer.createChild(am4core.Button);
	button.label.text = "Switch colors";
	button.label.align = "middle"
	button.padding(5, 5, 5, 5);
	button.height = 30
	button.width = 130;
	button.align = "left";
	button.dx = 300
	button.events.on("hit", function() {
		changeColor();
	});

	let labelHS = nodeLabel.states.create("hover");
	labelHS.properties.fillOpacity = 1;
	
	var nodeHS = node.states.create("hover");
	nodeHS.properties.fillOpacity = 1;
	//nodeHS.properties.scale = 1.15;

	var linkHS = link.states.create("hover");
	linkHS.properties.opacity = 1;
	
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
		circleBullet.locationX = 0
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
		circleBullet.locationX = 0.5
	})	

	document.getElementById('filter').addEventListener('change', function(e) {
		var lang = e.target.value
		changeLanguage(lang)
	})

    return chart;
}

export { constructChord }