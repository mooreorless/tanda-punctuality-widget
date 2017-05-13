define([
  'angular',
  'angular-ui-router',
  'angular-resource',
  'oclazyload',
  'angular-bootstrap',
  'punctualWidget',
  'tandaSDK'
], (angular) => {
  const tandaApp = angular.module('tandaApp', [
    'ui.router',
    'ngResource',
    'oc.lazyLoad',
    'ui.bootstrap',
    'punctualWidget',
    'tandaSDK'
  ]);

  tandaApp
  .config((
    $stateProvider,
    $urlRouterProvider
  ) => {
    $stateProvider
    .state('app', {
      abstract: true,
      views: {
        app: {
          templateUrl: './js/tandaApp/views/index.html'
        }
      }
    })
    .state('app.main', {
      abstract: true,
      parent: 'app',
      controller: 'MainCtrl',
      views: {
        'navbar@app': {
          templateUrl: './js/tandaApp/templates/nav.tpl.html'
        }
      },
      resolve: {
        deps: ($ocLazyLoad) => {
          $ocLazyLoad.load([
            './dist/js/tandaApp/controllers/main.ctrl.js'
          ]);
        }
      }
    })
    .state('app.main.welcome', {
      url: '/welcome',
      parent: 'app.main',
      views: {
        'content@app': {
          templateUrl: './js/tandaApp/views/welcome/index.html'
        }
      }
    });

    $urlRouterProvider.otherwise('/welcome');
  });

  return tandaApp;
});
