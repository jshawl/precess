    var myTextarea = document.querySelector('.js-input');
    var editor = CodeMirror.fromTextArea(myTextarea, {
      matchBrackets: true,
      mode: "text/x-scss",
      lineNumbers:true,
      lineWrapping: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      foldGutter: true
    });
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
    function refresh(cm){
      clearTimeout(timer);
      timer = setTimeout(function(){
	save( null );
	var lang = cm.getTextArea().name;
        $.ajax({
	  type: "POST",
	  url: '/compile',
	  data: { lang : lang, input : cm.getValue()}
	}).done( function(res){
          $('.js-css').val( res );
          csseditor.getDoc().setValue(res);
        }).fail(function (err, msg){
        });
      }, 1000);
    }
    editor.on('change', refresh );

    function save( event ){
      if (event) event.preventDefault();
      if( $('.js-view-gist') ){
        $createGist = $('<li><a href="/create-gist" class="js-create-gist">Create Gist</a></li>');
	$('.js-view-gist').parent().after( $createGist );
        $('.js-view-gist').parent().remove(); 
      }
      var data = editor.getValue();
      var lang = editor.getTextArea().name;
      localStorage.setItem('data', lang+':'+btoa(data) );
      if( !data ){
        window.location.hash = lang;
      }else{
	window.location.hash = lang+':'+btoa(data);
      }
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
	  $('.js-create-gist').attr('href', reply.html_url);
	  $viewGist = $('<li><a class="js-view-gist" href="'+ reply.html_url +'"> View Gist </a></li>');
	  $('.js-create-gist').parent().after( $viewGist );
	  $('.js-create-gist').remove();
        });
    });

   $('.opts').on('click', function(event){
    event.preventDefault();
  $(this).toggleClass('active');
    
});

$('.opts a').on('click', function(){
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  var lang = $(this).attr('data-lang');
  var mode = editor.options.mode;
  var simplemode = mode.split('-')[1];
  if (!mode.match( lang )) {
    editor.options.mode = 'text/x-' + lang;
    $('.js-input').attr('name', lang);
    refresh( editor );
  }
}); 

    $(function(){
      var hash = window.location.hash.substr(1);
      var input = hash.split(':')[1];
      var lang = hash.split(':')[0];
      if ( !hash.match(':')){
        input = hash;
	lang = 'scss';
      }

      if ( input || lang ) {
	editor.options.mode = 'text/x-'+lang;
	$('.js-input').attr('name', lang);
	$("[data-lang='"+lang+"']").addClass('active').siblings().removeClass('active');
	if (input){
	  editor.getDoc().setValue( atob( input ) );
	}
      } else if ( localStorage.data ){
        editor.getDoc().setValue( atob( localStorage.data ) );
      }
    });