'use strict';
const selector = '#cuisine-charts';
const e = React.createElement;

class CuisineCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCuisines: [],
        selectedStates: [],
        selectedCities: []
    }
  }

  drawBarChart(data, selector) {
        $(selector).empty();
        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = $(selector).width() - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
        var y = d3.scaleLinear()
                .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // get the data

        // format the data
        data.forEach(function(d) {
            d.count = +d.count;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.priceRange; }));
        y.domain([0, d3.max(data, function(d) { return d.count; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.priceRange); })
            .attr("width", x.bandwidth())
            .transition()
            .duration(2000)
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
  }

  drawBubbleChart(data, selector) {
      $(selector).empty();
      let dataset = data;
        let margin = {
            top: 0,
            left: 10,
            right: 10,
            bottom: 0
        };
        var diameter = 400;
        var color = d3.scaleOrdinal(d3.schemeCategory20);
        let width = $(selector).width() - margin.left -margin.right;
        let height = 500 - margin.top - margin.bottom;

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        var svg = d3.select(selector)
            .append("svg")
            .attr("width", "100%")
            .attr("height", height)
            .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

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
                return d.Name + ": " + d.Count;
            });

        node.append("circle")
            .transition()
			.duration(2000)
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
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
            .transition()
			.duration(2500)
            .attr("fill", "white");

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
            .transition()
			.duration(2500)
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "px");
  }

 onCuisineSelect(cuisineList) {
     this.setState({
         selectedCuisines: cuisineList
     });
 }

 onStateSelect(stateList) {
     this.setState({
         selectedStates: stateList,
         selectedCities: [],
         selectedCuisines: []
     });
 }

 onCitySelect(cityList) {
     this.setState({
        selectedCities: cityList,
        selectedCuisines: []
     });
 }

 getCityDropdown(state) {
     if (state) {
         return (
            <div className="col-md city-filter chart-filters">
                        <CityDropdown stateName={this.state.selectedStates[0]} onCitySelect={this.onCitySelect.bind(this)}/>
            </div>
         );
     }
     else {
         return null;
     }
 }

 drawAllCharts(response) {
    let barChartData = [
        {
            'count': 0,
            'priceRange': '$'
        },
        {
            'count': 0,
            'priceRange': '$$'
        },
        {
            'count': 0,
            'priceRange': '$$$'
        },
        {
            'count': 0,
            'priceRange': '$$$$'
        },
        {
            'count': 0,
            'priceRange': '?'
        }
    ];
    response.data.results.map((item) => {
        if (item.attributes && item.attributes.RestaurantsPriceRange2 !== undefined) {
            switch(parseInt(item.attributes.RestaurantsPriceRange2)) {
                case 1:
                    barChartData[0].count = barChartData[0].count + 1;
                break;
                case 2:
                    barChartData[1].count = barChartData[1].count + 1;
                break;
                case 3:
                    barChartData[2].count = barChartData[2].count + 1;
                break;
                case 4:
                    barChartData[3].count = barChartData[3].count + 1;
                break;
                default:
                    barChartData[4].count = barChartData[4].count + 1;
            }
        }
        else {
            barChartData[4].count = barChartData[4].count + 1;
        }
        
    });
    this.drawBarChart(barChartData, '#cuisine-chart-2');

    console.log(response.data.validCategories.filter((item) => { this.state.selectedCuisines.indexOf(item['Name']) > -1 }));

    let bubbleData = {
        "children": response.data.validCategories.filter((item) => { 
            return this.state.selectedCuisines.indexOf(item.Name) > -1;
        })
    };
    this.drawBubbleChart(bubbleData, "#cuisine-chart-1");
 }

  render() {
    // when all filters are set
    if (this.state.selectedCuisines.length && this.state.selectedStates.length && this.state.selectedCities.length) {
        let url = '/api/restaurants';
        url = url + '?state=' + this.state.selectedStates.join(',');
        url = url + '&city=' + this.state.selectedCities.join(',');
        url = url + '&cuisine=' + this.state.selectedCuisines.join(',');
        // URL EXAMPLE: /api/restaurants?state=AZ,ON&cuisine=Indian,Mexican&city=Scarborough,Mesa
        axios.get(url).then((response) => {
            this.drawAllCharts(response);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
        
        });
    }
    else {
        $("#cuisine-chart-1, #cuisine-chart-2").empty();
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

                 {this.state.selectedCities.length ? (
                        <div className="col-md city-filter chart-filters">
                           <CuisineDropdown isMultiSelect="true" onCuisineSelect={this.onCuisineSelect.bind(this)}/>
                        </div>
                    ): (null)
                 }
            </div>
            <div className="row">
                <div className="col-md-6 w-100 p-3" id="cuisine-chart-1"></div>
                <div className="col-md-6 w-100 p-3" id="cuisine-chart-2"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(CuisineCharts), domContainer);