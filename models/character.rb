class Character < ActiveRecord::Base
  belongs_to :user
  validate :name, presence: true
  after_initialize :init

  def init
    self.hidden ||= false
  end

  def hidden?
    self.hidden ||= false
  end

  def character_datum
    CharacterData.where(character_id: self.id).order(timestamp: :desc)
  end

  def last_modified
    self.character_datum.maximum(:timestamp) || self.updated_at
  end

  def data
    cd = self.character_datum.first
    if cd.nil?
      data = "{}"
    else
      data = cd.data
    end
    return JSON.parse(data)
  end

  def data= new_data
    set_data(new_data, self.user)
  end

  def set_data new_data, writer
    cd = CharacterData.new
    cd.data = new_data.to_json
    cd.character = self
    cd.user = writer
    cd.timestamp = Time.now
    cd.save

    return cd.data
  end
end
