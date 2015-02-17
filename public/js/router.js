var Router = (function(){

  var Router = function(){
    this.routes = []
    var self = this
    window.onpopstate = function(){
      console.log('pop')
      self.route.bind(self)
    }
  }

  Router.prototype = {
    location: function(){
      return window.location.pathname	      
    },
    get: function( re, cb ){
      this.routes.push( { re: re, handler: cb } )
      if( this.location().match( re + "$")){
	cb()
      }
    },
    set: function( url ){
      history.pushState( {}, null, url ) 
      this.route()
    },
    route: function( ){
      for( var i = 0; i < this.routes.length; i++ ){
	if( this.location().match( this.routes[i].re + "$")){
	  this.routes[i].handler()
	}
      }
    }
  }
  return new Router()
})()

Router.get('/', function(){
  console.log('do home related stuff')
})

Router.get('/gist.github.com/(.*)/(.*)', function(){
  console.log('do gist stuff')
})

Router.get('/pizza', function(){
  console.log('do pizza stuff')
})

//Router.set('/gist.github.com/jshawl/4988f37eb1a2e6dc98e8')