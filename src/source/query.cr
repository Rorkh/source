require "socket"

module Source
    class Query
        def initialize(@ip : String, @port : UInt32)
            @client = UDPSocket.new
            @client.connect @ip, @port
            @client.read_timeout = 2
        end

        def close
            @client.close
        end

        def challenge(code : UInt8)
            @client.write_byte code
            @client.write_string "\xFF\xFF\xFF\xFF".to_slice

            puts "header"

            header = Bytes.new 1
            @client.read_fully header
        end

        def info
            # Write header byte
            @client.write_byte 0x54_u8
            @client.write_string "Source Engine Query\0".to_slice

            resp = Bytes.new 1
            @client.read_fully resp
        end

        def rules
            @client.write_byte 0x56_u8

            resp = Bytes.new 1
            @client.read_fully resp
        end
    end
end