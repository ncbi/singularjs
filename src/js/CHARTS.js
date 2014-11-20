/**
 #### Version 0.0.3


 // ### Create Chart Objects
 // Create chart objects associated with the container elements identified by the css selector.

 USAGE:
 var myCharts = new dc.CHARTS();

 d3.json("json/barchart.data.json", function (error, json) {
        if (error) return console.warn(error);
        ["seqlen0", "seqlen1", "seqlen2"].forEach(function (chartname, index) {
            var chart = myCharts.createBarChart({
                field: chartname,
                xmin: 6,
                xmax: 20,
                xtickscale: 1,
                width: 300,
                height: 200
            }).filterHandler(myCharts.getChartFilterHandler);
            // chart.margins().left = 80;
            // this will make the left margin to show the yaxis properly
            chart.group(myCharts.getGroupsFromData(json)).render();
        });
        myCharts.renderAll()
    });

 d3.json("json/rowchart.data.json", function (error, json) {
        if (error) return console.warn(error);
        ["row0", "row1", "row2"].forEach(function (chartname, index) {
            var chart = myCharts.createRowChart({
                field: chartname,
                width: 300,
                height: 200
            }).filterHandler(myCharts.getChartFilterHandler);
            chart.group(myCharts.getGroupsFromData(json)).render();
        });
        myCharts.renderAll()
    });


 d3.json("json/rowchart.data.json", function (error, json) {
        if (error) return console.warn(error);
        ["pie0", "pie1", "pie2"].forEach(function (chartname, index) {
            var chart = myCharts.createPieChart({
                field: chartname,
                width: 300,
                height: 200
            }).filterHandler(myCharts.getChartFilterHandler);
            chart.dimension(myCharts.getDimensions(json));
            chart.group(myCharts.getGroupsFromData(json)).render();
        });
        myCharts.renderAll()
    });

 *****************************************************************************************/



