defmodule Excode.LobbyChannel do
  use Phoenix.Channel

  defmodule Game do
    defstruct _id: nil, 
         exercise: "123", 
       isComplete: false,
       isJoinable: true,
   isSinglePlayer: false,
       isViewable: true,
             lang: "ruby",
         langName: "Ruby",
       maxPlayers: 4,
       numPlayers: 1,
      players: ["player8904"]
  end

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
    # 2. Create new game
    # 3. Emit success
    push socket, "games:create:res", %{}
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

end
