require 'sinatra'
require 'sass'

get '/' do
  erb :index
end

post '/compile' do
  @sass = params[:sass]
  sass = Sass::Engine.new(@sass, {
    :syntax => :scss,
    :style => :expanded
  })
  @css = sass.render
  erb :compile
end
