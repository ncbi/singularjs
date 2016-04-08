# Singular



## Installation

### npm

```
npm install singularjs
```

### wget

> ***FIXME:*** The ***REMOVED*** URLs don't work, even for NCBI users, because
> credentials. Here is another suggestion for where we could deploy. Could also
> use bower.


```
wget https://github.com/ncbi/singular/releases/latest/Singular.min.css?raw
wget https://github.com/ncbi/singular/releases/latest/Singular.min.js?raw
```


## Libraries used

* dc_1.7.0
* quicksort from crossfilter 1.3.11


## Development

Set up these command-line tools (you should only have to do this once):

```    
npm install -g bower grunt-cli safe-http-server
```

Then, clone the repo, install dependencies, and build:

```
npm install
bower install
grunt       #=> creates the dist/ directory
```

## Release and publish

Build:

```
rm -rf dist
grunt
```

Test:

```
safe-http-server    #=> make sure http://localhost:8080/dist/ is working
```

Then bump the version, and then

```
git commit -m 'Release version x.y.z'
git tag -a 'vx.y.z' -m 'Tagging release'
git push --all
npm publish
```


## Change log

V0.0.7

* allow the chart to use the width and height from it's dom element, or from 
  it's parent if it's missing from configuration.
* much better way of resize the charts!
  
      window.addEventListener('resize', singular.onResize(barchart, 'seqlen-chart-explicit-id'));

v0.0.6 

* add time series bar chart
