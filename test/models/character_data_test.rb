require File.expand_path(File.dirname(__FILE__) + '/../test_config.rb')

describe "CharacterData Model" do
  it 'can construct a new instance' do
    @character_data = CharacterData.new
    refute_nil @character_data
  end
end
