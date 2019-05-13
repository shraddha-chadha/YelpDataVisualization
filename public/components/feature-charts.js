'use strict';
const selector = '#feature-charts';
const e = React.createElement;

class FeatureCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [],
        selectedCities: []
    }
  }

  drawChart(data, selector) {
        $(selector).empty();
            var text = "";

            var width = 500;
            var height = 500;
            var thickness = 40;
            var duration = 750;
            var padding = 10;
            var opacity = .8;
            var opacityHover = 1;
            var otherOpacityOnHover = .8;
            var tooltipMargin = 13;

            var radius = Math.min(width-padding, height-padding) / 2;
            var color = d3.scaleOrdinal(d3.schemeCategory10);

            var svg = d3.select(selector)
            .append('svg')
            .attr('class', 'pie')
            .attr('width', width)
            .attr('height', height);

            var g = svg.append('g')
            .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

            var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

            var pie = d3.pie()
            .value(function(d) { return d.value; })
            .sort(null);

            var path = g.selectAll('path')
            .data(pie(data))
            .enter()
            .append("g")  
            .append('path')
            .attr('d', arc)
            .attr('fill', (d,i) => color(i))
            .style('opacity', opacity)
            .style('stroke', 'white')
            .on("mouseover", function(d) {
                d3.selectAll('path')
                    .style("opacity", otherOpacityOnHover);
                d3.select(this) 
                    .style("opacity", opacityHover);

                let g = d3.select("svg")
                    .style("cursor", "pointer")
                    .append("g")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
            
                g.append("text")
                    .attr("class", "name-text")
                    .text(`${d.data.name} (${d.data.value})`)
                    .attr('text-anchor', 'middle');
                
                let text = g.select("text");
                let bbox = text.node().getBBox();
                let padding = 2;
                g.insert("rect", "text")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + (padding*2))
                    .attr("height", bbox.height + (padding*2))
                    .style("fill", "white")
                    .style("opacity", 0.75);
                })
            .on("mousemove", function(d) {
                    let mousePosition = d3.mouse(this);
                    let x = mousePosition[0] + width/2;
                    let y = mousePosition[1] + height/2 - tooltipMargin;
                
                    let text = d3.select('.tooltip text');
                    let bbox = text.node().getBBox();
                    if(x - bbox.width/2 < 0) {
                    x = bbox.width/2;
                    }
                    else if(width - x - bbox.width/2 < 0) {
                    x = width - bbox.width/2;
                    }
                
                    if(y - bbox.height/2 < 0) {
                    y = bbox.height + tooltipMargin * 2;
                    }
                    else if(height - y - bbox.height/2 < 0) {
                    y = height - bbox.height/2;
                    }
                
                    d3.select('.tooltip')
                    .style("opacity", 1)
                    .attr('transform',`translate(${x}, ${y})`);
                })
            .on("mouseout", function(d) {   
                d3.select("svg")
                    .style("cursor", "none")  
                    .select(".tooltip").remove();
                d3.selectAll('path')
                    .style("opacity", opacity);
                })
            .on("touchstart", function(d) {
                d3.select("svg")
                    .style("cursor", "none");    
            })
            .each(function(d, i) { this._current = i; });

            let legend = d3.select("#chart").append('div')
                        .attr('class', 'legend')
                        .style('margin-top', '30px');

            let keys = legend.selectAll('.key')
                        .data(data)
                        .enter().append('div')
                        .attr('class', 'key')
                        .style('display', 'flex')
                        .style('align-items', 'center')
                        .style('margin-right', '20px');

                    keys.append('div')
                        .attr('class', 'symbol')
                        .style('height', '10px')
                        .style('width', '10px')
                        .style('margin', '5px 5px')
                        .style('background-color', (d, i) => color(i));

                    keys.append('div')
                        .attr('class', 'name')
                        .text(d => `${d.name} (${d.value})`);

                    keys.exit().remove();
  }

    onStateSelect(stateList) {
        this.setState({
            selectedStates: stateList,
            selectedCities: []
        });
    }

    onCitySelect(cityList) {
        this.setState({
            selectedCities: cityList
        });
    }

  render() {

      if (this.state.selectedCities.length && this.state.selectedStates.length) {
          let url = '/api/restaurants';
          url = url + '?state=' + this.state.selectedStates.join(',');
          url = url + '&city=' + this.state.selectedCities.join(',')
          axios.get(url).then((response) => {
              var data = [
                {name: "WiFi", value: 0},
                {name: "No Wifi", value: 0},
                {name: "?", value: 0}
            ];
            response.data.results.map((item) => {
                if (item.attributes && item.attributes.WiFi) {
                    if (item.attributes.WiFi.includes('no')) {
                        data[1].value = data[1].value + 1; 
                    }
                    if (item.attributes.WiFi.includes('free')) {
                        data[0].value = data[0].value + 1; 
                    }
                }
                else {
                    data[2].value = data[2].value + 1; 
                }

            });
             this.drawChart(data, '#feature-chart');
          }).catch(() => {

          }).finally(() => {

          });
          
      }
    return (
        <div className="container p-0">
            <div className="row view-container">
               <div className="col-md state-filter chart-filters">
                    <StateDropdown onStateSelect={this.onStateSelect.bind(this)}/>
               </div>

                {this.state.selectedStates.length ? (
                        <div className="col-md city-filter chart-filters">
                           <CityDropdown stateName={this.state.selectedStates[0]} onCitySelect={this.onCitySelect.bind(this)}/>
                        </div>
                    ): (null)
                 }
            </div>
            <div className="row">
                <div className="col-md w-100" id="feature-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(FeatureCharts), domContainer);