'use strict';
const e = React.createElement;
class CityDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        isOpen: false,
        searchText: '',
        selectedCities: [],
        searchResults: [],
        cities: []
        };
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.stateName == this.props.stateName) { // nothing to change
          return;
      }
      axios.get('/api/city?state=' + nextProps.stateName)
        .then((response) => {
            this.setState({
                cities: response.data,
                searchResults: response.data,
                isLoading: false
            });
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
        .finally(() => {
            this.setState({
                isLoading: false
            });
        });
  }

  /**
    Initialize component hook
   */
  componentDidMount() {
    axios.get('/api/city?state=' + this.props.stateName)
        .then((response) => {
            this.setState({
                cities: response.data,
                searchResults: response.data,
                isLoading: false
            });
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
        .finally(() => {
            this.setState({
                isLoading: false
            });
        });
  }

  /**
    Function that returns the label of the dropdown
   */
  getDropdownSelectionLabel() {
      if (this.state.isLoading) { // wait for API to complete
          return 'Loading...'
      }
      else {
          return this.state.selectedCities.join(',') || 'Select Cities';
      }
  }

  /**
    Function to toggle the dropdown
   */
  toggleDropdown() {
        this.setState({
              isOpen: !this.state.isOpen,
              searchText: ''
        });
  }

  /**
    Function to search
   */
  searchList(event) {
        let updatedList = this.state.cities.filter(function(item) {
            var city = item.toLowerCase(),
                filter = event.target.value.toLowerCase();
            return city.includes(filter);
        });
        console.log("searchResults: ", updatedList);
        this.setState({
            searchText: event.target.value,
            searchResults: updatedList
        });
  }

  /**
    Function to add or remove state from the selected states array
   */
  addOrRemoveCity(event) {
      var cityValue = event.target.textContent,
           indexOfCity = this.state.selectedCities.indexOf(cityValue);

      this.state.searchText = '';
      if (indexOfCity > -1) {
            this.setState({
                selectedCities: this.state.selectedCities.splice(indexOfCity, 1)
            });
      }
      else {
          // for single select, the selectedCuisines can have only one entry
            if (!this.props.isMultiSelect && this.state.selectedCities.length) {
                this.state.selectedCities.pop();
                this.state.selectedCities.push(cityValue);
                this.setState({
                    selectedCities: this.state.selectedCities
                });
            }
            else { // IF MULTI SELECT, array length can be more that 1
                this.state.selectedCities.push(cityValue);
                this.setState({
                    selectedCities: this.state.selectedCities
                });
            }
      }
      this.props.onCitySelect(this.state.selectedCities);
  }

  /**
    React's function to render the DOM
   */
  render() {
       let cityList, selectedList;
        cityList = this.state.searchResults.map((city) => {
            if (this.state.selectedCities.indexOf(city) < 0) {
                return (
                    <div key={city} onClick={this.addOrRemoveCity.bind(this)} className="dropdown-item">
                            {city}
                    </div>
                );
            }
            else {
                return null;
            }
        });

        selectedList = this.state.selectedCities.map((city) => {
            return (
                    <div key={city} onClick={this.addOrRemoveCity.bind(this)} className="active dropdown-item">
                            {city}
                    </div>
                );
        });

        // HTML
        return (
                <div className="city-dropdown react-dropdown position-relative dropdown" className={this.state.isOpen ? 'active dropdown' : 'dropdown'}>
                    <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="cityDropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.getDropdownSelectionLabel()}
                    </button>
                    <div className="dropdown-menu position-absolute w-100" aria-labelledby="cityDropdownMenuButton">
                        <div className="p-2">
                            <input type="text" placeholder="Search Cities" className="form-control" onChange={this.searchList.bind(this)}/>
                        </div>
                        <h6 className="p-2">Selected Cities</h6>
                        {selectedList}
                        <div class="dropdown-divider"></div>
                        {cityList}
                    </div>
                </div>
        );
  }
}