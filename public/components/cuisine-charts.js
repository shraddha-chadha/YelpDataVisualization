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

  drawChart() {
      $("#cuisine-chart").empty();
      let dataset = {
            "children": [{"Name":"Olives","Count":4319},
                {"Name":"Tea","Count":4159},
                {"Name":"Mashed Potatoes","Count":2583},
                {"Name":"Boiled Potatoes","Count":2074},
                {"Name":"Milk","Count":1894},
                {"Name":"Chicken Salad","Count":1809},
                {"Name":"Vanilla Ice Cream","Count":1713},
                {"Name":"Cocoa","Count":1636},
                {"Name":"Lettuce Salad","Count":1566},
                {"Name":"Lobster Salad","Count":1511},
                {"Name":"Chocolate","Count":1489},
                {"Name":"Apple Pie","Count":1487},
                {"Name":"Orange Juice","Count":1423},
                {"Name":"American Cheese","Count":1372},
                {"Name":"Green Peas","Count":1341},
                {"Name":"Assorted Cakes","Count":1331},
                {"Name":"French Fried Potatoes","Count":1328},
                {"Name":"Potato Salad","Count":1306},
                {"Name":"Baked Potatoes","Count":1293},
                {"Name":"Roquefort","Count":1273},
                {"Name":"Stewed Prunes","Count":1268}]
        };

        var diameter = 600;
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        var svg = d3.select("#cuisine-chart")
            .append("svg")
            .attr("width", "100%")
            .attr("height", 600)
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
         selectedStates: stateList
     });
 }

 onCitySelect(cityList) {
     this.setState({
        selectedCities: cityList
     });
 }

  render() {
    if (this.state.selectedCuisines.length && this.state.selectedStates.length && this.state.selectedCities.length) {
        axios.get('/api/restaurants').then((response) => {
            this.drawChart(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {

        });
    }
    return (
        <div className="container">
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
                <div className="col-md w-100" id="cuisine-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(CuisineCharts), domContainer);