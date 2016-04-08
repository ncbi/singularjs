///<reference path='../../typings/browser.d.ts'/>
/**
 * Created by hanl on 6/22/2015.
 *
 * IMPORTANT:
 *    interface.ts: This is where the interface defined using typescript, and all editing should go to this file
 *                  make sure to compile the ts to js before testing
 *    interface.js: This is automatically generated. Please do not update the interface.js directly unless you
 *                  want to maintain the interface.js without the type definition.
 *
 *    However, you can use JavaScript in this interface.ts file as you would like to do in *.js
 *
 *
 */
'use strict';
/**
 * dc.useRemoteData = true;
 * @type {boolean}
 *
 *   -- this is required for server side data processing: this will also turn off the filter re-settings when using remote data store; to avoid the rapid backend firing
 *   -- reference: if(!dc.useRemoteData)_chart.filter(null);
 */
dc.useRemoteData = true;
/**
 * Singular class
 */
var Singular = (function () {
    /**
     *
     * @param useRemoteDataStore
     */
    function Singular() {
        var _this = this;
        this.version = '0.0.8';
        this.items = []; //any chart type
        /**
         * render all the charts managed by me, CHARTS
         */
        this.renderAll = function () {
            for (var chartName in _this.items) {
                if (_this.items.hasOwnProperty(chartName)) {
                    _this.items[chartName].render();
                }
            }
        };
        /**
         * redraw all the charts managed by me, CHARTS
         */
        this.redrawAll = function () {
            for (var chartName in _this.items) {
                if (_this.items.hasOwnProperty(chartName)) {
                    _this.items[chartName].redraw();
                }
            }
        };
        /**
         *getAllFilters
         * @returns the string that has all the filters in CHARTS collection
         */
        this.getAllFilters = function () {
            var currentFilters = [], chartName, chart, i;
            for (chartName in _this.items) {
                if (_this.items.hasOwnProperty(chartName)) {
                    chart = _this.items[chartName];
                    if (chart.filters && chart.filters() && chart.filters().length > 0) {
                        var chartFilters = JSON.parse(JSON.stringify(chart.filters().slice(0))); //deep clone
                        if (chart.xtickscale && chart.xtickscale > 0) {
                            for (i = 0; i < chartFilters[0].length; i++) {
                                chartFilters[0][i] = Math.floor(chartFilters[0][i] * chart.xtickscale);
                            }
                        }
                        currentFilters[chartName] = chartFilters;
                    }
                }
            }
            return currentFilters;
        };
        /**
         *defaultFilterHandler
         * @param dimension
         * @param filter
         * @returns {*}
         */
        this.defaultFilterHandler = function (dimension, filter) {
            console.info("Chart.FilterHandler():filter=" + filter + " dimension = " + dimension);
            console.info(_this.getAllFilters());
            return filter; // return the actual filter value
        };
        /**
         * updateDimension
         * @param conf
         * @returns {any}
         */
        this.updateDimension = function (conf) {
            if (conf && conf.field && !conf.itemId) {
                conf.itemId = conf.field + "-chart";
            }
            try {
                if (conf && conf.itemId) {
                    var elem = document.getElementById(conf.itemId);
                    //console.info(elem.clientWidth, elem.clientHeight, elem.parentNode["clientHeight"]);
                    conf.width = conf.width || (elem && (elem.clientWidth > 0) ? elem.clientWidth : elem.parentNode["clientWidth"]);
                    conf.height = conf.height || (elem && (elem.clientHeight > 0) ? elem.clientHeight : elem.parentNode["clientHeight"]);
                }
            }
            catch (e) {
                console.info(e);
            }
            finally {
                conf.width = conf.width || 300;
                conf.height = conf.height || 300;
            }
            return conf;
        };
        this.getItemId = function (conf) {
            return conf.itemId ? conf.itemId : conf.field + '-chart';
        };
        this.onResize = function (chart, itemId) {
            var getNewWidth = function (itemId) {
                var width = 300;
                try {
                    var elem = document.getElementById(itemId);
                    width = elem.offsetWidth || elem.parentNode["offsetWidth"];
                }
                catch (e) {
                }
                finally {
                    return width;
                }
            };
            return (function () {
                return function () {
                    chart.width(getNewWidth(itemId));
                    if (chart.hasOwnProperty('rescale')) {
                        chart.rescale();
                    }
                    chart.redraw().render();
                };
            }());
        };
        /**
         * createBarChart
         * @param newconf
         * @returns {*}
         */
        this.createBarChart = function (newconf) {
            var me = this, conf = Singular.apply({}, newconf, {
                xmin: 0,
                xmax: 150,
                gap: 1,
                elasticX: false,
                numberFormat: d3.format(".0f"),
                xtickscale: 1,
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            });
            conf = this.updateDimension(conf);
            var chart = dc.barChart('#' + me.getItemId(conf));
            chart.xtickscale = conf.xtickscale;
            me.items[conf.field] = chart;
            chart.width(conf.width).height(conf.height).margins({
                top: 10,
                right: 50,
                bottom: 30,
                left: 40
            }).dimension(conf.dimension) //
                .group(conf.dimensionGroup) //
                .elasticY(true) //
                .elasticX(conf.elasticX) //
                .gap(conf.gap) //
                .x(d3.scale.linear().domain([conf.xmin, conf.xmax])) //
                .renderHorizontalGridLines(true) //
                .filterPrinter(function (filters) {
                var filter = filters[0], s = "";
                s += conf.numberFormat(filter[0] * conf.xtickscale) + " -> " + conf.numberFormat(filter[1] * conf.xtickscale) + " ";
                return s;
            });
            chart.xAxis().ticks(5);
            chart.xAxis().tickFormat(function (v) {
                return v * conf.xtickscale + '';
            });
            chart.yAxis().ticks(5);
            chart.load = function (data) {
                chart.group(Singular.getGroupsFromData(data)).render();
                return chart;
            };
            return chart;
        };
        /**
         * createBarChart
         * @param newconf
         * @returns {*}
         */
        this.createTimeSeriesBarChart = function (newconf) {
            var me = this, conf = Singular.apply({}, newconf, {
                xmin: new Date(2015, 2, 31),
                xmax: new Date(2015, 3, 10),
                gap: 1,
                elasticX: false,
                xUnits: d3.time.days,
                timeParser: d3.time.format("%d-%m-%Y %H:%M:%S").parse,
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            });
            conf = this.updateDimension(conf);
            //console.info(conf);
            var chart = dc.barChart('#' + me.getItemId(conf));
            me.items[conf.field] = chart;
            chart.width(conf.width).height(conf.height).margins({
                top: 10,
                right: 50,
                bottom: 30,
                left: 40
            }).dimension(conf.dimension) //
                .group(conf.dimensionGroup) //
                .elasticY(true) //
                .elasticX(conf.elasticX) //
                .gap(conf.gap)
                .brushOn(true)
                .x(d3.time.scale().domain([conf.xmin, conf.xmax]))
                .xUnits(conf.xUnits)
                .renderHorizontalGridLines(true) //
                .filterPrinter(function (filters) {
                var filter = filters[0], s = "";
                s += filter[0] + " -> " + filter[1];
                return s;
            });
            chart.xAxis().ticks(5);
            chart.yAxis().ticks(5);
            chart.load = function (data) {
                data.forEach(function (d) {
                    d.key = d3.time.day(conf.timeParser(d.key));
                });
                chart.group(Singular.getGroupsFromData(data)).render();
                return chart;
            };
            return chart;
        };
        /**
         * createRowChart
         *   -- function that create customized row chart
         *   -- usage:
         *     CHARTS.createRowChart({dimension:mwDimension,dimensionGroup:mwDimension.group(),field:"actvtyrow"});
         *     CHARTS.items[actvtyrow].width(200).height(120).dimension(CHARTS.helper.getDimensions([])).group(CHARTS.helper.getGroupsFromData([])).renderLabel(true).colors().colorDomain([]).label(function(d) { return d.key;}).elasticX(true).xAxis().ticks(2);
         *
         * @param newconf
         * @returns {*}
         */
        this.createRowChart = function (newconf) {
            var me = this, conf = Singular.apply({}, newconf, {
                field: "row",
                colors: d3.scale.category20c(),
                colorsdomain: [],
                //colors: ['red', 'green', 'blue', '#c6dbef', '#dadaeb'],
                //colorsdomain: ["active", "inactive", "unspecified", "inclonclusive"],
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            });
            conf = this.updateDimension(conf);
            var chart = dc.rowChart('#' + me.getItemId(conf));
            this.items[conf.field] = chart;
            chart.width(conf.width).height(conf.height).margins({
                top: 10,
                right: 50,
                bottom: 30,
                left: 40
            }).dimension(conf.dimension) //
                .group(conf.dimensionGroup) //
                .renderLabel(true).colors(conf.colors).label(function (d) {
                return d.key;
            }).elasticX(true).xAxis().ticks(2);
            chart.colors(conf.colors).colorDomain(conf.colorsdomain);
            chart.ordering(function (d) {
                return -d.value;
            });
            chart.load = function (data) {
                chart.group(Singular.getGroupsFromData(data)).render();
                return chart;
            };
            return chart;
        };
        /**
         *
         * function that create customized row chart
         *
         * usage:
         * CHARTS.createRowChart({dimension:mwDimension,dimensionGroup:mwDimension.group(),field:'actvtyrow'});
         *
         *
         *
         */
        this.createPieChart = function (newconf) {
            var me = this, conf = Singular.apply({}, newconf, {
                field: 'pie',
                width: 200,
                height: 120,
                innerRadius: 20,
                slicesCap: 5,
                //colors: ['red', 'green', 'blue', '#c6dbef', '#dadaeb'],
                //colorsdomain: ['active', 'inactive', 'unspecified', 'inclonclusive'],
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            }), chart = dc.pieChart('#' + me.getItemId(conf));
            me.items[conf.field] = chart;
            chart.width(conf.width)
                .height(conf.height)
                .dimension(conf.dimension)
                .group(conf.dimensionGroup)
                .innerRadius(conf.innerRadius)
                .slicesCap(conf.slicesCap)
                .legend(dc.legend());
            //chart.colors(conf.colors).colorDomain(conf.colorsdomain);
            chart.load = function (data) {
                chart.group(Singular.getGroupsFromData(data)).render();
                return chart;
            };
            return chart;
        };
    }
    /*****************************************************
     * static methods section
     ****************************************************/
    /**
     * apply
     *   - static method
     *   - Copies all the properties of config to the specified object.
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
    Singular.apply = function (o, n, q) {
        if (q) {
            this.apply(o, q);
        }
        if (o && n && typeof n === 'object') {
            var p;
            for (p in n) {
                if (n.hasOwnProperty(p)) {
                    o[p] = n[p];
                }
            }
        }
        return o;
    };
    /**
     *getGroupsFromData
     * @param data
     * @returns {{top: (function(any): string|T[]|ArrayBuffer|Blob), all: (function(): *)}}
     */
    Singular.getGroupsFromData = function (data) {
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
     * getDimensions
     * @param data
     * @returns {{top: (function(any): any[]), filter: (function(any): void), filterFunction: (function(any): void)}}
     */
    Singular.getDimensions = function (data) {
        return {
            top: function (count) {
                return data.slice(0, count);
            },
            filter: function (filter) {
                console.log('dimention.filter():' + filter);
            },
            filterFunction: function (filter) {
                console.log('dimention.filterFunction():' + filter);
            }
        };
    };
    return Singular;
}());
//# sourceMappingURL=interface.js.map