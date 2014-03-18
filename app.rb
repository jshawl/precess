require 'sinatra'
require 'sass'
require 'rest-client'
require 'json'

#CLIENT_ID = '5cac1a56407e03f6be13'
#CLIENT_SECRET = 'f816936b30905962b17fe826f7a60d8f2519dc30'

CLIENT_ID = ENV['GH_BASIC_CLIENT_ID']
puts 'CID'
puts ENV
CLIENT_SECRET = ENV['GH_BASIC_SECRET_ID']


get '/' do
  erb :index, :locals => { :client_id => CLIENT_ID }
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

get '/callback' do
  session_code = request.env['rack.request.query_hash']['code']
  result = RestClient.post('https://github.com/login/oauth/access_token',
                          {:client_id => CLIENT_ID,
                           :client_secret => CLIENT_SECRET,
                           :code => session_code},
                           :accept => :json)
  access_token = JSON.parse(result)['access_token']
  puts access_token
end
