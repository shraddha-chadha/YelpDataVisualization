'use strict';
const selector = '#checkin-charts';
const e = React.createElement;

class CheckingCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [],
        selectedCities: []
    }
  }

  drawChart(state) {
      console.log('Draw chart!!');
  }

  onCitySelect(cityList) {
      this.setState({
          selectedCities: cityList
      });
  }

  onStateSelect(stateList) {
      this.setState({
          selectedStates: stateList
      });
  }


drawTimeOfTheDayChart(data, selector) {
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 100, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
}

  render() {
      if (this.state.selectedStates.length && this.state.selectedCities.length) {
          let url = '/api/restaurants';
          url = url + '?state=' + this.state.selectedStates.join(',');
          url = url + '&city=' + this.state.selectedCities.join(',')
          axios.get(url).then((response) => {
              let timeOfTheDayData = [];
             this.drawTimeOfTheDayChart(timeOfTheDayData);
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
                    <div className="col-md cuisine-filter chart-filters">
                        <CityDropdown stateName={this.state.selectedStates[0]} onCitySelect={this.onCitySelect.bind(this)}/>
                    </div>
                ) : (null)}
            </div>
            <div className="row">
                <div className="col-md-6 w-100" id="checkins-chart-1"></div>
                <div className="col-md-6 w-100" id="checkins-chart-2"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(CheckingCharts), domContainer);