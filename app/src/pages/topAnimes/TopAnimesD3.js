import * as d3 from "d3"
import {sliderBottom} from "d3-simple-slider"

let defaultYear = 2012

const LEFT_COMPRESSED = {
    width: "5px"
}

const LEFT = {
    width: "100px"
}

const CENTER = {
    width: "250px"
}

const RIGHT = {
    width: "100px"
}

const RIGHT_COMPRESSED = {
    width: "5px"
}


function constructTopAnimes(data) {
    const topAnimesSlider = document.createElement("div")
    topAnimesSlider.id = "topAnimes-slider"

    d3.select(topAnimesSlider)
        .append('svg')
        .attr('width', 360)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)')

    return topAnimesSlider
}

function updateTopAnimes (data) {
    const years = Object.keys(data);
    function focusYear(year) {
        d3.select('div#topAnimes-show').selectAll(".column")
            .data(years)
            .transition().duration(500).ease(d3.easePolyOut)
            .style('width', y =>  {
                if (Number(y) < year - 1) return LEFT_COMPRESSED['width']
                else if (Number(y) === year - 1) return LEFT['width']
                else if (Number(y) === year) return CENTER['width']
                else if (Number(y) === year + 1) return RIGHT['width']
                else return RIGHT_COMPRESSED['width']
            })
            .select('ul')
            .style('display', y => 
                y >= year - 1 && y <= year + 1 ? 'block' : 'none'
            )
    }

    var slider = sliderBottom()
        .min(d3.min(years))
        .max(d3.max(years))
        .width(300)
        .tickFormat(d3.format(''))
        .ticks(years.length)
        .step(1)
        .default(defaultYear)
        .on('onchange', selectedYear => {
            focusYear(selectedYear);
        });
    
    d3.select('div#topAnimes-slider').select('svg').select('g').call(slider)

    focusYear(defaultYear)
}

export {constructTopAnimes, updateTopAnimes}