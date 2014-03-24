class Character < ActiveRecord::Base
  belongs_to :user
  has_many :character_data

end
