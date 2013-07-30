class User < ActiveRecord::Base
  validates :name, :uniqueness => true, :presence => true, :format => { :with => /\A[0-9a-zA-Z]+\z/, :message => "Only numbers and letters allowed." }
  validates :email, :email => true, :allow_nil => true
end
