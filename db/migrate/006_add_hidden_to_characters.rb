class AddHiddenToCharacters < ActiveRecord::Migration
  def self.up
    change_table :characters do |t|
      t.boolean :hidden
    end
  end

  def self.down
    change_table :characters do |t|
      t.remove :hidden
    end
  end
end
