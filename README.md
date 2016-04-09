# Singular 0.0.8


V0.0.7

  * allow the chart to use the width and height from it's dom element, or from it's parent if it's missing from configuration.
  * much better way of resize the charts!
  
        window.addEventListener('resize', singular.onResize(barchart, 'seqlen-chart-explicit-id'));

v0.0.6 

  * add time series bar chart

#installation

## bower

        bower install https://***REMOVED***/scm/~hanl/singular.git
        
## wget

         curl https://***REMOVED***/users/hanl/repos/singular/browse/dist/Singular.min.css?raw > Singular.min.css
         curl https://***REMOVED***/users/hanl/repos/singular/browse/dist/Singular.min.js?raw > Singular.min.js

## Libs

    dc_1.7.5
    quicksort from crossfilter 1.3.11

## setup
    
    npm install bower grunt-cli typings -g
    npm install
    bower install
    #typings install github:DefinitelyTyped/DefinitelyTyped/d3/d3.d.ts#101a5daef4fc42eca0d447ba5d080248f80daf90 --save --ambient
    
    