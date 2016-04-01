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
/*global dc, d3,crossfilter,console,colorbrewer */
/**
 *  Create Singular Chart Objects
 *    - chart objects associated with the container elements identified by the css selector.
 *
 *  Usage
 *
 */
//
//var myCharts = new dc.CHARTS();
//
//d3.json("json/barchart.data.json", function (error, json) {
//       if (error) return console.warn(error);
//       ["seqlen0", "seqlen1", "seqlen2"].forEach(function (chartname, index) {
//           var chart = myCharts.createBarChart({
//               field: chartname,
//               xmin: 6,
//               xmax: 20,
//               xtickscale: 1,
//               width: 300,
//               height: 200
//           }).filterHandler(myCharts.defaultFilterHandler);
//           // chart.margins().left = 80;
//           // this will make the left margin to show the yaxis properly
//           chart.group(myCharts.getGroupsFromData(json)).render();
//       });
//       myCharts.renderAll()
//   });
//
//d3.json("json/rowchart.data.json", function (error, json) {
//       if (error) return console.warn(error);
//       ["row0", "row1", "row2"].forEach(function (chartname, index) {
//           var chart = myCharts.createRowChart({
//               field: chartname,
//               width: 300,
//               height: 200
//           }).filterHandler(myCharts.defaultFilterHandler);
//           chart.group(myCharts.getGroupsFromData(json)).render();
//       });
//       myCharts.renderAll()
//   });
//
//
//d3.json("json/rowchart.data.json", function (error, json) {
//       if (error) return console.warn(error);
//       ["pie0", "pie1", "pie2"].forEach(function (chartname, index) {
//           var chart = myCharts.createPieChart({
//               field: chartname,
//               width: 300,
//               height: 200
//           }).filterHandler(myCharts.defaultFilterHandler);
//           chart.dimension(myCharts.getDimensions(json));
//           chart.group(myCharts.getGroupsFromData(json)).render();
//       });
//       myCharts.renderAll()
//   });


declare module DC {
    export interface Base {
        useRemoteData:boolean;
    }
    export interface BaseMixin<T> {
        load(data:any):void;
        xtickscale:number;
    }
}

declare var dc:DC.Base;

interface ChartConfiguration {
    field:string ;// use to label the field
    width:number;
    height:number;
    itemId?:string; // dom el id, #id, must be unique if provided
    colors?:any[];
    colorsdomain?:any[];

    //Pie Chart
    innerRadius?:number;
    slicesCap?:number;
    dimension?:any;
    dimensionGroup?:any;

    //Bar Chart
    xmin?:number;
    xmax?:number
    numberFormat?:any;
    xtickscale?:number;

}

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
class Singular {
    public version:string = '0.0.4';
    public items:any[] = [];//any chart type

    /**
     *
     * @param useRemoteDataStore
     */
    constructor() {
    }

    /**
     * render all the charts managed by me, CHARTS
     */
    renderAll = () => {
        for (var chartName in this.items) {
            if (this.items.hasOwnProperty(chartName)) {
                this.items[chartName].render();
            }
        }
    };

    /**
     * redraw all the charts managed by me, CHARTS
     */
    redrawAll = () => {
        for (var chartName in this.items) {
            if (this.items.hasOwnProperty(chartName)) {
                this.items[chartName].redraw();
            }
        }
    };


    /**
     *getAllFilters
     * @returns the string that has all the filters in CHARTS collection
     */
    getAllFilters = ()=> {
        var currentFilters = [],
            chartName,
            chart,
            i;
        for (chartName in this.items) {
            if (this.items.hasOwnProperty(chartName)) {
                chart = this.items[chartName];

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
     *defaultFilterHandler
     * @param dimension
     * @param filter
     * @returns {*}
     */
    public defaultFilterHandler = (dimension, filter) => {
        console.info("Chart.FilterHandler():filter=" + filter + " dimension = " + dimension);
        console.info(this.getAllFilters());
        return filter;// return the actual filter value
    };


    /**
     *
     * @param newconf
     * @returns {*}
     */
    public createBarChart = function (newconf:ChartConfiguration):DC.BarChart {
        var me = this,
            conf = Singular.apply({}, newconf, {
                xmin: 0,
                xmax: 150,
                width: 400,
                height: 180,
                numberFormat: d3.format(".0f"),
                xtickscale: 1,
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            }),
            chart = dc.barChart(conf.itemId ? '#' + conf.itemId : '#' + conf.field + "-chart");
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
        chart.xAxis().tickFormat((v)=> {
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
     * createRowChart
     *   -- function that create customized row chart
     *   -- usage:
     *     CHARTS.createRowChart({dimension:mwDimension,dimensionGroup:mwDimension.group(),field:"actvtyrow"});
     *     CHARTS.items[actvtyrow].width(200).height(120).dimension(CHARTS.helper.getDimensions([])).group(CHARTS.helper.getGroupsFromData([])).renderLabel(true).colors().colorDomain([]).label(function(d) { return d.key;}).elasticX(true).xAxis().ticks(2);
     *
     * @param newconf
     * @returns {*}
     */
    public createRowChart = function (newconf):DC.RowChart {
        var me = this,
            conf = Singular.apply({}, newconf, {
                field: "row",
                width: 200,
                height: 120,
                colors: d3.scale.category20c(),
                colorsdomain: [],
                //colors: ['red', 'green', 'blue', '#c6dbef', '#dadaeb'],
                //colorsdomain: ["active", "inactive", "unspecified", "inclonclusive"],
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            }),
            chart = dc.rowChart(conf.itemId ? '#' + conf.itemId : '#' + conf.field + '-chart');

        this.items[conf.field] = chart;

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
    public createPieChart = function (newconf):DC.PieChart {
        var me = this,
            conf = Singular.apply({}, newconf, {
                field: 'pie',
                width: 200,
                height: 120,
                innerRadius: 20,
                slicesCap: 5,
                //colors: ['red', 'green', 'blue', '#c6dbef', '#dadaeb'],
                //colorsdomain: ['active', 'inactive', 'unspecified', 'inclonclusive'],
                dimension: Singular.getDimensions([]),
                dimensionGroup: Singular.getGroupsFromData([])
            }),
            chart = dc.pieChart(conf.itemId ? '#' + conf.itemId : '#' + conf.field + '-chart');
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
    static apply = function (o, n, q) {
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
    static getGroupsFromData = function (data:any[]) {
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
    static getDimensions = function (data:any[]) {
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
}