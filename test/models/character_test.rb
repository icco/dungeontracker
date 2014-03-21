require File.expand_path(File.dirname(__FILE__) + '/../test_config.rb')

describe "Character Model" do
  it 'can construct a new instance' do
    @character = Character.new
    refute_nil @character
  end
end
