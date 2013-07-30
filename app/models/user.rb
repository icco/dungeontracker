class User < ActiveRecord::Base
  validates :name, :uniqueness => true, :presence => true, :format => { :with => /\A[0-9a-zA-Z]+\z/, :message => "Only numbers and letters allowed." }
  validates :email, :email => true, :allow_nil => true

  def User.login email, password
    identity = Identity.authenticate(email, password)

    if identity
      user = User.find_or_create_by_email email
      p user.errors.messages if !user.valid?

      return user
    else
      return nil
    end
  end
end
