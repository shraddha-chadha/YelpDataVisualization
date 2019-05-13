'use strict';
const selector = '#state-charts';
const e = React.createElement;

class StateCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCuisines: [],
        selectedStates: [],
        selectedCities: []
    }
  }

  drawChart(data, selector) {
    $(selector).empty();

    let state = selector.split('-')[2];

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

    // format the data
    data.forEach(function(d) {
        d.count = +d.Count;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.Name; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); })
        .transition()
        .duration(2000)
        .style('fill', '#0984e3');

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

      svg.append('g')
      .attr("transform", "translate(200, 480)")
      .append('text')
      .text(state)
      .style('fill', 'red')
      .style('font-size', '12px');
  }

  onCitySelect(cityList) {
      this.setState({
          selectedCities: cityList
      });
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

  drawStateWiseChart(state) {
        let stateDocumentSelector = "#state-chart-" + state;
        $(stateDocumentSelector).remove();
        if (!this.state.selectedCuisines.length) {
            return;
        }
        $("#states-chart").append('<div class="col-md-6" id="state-chart-' + state + '">Loading...</div>')
        let url = '/api/restaurants';
        url = url + '?state=' + state;
        url = url + '&cuisine' + this.state.selectedCuisines.join(',');
        axios.get(url).then((response) => {
            let chartData = [];
            console.log(response.data);
            chartData = response.data.validCategories.filter((item) => {
                return this.state.selectedCuisines.indexOf(item.Name) > -1;
            });
            this.drawChart(chartData, stateDocumentSelector);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {

        });
  }

  render() {
    return (
        <div className="container p-0">
            <div className="row view-container">
                <div className="col-md state-filter chart-filters">
                    <StateDropdown isMultiSelect="true" onStateSelect={this.onStateSelect.bind(this)}/>
               </div>

                 {this.state.selectedStates.length ? (
                        <div className="col-md cuisine-filter chart-filters">
                           <CuisineDropdown isMultiSelect="true" onCuisineSelect={this.onCuisineSelect.bind(this)}/>
                        </div>
                    ): (null)
                 }
            </div>
            <div className="container">
                <div className="row" id="states-chart">
                    {this.state.selectedStates.map((item) => {
                        this.drawStateWiseChart(item);
                    })
                    }
                </div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(StateCharts), domContainer);