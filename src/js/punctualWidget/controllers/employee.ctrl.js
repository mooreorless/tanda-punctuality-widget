define([
  'angular',
  'moment'
], (angular, moment) => {
  angular
  .module('punctualWidget')
  .controller('EmployeeCtrl', (
    $scope,
    $rootScope,
    Employees
  ) => {
    /**
     * create hashmap with actual times, and rostered times!! use that for the cols;
     * then create a difference between times for the actual vs rostered columns.
     * Then use time difference for the extra display for actual finish
     *
     * Then count how many times they were late, ontime, and when they left early
     */

    $scope.employee = 'Elliott Moore';
    Employees.getRoster({
      date: new moment('2013-09-15')
    }).$promise
    .then((roster) => {
      console.log(roster);
      $scope.roster = roster;
    });
    $scope.cols = [{
      data: {
        _: 'date',
        display(row) {
          const day = new moment(row.date);
          if (day.isValid()) {
            return day.format('MMMM Do YYYY');
          }
          return day;
        }
      },
      name: 'Day'
    }, {
      data: {
        _: 'start',
        display(row) {
          const start = moment(row.start).format('hh:mm a');
          return start;
          // this needs to be the rosters time, not shifts
        }
      },
      name: 'Rostered Start'
    }, {
      data: {
        _: ''
      },
      name: 'Actual Start',
      defaultContent: 'on time'
    }, {
      data: {
        _: 'finish',
        display(row) {
          if (row.finish === null) {
            return 'no finish time clocked';
          }
          const finish = moment(row.finish).format('hh:mm a');
          return finish;
        }
      },
      name: 'Rostered Finish',
      defaultContent: '-'
    }, {
      data: '',
      name: 'Actual Finish',
      defaultContent: 'time diff msg'
    }];
    $scope.tableOptions = {
      pageLength: 25,
      order: [[0, 'desc']]
    };
    $scope.getTableData = (data, settings, cb) => Employees.getAllShifts({
      from: new moment('2013-09-15'),
      to: new moment()
    }).$promise
      .then((shifts) => {
        console.log('shifts', shifts);
        cb({ data: shifts });
      });

    Employees.getAllRosters({
      from: new moment('2013-09-15'),
      to: new moment()
    }).$promise
      .then((rosters) => {
        console.log('rosters', rosters);
      });
  });
});
