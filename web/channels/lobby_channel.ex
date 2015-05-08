defmodule Excode.LobbyChannel do
  use Phoenix.Channel

  def join("lobby", message, socket) do
    {:ok, socket}
  end

  def handle_in("games:fetch", _message, socket) do
    push socket, "games:fetch:res", %{
      games: []
    }

    {:noreply, socket}
  end

  def handle_in("games:create", message, socket) do
    # 1. Find user
    # 2. Create new game (language)
    # 3. Emit success
    push socket, "games:create:res", %{}
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

end
