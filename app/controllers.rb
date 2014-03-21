DungeonTracker::App.controllers  do
  layout :main

  get :index do
    render :index
  end

  post :login do
    # blah
  end

  get :new_character do
    render :new_character
  end
end
