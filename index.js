phantom.cookiesEnabled = true;
phantom.clearCookies();
var debug = false
  , casper = require('casper').create({
  verbose: debug,
  logLevel: debug ? "debug" : "error",
  timeout: 1000*60*30, // 30-minute total timeout
  onTimeout: function() {
    casper.echo('[{ "error":"timeout"}] ]').exit();
  },
  onError: function(self, m) {
    self.echo("An error occurred.  Please try again.");
    self.exit();
  }
});
if(casper.cli.args.length < 1) {
  casper.echo("syntax: index.js email password");
  casper.exit();
}

var email = casper.cli.get(0)
  , password = casper.cli.get(1);
casper
  .start()
  .then(function(){
    if(casper.cli.args.length < 1){
      this.echo("syntax: index.js email password [debug]");
      this.exit();
    }
  })
  .thenOpen("https://accounts.craigslist.org/logout") // Logout
  .then(function(){ // Clear Cookies
    phantom.clearCookies();
  })
  .thenOpen("https://accounts.craigslist.org/login", function(){ // Fill in login form
    if(debug) this.page.render('debug_open.png');
    try {
      this.fill("form[name='login']", {
          inputEmailHandle: email,
          inputPassword: password
      }, false);
    } catch(err){
      if(debug) this.page.render('debug_form.png');
      this.echo("Error filling login form");
      this.exit();
    }
  })
  .then(function(){ // Click submit
    try{
      this.click('button[type="submit"]');
    } catch(err){
      if(debug) this.page.render('debug_click.png');
      this.echo("Error submitting login form");
      this.exit();
    }
  })
  .then(function(){ // Verify we are logged in
    var linkText = this.evaluate(function(){
      var els = document.getElementsByTagName("a");
      for (var i = 0, l = els.length; i < l; i++) {
          var el = els[i];
          if (el.href === 'https://accounts.craigslist.org/login/home') {
              return el.innerHTML;
          }
      }
      return false;
    });
    if(linkText !== false){
      if(linkText !== "home of "+email) linkText = false;
    }
    if(linkText === false) {
      if(debug) {
        this.page.render('debug_fail.png');
      }
      this.echo("Failed login verification");
      this.exit();
    }
  })
  .then(function(){ // Render proof
    this.page.render('success-'+email+'.png');
  })
  .run(function(){
    this.echo("Success! Render of page saved as: success-"+email+'.png');
    this.exit();
  });
