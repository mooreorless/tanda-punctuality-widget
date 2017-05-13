define([
  'angular'
], (angular) => {
  angular
  .module('tandaApp')
  .controller('MainCtrl', (
    $scope,
    $window
  ) => {
    $scope.welcome = 'Welcome to the Punctuality Widget';
  });
});
