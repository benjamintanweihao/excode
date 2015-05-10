defmodule Excode do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      supervisor(Excode.Endpoint, []),
      worker(Excode.Repo, []),
      worker(Excode.PlayersServer, []),
      worker(Excode.GamesServer, []),
    ]

    opts = [strategy: :one_for_one, name: Excode.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    Excode.Endpoint.config_change(changed, removed)
    :ok
  end
end
