'use strict';
const selector = '#price-charts';
const e = React.createElement;

class PriceCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [],
        selectedCuisines: [],
        selectedCities: []
    }
  }

  drawGroupBarChart(data, selector) {
      $(selector).empty();
     var models = data;
     var max = 0;
    models = models.map((i) => {
        i.model_name = i.model_name;
        if (Math.max(i.field1, i.field2, i.field3, i.field4, i.field5) > max)  {
            max = Math.max(i.field1, i.field2, i.field3, i.field4, i.field5);
        }
        return i;
    });
    console.log('max', max);
    var container = d3.select(selector),
        width = 500,
        height = 500,
        margin = {top: 30, right: 20, bottom: 30, left: 50},
        barPadding = .2,
        axisTicks = {qty: 5, outerSize: 0};

        var svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
        var xScale1 = d3.scaleBand();
        var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

        var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
        var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

        xScale0.domain(models.map(d => d.model_name));
        xScale1.domain(['field1', 'field2', 'field3', 'field4', 'field5']).range([0, xScale0.bandwidth()]);
        yScale.domain([0, max]);

        var model_name = svg.selectAll(".model_name")
        .data(models)
        .enter().append("g")
        .attr("class", "model_name")
        .attr("transform", d => `translate(${xScale0(d.model_name)},0)`);

        /* Add field1 bars */
        model_name.selectAll(".bar.field1")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field1")
        .style("fill","#0984e3")
        .attr("x", d => xScale1('field1'))
        .attr("y", d => yScale(d.field1))
        .attr("width", xScale1.bandwidth())
        .transition()
        .duration(2000)
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field1)
        });

        /* Add field2 bars */
        model_name.selectAll(".bar.field2")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field2")
        .style("fill","#d63031")
        .attr("x", d => xScale1('field2'))
        .attr("y", d => yScale(d.field2))
        .attr("width", xScale1.bandwidth())
        .transition()
        .duration(2000)
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field2)
        });

        /* Add field3 bars */
        model_name.selectAll(".bar.field3")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field3")
        .transition()
        .duration(2000)
        .style("fill","#00b894")
        .attr("x", d => xScale1('field3'))
        .attr("y", d => yScale(d.field3))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field3)
        });

        /* Add field4 bars */
        model_name.selectAll(".bar.field4")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field2")
        .transition()
        .duration(2000)
        .style("fill","#e17055")
        .attr("x", d => xScale1('field4'))
        .attr("y", d => yScale(d.field4))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field4)
        });

        /* Add field5 bars */
        model_name.selectAll(".bar.field5")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar field5")
        .transition()
        .duration(2000)
        .style("fill","grey")
        .attr("x", d => xScale1('field5'))
        .attr("y", d => yScale(d.field5))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.field5)
        });

        // Add the X Axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis);

        // Add the Y Axis
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

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

    drawGoogleMap(data) {
        let height = 500;
        let width = $("#map-chart").width();
        $("#map-chart").empty();
        let markers = '';
        for (let i = 0; i < data.length; i++) {
            markers = markers + '&markers=color:red%7Clabel:R%7C' + data[i]['latitude'] + ',' + data[i]['longitude'];
        }
        $("#map-chart").append(`
        <img src="https://maps.googleapis.com/maps/api/staticmap?&size=`+ width +`x500&maptype=roadmap
`+ markers + `
&key=AIzaSyAecin5AcxwhVi7R_E6mCXXd_WLtVVXwps"/>`)
    }

  render() {
      if (this.state.selectedStates.length && this.state.selectedCities.length && this.state.selectedCuisines.length) {
          let url = '/api/restaurants';
          url = url + '?state=' + this.state.selectedStates.join(',');
          url = url + '&city=' + this.state.selectedCities.join(',');
          url = url + '&cuisine=' + this.state.selectedCuisines.join(',');
          axios.get(url).then((response) => {
            let groupBarChartData = [];
            this.state.selectedCuisines.map((cuisine) => {
                let barChartItem = {
                    'model_name': cuisine,
                    'field1': 0,
                    'field2': 0,
                    'field3': 0,
                    'field4': 0,
                    'field5': 0,
                }
                response.data.results.map((item) => {
                    // {state: '', $: 1, $$: 15, $$$: 16, $$$$: 234, ? : 33434}
                    // { 'state': 'Mexican', $: 1, $$: 15, $$$: 16, $$$$: 234, ? : 33434 }
                    let pattern = '/' + cuisine + '/g';
                    console.log(item.categories.match(pattern));
                    if (item.attributes && item.attributes.RestaurantsPriceRange2 !== undefined) {
                        console.log("priceRange", item.attributes.RestaurantsPriceRange2);
                        switch(item.attributes.RestaurantsPriceRange2) {
                            case "1":
                                barChartItem["field1"] = barChartItem["field1"] + 1;
                            break;
                            case "2":
                                barChartItem["field2"] = barChartItem["field2"] + 1;
                            break;
                            case "3":
                                barChartItem["field3"] = barChartItem["field3"] + 1;
                            break;
                            case "4":
                                barChartItem["field4"] = barChartItem["field4"] + 1;
                            break;
                            default:
                                barChartItem["field5"] = barChartItem["field5"] + 1;
                            break;
                        }
                    }
                    else if (item.categories.match(pattern)){
                        barChartItem["field5"] = barChartItem["field5"] + 1;
                    }
                });
                groupBarChartData.push(barChartItem);
            });
             this.drawGroupBarChart(groupBarChartData, '#price-chart');
             this.drawGoogleMap(response.data.results);
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
                           <CityDropdown isMultiSelect="true" stateName={this.state.selectedStates[0]} onCitySelect={this.onCitySelect.bind(this)}/>
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
                <div className="col-md-6 w-100" id="price-chart"></div>
                <div className="col-md-6 w-100" id="map-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(PriceCharts), domContainer);