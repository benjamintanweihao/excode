defmodule Excode.Game do
  alias Excode.Exercise

  defstruct id: nil,
          lang: nil,
      exercise: %Exercise{},      
    isComplete: false,
    isJoinable: true,
isSinglePlayer: true,
    maxPlayers: 4,
    numPlayers: 0,
       players: []
end

