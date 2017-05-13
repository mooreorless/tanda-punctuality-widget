define([
  'angular',
  'tandaSDK'
], (angular) => {
  angular
  .module('tandaSDK')
  .factory('Employees', ($resource, $apiEndpoint) => {
    const url = `${$apiEndpoint}/roster/:date`;
    const Employee = $resource(url, {
      date: '@date'
    }, {
      roster: {
        url: `${$apiEndpoint}/roster/:date`,
        method: 'GET',
        isArray: true,
        params: {
          date: '@date'
        }
      }
    });

    return Employee;
  });
});
