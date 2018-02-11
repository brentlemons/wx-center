import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  readings = [];
  newThing = '';
  options = {
    elements:{ line: {fill:false}},
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
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/readings?hours=3')
      .then(response => {
        this.readings = response.data;
        //this.socket.syncUpdates('reading', this.readings);
        this.labels = response.data.map(reading => {
          return reading.timestamp;
        });
        this.data = response.data.map(reading => {
          return {
            x: reading.timestamp,
            y: reading.temperature
          }
        });
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
