require File.expand_path(File.dirname(__FILE__) + '/../test_config.rb')

describe "User Model" do
  it 'can construct a new instance' do
    @user = User.new
    refute_nil @user
  end
end
