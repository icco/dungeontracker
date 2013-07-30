class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.string :name
      t.text :description
      t.datetime :begin_date
      t.integer :dm_id
      t.integer_array :players

      t.timestamps
    end
  end
end
