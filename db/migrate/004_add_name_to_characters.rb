class AddNameToCharacters < ActiveRecord::Migration
  def self.up
    change_table :characters do |t|
      t.string :name
    end
  end

  def self.down
    change_table :characters do |t|
      t.remove :name
    end
  end
end
