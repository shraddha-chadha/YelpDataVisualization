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
            this.state.selectedStates.splice(indexOfState, 1);
            console.log(this.state.selectedStates);
            this.setState({
                selectedStates: this.state.selectedStates.splice(indexOfState, 1)
            });
      }
      else {
            this.state.selectedStates.push(stateValue)
            this.setState({
                selectedStates: this.state.selectedStates
            });
      }
  }

  focusInCurrentTarget ({ relatedTarget, currentTarget }) {
    if (relatedTarget === null) return false;

    var node = relatedTarget.parentNode;

    while (node !== null) {
        if (node === currentTarget) return true;
        node = node.parentNode;
    }

    return false;
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
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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