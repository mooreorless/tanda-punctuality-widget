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
      getRoster: {
        url: `${$apiEndpoint}/roster/:date`,
        method: 'GET',
        isArray: true,
        params: {
          date: '@date'
        }
      },
      getAllRosters: {
        url: `${$apiEndpoint}/rosters/:from/:to`,
        method: 'GET',
        isArray: true,
        params: {
          from: '@from',
          to: '@to'
        }
      },
      getShift: {
        url: `${$apiEndpoint}/shift/:date`,
        method: 'GET',
        isArray: true,
        params: {
          date: '@date'
        }
      },
      getAllShifts: {
        url: `${$apiEndpoint}/shifts/:from/:to`,
        method: 'GET',
        isArray: true,
        params: {
          from: '@from',
          to: '@to'
        }
      }
    });

    return Employee;
  });
});
