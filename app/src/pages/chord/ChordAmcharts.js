import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import actorDetails from './vA_infos.json'

const constructChord = function (json, setActor) {

	var chart = am4core.create("chartdiv", am4charts.ChordDiagram)
	chart.hiddenState.properties.opacity = 0

	am4core.useTheme(am4themes_animated)

	var data = json

	var sortBy = "popularity"
	var actualLanguage = "Japanese"
	var actualTop = "20"
	var currDx = 0

	function changeLanguage(lang) {
		chart.data = sortData(data[actualTop][lang], sortBy)
		actualLanguage = lang
		chart.invalidateData()
	}

	function changeTop(top) {
		chart.data = sortData(data[top][actualLanguage], sortBy)
		actualTop = top
		switch (parseInt(top)) {
			case 5:
				currDx = 0.4
				break
			case 10:
				currDx = 0.3
				break
			case 20:
				currDx = 0
				break
			case 30:
				currDx = -0.4
				break
			case 40:
				currDx = -0.6
				break
			default:
				currDx = 1
		}
		chart.invalidateData()
	}

	function sortData(d, sortBy) {
		d.sort(function (x, y) {
			if (sortBy in x && !(sortBy in y)) {
				return -1
			} else if (sortBy in y && !(sortBy in x)) {
				return 1
			}
			if (x[sortBy] < y[sortBy]) {
				return -1
			}
			if (x[sortBy] > y[sortBy]) {
				return 1
			}
			return 0
		})
		return d
	}

	changeLanguage(actualLanguage)

	var title = chart.titles.create()
	title.text = ""
	title.marginBottom = 0

	chart.dataFields.fromName = "from"
	chart.dataFields.toName = "to"
	chart.dataFields.value = "value"
	chart.dataFields.color = "colorByGender"
	chart.nonRibbon = true
	chart.startAngle = 270
	chart.endAngle = 630
	chart.dy = -100
	chart.contentValign = "middle"
	chart.height = am4core.percent(60)

	var node = chart.nodes.template
	node.propertyFields.id = "id"
	node.fillOpacity = 0.4
	node.showSystemTooltip = true
	node.tooltipText = ""
	node.clickable = false
	node.events.off("hit")
	node.draggable = false
	node.cursorOverStyle = am4core.MouseCursorStyle.default

	var nodeLabel = node.label
	nodeLabel.relativeRotation = 90
	nodeLabel.fillOpacity = 0.2

	var slice = chart.nodes.template.slice
	slice.stroke = am4core.color("#000")
	slice.strokeOpacity = 0.5
	slice.strokeWidth = 1
	slice.cornerRadius = 8
	slice.innerCornerRadius = 4

	var link = chart.links.template
	link.opacity = 0.05
	link.strokeWidth = 2
	link.colorMode = am4core.color("#000")
	link.defaultState.properties.opacity = 0.05
	link.tooltipText = "{anime}"

	var circleBullet = node.createChild(am4charts.CircleBullet)
	circleBullet.setStateOnChildren = true
	circleBullet.locationY = 0.8
	circleBullet.fill = "black"
	circleBullet.circle.radius = 15
	circleBullet.adapter.add("fill", function (fill, target) {
		if (!target.dataItem) {
			return fill
		}
		return target.dataItem.dataContext["colorByPopu"]
	})

	var CBlabel = circleBullet.createChild(am4core.Label)
	CBlabel.text = "{number}"
	CBlabel.horizontalCenter = "middle"
	CBlabel.verticalCenter = "middle"
	CBlabel.fill = "black"
	CBlabel.fillOpacity = 0.9
	CBlabel.fontSize = 13

	let labelHS = nodeLabel.states.create("hover")
	labelHS.properties.fillOpacity = 1

	var nodeHS = node.states.create("hover")
	nodeHS.properties.fillOpacity = 1
	//nodeHS.properties.scale = 1.15

	var linkHS = link.states.create("hover")
	linkHS.properties.opacity = 1

	node.events.on("over", function (event) {
		var node = event.target

		if (node.id !== 0) {
			console.log(node.id)
			setActor(actorDetails[node.id])
		}

		node.outgoingDataItems.each(function (dataItem) {
			if (dataItem.toNode) {
				dataItem.link.isHover = true
				dataItem.toNode.label.isHover = true
			}
		})
		node.incomingDataItems.each(function (dataItem) {
			if (dataItem.fromNode) {
				dataItem.link.isHover = true
				dataItem.fromNode.label.isHover = true
			}
		})
		node.label.isHover = true
		circleBullet.locationX = currDx
	})

	node.events.on("out", function (event) {
		var node = event.target
		node.outgoingDataItems.each(function (dataItem) {
			if (dataItem.toNode) {
				dataItem.link.isHover = false
				dataItem.toNode.label.isHover = false
			}
		})
		node.incomingDataItems.each(function (dataItem) {
			if (dataItem.fromNode) {
				dataItem.link.isHover = false
				dataItem.fromNode.label.isHover = false
			}
		})
		node.label.isHover = false
		circleBullet.locationX = 0.5
	})

	document.getElementById('filter').addEventListener('change', function (e) {
		var lang = e.target.value
		changeLanguage(lang)
	})

	document.getElementById('top').addEventListener('change', function (e) {
		var top = e.target.value
		changeTop(top)
	})

	document.getElementById("SortByPopularity").addEventListener('click', function (e) {
		chart.data = sortData(data[actualTop][actualLanguage], "popularity")
		chart.invalidateData()
	})

	document.getElementById("SortByName").addEventListener('click', function (e) {
		chart.data = sortData(data[actualTop][actualLanguage], "name")
		chart.invalidateData()
	})

	return chart
}

export { constructChord }