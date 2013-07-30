class SessionsController < ApplicationController
  def new
  end

  def create
    self.current_user = User.login(params['auth_key'], request['password'])

    if self.current_user
      redirect_to '/', notice: "Logged in."
    else
      failure
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/', notice: "Signed out!"
  end

  def failure
    redirect_to '/', alert: "Authentication failed, please try again."
  end
end
