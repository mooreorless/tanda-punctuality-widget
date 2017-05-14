define([
  'angular',
  'jquery',
  'lodash',
  'moment',
  'datatables.net'
], (angular, $, _, moment) => {
  angular
  .module('tandaApp')
  .directive('tandaTableDirective', $rootScope => ({
    restrict: 'AE',
    template: `<table class="table table-striped table-hover dt-left">
    <thead></thead></table>`,
    replace: true,
    scope: {
      src: '&',
      cols: '=',
      rowHover: '&?',
      table: '=?',
      options: '=?'
    },
    link(scope, elem) {
      let options = {
        autoWidth: false,
        ajax(data, callback, settings) {
          scope.src({
            data,
            cb(source) {
              return callback(source);
            },
            settings
          });
        },
        columns: _.map(scope.cols, (col) => {
          col.title = col.title || col.name;
          return col;
        })
      };
      scope.options = scope.options || {};
      options = _.defaults(options, scope.options);
      scope.table = $(elem).DataTable(options);

      $rootScope.$on('UPDATE_TABLE', () => {
        scope.table.ajax.reload();
      });

      $('#employeeShiftsTable tbody').on('mouseover', 'tr > .time-comment', (e) => {
        e.stopPropagation();
        const data = scope.table.row(this).data();
        if (data.actualFinish !== null) {
          $('.dt-body-left .time-comment > a').tooltip();
        }
      });
    }
  }));
});
