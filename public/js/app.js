var myTextarea = document.querySelector('.js-sass');
    var editor = CodeMirror.fromTextArea(myTextarea, {
      matchBrackets: true,
      mode: "text/x-scss",
      lineNumbers:true,
      lineWrapping: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      foldGutter: true
    });
    editor.foldCode(CodeMirror.Pos(0, 0));
    var css = document.querySelector('.js-css');
    var csseditor = CodeMirror.fromTextArea(css, {
      mode: "css",
      readOnly: true,
      lineNumbers:true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      foldGutter: true
    });
    csseditor.foldCode(CodeMirror.Pos(0, 0));
    var timer;
    editor.on('change', function(cm){
      clearTimeout(timer);
      timer = setTimeout(function(){
	save( null );
        $.ajax({
	  type: "POST",
	  url: '/compile',
	  data: { 'sass': cm.getValue()}
	}).done( function(res){
          $('.js-css').val( res );
          csseditor.getDoc().setValue(res);
        }).fail(function (err, msg){
        });
      }, 1000);
    });
    function save( event ){
      if (event) event.preventDefault();
      if( $('.js-view-gist') ){
        $createGist = $('<li><a href="/create-gist" class="js-create-gist">Create Gist</a></li>');
	$('.js-view-gist').parent().after( $createGist );
        $('.js-view-gist').parent().remove(); 
      }
      var data = editor.getValue();
      localStorage.setItem('data', btoa(data) );
      window.location.hash = btoa(data);
    }
    $(document).on('click','.js-clear', function(event){
      event.preventDefault();
      localStorage.removeItem('data');
      window.location = $(this).attr('href');
    });
    $(document).on('click', '.js-create-gist', function(event){
        event.preventDefault();
        $.ajax({
	  type: "POST",
	  url: '/create-gist',
	  data: { 
	    'sass': editor.getValue(),
	    'css': csseditor.getValue()
	  }
	}).done( function(res){
	  var reply = JSON.parse(res);
	  console.log( reply.html_url );
	  $('.js-create-gist').attr('href', reply.html_url);
	  $viewGist = $('<li><a class="js-view-gist" href="'+ reply.html_url +'"> View Gist </a></li>');
	  $('.js-create-gist').parent().after( $viewGist );
	  $('.js-create-gist').remove();
        });
    });

    $(function(){
      var hash = window.location.hash.substr(1);
      if ( hash ) {
        editor.getDoc().setValue( atob( hash ) );
      } else if ( localStorage.data ){
        editor.getDoc().setValue( atob( localStorage.data ) );
      }
    });