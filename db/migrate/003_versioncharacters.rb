class Versioncharacters < ActiveRecord::Migration
  def self.up
    create_table :character_data do |t|
      t.integer :character_id
      t.text :data
      t.datetime :timestamp
    end

    change_table :characters do |t|
      t.remove :data
    end
  end

  def self.down
    drop_table :character_data
    change_table :characters do |t|
      t.text :data
    end
  end
end
