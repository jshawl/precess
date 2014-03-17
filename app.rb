require 'sinatra'
require 'sass'
set :environment, :production

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
    @css = e
  end
  erb :compile
end
