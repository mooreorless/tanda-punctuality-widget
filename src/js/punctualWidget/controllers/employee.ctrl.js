define([
  'angular',
  'lodash',
  'moment'
], (angular, _, moment) => {
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

    // $scope.dateSelected = (from, to) => {
    //   const proms = {
    //     roster: Employees.getAllRosters({ from: new moment(from), to: new moment(to) }).$promise,
    //     shift: Employees.getAllShifts({ from: new moment(from), to: new moment(to) }).$promise
    //   };
    //   $q.all(proms)
    //   .then((data) => {
    //     const roster = data.roster[0];
    //     const shift = data.shift[0];

    //     const shiftData = {
    //       date: roster.date,
    //       rosteredStart: roster.start,
    //       rosteredFinish: roster.finish,
    //       actualStart: shift.start,
    //       actualFinish: shift.finish
    //     };
    //     console.log('shift', shiftData);
    //     $scope.getTableData = (shiftData, settings, cb) => {
    //       cb({ data: shiftData });
    //     };
    //   });
    // };

    $scope.getTableData = (data, settings, cb) => {
      $scope.dateSelected = (from, to) => {
        const proms = {
          rosters: Employees.getAllRosters({ from: new moment(from), to: new moment(to) }).$promise,
          shifts: Employees.getAllShifts({ from: new moment(from), to: new moment(to) }).$promise
        };
        return $q.all(proms)
        .then((result) => {
          let { rosters, shifts } = result;
          console.log('rosters', rosters);
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
          console.log('rs', rosters);
          console.log('sh', shifts);

          const shiftData = _.merge(rosters, shifts);
          console.log(shiftData);
          cb({ data: shiftData });
        });
      };
    };

    $scope.testCols = [{
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
          // this needs to be the rosters time, not shifts
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
            // return 'on time';
            return actualStart.format('hh:mm a');
          }
          return 'late';
        }
      },
      name: 'Actual Start',
      className: 'dt-body-left',
      defaultContent: 'on time'
    }, {
      data: {
        _: 'rosteredFinish',
        display(row) {
          const actualFinish = moment(row.actualFinish);
          const rosteredFinish = moment(row.rosteredFinish);
          if (row.rosteredFinish === null) {
            return 'no finish time clocked';
          }


          return moment(row.rosteredFinish).format('hh:mm a');
        }
      },
      name: 'Rostered Finish',
      className: 'dt-body-left',
      defaultContent: '-'
    }, {
      data: {
        _: 'actualFinish',
        display(row) {
          const actualFinish = moment(row.actualFinish);
          const rosteredFinish = moment(row.rosteredFinish);
          if (row.actualFinish === null) {
            return 'no finish time clocked';
          }
          // if (actualFinish.isAfter(rosteredFinish)) {
          //   return 'on time';
          // }
          const diff = actualFinish.diff(rosteredFinish, 'minutes');
          return diff;
          // return 'left early';

          // return moment(row.actualFinish).format('hh:mm a');
        }
      },
      name: 'Actual Finish',
      className: 'dt-body-left',
      defaultContent: 'time diff msg'
    }];

    // $scope.dateSelected = (date) => {
    //   const proms = {
    //         roster: Employees.getRoster({ date: new moment(date) }).$promise,
    //         shift: Employees.getShift({ date: new moment(date) }).$promise
    //       };
    //   $q.all(proms)
    //   .then((data) => {
    //     const roster = data.roster[0];
    //     const shift = data.shift[0];

    //     const shiftData = {
    //       date: roster.date,
    //       rosteredStart: roster.start,
    //       rosteredFinish: roster.finish,
    //       actualStart: shift.start,
    //       actualFinish: shift.finish
    //     };
    //     // const shift = _.map(shiftData, item => console.log('item', item));
    //     // const shift = _.map(shiftData, item => ({
    //     //   date: item.date,
    //     //   rosteredStart: item.roster.start,
    //     //   rosteredFinish: item.roster.finish,
    //     //   actualStart: item.shift.start,
    //     //   actualFinish: item.shift.finish
    //     // }));
    //     console.log('shift', shiftData);
    //   });
    // };

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

    // $scope.getTableData = (data, settings, cb) => Employees.getAllShifts({
    //   from: new moment('2013-09-15'),
    //   to: new moment()
    // }).$promise
    //   .then((shifts) => {
    //     const arr = [];
    //     for (let i = 0; i < 5; ++i) {
    //       arr.push(shifts[i]);
    //     }
    //     // console.log('shifts', shifts);
    //     cb({ data: arr });
    //   });
  });
});
