# barchart

## Overview of the barchart widget

Here's an overview of how the barchart widget works.

### HTML (demo page)

The demo page has this HTML:

```
<div id="seqlen-chart" style='height: 300px'></div>
```

And this JavaScript:

```javascript
var singular = new Singular();
var barchart = singular.createBarChart({
  field: 'seqlen',
  ...
});
```

The `field` has `-chart` appended to it, and it is matched against the DOM
element, which is then passed as `this` into the `createBarChart()` method.

The barchart is an object with a lot of methods;
there is some (incomplete) description in the dc.js wiki of the
[bar chart 
API](https://github.com/dc-js/dc.js/blob/master/web/docs/api-1.6.0.md#bar-chart0).


## `var singular = new Singular();`

`Singular` is a class, and you have to instantiate one to get started.

## `singular.createBarChart(opts)`

`opts` are those defined in interface.ts ChartConfiguration, including:

* field:string ;  // use to label the field
* width:number;
* height:number;
* itemId?:string; // dom el id, #id, must be unique if provided
* xmin?:any;
* xmax?:any;
* gap?:number;

That routine delegates to `dc.barChart()`, passing it a CSS selector for the DOM
node based on its ID.


## `barchart.filterHandler(filterHandler)`

Call this to get a function to use to handle filter events. For experimenting,
you can call singular.defaultFilterHandler, which logs the events to the
console:

```javascript
public defaultFilterHandler = (dimension, filter) => {
    console.info("Chart.FilterHandler():filter=" + filter + 
        " dimension = " + dimension);
    console.info(this.getAllFilters());
    return filter;  // return the actual filter value
};
```

## `barchart.load(data);`

Load data to it, typically from JSON. In this demo, it uses d3's `json()`
method:

```javascript
d3.json("assets/barchart.data.json", function (error, json) {
  if (error) return console.warn(error);
  barchart.load(json);
});
```

