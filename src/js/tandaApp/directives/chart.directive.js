define([
  'angular',
  'jquery',
  'chart'
], (angular, $, Chart) => {
  angular
  .module('tandaApp')
  .directive('tandaChartDirective', () => ({
    scope: {
      thisChart: '=',
      chartSources: '=',
      chartType: '@',
      chartOptions: '='
    },
    template: '<canvas></canvas>',
    link(scope) {
      const ctx = document.getElementById('stats-chart');
      const opts = {
        type: scope.chartType,
        data: scope.chartSources,
        options: scope.chartOptions
      };

      $(document).ready(() => {
        scope.thisChart = new Chart(ctx, opts);
      });
    }
  }));
});

