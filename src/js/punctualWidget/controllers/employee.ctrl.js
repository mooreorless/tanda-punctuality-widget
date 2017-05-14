define([
  'angular',
  'lodash',
  'jquery',
  'moment'
], (angular, _, $, moment) => {
  angular
  .module('punctualWidget')
  .controller('EmployeeCtrl', (
    $scope,
    $rootScope,
    $q,
    thisEmployee,
    Employees
  ) => {
    $scope.employee = thisEmployee;
    $scope.rosters = [];
    $scope.shifts = [];
    $scope.today = new moment().format('MMM Do YYYY hh:mm:ss a');
    /**
     * create hashmap with actual times, and rostered times!! use that for the cols;
     * then create a difference between times for the actual vs rostered columns.
     * Then use time difference for the extra display for actual finish
     *
     * Then count how many times they were late, ontime, and when they left early
     *
     *
     * when selecting times from datePicker, if no to date selected use + 7 days or to 'today'
     */

    Employees.getAllRosters({
      from: new moment('2013-09-15'),
      to: new moment('2013-09-20')
    }).$promise
    .then((rosters) => {
      $scope.rosters = rosters;
    });

    Employees.getAllShifts({
      from: new moment('2013-09-15'),
      to: new moment('2013-09-20')
    }).$promise
    .then((shifts) => {
      $scope.shifts = shifts;
    });

    $scope.getTableData = (data, settings, cb) => {
      $scope.dateSelected = (from, to) => {
        const proms = {
          rosters: Employees.getAllRosters({ from: new moment(from), to: new moment(to) }).$promise,
          shifts: Employees.getAllShifts({ from: new moment(from), to: new moment(to) }).$promise
        };
        return $q.all(proms)
        .then((result) => {
          let { rosters, shifts } = result;
          rosters = _.map(rosters, roster => ({
            date: roster.date,
            rosteredStart: roster.start,
            rosteredFinish: roster.finish
          }));

          shifts = _.map(shifts, shift => ({
            date: shift.date,
            actualStart: shift.start,
            actualFinish: shift.finish
          }));

          const shiftData = _.merge(rosters, shifts);
          console.log(shiftData);
          cb({ data: shiftData });
        });
      };
    };

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
        _: 'rosteredStart',
        display(row) {
          return moment(row.rosteredStart).format('hh:mm a');
        }
      },
      name: 'Rostered Start',
      className: 'dt-body-left'
    }, {
      data: {
        _: 'actualStart',
        display(row) {
          const actualStart = moment(row.actualStart);
          const rosteredStart = moment(row.rosteredStart);

          if (actualStart.isSameOrBefore(rosteredStart)) {
            return actualStart.format('hh:mm a');
          }
          return 'started late';
        }
      },
      name: 'Actual Start',
      className: 'dt-body-left'
    }, {
      data: {
        _: 'rosteredFinish',
        display(row) {
          if (row.rosteredFinish === null) {
            return 'no finish time clocked';
          }
          return moment(row.rosteredFinish).format('hh:mm a');
        }
      },
      name: 'Rostered Finish',
      className: 'dt-body-left',
      defaultContent: 'no finish time clocked'
    }, {
      data: {
        _: 'actualFinish'
      },
      render(data, type, row) {
        const actualFinish = moment(row.actualFinish);
        const rosteredFinish = moment(row.rosteredFinish);
        // if (row.actualFinish === null) {
        //   return 'no finish time clocked';
        // }
        if (actualFinish.isAfter(rosteredFinish)) {
          const time = actualFinish.format('hh:mm a');
          const timeDiff = `${actualFinish.diff(rosteredFinish, 'minutes')} minutes`;
          const html = `left early <a data-toggle="tooltip" title="${time}"><span id="status" class="badge badge-pill badge-danger">${timeDiff}</span></a>`;
          return html;
        }
        return 'on time';
      },
      name: 'Actual Finish',
      className: 'dt-body-left time-comment',
      defaultContent: 'no finish time clocked'
    }];
  });
});
