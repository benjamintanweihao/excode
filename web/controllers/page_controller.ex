defmodule Excode.PageController do
  use Excode.Web, :controller

  plug :action

  def index(conn, _params) do
    render conn, "index.html"
  end
end
