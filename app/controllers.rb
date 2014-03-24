DungeonTracker::App.controllers  do
  layout :main

  get :index do
    if authenticated?
      redirect url_for(:characters)
    else
      render :index
    end
  end

  post :login do
    @user = User.by_email params["email"]
    session[:user] = @user.id
    redirect url_for(:characters)
  end

  get :logout do
    if session
      session[:user] = nil
    end

    redirect url_for(:index)
  end

  get :characters do
    if authenticated?
      @chars = Character.all
      render :characters
    else
      redirect url_for(:index)
    end
  end

  get :new_character do
    c = Character.new
    c.user = current_user
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
    @c = Character.where(id: params[:id]).first
    if @c.nil?
      404
    else
      p params
      redirect url_for(:edit_character, id: @c.id)
    end
  end

  get :view_character, :map => '/character/:id' do
    render :view_character
  end
end
