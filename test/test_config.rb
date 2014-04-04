RACK_ENV = 'test' unless defined?(RACK_ENV)
require File.expand_path('../../config/boot', __FILE__)

p ActiveRecord::Base.configurations, Padrino.env, ENV['DATABASE_URL']

class MiniTest::Unit::TestCase
  include Rack::Test::Methods

  # You can use this method to custom specify a Rack app
  # you want rack-test to invoke:
  #
  #   app DungeonTracker::App
  #   app DungeonTracker::App.tap { |a| }
  #   app(DungeonTracker::App) do
  #     set :foo, :bar
  #   end
  #
  def app(app = nil, &blk)
    @app ||= block_given? ? app.instance_eval(&blk) : app
    @app ||= Padrino.application
  end
end
