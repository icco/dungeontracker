class AddUserIdToCharacterData < ActiveRecord::Migration
  def self.up
    change_table :character_data do |t|
      t.integer :user_id
    end
  end

  def self.down
    change_table :character_data do |t|
      t.remove :user_id
    end
  end
end
