module Source
    class Socket < UDPSocket
        # Reads string terminated by `0x00`
        def read_source_string : String
            array = [] of UInt8

            while true
                byte = read_byte
                if byte == 0x00 
                    break
                end
                array << byte.not_nil!
            end

            String.new Slice.new array.to_unsafe, array.size
        end

        # Reads byte as `Source::OS`
        def read_source_os : Source::OS
            byte = read_byte
            
            if byte == 108
                return Source::OS::Linux
            elsif byte == 119
                return Source::OS::Windows
            else
                return Source::OS::Mac
            end
        end

        # Reads byte as `Source::ServerType`
        def read_source_type : Source::ServerType
            byte = read_byte
            
            if byte == 100
                return Source::ServerType::Dedicated
            elsif byte == 108
                return Source::ServerType::Localhost
            else
                return Source::ServerType::Proxy
            end
        end

        # Reads 2 bytes as short
        def read_short : UInt16
            bytes = Bytes.new 2
            read_fully bytes
            
            Pack.unpack(bytes, "v")[0]
        end
        
        # Reads byte as `Bool`
        def read_bool : Bool
            read_byte == 1 ? true : false
        end
    end
end