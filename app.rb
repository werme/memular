# app.rb
require "sinatra"
require "sinatra/activerecord"
require "sinatra/json"
require "json"

set :database, "sqlite3:///memular.db"

class Node < ActiveRecord::Base
  belongs_to :list

  validates :word, :translation, presence: true
end

class List < ActiveRecord::Base
  has_many :nodes

  validates :title, uniqueness: true
end

get "/" do
  haml :"index"
end

get "/nodes" do
  json Node.order("created_at DESC")
end

post "/lists" do
  l = List.new(params[:list])
  if(l.save)
    json l
  end
end

post "/nodes" do
  n = Node.new(params[:node])
  if(n.save)
    json n
  end
end

post "/list/nodes/:title" do
  n = Node.new(params[:node])
  n.list = List.where(title: URI.decode(params[:title])).first
  if(n.save)
    json n
  end
end

delete "/nodes/delete/:id" do
  Node.find(params[:id]).delete
end

delete "/list/:id/delete" do
  List.find(params[:id]).delete
end

get "/list/:title" do
  json List.where(title: params[:title]).first.nodes
end

get "/lists" do
  json List.order("created_at DESC")
end

delete "lists/delete/:id" do

end
