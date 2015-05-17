defmodule Excode.Mixfile do
  use Mix.Project

  def project do
    [app: :excode,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps]
  end

  def application do
    [mod: {Excode, []},
     applications: [:phoenix, :cowboy, :logger,
                    :phoenix_ecto, :postgrex, :octex]]
  end

  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  defp deps do
    [{:phoenix, "0.13.0", override: true},
     {:phoenix_ecto, "~> 0.4"},
     {:postgrex, ">= 0.0.0"},
     {:phoenix_live_reload, "~> 0.4"},
     {:phoenix_html, "~> 1.0"},
     {:cowboy, "~> 1.0"},
     {:uuid, "~> 1.0"},
     {:timex, "~> 0.13.4"},
     {:octex, git: "git://github.com/benjamintanweihao/octex.git"}
   ]
  end
end
