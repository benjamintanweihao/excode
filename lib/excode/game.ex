defmodule Excode.Game do
  alias Excode.Exercise

  defstruct id: nil,
          lang: nil,
      exercise: %Exercise{},      
    isComplete: false,
    isJoinable: false,
isSinglePlayer: false,
    maxPlayers: 0,
    numPlayers: 0,
       players: [],
      gameType: nil,
        status: "waiting",
       started: false,
      starting: false,
     startTime: nil,
        winner: nil
end