(function (dc) {
    'use strict';
    /*global dc, d3,crossfilter,console,colorbrewer */

    /**
     * dc.useRemoteData = true;
     * @type {boolean}
     *
     *  this is required for server side data processing: this will also turn off the filter re-settings when using remote data store, to avoid the rapid backend firing

     +
     +    _chart.clearFilter=function() {
     +        _filters = [];
     +    };

     function removeFilter(_) {
 _filters.splice(_filters.indexOf(_), 1);
 } else {
 dc.events.trigger(function () {
 if(!dc.useRemoteData)_chart.filter(null);
 +                else _chart.clearFilter(); //this will reset the filters stored in the chart, without fire the redraw event
 _chart.filter([extent[0], extent[1]]);
 dc.redrawAll(_chart.chartGroup());
 }, dc.constants.EVENT_DELAY);
 */
    dc.useRemoteData = true;
    dc.CHARTS = function () {
        var _charts = { version: "0.0.3", items: {}};

        /**
         * render all the charts managed by me, CHARTS
         */
        _charts.renderAll = function () {
            var chartname;
            for (chartname in _charts.items) {
                _charts.items[chartname].render();
            }
        };

        /**
         * redraw all the charts managed by me, CHARTS
         */
        _charts.redrawAll = function () {
            var chartname;
            for (chartname in _charts.items) {
                _charts.items[chartname].redraw();
            }
        };

        /**
         *
         * @param data
         * @returns {{all: all}}
         */
        _charts.getGroupsFromData = function (data) {
            return {
                top: function (k) {
                    return data.slice(0, k);
                },
                all: function () {
                    return data;
                }
            };
        };
        /**
         *
         * @param data
         * @returns {{top: top, filter: filter, filterFunction: filterFunction}}
         */
        _charts.getDimensions = function (data) {
            return {
                top: function (count) {
                    return data.slice(0, count);
                },
                filter: function (filter) {
                    console.log("dimention.filter():" + filter);
                },
                filterFunction: function (filter) {
                    console.log("dimention.filterFunction():" + filter);
                }
            };

        };
        /**
         *
         * @returns the string that has all the filters in CHARTS collection
         */
        _charts.getAllFilters = function () {
            var currentFilters = {},
                chartName,
                chart,
                i;

            for (chartName in _charts.items) {
                if (_charts.items.hasOwnProperty(chartName)) {
                    chart = _charts.items[chartName];
                    if (chart.filters && chart.filters() && chart.filters().length > 0) {
                        if (chart.xtickscale && chart.xtickscale > 0) {
                            for (i = 0; i < chart.filters()[0].length; i++) {
                                chart.filters()[0][i] = Math.floor(chart.filters()[0][i] * chart.xtickscale);
                            }
                        }
                        currentFilters[chartName] = chart.filters();
                    }
                }
            }
            return currentFilters;
        };
        /**
         *
         * @param dimension
         * @param filter
         * @returns {*}
         */
        _charts.getChartFilterHandler = function (dimension, filter) {
            //console.info("dcChart.FilterHandler():filter=" + filter + " dimension = " + dimension);
            console.info(JSON.stringify(_charts.getAllFilters(), null, 2));
            return filter;
            // return the actual filter value
        };

        /**
         *
         * @param newconf
         * @returns {*}
         */
        _charts.createBarChart = function (newconf) {
            var me = this,
                conf = me.apply({}, newconf, {
                    xmin: 0,
                    xmax: 150,
                    width: 400,
                    height: 180,
                    numberFormat: d3.format(".0f"),
                    xtickscale: 1,
                    dimension: me.getDimensions([]),
                    dimensionGroup: me.getGroupsFromData([])
                }),
                chart = dc.barChart("#" + conf.field + "-chart");
            chart.xtickscale = conf.xtickscale;
            me.items[conf.field] = chart;

            chart.width(conf.width).height(conf.height).margins({
                top: 10,
                right: 50,
                bottom: 30,
                left: 40
            }).dimension(conf.dimension)//
                .group(conf.dimensionGroup)//
                .elasticY(true)//
                //.centerBar(true)//
                .gap(1)//
                // .round(dc.round.floor)//
                .x(d3.scale.linear().domain([conf.xmin, conf.xmax]))//
                // .xUnits(dc.units.fp.precision(0.01))
                .renderHorizontalGridLines(true)//
                .filterPrinter(function (filters) {
                    var filter = filters[0], s = "";
                    s += conf.numberFormat(filter[0] * conf.xtickscale) + " -> " + conf.numberFormat(filter[1] * conf.xtickscale) + " ";
                    return s;
                });
            chart.xAxis().ticks(5);
            chart.xAxis().tickFormat(function (v) {
                return v * conf.xtickscale;
            });
            chart.yAxis().ticks(5);
            return chart;
        };

        /**
         *
         * function that create customized row chart
         *
         * usage:
         * CHARTS.createRowChart({dimension:mwDimension,dimensionGroup:mwDimension.group(),field:"actvtyrow"});
         *
         *
         *
         */
        _charts.createRowChart = function (newconf) {
            var me = this,
                conf = me.apply({}, newconf, {
                    field: "row",
                    width: 200,
                    height: 120,
                    colors: d3.scale.category20c(),
                    colorsdomain: [],
                    //colors: ['red', 'green', 'blue', '#c6dbef', '#dadaeb'],
                    //colorsdomain: ["active", "inactive", "unspecified", "inclonclusive"],
                    dimension: _charts.getDimensions([]),
                    dimensionGroup: _charts.getGroupsFromData([])
                }),
                chart = dc.rowChart("#" + conf.field + "-chart");
            //CHARTS.actvtyrow.width(200).height(120).dimension(CHARTS.helper.getDimensions([])).group(CHARTS.helper.getGroupsFromData([])).renderLabel(true).colors().colorDomain([]).label(function(d) { return d.key;}).elasticX(true).xAxis().ticks(2);
            _charts.items[conf.field] = chart;

            chart.width(conf.width).height(conf.height).margins({
                top: 10,
                right: 50,
                bottom: 30,
                left: 40
            }).dimension(conf.dimension)//
                .group(conf.dimensionGroup)//
                .renderLabel(true).colors(conf.colors).label(function (d) {
                    return d.key;
                }).elasticX(true).xAxis().ticks(2);

            chart.colors(conf.colors).colorDomain(conf.colorsdomain);
            chart.ordering(function (d) {
                return -d.value;
            });

            return chart;
        };


        /**
         *
         * function that create customized row chart
         *
         * usage:
         * CHARTS.createRowChart({dimension:mwDimension,dimensionGroup:mwDimension.group(),field:"actvtyrow"});
         *
         *
         *
         */
        _charts.createPieChart = function (newconf) {
            var me = this,
                conf = me.apply({}, newconf, {
                    field: "pie",
                    width: 200,
                    height: 120,
                    innerRadius: 20,
                    slicesCap: 5,
                    //colors: ['red', 'green', 'blue', '#c6dbef', '#dadaeb'],
                    //colorsdomain: ["active", "inactive", "unspecified", "inclonclusive"],
                    dimension: _charts.getDimensions([]),
                    dimensionGroup: _charts.getGroupsFromData([])
                }),
                chart = dc.pieChart("#" + conf.field + "-chart");
            _charts.items[conf.field] = chart;

            chart
                .width(conf.width)
                .height(conf.height)
                .dimension(conf.dimension)
                .group(conf.dimensionGroup)
                .innerRadius(conf.innerRadius)
                .slicesCap(conf.slicesCap)
                .legend(dc.legend());


            //chart.colors(conf.colors).colorDomain(conf.colorsdomain);
            return chart;
        };

        /**
         * Copies all the properties of config to the specified object. borrowed from extjs
         *
         * @param {Object}
         *            object The receiver of the properties
         * @param {Object}
         *            config The source of the properties
         * @param {Object}
         *            [defaults] A different object that will also be applied for
         *            default values
         * @return {Object} returns obj
         */
        _charts.apply = function (o, n, q) {
            if (q) {
                this.apply(o, q);
            }
            if (o && n && typeof n === "object") {
                var p;
                for (p in n) {
                    if (n.hasOwnProperty(p)) {
                        o[p] = n[p];
                    }
                }
            }
            return o;
        };
        return _charts;
    };
}(dc));