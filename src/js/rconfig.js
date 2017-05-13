require.config({
  paths: {
    angular: '../../node_modules/angular/angular',
    'angular-resource': '../../node_modules/angular-resource/angular-resource',
    'angular-messages': '../../node_modules/angular-messages/angular-messages',
    'angular-ui-router': '../../node_modules/angular-ui-router/release/angular-ui-router',
    'angular-ui-bootstrap': '../../node_modules/angular-ui-bootstrap/dist/ui-bootstrap',
    'angular-ui-bootstrap-tpls': '../../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls',
    'angular-animate': '../../node_modules/angular-animate/angular-animate',
    'angular-touch': '../../node_modules/angular-touch/angular-touch',

    jquery: '../../node_modules/jquery/dist/jquery.min',
    lodash: '../../node_modules/lodash/lodash',
    moment: '../../node_modules/moment/moment',
    'datatables.net': '../../node_modules/datatables.net/js/jquery.dataTables',
    oclazyload: '../../node_modules/oclazyload/dist/ocLazyLoad.require',


    // modules
    tandaSDK: './tandaSDK/module',
    tandaApp: './tandaApp/module',
    punctualWidget: './punctualWidget/module'
  },
  shim: {
    angular: {
      exports: 'angular',
      deps: ['jquery']
    },
    jquery: {
      exports: '$'
    },
    oclazyload: ['angular'],
    'angular-resource': ['angular'],
    'angular-messages': ['angular'],
    'angular-ui-router': ['angular'],
    'angular-ui-bootstrap': ['angular-touch', 'angular-animate'],
    'angular-touch': ['angular'],
    'angular-animate': ['angular'],
    'angular-ui-bootstrap-tpls': ['angular-ui-bootstrap', 'angular'],
    'datatables.net': ['angular', 'jquery']
  }
});

require(['js/app.js']);
