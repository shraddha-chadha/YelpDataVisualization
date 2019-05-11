'use strict';

const e = React.createElement;

class RatingsByStateChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  drawChart(state) {
      console.log('Draw chart!!');
  }

  render() {
    console.log('React is doing its job...');
    this.drawChart();
    return e(
      'div'
    );
  }
}

const domContainer = document.querySelector('#ratings-chart-1');
ReactDOM.render(e(RatingsByStateChart), domContainer);