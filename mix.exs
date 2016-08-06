defmodule Venture.Mixfile do
  use Mix.Project

  def project do
    [app: :venture,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [mod: {Venture, []},
     applications: [:phoenix, :phoenix_pubsub, :cowboy, :logger, :yaml_elixir]]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies
  #
  # Type `mix help deps` for examples and options
  defp deps do
    [
      {:phoenix, "~> 1.2.0"},
      {:phoenix_pubsub, "~> 1.0"},
      {:cowboy, "~> 1.0"},
      {:uuid, "~> 1.0.1"},
      {:yaml_elixir, "~> 1.0.0"},
      {:yamerl, github: "yakaz/yamerl"}
    ]
  end
end
