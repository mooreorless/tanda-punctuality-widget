define([
  'angular',
  'moment'
], (angular, moment) => {
  angular
  .module('punctualWidget')
  .controller('EmployeeCtrl', (
    $scope,
    Employees
  ) => {
    $scope.employee = 'Elliott Moore';
    Employees.roster({
      date: new moment('2013-09-15')
    }).$promise
    .then((roster) => {
      console.log(roster);
      $scope.roster = roster;
    });
  });
});
