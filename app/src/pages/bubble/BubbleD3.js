
import * as d3 from "d3";

// data
const bubbleDataset = {
    "children": [
        {"Name": "Comedy", "Count": 3000, "Image": "https://cdn.myanimelist.net/images/anime/1223/96541.webp"},
        {"Name": "Action", "Count": 2000, "Image": "https://cdn.myanimelist.net/images/anime/10/47347.jpg"},
        {"Name": "Fantasy", "Count": 1500, "Image": "https://cdn.myanimelist.net/images/anime/11/39717.jpg"},
        {"Name": "Adventure", "Count": 1400, "Image": "https://cdn.myanimelist.net/images/anime/11/33657.jpg"},
        {"Name": "Drama", "Count": 1350, "Image": "https://cdn.myanimelist.net/images/anime/5/50331.jpg"},
        {"Name": "Sci-Fi", "Count": 1300, "Image": "https://cdn.myanimelist.net/images/anime/5/73199.jpg"},
        {"Name": "Shounen", "Count": 1200, "Image": "https://cdn.myanimelist.net/images/anime/13/17405.jpg"},
        {"Name": "Romance", "Count": 1200, "Image": "https://cdn.myanimelist.net/images/anime/5/87048.jpg"},
        {"Name": "School", "Count": 1000, "Image": "https://cdn.myanimelist.net/images/anime/10/78745.jpg"},
        {"Name": "Slice of Life", "Count": 900, "Image": "https://cdn.myanimelist.net/images/anime/13/22128.jpg"},
        {"Name": "Supernatural", "Count": 800, "Image": "https://cdn.myanimelist.net/images/anime/9/9453.webp"},
        {"Name": "Magic", "Count": 600, "Image": "https://cdn.myanimelist.net/images/anime/5/18179.webp"},
        {"Name": "Mecha", "Count": 550, "Image": "https://cdn.myanimelist.net/images/anime/1614/90408.webp"},
        {"Name": "Ecchi", "Count": 500, "Image": "https://cdn.myanimelist.net/images/anime/5/65187.webp"},
        {"Name": "Seinen", "Count": 480, "Image": "https://cdn.myanimelist.net/images/anime/10/77957.webp"},
        {"Name": "Mystery", "Count": 460, "Image": "https://cdn.myanimelist.net/images/anime/9/9453.webp"},
        {"Name": "Shoujo", "Count": 440, "Image": "https://cdn.myanimelist.net/images/anime/6/25254.webp"},
        {"Name": "Historical", "Count": 400, "Image": "https://cdn.myanimelist.net/images/anime/11/29134.webp"},
        {"Name": "Kids", "Count": 385, "Image": "https://cdn.myanimelist.net/images/anime/13/73834.webp"},
        {"Name": "Super Power", "Count": 350, "Image": "https://cdn.myanimelist.net/images/anime/12/76049.jpg"},
    ]
}

// root of the visualization

var bubbleRoot = document.createElement('div');

// visualization

const diameter = 600;

const bubble = d3.pack(bubbleDataset)
    .size([diameter, diameter])
    .padding(2);

const svg = d3.select(bubbleRoot).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");


var nodes = d3.hierarchy(bubbleDataset)
    .sum(function(d) { return d.Count; });

const defs = svg.append("defs");

defs.selectAll("pattern")
    .data(bubble(nodes).descendants())
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
        return d.data.Image;
    });

var node = svg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function(d){
        return  !d.children
    })
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

node.append("title")
    .text(function(d) {
        return d.data.Name + ": " + d.data.Count;
    });

node.append("circle")
    .attr("r", function(d) {
        return d.r;
    })
    .style("fill", function(d,i) {
        return `url(#${d.data.Name.replace(/\s/g, '')})`;
    });

node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.Name.substring(0, d.r / 3);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", function(d){
        return d.r/5;
    })
    .attr("fill", "white")
    .style("font-weight", 700);

node.append("text")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.data.Count;
    })
    .attr("font-family",  "Gill Sans", "Gill Sans MT")
    .attr("font-size", function(d){
        return d.r/5;
    })
    .attr("fill", "white")
    .style("font-weight", 700);

export { bubbleRoot }