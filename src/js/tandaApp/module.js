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
    $urlRouterProvider,
    $ocLazyLoadProvider
  ) => {
    $stateProvider
    .state('app', {
      abstract: true,
      url: '/',
      views: {
        app: {
          templateUrl: './tandaApp/views/index.html'
        },
        'navbar@app': {
          templateUrl: './tandaApp/templates/nav.tpl.html',
          controller: 'navCtrl'
        }
      },
      resolve: {
        deps: ($ocLazyLoad) => {
          $ocLazyLoad.load([
            './tandaApp/controllers/nav.ctrl.js'
          ])
        }
      }
    });

    $urlRouterProvider.otherwise('/');
  });

  return tandaApp;
});