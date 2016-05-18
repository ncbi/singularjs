'use strict';

if (typeof angular !== 'undefined' && typeof Singular !== 'undefined') {
  (function () {
    // Create a new module if necessary
    var module = Singular.ngModule ||
      (Singular.ngModule = angular.module('Singular', []));

    module.run(['$templateCache', function ($templateCache) {
      $templateCache.put(
        'views/singular-angular-GeoFacetFields.html',
        '<div id="{{::config.field}}-chart" ' +
        '     class="geochart" style="width: 100%">' +
        '  <p style="font-size: 70%">{{config.unit}} ' +
        '    <span class="filter"></span> ' +
        '    <a class="reset" ng-click="resetChart()" href=""' +
        '      style="display: none;">reset</a>' +
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

    module.directive('singularGeochart', function () {
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
