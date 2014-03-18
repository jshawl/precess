require 'sinatra'
require 'sass'

get '/' do
  erb :index
end

post '/compile' do
  begin
    @sass = params[:sass]
    sass = Sass::Engine.new(@sass, {
      :syntax => :scss,
      :style => :expanded
    })
    @css = sass.render
  rescue Sass::SyntaxError => e
    res = "Line " + e.sass_line.to_s + ": "  +  e.to_s
    @css = res
  end
  erb :compile
end
