DungeonTracker::App.controllers  do
  layout :main

  get :index do
    render :index
  end

  post :login do
    # blah
  end

  get :new_character do
    c = Character.new
    c.save
    redirect url_for(:edit_character, :id => c.id)
  end

  get :edit_character, :map => '/character/:id' do
    @c = Character.where(id: params[:id]).first
    if @c.nil?
      404
    else
      render :edit_character
    end
  end

  post :edit_character, :map => '/character/:id' do
    p params
    render :edit_character
  end

  get :view_character, :map => '/character/:id' do
    render :view_character
  end
end
