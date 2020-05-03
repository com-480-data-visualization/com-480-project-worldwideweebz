import * as d3 from "d3"

import { Config } from '../../Config'

let bubblePositions
const offset = 120

const constructBubble = function (data) {
    const bubbleDataset = {"children": data}

    // root of the visualization
    var bubbleRoot = document.createElement('div')
    bubbleRoot.id = "bubble-root"

    // visualization

    const diameter = 600

    const bubble = d3.pack(bubbleDataset)
        .size([diameter, diameter])
        .padding(2)

    const svg = d3.select(bubbleRoot).append("svg")
        .attr("width", diameter + 2 * offset)
        .attr("height", diameter + offset)
        .attr("class", "bubble")


    const nodes = d3.hierarchy(bubbleDataset)
        .sum(function(d) { return d.Count })

    const defs = svg.append("defs")

    bubblePositions = bubble(nodes).descendants()

    defs.selectAll("pattern")
        .data(bubblePositions)
        .enter().append("pattern")
        .attr("height","100%")
        .attr("width","100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("id", d => d.data.Name ? d.data.Name.replace(/\s/g, '') : 'undefined')
        .append("image")
        .attr("height","1")
        .attr("width","1")
        .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", function(d){
            // if config disables NSFW genres, exclude images
            if ("Name" in d.data && Config.detectNSFW(d.data.Name)) {
                return `${process.env.PUBLIC_URL}/img/nsfw.png`
            }
            else {
                return d.data.Image
            }
        })

    const node = svg.selectAll(".node")
        .data(bubblePositions)
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + (diameter / 2 + offset) + "," + diameter / 2 + ")"
        })

    node.append("circle")
        .attr("r", function(d) {
            return d.r
        })
        .style("fill", function(d,i) {
            return `url(#${d.data.Name.replace(/\s/g, '')})`
        })

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Name.substring(0, d.r / 3)
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5
        })
        .attr("fill", "white")
        .style("font-weight", 700)
        .style("text-shadow", "2px 2px 2px black")

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Count
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5
        })
        .attr("fill", "white")
        .style("font-weight", 700)
        .style("text-shadow", "2px 2px 2px black")
    
    return bubbleRoot
}

const updateBubble = function () {
    let node = d3.select('#bubble-root').select('svg')
        .selectAll('.node')
        .data(bubblePositions.slice(1))

    node.transition().duration(2000).ease(d3.easeElasticOut)
        .attr('transform', d => "translate(" + (d.x + offset) + "," + d.y + ")")
        
}

export { constructBubble, updateBubble }