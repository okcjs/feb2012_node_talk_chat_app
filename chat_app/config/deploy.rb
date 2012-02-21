default_run_options[:pty] = true

set :application, 'chat_app'
set :repository,  "https://DataChomp@github.com/okcjs/feb2012_node_talk_chat_app.git"
set :domain, 'okcjs.ideasrun.com'

set :user, "jsdemo"  # The server's user for deploys

set :deploy_via, :remote_cache
set :scm, :git
set :branch, "master"
set :scm_verbose, true
set :use_sudo, false

set :deploy_to, "~/sites/#{application}"

role :web, domain                         # Your HTTP server, Apache/etc
role :app, domain                          # This may be the same as your `Web` server