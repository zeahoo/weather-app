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

    var location = encodeURIComponent(this.props.location);

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
    if (this.props.data.list) {
      currentTemp = this.props.data.list[0].main.temp;
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
                value={this.props.location}
                onChange={this.changeLocation} />
          </label>
        </form>

        {(this.props.data.list) ? (
          <div className="wrapper">
            {/* Render the current temperature if no specific date is selected */}
            {(this.props.selected.temp) ? (
              <p>The temperature on { this.props.selected.date } will be { this.props.selected.temp }°C</p>
            ) : (
              <p>The current temperature is { currentTemp }°C!</p>
            )}
            <h2>Forecast</h2>
            <Plot
              xData={this.props.dates}
              yData={this.props.temps}
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
  return state;
}
export default connect(mapStateToProps)(App);
