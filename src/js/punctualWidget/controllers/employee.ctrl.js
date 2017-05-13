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
      name: 'Day',
      className: 'dt-body-left'
    }, {
      data: {
        _: 'start',
        display(row) {
          const start = moment(row.start).format('hh:mm a');
          return start;
          // this needs to be the rosters time, not shifts
        }
      },
      name: 'Rostered Start',
      className: 'dt-body-left'
    }, {
      data: {
        _: ''
      },
      name: 'Actual Start',
      className: 'dt-body-left',
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
      className: 'dt-body-left',
      defaultContent: '-'
    }, {
      data: '',
      name: 'Actual Finish',
      className: 'dt-body-left',
      defaultContent: 'time diff msg'
    }];
    $scope.tableOptions = {
      pageLength: 25,
      order: [[0, 'desc']],
      searching: false,
      pagingType: 'simple'
    };
    $scope.getTableData = (data, settings, cb) => Employees.getAllShifts({
      from: new moment('2013-09-15'),
      to: new moment()
    }).$promise
      .then((shifts) => {
        const arr = [];
        for (let i = 0; i < 5; ++i) {
          arr.push(shifts[i]);
        }
        console.log('shifts', shifts);
        cb({ data: arr });
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
