defmodule Excode.LobbyChannel do
  use Phoenix.Channel

  def join("lobby", message, socket) do
    {:ok, socket}
  end

  def handle_in("games:fetch", _message, socket) do
    push socket, "games:fetch:res", %{
      games: [%Excode.Game{id: 12345}]
    }

    {:noreply, socket}
  end

  def handle_in("games:create", message, socket) do
    # 1. Find user
    # 2. Create new game (language), add player to game
    # 3. Check if single or multiplayer
    # 4. Emit success
    push socket, "games:create:res", %{}
    {:noreply, socket}
  end

  def handle_in("games:join", %{"game" => game_id, "player" => player_id} = message, socket) do
    # 1. Find game
    # 2. Add player to game
    message = Map.put(message, "success", true)
    push socket, "games:join:res", message
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

end
