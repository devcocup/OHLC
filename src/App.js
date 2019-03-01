import React, { Component } from 'react';
import './App.css';

// var CanvasJSReact = require('./canvasjs.react');
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&amp;symbol=MSFT&amp;outputsize=full&amp;apikey=G7IUI097Y5JNS5Z7';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data_point: []
    }
  }

  componentDidMount(){
    fetch(API_URL)
    .then(response => response.json())
    .then((data) => {
      const real_data = data['Time Series (Daily)'];
      const newData = Object.keys(real_data).reduce((result, currentKey) => {
        const value = real_data[currentKey]
        const tmp = {
          x: new Date(currentKey),
          y: [parseFloat(value['1. open']), parseFloat(value['2. high']), parseFloat(value['3. low']), parseFloat(value['4. close'])],
          color: parseFloat(value['1. open']) > parseFloat(value['4. close']) ? 'red' : 'green'
        }
        result.push(tmp);
        return result;
      }, [])

      console.log(newData)
      this.setState({
        data_point: newData.slice(0, 30)
      })
    })
  }

	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2",
			exportFileName: "MSFT-ohlc",
			title:{
				text: "Alpha Vantage - MSFT"
			},
			axisX: {
				interval:1,
				intervalType: "day",
				valueFormatString: "DD"
			},
			axisY: {
				includeZero:false,
				prefix: "$",
				title: "Price (in USD)"
			},
			data: [{
				type: "ohlc",
				yValueFormatString: "$###0.00",
				xValueFormatString: "YY/MM/DD",
				dataPoints: this.state.data_point
			}]
		}
		return (
      <div>
        <CanvasJSChart options = {options}
          onRef={ref => this.chart = ref}
        />
      </div>
		);
	}
}

export default App;