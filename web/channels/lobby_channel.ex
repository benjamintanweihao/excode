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
    player    = message["player"]
    game_type = message["gameType"]

    result = case PlayersServer.get_player(player["id"]) do
      nil -> 
        %{success: false}

      _  ->
        # TODO: lang should be taken from message["lang"]
        lang     = "ruby"
        exercise = create_exercise(lang)
        game     = create_game(player, exercise, game_type)

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

  defp create_single_player_game(player, exercise) do
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

  defp create_multi_player_game(player, exercise) do
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

  def create_game(player, exercise, game_type) do
    case game_type do
      "single" -> create_single_player_game(player, exercise)
      "multi"  -> create_multi_player_game(player, exercise)
    end
  end

  defp create_exercise(lang) do
    %Exercise{
      "lang":        lang,
      "projectName": "Jekyll",
      # "code": "alias_command :server, :serve\n\ncommand :doctor do |c|\n  c.syntax = 'jekyll doctor'\n  c.description = 'Search site and print specific deprecation warnings'\n\n  c.option '--config CONFIG_FILE[,CONFIG_FILE2,...]', Array, 'Custom configuration file'\n\n  c.action do |args, options|\n    options = normalize_options(options.__hash__)\n    options = Jekyll.configuration(options)\n    Jekyll::Commands::Doctor.process(options)\n  end\nend\nalias_command :hyde, :doctor\n"
      "code": "def\nend\n"
    }
  end

end
