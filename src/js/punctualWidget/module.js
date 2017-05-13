define([
  'angular',
  'angular-ui-router',
  'oclazyload',
  'tandaSDK'
], (angular) => {
  const module = angular.module('punctualWidget', [
    'oc.lazyLoad',
    'ui.router',
    'tandaSDK'
  ]);

  module.config(($stateProvider) => {
    $stateProvider
    .state('app.main.punctuality', {
      url: '/employee/punctuality',
      views: {
        'content@app': {
          templateUrl: './js/punctualWidget/views/index.html',
          controller: 'EmployeeCtrl'
        }
      },
      resolve: {
        deps: $oclazyLoad => $oclazyLoad.load([
          './dist/js/punctualWidget/controllers/employee.ctrl.js',
          './dist/js/tandaSDK/models/employees.factory.js'
          // './dist/js/tandaApp/directives/datatables.directive.js'
        ])
      }
    });
  });

  return module;
});
