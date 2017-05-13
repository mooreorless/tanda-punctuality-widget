define([
  'angular',
  'angular-resource'
], (angular) => {
  const tandaSDK = angular.module('tandaSDK', [
    'ngResource'
  ]);
  tandaSDK.constant('$apiEndpoint', 'http://localhost:4567');

  return tandaSDK;
});
