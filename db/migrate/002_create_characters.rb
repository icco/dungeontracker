class CreateCharacters < ActiveRecord::Migration
  def self.up
    create_table :characters do |t|
      t.integer :user_id
      t.text :data
      t.timestamps
    end
  end

  def self.down
    drop_table :characters
  end
end
