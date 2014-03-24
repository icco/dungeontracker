class AddUserIdToCharacterData < ActiveRecord::Migration
  def self.up
    change_table :characterdata do |t|
      t.integer :user_id
    end
  end

  def self.down
    change_table :characterdata do |t|
      t.remove :user_id
    end
  end
end
