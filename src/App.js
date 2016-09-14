import React, { Component } from 'react';
import './App.css';
import xhr from 'xhr';

import Plot from './Plot.js';
class App extends Component {
  state = {
    location: '',
    data: {},
    dates: [],
    temps: [],
    selected: {
      date: '',
      temp: null
    }
  };

  fetchData= (evt) => {
    evt.preventDefault();
    var location = encodeURIComponent(this.state.location);
    var urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
    var urlSuffix = '&APPID=56d8c90d7d558c38332d7f929436617a&units=metric';
    var url = urlPrefix + location + urlSuffix;

    var self = this;
    xhr({
      url: url
    }, function(err, data){
      var body = JSON.parse(data.body);
      var list = body.list;
      var dates = [];
      var temps = [];

      for(var i = 0; i < list.length; i++){
        dates.push(list[i].dt_txt);
        temps.push(list[i].main.temp);
      }
      self.setState({
        data: body,
        dates: dates,
        temps: temps,
        selected: {
          data: '',
          temp: null
        }
      });
    });
  };

  changeLocation = (evt) => {
    this.setState({
      location: evt.target.value
    });
  };
  onPlotClick = (data) =>{
    if(data.points){
      this.setState({
        selected: {
          date: data.points[0].x,
          temp: data.points[0].y
        }
      });
    }
  };
  render() {
    var currentTemp = 'not loaded yet';
    if(this.state.data.list){
      currentTemp = this.state.data.list[0].main.temp;
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
                value={this.state.location}
                onChange={this.changeLocation} />
          </label>
        </form>

        {(this.state.data.list) ? (
          <div className="wrapper">
            <p className="temp-wrapper">
              <span className="temp">
                {this.state.selected.temp ? this.state.selected.temp : currentTemp}
              </span>
              <span className="temp-symbol">°C</span>
              <span>
                {this.state.selected.temp ? this.state.selected.date : ''}
              </span>
            </p>
            <h2>Forecast</h2>
            <Plot
              xData={this.state.dates}
              yData={this.state.temps}
              onPlotClick={this.onPlotClick}
              type="scatter"
               />
          </div>
        ) : null}


      </div>
    );
  }
}

export default App;
