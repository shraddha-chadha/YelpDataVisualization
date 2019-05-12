'use strict';
const e = React.createElement;
class citiesDropdown extends React.Component {

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

  componentDidMount() {
      // Make a request for a user with a given ID
    axios.get('/api/state')
        .then((response) => {
            console.log(response);
            this.setState({
                cities: response.data,
                searchResults: response.data
            })
        })
        .catch((error) => {
            // handle error
            console.log(error);
        })
        .finally(() => {
            this.setState({
                isLoading: false
            })
        });
  }

  /**
    Function that returns the label of the dropdown
   */
  getDropdownSelectionLabel() {
     return this.state.selectedCities.join(',') || 'Select cities';
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
            var cities = item.toLowerCase(),
                filter = event.target.value.toLowerCase();
            return cities.includes(filter);
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
  addOrRemoveCities(event) {
      var citiesValue = event.target.textContent,
           indexOfcities = this.state.selectedCities.indexOf(citiesValue);

      this.state.searchText = '';
      if (indexOfState > -1) {
            this.setState({
                selectedCities: this.state.selectedCities.splice(indexOfcities, 1)
            });
      }
      else {
          this.state.selectedCities.push(citiesValue);
            this.setState({
                selectedCities: this.state.selectedCities
            });
      }
  }

  /**
    React's function to render the DOM
   */
  render() {
       let citiesList, selectedList;
        citiesList = this.state.searchResults.map((cities) => {
            if (this.state.selectedCities.indexOf(cities) < 0) {
                return (
                    <div key={cities} onClick={this.addOrRemoveCities.bind(this)} className="dropdown-item">
                            {cities}
                    </div>
                );
            }
            else {
                return null;
            }
        });

        selectedList = this.state.selectedCities.map((cities) => {
            return (
                    <div key={cities} onClick={this.addOrRemoveCities.bind(this)} className="active dropdown-item">
                            {cities}
                    </div>
                );
        });

        // HTML
        return (
                <div className="state-dropdown react-dropdown position-relative dropdown" className={this.state.isOpen ? 'active dropdown' : 'dropdown'}>
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="citiesDropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.getDropdownSelectionLabel()}
                    </button>
                    <div className="dropdown-menu position-absolute w-100" aria-labelledby="citiesDropdownMenuButton">
                        <div className="p-2">
                            <input type="text" placeholder="Search cities" className="form-control" onChange={this.searchList.bind(this)}/>
                        </div>
                        <h6 className="p-2">Selected cities</h6>
                        {selectedList}
                        <hr></hr>
                        {citiesList}
                    </div>
                </div>
        );
  }
}