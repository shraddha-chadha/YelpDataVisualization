'use strict';
const selector = '#feature-charts';
const e = React.createElement;

class FeatureCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [],
        selectedCities: [],
        selectedCuisines: []
    }
  }

  drawChart(state) {
      console.log('Draw chart!!');
  }

  getStates() {
    return this.state.states.map(function (state) {
        return <option key={state}>{state}</option>
    })
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
                <div className="col-md w-100" id="cuisine-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(FeatureCharts), domContainer);