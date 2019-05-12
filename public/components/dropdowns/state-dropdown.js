'use strict';
const e = React.createElement;
class StateDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        isOpen: false,
        searchText: '',
        selectedStates: [],
        searchResults: [],
        states: []
        };
  }

  componentDidMount() {
      // Make a request for a user with a given ID
    axios.get('/api/state')
        .then((response) => {
            console.log(response);
            this.setState({
                states: response.data,
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
     return this.state.selectedStates.join(',') || 'Select States';
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
        let updatedList = this.state.states.filter(function(item) {
            var state = item.toLowerCase(),
                filter = event.target.value.toLowerCase();
            return state.includes(filter);
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
  addOrRemoveState(event) {
      var stateValue = event.target.textContent,
           indexOfState = this.state.selectedStates.indexOf(stateValue);

      this.state.searchText = '';
      if (indexOfState > -1) {
            this.setState({
                selectedStates: this.state.selectedStates.splice(indexOfState, 1)
            });
      }
      else {
          this.state.selectedStates.push(stateValue);
            this.setState({
                selectedStates: this.state.selectedStates
            });
      }
  }

  /**
    React's function to render the DOM
   */
  render() {
       let stateList, selectedList;
        stateList = this.state.searchResults.map((state) => {
            if (this.state.selectedStates.indexOf(state) < 0) {
                return (
                    <div key={state} onClick={this.addOrRemoveState.bind(this)} className="dropdown-item">
                            {state}
                    </div>
                );
            }
            else {
                return null;
            }
        });

        selectedList = this.state.selectedStates.map((state) => {
            return (
                    <div key={state} onClick={this.addOrRemoveState.bind(this)} className="active dropdown-item">
                            {state}
                    </div>
                );
        });

        // HTML
        return (
                <div className="state-dropdown react-dropdown position-relative dropdown" className={this.state.isOpen ? 'active dropdown' : 'dropdown'}>
                    <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.getDropdownSelectionLabel()}
                    </button>
                    <div className="dropdown-menu position-absolute w-100" aria-labelledby="dropdownMenuButton">
                        <div className="p-2">
                            <input type="text" placeholder="Search States" className="form-control" onChange={this.searchList.bind(this)}/>
                        </div>
                        <h6 className="p-2">Selected States</h6>
                        {selectedList}
                        <hr></hr>
                        {stateList}
                    </div>
                </div>
        );
  }
}