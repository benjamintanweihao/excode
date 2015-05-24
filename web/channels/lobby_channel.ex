defmodule Excode.LobbyChannel do
  use Phoenix.Channel
  alias Excode.GamesServer
  alias Excode.PlayersServer
  alias Excode.Game
  alias Excode.Exercise

  #######################
  # WebSocket Callbacks #
  #######################

  def join("lobby", message, socket) do
    PlayersServer.add_player(message["player"])
    {:ok, socket}
  end

  def handle_in("games:fetch", _message, socket) do
    push socket, "games:fetch:res", %{
      games: GamesServer.fetch_games
    }
    {:noreply, socket}
  end

  def handle_in("languages:fetch", _message, socket) do
    push socket, "languages:fetch:res", %{
      languages: Octex.fetch_languages
    }
    {:noreply, socket}
  end

  def handle_in("games:create", message, socket) do
    player    = message["player"]
    game_type = message["gameType"]
    lang      = message["lang"]

    result = case PlayersServer.get_player(player["id"]) do
      nil -> 
        %{success: false}

      _  ->
        res = lang 
               |> create_exercise 
               |> create_game(game_type, player)

        case res do
          {:ok, game} ->
            case GamesServer.add_game(game) do
              :ok ->  
                %{success: true, game: game}
              _ ->
                %{success: false, reason: "Failed to add game"}
            end

            {:error, reason} ->
              %{success: false, reason: reason}
        end
    end

    push socket, "games:create:res", result 
    {:noreply, socket}
  end

  def handle_in("games:join", %{"game" => game_id, "player" => player}, socket) do
    game = GamesServer.add_player(game_id, player)

    push socket, "games:join:res", %{
      success: true,
      game: game
    }
    {:noreply, socket}
  end

  def terminate(_reason, _socket) do
    :ok
  end

  ###############
  # Private API #
  ###############

  defp create_game({:error, reason}, _game_type, _player) do
    {:error, reason}
  end

  defp create_game(exercise, game_type, player) do
    case game_type do
      "single" -> {:ok, create_single_player_game(exercise, player) }
      "multi"  -> {:ok, create_multi_player_game(exercise, player) }
    end
  end

  defp create_single_player_game(exercise, player) do
    %Game{ 
      id:             UUID.uuid1(),
      lang:           exercise.lang,
      starting:       true,
      exercise:       exercise,      
      isSinglePlayer: true,
      maxPlayers:     1,
      numPlayers:     1,
      players:        [player],
      gameType:       "single",
      status:         "waiting", 
      startTime:      GamesServer.start_time
    }
  end

  defp create_multi_player_game(exercise, player) do
    %Game{ 
      id:             UUID.uuid1(),
      lang:           exercise.lang,
      starting:       false,
      exercise:       exercise,      
      isSinglePlayer: false,
      isJoinable:     true,
      maxPlayers:     4,
      numPlayers:     1,
      players:        [player],
      gameType:       "multi",
      status:         "waiting"
    }
  end

  defp create_exercise(lang) do
    case Octex.fetch_code(lang) do
      {:ok, code} ->
        %Exercise{"lang": lang |> String.downcase, "code": code}

      {:error, reason} -> 
        {:error, reason}
    end
  end

end
