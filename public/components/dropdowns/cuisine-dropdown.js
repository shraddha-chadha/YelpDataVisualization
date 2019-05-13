'use strict';
const e = React.createElement;
class CuisineDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        isMultiSelect: false,
        isOpen: false,
        searchText: '',
        selectedCuisines: [],
        searchResults: [],
        cuisines: [
            "American (New)",
            "American (Traditional)",
            "Asian Fusion",
            "Bakeries",
            "Barbeque",
            "Bars",
            "Breakfast & Brunch",
            "Burgers",
            "Buffets",
            "Cafes",
            "Chinese",
            "Canadian (New)",
            "Caribbean",
            "Desserts",
            "Fast Food",
            "Fish & Chips",
            "French",
            "Indian",
            "Italian",
            "Japanese",
            "Korean",
            "Mexican",
            "Mediterranean",
            "Modern European",
            "Persian/Iranian",
            "Pizza",
            "Sandwiches",
            "Steakhouses",
            "Sushi Bars",
            "Thai",
            "Vietnamese"
            ]
        };
  }

  componentDidMount() {
     this.setState({
        searchResults: this.state.cuisines
    });
  }

  /**
    Function that returns the label of the dropdown
   */
  getDropdownSelectionLabel() {
     return this.state.selectedCuisines.join(',') || 'Select Cuisines';
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
        let updatedList = this.state.cuisines.filter(function(item) {
            var cuisine = item.toLowerCase(),
                filter = event.target.value.toLowerCase();
            return cuisine.includes(filter);
        });
        this.setState({
            searchText: event.target.value,
            searchResults: updatedList
        });
  }

  /**
    Function to add or remove state from the selected states array
   */
  addOrRemoveCuisine(event) {
        var cuisineValue = event.target.textContent,
            indexOfCuisine = this.state.selectedCuisines.indexOf(cuisineValue);

        this.state.searchText = '';
        if (indexOfCuisine > -1) {
                this.state.selectedCuisines.splice(indexOfCuisine, 1)
                this.setState({
                    selectedCuisines: this.state.selectedCuisines
                });
        }
        else {
            // for single select, the selectedCuisines can have only one entry
            if (!this.props.isMultiSelect && this.state.selectedCuisines.length) {
                this.state.selectedCuisines.pop();
                this.state.selectedCuisines.push(cuisineValue);
                this.setState({
                    selectedCuisines: this.state.selectedCuisines
                });
            }
            else { // IF MULTI SELECT, array length can be more that 1
                this.state.selectedCuisines.push(cuisineValue);
                this.setState({
                    selectedCuisines: this.state.selectedCuisines
                });
            }
        }
        this.props.onCuisineSelect(this.state.selectedCuisines);
  }

  /**
    React's function to render the DOM
   */
  render() {
       let cuisineList, selectedList;
        cuisineList = this.state.searchResults.map((cuisine) => {
            if (this.state.selectedCuisines.indexOf(cuisine) < 0) {
                return (
                    <div key={cuisine} onClick={this.addOrRemoveCuisine.bind(this)} className="dropdown-item">
                            {cuisine}
                    </div>
                );
            }
            else {
                return null;
            }
        });

        selectedList = this.state.selectedCuisines.map((cuisine) => {
            return (
                    <div key={cuisine} onClick={this.addOrRemoveCuisine.bind(this)} className="active dropdown-item">
                            {cuisine}
                    </div>
                );
        });

        // HTML
        return (
                <div className="state-dropdown react-dropdown position-relative dropdown" className={this.state.isOpen ? 'active dropdown' : 'dropdown'}>
                    <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="cuisineDropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.getDropdownSelectionLabel()}
                    </button>
                    <div className="dropdown-menu position-absolute w-100" aria-labelledby="cuisineDropdownMenuButton">
                        <div className="p-2">
                            <input type="text" placeholder="Search Cuisines" className="form-control" onChange={this.searchList.bind(this)}/>
                        </div>
                        <h6 className="p-2">Selected Cuisines</h6>
                        {selectedList}
                        <hr></hr>
                        {cuisineList}
                    </div>
                </div>
        );
  }
}