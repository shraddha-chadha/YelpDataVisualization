'use strict';
const e = React.createElement;

class StateDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: false,
        isOpen: false,
        searchText: '',
        selectedStates: [],
        searchResults: [],
        states: [
                "AZ",
                "NC",
                "ON",
                "PA",
                "NV",
                "AB",
                "OH",
                "QC",
                "WI",
                "IL",
                "NY",
                "SC",
                "NM",
                "VA",
                "NE",
                "CA",
                "WA",
                "XWY",
                "CON",
                "TX",
                "BC",
                "VT",
                "XGM",
                "AR",
                "FL",
                "AL"
            ]
        };
  }

  componentDidMount() {
      this.setState({
          searchResults: this.state.states
      });
  }

 /**
  * Function to add state to selected state array
  */
  selectState(state) {
        let selectedStates = this.state.selectedStates;
        selectedStates.push(state);
        this.setState({
            selectedStates: selectedStates
        });
  }

  /**
    Function that returns the label of the dropdown
   */
  getDropdownSelectionLabel() {
        if (this.state.selectedStates.length) {
            return this.state.selectedStates.split(',');
        }
        else {
            return 'Select State';
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
        let updatedList = this.state.states.filter(function(item) {
            var state = item.toLowerCase(),
                filter = event.target.value.toLowerCase();
                console.log("state", state + ' filter: ' + filter + ' result: ' + state.includes(filter));
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
      var stateValue = event.target.value,
           indexOfState = this.state.selectedStates.indexOf(stateValue);
      if (indexOfState > -1) {
            this.setState({
                selectedStates: this.state.selectedStates.splice(indexOfState, 1)
            });
      }
      else {
            this.setState({
                selectedStates: this.state.selectedStates.push(stateValue)
            });
      }
  }

  /**
    React's function to render the DOM
   */
  render() {
       let stateList;
        stateList = this.state.searchResults.map((state) => {
                return (
                    <li key={state}
                        onClick={this.addOrRemoveState.bind(this)}
                        className={this.state.selectedStates.indexOf(state.toUpperCase()) > -1 ? 'active' : ''}>
                            <span>{state}</span>
                    </li>
                );
        });

        // HTML
        return (
                <div className="state-dropdown react-dropdown" className={this.state.isOpen ? 'active dropdown' : 'dropdown'}>
                    <div className="dropdown-label" onClick={this.toggleDropdown.bind(this)}>
                        <span>{this.getDropdownSelectionLabel}</span>
                        <input type="text" placeholder="Select State" onChange={this.searchList.bind(this)}/>
                    </div>
                    <ul placeholder="Select State" className="dropdown">
                        {stateList}
                    </ul>
                </div>
        );
  }
}