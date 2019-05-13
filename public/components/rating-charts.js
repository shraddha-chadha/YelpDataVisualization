'use strict';
const selector = '#rating-charts';
const e = React.createElement;

class RatingCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCuisines: [],
        selectedStates: []
    }
  }

  drawChart(data, selector) {
      $(selector).empty();
      let dataset = data;

        var diameter = 600;
        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        var svg = d3.select(selector)
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
            .style("stroke", "black")
            .style("fill", function(d,i) {
                let colors = ["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"];
                switch(d.data.Name) {
                    case "1":
                        return colors[0];
                    break;
                    case "1.5":
                        return colors[1];
                    break;
                    case "2":
                        return colors[2];
                    break;
                    case "2.5":
                        return colors[3];
                    break;
                    case "3":
                        return colors[4];
                    break;
                    case "3.5":
                        return colors[5];
                    break;
                    case "4":
                        return colors[6];
                    break;
                    case "4.5":
                        return colors[7];
                    break;
                    case "5":
                        return colors[8];
                    break;
                    default:
                        return colors[9];
                }
            });

        node.append("text")
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return  d.data.State;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .transition()
			.duration(2500)
            .attr("fill", "#000");

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return  d.data.Name.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .transition()
			.duration(2500)
            .attr("fill", "#000");

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
            .attr("fill", "#000");

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

render() {
    if (this.state.selectedCuisines.length && this.state.selectedStates.length) {
        $("#ratings-chart").html('Loading...');
        let url = '/api/restaurants';
        url = url + '?state=' + this.state.selectedStates.join(',');
        let bubbleChartData = [];
        this.state.selectedStates.map((item) => {
            bubbleChartData.push({
                "Name": "0",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "1",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "1.5",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "2",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "2.5",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "3",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "3.5",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "4",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "4.5",
                "Count": 0,
                "State": item
            });
            bubbleChartData.push({
                "Name": "5",
                "Count": 0,
                "State": item
            });
        });
        axios.get(url).then((response) => {
            for (let i = 0; i < response.data.results.length; i++) {
                let item = response.data.results[i];
                if (item.stars && item.state)  {
                    for (let j = 0; j < bubbleChartData.length; j++) {
                        let bubbleChartItem = bubbleChartData[j];
                        if (bubbleChartItem["State"] == item.state) {
                            switch(item.stars) {
                                case "1":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "1.5":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "2":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "2.5":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "3":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "3.5":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "4":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "4.5":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                case "5":
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                                break;
                                default:
                                    bubbleChartData[j]['Count'] = bubbleChartData[j]['Count'] + 1;
                            }
                        }
                    }
                    
                }
                else {
                        
                }
            }
            this.drawChart({ "children": bubbleChartData}, "#ratings-chart");
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {

        });
    }
    return (
        <div className="container p-0">
            <div className="row view-container">
                <div className="col-md cuisine-filter chart-filters">
                        <CuisineDropdown onCuisineSelect={this.onCuisineSelect.bind(this)}/>
                </div>
                {this.state.selectedCuisines.length ? (
                        <div className="col-md state-filter chart-filters">
                           <StateDropdown isMultiSelect="true" onStateSelect={this.onStateSelect.bind(this)}/>
                        </div>
                    ): (null)
                 }

            </div>
            <div className="row">
                <div className="col-md w-100" id="ratings-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(RatingCharts), domContainer);