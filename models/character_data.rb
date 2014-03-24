class CharacterData < ActiveRecord::Base
  belongs_to :character
  belongs_to :user
end
