require 'sinatra'
require 'sass'
require 'rest-client'
require 'json'
require './env' if File.exists?('env.rb')

CLIENT_ID = ENV['GH_BASIC_CLIENT_ID']
CLIENT_SECRET = ENV['GH_BASIC_SECRET_ID']
access_token = ''

get '/' do
  erb :index, :locals => { :client_id => CLIENT_ID , :access_token => access_token }
end

post '/create-gist' do
  input_name = 'sasscade-input-' + Time.now.to_i.to_s + '.scss'
  output_name = 'sasscade-output-' + Time.now.to_i.to_s + '.css'
  res = RestClient.post('https://api.github.com/gists?access_token='+ access_token,
		         {
			    'description' => 'a sasscade production',
			    'public' => true,
			    'files' => {
			      input_name => {
				"content"=> params[:sass]
			      },
			      output_name => {
				"content"=> params[:css]
			      }
			    }
                         }.to_json
		       ) 
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
  redirect to('/');
end
