define([
  'angular',
  'lodash',
  'jquery',
  'moment',
  'angular-bootstrap',
  'bootstrap-daterangepicker'
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
    $scope.notFound = false;
    $scope.searching = false;

    $scope.punctualStats = {
      late: 0,
      onTime: 0,
      leftEarly: 0
    };

    $scope.dateOptions = {
      showWeeks: false
    };
    $('input[name="daterange"]').daterangepicker({
      locale: {
        format: 'YYYY-MM-DD'
      },
      startDate: '2013-09-15',
      endDate: '2014-06-07',
      showDropdowns: true
    }, (start, end) => {
      $scope.search(start, end);
    });

    $scope.getTableData = (data, settings, cb) => {
      $scope.search = (from, to) => {
        delete $scope.notFound;
        const proms = {
          rosters: Employees.getAllRosters({ from, to }).$promise,
          shifts: Employees.getAllShifts({ from, to }).$promise
        };
        return $q.all(proms)
        .then((result) => {
          if (!result.rosters.length) {
            $scope.notFound = true;
          }
          let { rosters, shifts } = result;
          rosters = _.map(rosters, roster => ({
            rosterDate: roster.date,
            rosteredStart: roster.start,
            rosteredFinish: roster.finish
          }));

          shifts = _.map(shifts, shift => ({
            shiftDate: shift.date,
            actualStart: shift.start,
            actualFinish: shift.finish
          }));

          let shiftData = _.merge(rosters, shifts);
          shiftData = _.map(shiftData, (item) => {
            const rosterDate = moment(item.rosterDate);
            const shiftDate = moment(item.shiftDate);

            if (!rosterDate.isSame(shiftDate)) {
              return {
                date: item.shiftDate,
                rosterDate: item.rosterDate,
                rosteredStart: item.actualStart,
                rosteredFinish: item.actualFinish,
                actualStart: item.actualStart,
                actualFinish: item.actualFinish,
                shiftChanged: true
              };
            }
            item.date = item.rosterDate;
            delete item.shiftDate;
            delete item.rosterDate;
            return {
              date: item.date,
              rosterDate: item.rosterDate,
              rosteredStart: item.rosteredStart,
              rosteredFinish: item.rosteredFinish,
              actualStart: item.actualStart,
              actualFinish: item.actualFinish
            };
          });
          cb({ data: shiftData });
        });
      };
    };


    $scope.cols = [{
      name: 'Day',
      data(row) {
        if (row.date || row.rosterDate) {
          const day = moment(row.date);
          if (day.isValid()) {
            return `${day.format('MMMM Do YYYY')} (was moved from ${moment(row.rosterDate).format('MMMM Do')})`;
          }
          return day.format('MMMM Do YYYY');
        }
      },
      className: 'dt-body-left',
      defaultContent: '-'
    }, {
      data(row, type) {
        if (type === 'display') {
          if (row.rosteredStart) {
            return moment(row.rosteredStart).format('hh:mm a');
          }
        }
      },
      name: 'Rostered Start',
      className: 'dt-body-left',
      defaultContent: '-'
    }, {
      data(row) {
        if (row.actualStart || row.actualFinish) {
          const actualStart = moment(row.actualStart);
          const rosteredStart = moment(row.rosteredStart);

          if (actualStart.isSameOrBefore(rosteredStart)) {
            $scope.punctualStats.onTime++;
            return actualStart.format('hh:mm a');
          }
          if (actualStart.isAfter(rosteredStart)) {
            $scope.punctualStats.late++;
            return 'started late';
          }
          // return 'started late';
        }
      },
      name: 'Actual Start',
      className: 'dt-body-left',
      defaultContent: 'no shift logged'
    }, {
      data(row) {
        if (row.rosteredFinish !== null) {
          return moment(row.rosteredFinish).format('hh:mm a');
        }
      },
      name: 'Rostered Finish',
      className: 'dt-body-left',
      defaultContent: 'no finish time clocked'
    }, {
      data: 'actualFinish',
      render(data, type, row) {
        const actualFinish = moment(row.actualFinish);
        const rosteredFinish = moment(row.rosteredFinish);
        if (row.actualFinish !== null) {
          const time = actualFinish.format('hh:mm a');
          let html = `<a data-toggle="tooltip" title="${time}">on time</a>`;

          if (actualFinish.isBefore(rosteredFinish)) {
            const timeDiff = `${actualFinish.diff(rosteredFinish, 'minutes')} minutes`;
            html = `left early <a data-toggle="tooltip" class="text-bold" title="${time}"><span id="status" class="badge badge-pill badge-danger">${timeDiff}</span></a>`;

            $scope.punctualStats.leftEarly++;
            return html;
          }
          return html;
        }
      },
      name: 'Actual Finish',
      className: 'dt-body-left time-comment',
      defaultContent: 'no finish time clocked'
    }];

    $scope.tableOptions = {
      pageLength: 5,
      pagingType: 'simple',
      searching: false,
      order: [['0', 'desc']],
      lengthMenu: [5, 10, 15, 25]
    };
  });
});
