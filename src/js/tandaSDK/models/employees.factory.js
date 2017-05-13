define([
  'angular',
  'tandaSDK'
], (angular) => {
  angular
  .module('tandaSDK')
  .factory('Employee', ($resource, $apiEndpoint) => {
    const url = `${$apiEndpoint}/roster/:date`;
    const Employee = $resource(url, {
      date: '@date'
    });

    return Employee;
  });
});
