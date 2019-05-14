'use strict';
const CancelToken = axios.CancelToken;
let pendingAPI = [];
const selector = '#cuisine-charts';
const e = React.createElement;

class CuisineCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedCuisines: [],
        selectedStates: [],
        selectedCities: [],
        token: 0
    }
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
            .attr("className", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("className", "node")
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

  initMap(data) {

        var map = new google.maps.Map(document.getElementById('map-chart'), {
            zoom: 10,
            center: {"lat": data[0].latitude, "lng":data[0].longitude},
        });

        data.forEach((item) => {
            var contentString = '<div id="map-content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h6 id="firstHeading" class="firstHeading">'+ item.name+ '</h6>'+
                '<div id="bodyContent">'+
                // WRITE BODY
                '<p>Stars: ' + item.stars + '</p>' +
                '<p>City: ' + item.city + '</p>' +
                '<p>State: ' + item.state + '</p>' +
                '<p>Reviews: ' + item.review_count + '</p>' +
                '</div>'+
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new google.maps.Marker({
                position: {"lat": item.latitude, "lng":item.longitude},
                map: map,
                title: 'Uluru (Ayers Rock)'
            });
            marker.addListener('mouseover', function() {
                infowindow.open(map, marker);
            });
            marker.addListener('mouseout', function() {
                infowindow.close(map, marker);
            });
        });
    }

  drawGoogleMap(data, selector) {
        $(selector).empty();
        let height = 500 - 20;
        let width = $(selector).width();
        let markers = '';
        for (let i = 0; i < data.length; i++) {
            markers = markers + '&markers=color:red%7Clabel:R%7C' + data[i]['latitude'] + ',' + data[i]['longitude'];
        }
        $(selector).append(`<img src="https://maps.googleapis.com/maps/api/staticmap?&size=`+ width + `x400&maptype=roadmap` + markers + `&key=AIzaSyAecin5AcxwhVi7R_E6mCXXd_WLtVVXwps"/>`);

        this.initMap(data);
    }

 onCuisineSelect(cuisineList) {
     let number_pending_api = pendingAPI.length;
     if(number_pending_api > 0) {
         // Cancel all
         for(let i=number_pending_api-1; i >= 0; i--) {
             pendingAPI[i].cancel("Cancelled the previous API calls by the user");
             pendingAPI.pop()
         }
     }
     this.setState({
         selectedCuisines: cuisineList,
         token: CancelToken.source()
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

 drawAllCharts(response) {
     let bubbleData = {
           "children": response.data.validCategories.filter((item) => {
               return this.state.selectedCuisines.indexOf(item.Name) > -1;
           })
     };
     this.drawBubbleChart(bubbleData, "#cuisine-chart-1");
     this.drawGoogleMap(response.data.results, "#map-chart");
 }

  render() {
    // when all filters are set
      if (this.state.selectedCuisines.length && this.state.selectedStates.length && this.state.selectedCities.length) {
          $("#cuisine-chart-1").html('Loading...');
            let token = this.state.token;
            pendingAPI.push(token);
            let url = '/api/restaurants';
            url = url + '?state=' + this.state.selectedStates.join(',');
            url = url + '&city=' + this.state.selectedCities.join(',');
            url = url + '&cuisine=' + this.state.selectedCuisines.join(',');
            // URL EXAMPLE: /api/restaurants?state=AZ,ON&cuisine=Indian,Mexican&city=Scarborough,Mesa
            axios.get(url,
                {
                cancelToken: token.token
                }
            ).then((response) => {
                var index = pendingAPI.indexOf(token);
                if (index !== -1) {
                    pendingAPI.splice(index, 1);
                }
                if(response.data.count == 0) {
                    $("#cuisine-chart-1").html('No Data Available. Please try changing filters');
                } else {
                    this.drawAllCharts(response);
                }

            }).catch(function(thrown) {
                    if (axios.isCancel(thrown)) {
                        console.log('Request canceled', thrown.message);
                    }

                })
    }
    else {
        $("#cuisine-chart-1, #map-chart").empty();
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
                <div className="col-md-6 w-100 p-3" id="cuisine-chart-1"></div>
                <div className="col-md-6 w-100 p-3" id="map-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(CuisineCharts), domContainer);