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
[GitHub](https://github.com/ncbi/singularjs/releases) and extract it
to your local drive.

## Development

Set up these command-line tools (you should only have to do this once):

```    
npm install -g bower grunt-cli safe-http-server typings
```

Then, clone the repo, install dependencies, and build:

```
npm install
bower install
typings install
grunt         #=> creates the dist/ directory
```

Then, you can start an http server at the project root directory, and bring
up http://localhost:8080/dist.


## Libraries used

* dc_1.7.5 - singularjs repository was forked from here
* quicksort - from crossfilter 1.3.11


## Release and publish

Build:

```
rm -rf dist
grunt
```

Test (not automated yet).

First bring up `http-server`, and check that the demo pages are working.

Bump the version, tag, and publish:

```
git commit -m 'Release version x.y.z'
git tag -a 'vx.y.z' -m 'Tagging release'
git push
git push --tags
npm publish
```
