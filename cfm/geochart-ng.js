'use strict';

if (typeof angular !== 'undefined' && typeof Singular !== 'undefined') {
  (function () {
    // Create a new module if necessary
    var ngModule = Singular.ngModule ||
      (Singular.ngModule = angular.module('Singular', []));

    ngModule.run(['$templateCache', function ($templateCache) {
      $templateCache.put(
        'views/singular-angular-GeoFacetFields.html',
        '<div id="{{::config.field}}-chart" ' +
        '     class="geochart" style="width: 100%">' +
        '  <strong>By state</strong>' +
        '    <span class="reset" style="display: none;"> : ' +
        '      <span class="filter"></span></span>' +
        '    <a class="reset" ng-click="resetChart()" href=""' +
        '      style="display: none;">reset<i class="fa fa-bar-chart-o"></i>' +
        '    </a>' +
        '  <div style="clear: both"></div>' +
        '</div>'
      );
    }])


    var controller = function ($scope, $timeout) {
      $scope.config = $scope.config || {};
      var singular = new Singular();
      if (!singular) return;

      $timeout(function () {
        var chart = singular.createGeoChart($scope.config);
        console.log('created: ', chart);

        chart.filterHandler(function () {
          var allfilters = singular.getAllFilters();
          console.log('chart.filterHandler, allfilters: ', allfilters);

          $timeout(function () {
            $scope.onFilterChanges();
          });
        });
        chart.load([]);
        $scope.resetChart = function (item) {
          chart.filterAll();
          dc.redrawAll();
        };

        $scope.$watch(
          // Invoked whenever there's a change in the filter selection
          function ($scope) {
            console.log('watch: filters: ', $scope.filters);
            return $scope.filters;
          },

          // Invoked when a data values changes:
          function (newValue) {
            console.log('=============== newValue: ', newValue);
            var data = [];
            if (newValue && angular.isArray(newValue)) {
              data = newValue.map(function (d) {
                return {
                  key: d.name,
                  value: d.count
                };
              });
            }
            chart.load(data);
          }
        );
      });
    }

    ngModule.directive('singularGeochart', function () {
      return {
        templateUrl: 'views/singular-angular-GeoFacetFields.html',
        restrict: 'AE',
        replace: true,
        scope: {
          config: '=?',
          filters: '=?',
          onFilterChanges: '&'   // use as on-tag-changes
        },

        controller: ['$scope', '$timeout', controller],
      };
    });
  })();
}
