require File.expand_path(File.dirname(__FILE__) + '/../test_config.rb')

describe "ENV" do
  it 'must contain a DATABASE_URL' do
    refute_nil ENV['DATABASE_URL']
  end
end
