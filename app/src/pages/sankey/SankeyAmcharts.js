import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import studioDetails from './StudioDetails.json'

const constructSankey = function (json, setDisplay) {
	var chart = am4core.create("chartdiv", am4charts.SankeyDiagram)
	chart.hiddenState.properties.opacity = 0
	am4core.useTheme(am4themes_animated)

	var data = json
	chart.data = data

	var title = chart.titles.create()
	title.text = ""

	chart.dataFields.fromName = "from"
	chart.dataFields.toName = "to"
	chart.dataFields.value = "value"
	chart.propertyFields.id = "studio"
	chart.paddingRight = 100
	chart.paddingBottom = 40
	chart.paddingLeft = 10
	chart.paddingTop = 10

	var node = chart.nodes.template
	node.width = 20
	node.fillOpacity = 0.8
	node.togglable = false
	node.clickable = false
	node.draggable = false
	node.propertyFields.type = "type"
	node.tooltipText = "{info}"
	node.cursorOverStyle = am4core.MouseCursorStyle.pointer
	node.strokeWidth = 3
	node.strokeLinejoin = "round"

	var links = chart.links.template
	links.propertyFields.id = "id"
	links.propertyFields.name = "value"
	links.colorMode = "gradient"
	links.tooltipText = ""
	links.fillOpacity = 0.2
	links.controlPointDistance = 0.2

	let hoverState = links.states.create("hover")
	hoverState.properties.fillOpacity = 1

	let nodeHS = node.states.create("hover")
	nodeHS.properties.fillOpacity = 1
	nodeHS.properties.scale = 1.15

	node.events.on("over", function (event) {
		let currNode = event.target

		if(currNode.type === "studio") {
			setDisplay(studioDetails[currNode.fromName], "studio")
		}
	})

	// highlight all links with the same id beginning
	links.events.on("over", function (event) {
		let currLink = event.target
		
		chart.closeAllPopups()
		chart.openPopup("This link contains <strong>" + currLink.name + "</strong> animes")
		
		let id = ""
		if(currLink.id !== "none") {
			id = currLink.id.split("-")[0]

			chart.links.each(function (link) {
				if (link.id.indexOf(id) !== -1) {
					link.isHover = true
				}
			})
		}
	})

	links.events.on("out", function (event) {
		chart.closeAllPopups()
		chart.links.each(function (link) {
			link.isHover = false
			link.disabled = false
		})
	})

	return chart
}

export { constructSankey }