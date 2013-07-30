DungeonTracker::Application.routes.draw do
  resources :identities
  resources :users
  resources :campaigns
end
