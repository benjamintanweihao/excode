defmodule Excode.Game do
  alias Excode.Exercise

  defstruct "id": nil,
          "lang": nil,
      "starting": true,
      "exercise": %Exercise{},      
    "isComplete": false,
    "isJoinable": true,
"isSinglePlayer": true,
    "maxPlayers": 4,
    "numPlayers": 0,
       "players": [],
     "game_type": nil
end

