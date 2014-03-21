module DungeonTracker
  class App < Padrino::Application
    register SassInitializer
    use ActiveRecord::ConnectionAdapters::ConnectionManagement
    register Padrino::Rendering
    register Padrino::Mailer
    register Padrino::Helpers

    enable :sessions

    ##
    # Caching support.
    register Padrino::Cache
    enable :caching

    ##
    # Application configuration options.
    set :dump_errors, true        # Exception backtraces are written to STDERR (default for production/development)
    set :logging, true            # Logging in STDOUT for development and file for production (default only for development)
    set :css_asset_folder, 'css'
    set :js_asset_folder, 'js'

    ##
    # Errors
    error 404 do
      render 'errors/404'
    end
  end
end
