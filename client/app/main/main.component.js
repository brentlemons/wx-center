import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  readings = [];
  newThing = '';
  options = {
    elements: { line: {fill: false, tension: 0}},
    fill: false,
    responsive: true,
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        time: {
          unit: 'hour'
        }
      }],
      yAxes: [
        {
          id: 'left-y-axis',
          type: 'linear',
          position: 'left'
        },
        {
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          ticks: {
            min: 0,
            max: 100
          }
        }
      ]
    }
  };
  datasetOverride = [{yAxisID: 'left-y-axis'}, {yAxisID: 'right-y-axis'}]

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/readings?hours=24')
      .then(response => {
        this.readings = response.data.map(reading => ({
          _id: reading._id,
          device: reading.device,
          timestamp: reading.timestamp,
          temperature: reading.temperature,
          dewPoint: 243.04*(Math.log(reading.humidity/100.0)+((17.625*reading.temperature)/(243.04+reading.temperature)))/(17.625-Math.log(reading.humidity/100.0)-((17.625*reading.temperature)/(243.04+reading.temperature))),
          humidity: reading.humidity
        }));
        //this.socket.syncUpdates('reading', this.readings);
        this.labels = response.data.map(reading => reading.timestamp);
        var temperature = response.data.map(reading => reading.temperature);
        var humidity = response.data.map(reading => reading.humidity);
        this.data = [temperature,humidity];
        // this.data = response.data.map(reading => ({
        //   x: reading.timestamp,
        //   y: reading.temperature
        // }));
        console.log(this.data);
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }

  // $scope.onClick = function (points, evt) {
  //   console.log(points, evt);
  // };

}

export default angular.module('wxCenterApp.main', [uiRouter, 'chart.js'])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
