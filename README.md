# Singular



## Installation

### bower

```
bower install https://***REMOVED***/scm/~hanl/singular.git
```

### wget

> ***FIXME:*** These don't work, because credentials.

```
wget https://***REMOVED***/users/hanl/repos/singular/browse/dist/Singular.min.css?raw
wget https://***REMOVED***/users/hanl/repos/singular/browse/dist/Singular.min.js?raw
```


## Libraries used

* dc_1.7.0
* quicksort from crossfilter 1.3.11


## Development

```    
npm install bower grunt-cli
npm install
bower install
grunt   #=> creates the dist/ directory
```    


## Change log

V0.0.7

  * allow the chart to use the width and height from it's dom element, or from it's parent if it's missing from configuration.
  * much better way of resize the charts!
  
        window.addEventListener('resize', singular.onResize(barchart, 'seqlen-chart-explicit-id'));

v0.0.6 

  * add time series bar chart
