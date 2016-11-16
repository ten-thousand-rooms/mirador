[![Build Status](https://travis-ci.org/ProjectMirador/mirador.svg?branch=master)](https://travis-ci.org/ProjectMirador/mirador?branch=master)
[![Stories in Ready](https://badge.waffle.io/ProjectMirador/mirador.svg?label=ready&title=Ready)](http://waffle.io/iiif/mirador)

#Mirador
![mirador banner](http://projectmirador.github.io/mirador/img/banner.jpg)
**Mirador is a multi-repository, configurable, extensible, and easy-to-integrate viewer and annotation creation and comparison environment for IIIF resources, ranging from deep-zooming artwork, to complex manuscript objects. It provides a tiling windowed environment for comparing multiple image-based resources, synchronised structural and visual navigation of content using openSeadragon, Open Annotation compliant annotation creation and viewing on deep-zoomable canvases, metadata display, bookreading, and bookmarking.**
###[See a Demo](http://projectmirador.org/demo/)
###[Getting Started](http://projectmirador.org/docs/docs/getting-started.html)

### Run in Development
Mirador uses [node.js](http://nodejs.org/) and a build system to assemble, test, and manage the development resources. If you have never used these tools before, you may need to install them.

 1. Install Node, if you haven't already (available at the link above)  
 2. Install the Grunt command line runner (if you haven't already); on the command line, run `npm install -g grunt-cli`  
 3. Clone the mirador repository (if you haven't already done so above)
 4. On the command line, go into the mirador folder
 5. Install all dependencies with `npm install` and `bower install`. Run `npm start'.
 
### Run Tests
`npm test`

For more information, see the [Docs](http://projectmirador.org/docs/docs/getting-started.html), submit an [issue](https://github.com/projectmirador/mirador/issues), or ask on [slack](http://bit.ly/iiif-slack).

### Project Diagnostics
 [![Coverage Status](https://coveralls.io/repos/github/ProjectMirador/mirador/badge.svg?branch=master&upToDate=true)](https://coveralls.io/github/ProjectMirador/mirador?branch=master&upToDate=true)
