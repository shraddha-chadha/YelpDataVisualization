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

  drawChart(state) {
      console.log('Draw chart!!');
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

  render() {
    return (
        <div className="container">
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
                <div className="col-md w-100" id="price-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(PriceCharts), domContainer);