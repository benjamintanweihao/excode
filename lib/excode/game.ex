defmodule Excode.Game do
  alias Excode.Exercise

  defstruct id: nil,
          lang: nil,
      starting: true,
      exercise: %Exercise{},      
    isComplete: false,
    isJoinable: false,
isSinglePlayer: true,
    maxPlayers: 4,
    numPlayers: 0,
       players: [],
      gameType: nil,
        status: "waiting",
       started: false,
      starting: false,
     startTime: nil
end

