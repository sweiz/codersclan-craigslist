CraigsList CasperJS login
======

Login to Craigslist with CasperJS.

## usage

The main component is a CasperJS script that goes through the United.com search process.

You will need to install:
* [CasperJS](http://casperjs.org/installation.html)
* PhantomJS (follow the instructions in CasperJS)

Run the tool with:

    casperjs index.js EMAIL PASSWORD


### Linux users:
Be sure to use option `--ignore-ssl-errors=yes` when you run casperjs

    casperjs --ignore-ssl-errors=yes index.js EMAIL PASSWORD
