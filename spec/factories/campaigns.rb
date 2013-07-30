# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :campaign do
    name "MyString"
    description "MyText"
    begin_date "2013-07-29 21:54:57"
    dm_id 1
    players ""
  end
end
