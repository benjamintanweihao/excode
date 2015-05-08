defmodule Excode.GameChannel do
  use Phoenix.Channel

  def join(socket, "games:12345", message) do
    {:ok, socket}
  end

  def event(socket, "join", message) do
    player_id = socket.assigns[:player_id]

    broadcast socket, "player:new", %{
      player_id: player_id
    }
    
    socket
  end

  def terminate(socket, message) do
    socket
  end

end
