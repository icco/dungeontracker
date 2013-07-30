DungeonTracker::Application.routes.draw do
  # Root
  get '/' => 'home#index'

  # Auth config
  get '/login' => 'sessions#new'
  get '/logout' => 'sessions#destroy'
  match '/auth/:provider/callback' => 'sessions#create', via: [:get, :post]

  resources :identities
  resources :users
  resources :campaigns
end
