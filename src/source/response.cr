module Source
  struct InfoResponse
    # Protocol version used by the server.
    getter protocol : UInt8?
    # Name of the server.
    getter name : String?
    # Map the server has currently loaded.
    getter map : String?
    # Name of the folder containing the game files.
    getter folder : String?
    # Full name of the game.
    getter game : String?
    # Steam Application ID of game.
    getter app : UInt16?
    # Number of players on the server.
    getter players : UInt8?
    # Maximum number of players the server reports it can hold.
    getter max_players : UInt8?
    # Number of bots on the server.
    getter bots : UInt8?
    # Type of the server
    getter type : Source::ServerType?
    # Operating system of the server,
    getter os : Source::OS?
    # Indicates whether the server requires a password,
    getter password : Bool?
    # Specifies whether the server uses VAC,
    getter secure : Bool?

    def initialize(@protocol = nil, @name = nil, @map = nil, @folder = nil, @game = nil, @app = nil, @players = nil, @max_players = nil,
                   @bots = nil, @type = nil, @os = nil, @password = nil, @secure = nil)
    end
  end
end
