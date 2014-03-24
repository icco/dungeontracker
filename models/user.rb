class User < ActiveRecord::Base
  has_many :characters
  validate :email, presence: true, email: true, uniqueness: true

  def self.new_by_email email
    user = User.new
    user.email = email
    user.save

    user
  end
end
