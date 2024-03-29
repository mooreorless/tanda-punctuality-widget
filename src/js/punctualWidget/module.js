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
    .state('app.main.employee', {
      url: '/employee/:id',
      views: {
        'content@app': {
          templateUrl: './js/punctualWidget/views/index.html',
          controller: 'EmployeeCtrl'
        }
      },
      resolve: {
        deps: $ocLazyLoad => $ocLazyLoad.load([
          './js/punctualWidget/controllers/employee.ctrl.js',
          './js/tandaSDK/models/employees.factory.js',
          './js/tandaApp/directives/dataTable.directive.js'
        ]),
        thisEmployee($stateParams) {
          return {
            name: 'Mike'
          };
        }
      }
    });
  });

  return module;
});
