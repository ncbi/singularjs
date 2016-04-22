# Singular

Singular is a fork of dc.js, without dependencies on crossfilter or jquery.
In our target environment, most of crossfilter's functionality is handled on
the server.

## Installation

### npm

```
npm install singularjs
```

### Download

Download the latest release from 
[GitHub](https://github.com/ncbi/singular/releases/latest) and extract it
to your local drive.

## Development

```
npm install -g typings grunt-cli less
npm install
bower install
typings install
grunt
```

Then, you can start an http server at the project root directory, and bring
up http://localhost:8080/src.

***FIXME:*** Integrate `grunt watch`.


## Libraries used

* dc_1.7.5
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
grunt         #=> creates the dist/ directory
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
git push
git push --tags
npm publish
```

## Change log

### v0.0.7

* allow the chart to use the width and height from it's dom element, or from 
  it's parent if it's missing from configuration.
* much better way to resize the charts!
  
      window.addEventListener('resize', 
        singular.onResize(barchart, 'seqlen-chart-explicit-id'));

### v0.0.6 

* dc_1.7.5
* quicksort from crossfilter 1.3.11
* add time series bar chart
