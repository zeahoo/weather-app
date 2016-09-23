import React from 'react';
import './App.css';
import { connect } from 'react-redux';
// import xhr from 'xhr';
import Plot from './Plot.js';
import {
  changeLocation,
  setSelectedDate,
  setSelectedTemp,
  fetchData
} from './actions';
class App extends React.Component {
  fetchData= (evt) => {
    evt.preventDefault();

    var location = encodeURIComponent(this.props.redux.get('location'));

    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=56d8c90d7d558c38332d7f929436617a&units=metric';
    var url = urlPrefix + location + urlSuffix;

    this.props.dispatch(fetchData(url));
  };

  changeLocation = (evt) => {
    this.props.dispatch(changeLocation(evt.target.value));
  };
  onPlotClick = (data) =>{
    if(data.points){
      this.props.dispatch(setSelectedDate(data.points[0].x));
      this.props.dispatch(setSelectedTemp(data.points[0].y));
    }
  };
  render() {
    var currentTemp = 'not loaded yet';
    if (this.props.redux.getIn(['data','list'])) {
      currentTemp = this.props.redux.getIn(['data', 'list', '0', 'main', 'temp']);
    }
    return (
      <div>
        <h1>Weather</h1>
        <form onSubmit={this.fetchData}>
          <label>
            I want to know the weather for
              <input
                placeholder={"City, Country"}
                type="text"
                value={this.props.redux.get('location')}
                onChange={this.changeLocation} />
          </label>
        </form>

        {(this.props.redux.getIn(['data', 'list'])) ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            {(this.props.redux.getIn(['selected', 'temp'])) ? (
              <p>The temperature on { this.props.redux.getIn(['selected', 'date']) } will be { this.props.redux.getIn(['selected', 'temp']) }°C</p>
            ) : (
              <p>The current temperature is { currentTemp }°C!</p>
            )}
            <h2>Forecast</h2>
            <Plot
              xData={this.props.redux.get('dates')}
              yData={this.props.redux.get('temps')}
              onPlotClick={this.onPlotClick}
              type="scatter"
               />
          </div>
        ) : null}


      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    redux: state
  };
}
export default connect(mapStateToProps)(App);
