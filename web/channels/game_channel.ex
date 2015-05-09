defmodule Excode.GameChannel do
  use Phoenix.Channel
  alias Excode.Game
  alias Excode.Exercise

  def join("games:12345", message, socket) do
    {:ok, socket}
  end

  def handle_in("ingame:ready", message, socket) do
    exercise = %Exercise{
      id:          "some-random-id",
      lang:        "ruby",
      projectName: "Jekyll",
      code: "def foo\nend\n"
      # code: "alias_command :server, :serve\n\ncommand :doctor do |c|\n  c.syntax = 'jekyll doctor'\n  c.description = 'Search site and print specific deprecation warnings'\n\n  c.option '--config CONFIG_FILE[,CONFIG_FILE2,...]', Array, 'Custom configuration file'\n\n  c.action do |args, options|\n    options = normalize_options(options.__hash__)\n    options = Jekyll.configuration(options)\n    Jekyll::Commands::Doctor.process(options)\n  end\nend\nalias_command :hyde, :doctor\n"
    }

    game = %Game{
      lang: exercise.lang,
      exercise: exercise,
      starting: true
    }

    push socket, "ingame:ready:res", %{
      success: true,
      game: game
    }
    
    {:noreply, socket}
  end

  def handle_in("ingame:complete", message, socket) do
    push socket, "ingame:complete:res", message
    {:noreply, socket}
  end

  def terminate(socket, message) do
    socket
  end

end
