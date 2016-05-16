# Singular.js

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

To make sure you have access to the build tools from the command line, add
the *relative* directory `./node_modules/.bin` to your PATH.

Then, clone the repo, install dependencies, and build:

```
npm install
bower install
typings install
grunt         #=> creates the dist/ directory
```

Start an http server at the project root directory, and bring
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
