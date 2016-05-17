'use strict';

if (typeof angular !== 'undefined' && typeof Singular !== 'undefined') {
  (function () {
    var ngModule = Singular.ngModule ||
      (Singular.ngModule = angular.module('Singular', []));

    ngModule.run(['$templateCache', function ($templateCache) {
      $templateCache.put(
        'views/singular-angular-GeoFacetFields.html',
        '<div id="{{::config.field}}-chart" ' +
        '     class="barchart" style="width: 100%">' +
        '  <p style="font-size: 11px">{{config.unit}} ' +
        '    <span class="filter"></span> ' +
        '    <a class="reset" ng-click="resetChart()" ' +
        '       style="display: none">reset</a>' +
        '  </p>' +
        '  <div style="clear: both"></div>' +
        '</div>'
      );
    }])
    .directive('singularGeochart', function () {
      return {
        templateUrl: 'views/singular-angular-GeoFacetFields.html',
        restrict: 'AE',
        replace: true,
        scope: {
          config: '=?',
          filters: '=?',
          rangeFilters: '=?',
          onFilterChanges: '&'   // use as on-tag-changes
        },

        controller: ['$scope', '$timeout',
          function ($scope, $timeout) {

            // Defaults, if the user hasn't specified anything
            // FIXME: does this really belong here?
            $scope.config = $scope.config || {};
            $scope.rangeFilters = $scope.rangeFilters || [];

            var singular = new Singular();
            if (!singular) return;

            $timeout(function () {
              var chart =
                ($scope.config.xmax && angular.isDate($scope.config.xmax))
                  ? singular.createTimeSeriesBarChart($scope.config)
                  : singular.createBarChart($scope.config);
              chart.margins({
                top: 10,
                right: 50,
                bottom: 20,
                left: 80
              });

              chart.filterHandler(function () {
                //TODO:: here we need to update $scope.filters
                var allfilters = singular.getAllFilters();

                $scope.rangeFilters =
                  ( allfilters[$scope.config.field] &&
                  angular.isArray(allfilters[$scope.config.field]) &&
                  allfilters[$scope.config.field].length > 0 )
                    ? allfilters[$scope.config.field][0]
                    : [];
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
                  return $scope.filters;
                },
                // Invoked when a data values changes:
                function (newValue) {
                  var data = [];
                  if (newValue && angular.isArray(newValue)) {
                    //only for non-time series
                    if ($scope.config.xtickscale && !($scope.config.xmax && angular.isDate($scope.config.xmax))) {
                      data = newValue.map(function (d) {
                        return {
                          key: d.name / ($scope.config.xtickscale || 1 ),
                          value: d.count
                        };
                      });
                    }
                    else {
                      data = newValue.map(function (d) {
                        return {
                          key: d.name,
                          value: d.count
                        };
                      });
                    }
                  }
                  chart.load(data);
                }
              );
            });
          }
        ],
      };
    });
  })();
}
