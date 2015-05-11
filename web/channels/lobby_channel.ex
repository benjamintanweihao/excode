defmodule Excode.LobbyChannel do
  use Phoenix.Channel
  alias Excode.GamesServer
  alias Excode.PlayersServer
  alias Excode.Game
  alias Excode.Exercise

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

  def handle_in("games:create", message, socket) do
    result = case PlayersServer.get_player(message["player"]["id"]) do
      nil -> 
        %{success: false}

      _  ->
        exercise = %Exercise{
          "lang":        "ruby",
          "projectName": "Jekyll",
          "code": "alias_command :server, :serve\n\ncommand :doctor do |c|\n  c.syntax = 'jekyll doctor'\n  c.description = 'Search site and print specific deprecation warnings'\n\n  c.option '--config CONFIG_FILE[,CONFIG_FILE2,...]', Array, 'Custom configuration file'\n\n  c.action do |args, options|\n    options = normalize_options(options.__hash__)\n    options = Jekyll.configuration(options)\n    Jekyll::Commands::Doctor.process(options)\n  end\nend\nalias_command :hyde, :doctor\n"
        }

        game_type = message["gameType"]
        is_single_player = case game_type do
          "single" -> true
          _ -> false
        end

        game = %Game{
          "id":             UUID.uuid1(),
          "lang":           exercise.lang,
          "exercise":       exercise,
          "starting":       true,
          "numPlayers":     1,  
          "players":        [message["player"]],
          "gameType":       game_type,
          "isSinglePlayer": is_single_player 
        }

        case GamesServer.add_game(game) do
          :ok ->  
            %{success: true, game: game}
          _ ->
            %{success: false}
        end
    end

    push socket, "games:create:res", result 
    {:noreply, socket}
  end

  def handle_in("games:join", %{"game" => game_id, "player" => player} = message, socket) do
    game = GamesServer.get_game(game_id)    
    game = GamesServer.add_player(game_id, player)

    push socket, "games:join:res", %{
      success: true,
      game: game
    }
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

end
