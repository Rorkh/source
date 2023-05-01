require "socket"
require "json"

module Source
  class Query
    def initialize(@ip : String, @port : UInt32)
      @client = Source::Socket.new
      @client.connect @ip, @port
      @client.read_timeout = 2
    end

    # Closes connection
    def close
      @client.close
    end

    private def proccess_challenge(code : UInt8)
      challenge = Bytes.new(4)
      @client.read_fully challenge

      handshake code, challenge
    end

    private def handshake(code : UInt8, challenge : Bytes? = nil)
      body = [0xFF_u8, 0xFF_u8, 0xFF_u8, 0xFF_u8, code]

      body.concat "Source Engine Query\0".to_slice
      if !challenge.nil?
        body.concat challenge.not_nil!
      end

      @client.write Slice.new body.to_unsafe, body.size
    end

    # Returns info about server
    def info : Source::InfoResponse
      handshake Source::A2S_INFO

      # Skip magic bytes
      @client.skip 4
      header = @client.read_byte

      if header == Source::S2C_CHALLENGE
        proccess_challenge Source::A2S_INFO
        # Skip magic bytes and header
        @client.skip 4
      end

      protocol = @client.read_byte

      name = @client.read_source_string
      map = @client.read_source_string
      folder = @client.read_source_string
      game = @client.read_source_string
      app = @client.read_short

      players = @client.read_byte
      max_players = @client.read_byte
      bots = @client.read_byte
      type = @client.read_source_type
      environment = @client.read_source_os
      password = @client.read_bool
      secure = @client.read_bool

      Source::InfoResponse.new protocol, name, map, folder, game, app, players, max_players, bots, type, environment, password, secure
    end
  end
end
