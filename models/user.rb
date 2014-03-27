class User < ActiveRecord::Base
  has_many :characters, -> { where hidden: false }, autosave: true
  validate :email, presence: true, email: true, uniqueness: true

  def self.by_email email
    user = User.find_or_create_by(email: email)
    user.save if user.valid?

    user
  end
end
