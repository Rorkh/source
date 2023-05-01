crystal_doc_search_index_callback({"repository_name":"source","body":"# source\n\n[Source Query](https://developer.valvesoftware.com/wiki/Server_queries) library for crystal\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n   ```yaml\n   dependencies:\n     source:\n       github: Rorkh/source\n   ```\n\n2. Run `shards install`\n\n## Usage\n\n```crystal\nrequire \"source\"\n\nquery = Source::Query.new \"37.230.162.62\", 27015\ninfo = query.info\n\nputs info.players\n\nquery.close\n```\n\n## Contributing\n\n1. Fork it (<https://github.com/Rorkh/source/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Rorkh](https://github.com/Rorkh) - creator and maintainer\n","program":{"html_id":"source/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"locations":[],"repository_name":"source","program":true,"enum":false,"alias":false,"const":false,"types":[{"html_id":"source/Pack","path":"Pack.html","kind":"module","full_name":"Pack","name":"Pack","abstract":false,"locations":[{"filename":"src/lib/unpack.cr","line_number":4,"url":null}],"repository_name":"source","program":false,"enum":false,"alias":false,"const":false,"macros":[{"html_id":"unpack(bytes,fmt)-macro","name":"unpack","doc":"Unpacks a buffer of *bytes* according to the given format string *fmt*.\nReturns a `Tuple` of unpacked values, without flattening commands that\ncontain repeat counts or globs.\n\n*bytes* must be a `Bytes`. *fmt* must be a string literal or string constant\nrepresenting a valid sequence of unpacking commands.\n\n```\nPack.unpack(Bytes[0x01, 0xE8, 0x03, 0x05, 0xF5, 0xE1, 0x00], \"csl>\") # => {1_i8, 1000_i16, 100000000}\nPack.unpack(\"abcd\\x00ef\\x00\".to_slice, \"CCZ*a*\")                     # => {StaticArray[97_u8, 98_u8], Bytes[99, 100], Bytes[101, 102, 0]}\n```","summary":"<p>Unpacks a buffer of <em>bytes</em> according to the given format string <em>fmt</em>.</p>","abstract":false,"args":[{"name":"bytes","external_name":"bytes","restriction":""},{"name":"fmt","external_name":"fmt","restriction":""}],"args_string":"(bytes, fmt)","args_html":"(bytes, fmt)","location":{"filename":"src/lib/unpack.cr","line_number":405,"url":null},"def":{"name":"unpack","args":[{"name":"bytes","external_name":"bytes","restriction":""},{"name":"fmt","external_name":"fmt","restriction":""}],"visibility":"Public","body":"    \n{% if fmt.is_a?(Path) %}\n      {% fmt = fmt.resolve %}\n    {% end %}\n\n    \n{% if fmt.is_a?(StringLiteral) %}{% else %}\n      {% fmt.raise(\"format must be a string literal or constant\") %}\n    {% end %}\n\n\n    \n{% commands = [] of ASTNode %}\n\n    \n{% current = {directive: nil} %}\n\n\n    \n{% chars = fmt.chars %}\n\n    \n{% chars << ' ' %}\n\n    \n{% accepts_modifiers = false %}\n\n\n    \n{% for ch, index in chars %}\n      {% if \"cCsSlLqQiIjJnNvVdfFeEgGUwaAZbBhHumMpP@xX \\n\\t\\f\\v\\r\".includes?(ch) %}\n        {% if current[:directive] %}\n          {% current[:name] = chars[current[:index]...index].join(\"\") %}\n          {% commands << current %}\n        {% end %}\n\n        {% current = {directive: nil, index: index} %}\n        {% accepts_modifiers = false %}\n\n        {% if \" \\n\\t\\f\\v\\r\".includes?(ch) %}{% else %}\n          {% current[:directive] = ch %}\n          {% accepts_modifiers = \"sSlLqQjJiI\".includes?(ch) %}\n        {% end %}\n\n      {% else %}{% if (ch == '_') || (ch == '!') %}\n        {% unless accepts_modifiers\n  fmt.raise(\"#{ch} allowed only after directives sSiIlLqQjJ\")\nend %}\n        {% if current[:glob] || current[:count]\n  fmt.raise(\"#{ch} allowed only before '*' and count\")\nend %}\n        {% current[:bang] = true %}\n\n      {% else %}{% if ch == '<' %}\n        {% unless accepts_modifiers\n  fmt.raise(\"#{ch} allowed only after directives sSiIlLqQjJ\")\nend %}\n        {% if current[:glob] || current[:count]\n  fmt.raise(\"#{ch} allowed only before '*' and count\")\nend %}\n        {% if current[:endianness] == (:BigEndian)\n  fmt.raise(\"can't use both '<' and '>'\")\nend %}\n        {% current[:endianness] = :LittleEndian %}\n      {% else %}{% if ch == '>' %}\n        {% unless accepts_modifiers\n  fmt.raise(\"#{ch} allowed only after directives sSiIlLqQjJ\")\nend %}\n        {% if current[:glob] || current[:count]\n  fmt.raise(\"#{ch} allowed only before '*' and count\")\nend %}\n        {% if current[:endianness] == (:LittleEndian)\n  fmt.raise(\"can't use both '<' and '>'\")\nend %}\n        {% current[:endianness] = :BigEndian %}\n\n      {% else %}{% if ch == '*' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:directive] == '@'\n  fmt.raise(\"#{ch} not allowed for '@'\")\nend %}\n        {% if current[:directive] == 'P'\n  fmt.raise(\"#{ch} not allowed for 'P'\")\nend %}\n        {% if current[:count]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:glob] = true %}\n\n      {% else %}{% if ch == '0' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 0 %}\n      {% else %}{% if ch == '1' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 1 %}\n      {% else %}{% if ch == '2' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 2 %}\n      {% else %}{% if ch == '3' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 3 %}\n      {% else %}{% if ch == '4' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 4 %}\n      {% else %}{% if ch == '5' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 5 %}\n      {% else %}{% if ch == '6' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 6 %}\n      {% else %}{% if ch == '7' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 7 %}\n      {% else %}{% if ch == '8' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 8 %}\n      {% else %}{% if ch == '9' %}\n        {% unless current[:directive]\n  fmt.raise(\"#{ch} allowed only after a directive\")\nend %}\n        {% if current[:glob]\n  fmt.raise(\"can't use both '*' and count\")\nend %}\n        {% current[:count] = ((current[:count] || 0) * 10) + 9 %}\n\n      {% else %}{% if ch == 'D' %}\n        {% fmt.raise(\"long double is not supported, use 'd' instead\") %}\n\n      {% else %}\n        {% fmt.raise(\"unexpected directive: #{ch}\") %}\n      {% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}{% end %}\n    {% end %}\n\n\n    \n%obj\n = Pack::UnpackImpl.to_slice(\n{{ bytes }}\n)\n    \n%byte_offset\n = 0\n\n    \n{% used_indices = [] of ASTNode %}\n\n    \n{% for command in commands %}\n      {% if \"@xX\".includes?(command[:directive]) %}\n        Pack::UnpackImpl.do_unpack1(%obj, %byte_offset, {{ command }})\n      {% else %}\n        %values{command[:index]} = Pack::UnpackImpl.do_unpack1(%obj, %byte_offset, {{ command }})\n        {% used_indices << command[:index] %}\n      {% end %}\n    {% end %}\n\n\n    Tuple.new(\n      \n{% for index in used_indices %}\n        %values{index},\n      {% end %}\n\n    )\n  \n"}}]},{"html_id":"source/Source","path":"Source.html","kind":"module","full_name":"Source","name":"Source","abstract":false,"locations":[{"filename":"src/source.cr","line_number":6,"url":null},{"filename":"src/source/const/codes.cr","line_number":1,"url":null},{"filename":"src/source/const/os.cr","line_number":1,"url":null},{"filename":"src/source/const/type.cr","line_number":1,"url":null},{"filename":"src/source/query.cr","line_number":4,"url":null},{"filename":"src/source/response.cr","line_number":1,"url":null},{"filename":"src/source/socket.cr","line_number":1,"url":null}],"repository_name":"source","program":false,"enum":false,"alias":false,"const":false,"constants":[{"id":"A2A_PING","name":"A2A_PING","value":"105_u8"},{"id":"A2S_INFO","name":"A2S_INFO","value":"84_u8"},{"id":"A2S_PLAYER","name":"A2S_PLAYER","value":"85_u8"},{"id":"A2S_RULES","name":"A2S_RULES","value":"86_u8"},{"id":"A2S_SERVERQUERY_GETCHALLENGE","name":"A2S_SERVERQUERY_GETCHALLENGE","value":"87_u8"},{"id":"S2C_CHALLENGE","name":"S2C_CHALLENGE","value":"65_u8"},{"id":"VERSION","name":"VERSION","value":"\"0.1.0\""}],"types":[{"html_id":"source/Source/InfoResponse","path":"Source/InfoResponse.html","kind":"struct","full_name":"Source::InfoResponse","name":"InfoResponse","abstract":false,"superclass":{"html_id":"source/Struct","kind":"struct","full_name":"Struct","name":"Struct"},"ancestors":[{"html_id":"source/Struct","kind":"struct","full_name":"Struct","name":"Struct"},{"html_id":"source/Value","kind":"struct","full_name":"Value","name":"Value"},{"html_id":"source/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/source/response.cr","line_number":2,"url":null}],"repository_name":"source","program":false,"enum":false,"alias":false,"const":false,"namespace":{"html_id":"source/Source","kind":"module","full_name":"Source","name":"Source"},"constructors":[{"html_id":"new(protocol:UInt8|Nil=nil,name:Nil|String=nil,map:Nil|String=nil,folder:Nil|String=nil,game:Nil|String=nil,app:UInt16|Nil=nil,players:UInt8|Nil=nil,max_players:UInt8|Nil=nil,bots:UInt8|Nil=nil,type:Source::ServerType|Nil=nil,os:Source::OS|Nil=nil,password:Bool|Nil=nil,secure:Bool|Nil=nil)-class-method","name":"new","abstract":false,"args":[{"name":"protocol","default_value":"nil","external_name":"protocol","restriction":"::UInt8 | ::Nil"},{"name":"name","default_value":"nil","external_name":"name","restriction":"::Nil | ::String"},{"name":"map","default_value":"nil","external_name":"map","restriction":"::Nil | ::String"},{"name":"folder","default_value":"nil","external_name":"folder","restriction":"::Nil | ::String"},{"name":"game","default_value":"nil","external_name":"game","restriction":"::Nil | ::String"},{"name":"app","default_value":"nil","external_name":"app","restriction":"::UInt16 | ::Nil"},{"name":"players","default_value":"nil","external_name":"players","restriction":"::UInt8 | ::Nil"},{"name":"max_players","default_value":"nil","external_name":"max_players","restriction":"::UInt8 | ::Nil"},{"name":"bots","default_value":"nil","external_name":"bots","restriction":"::UInt8 | ::Nil"},{"name":"type","default_value":"nil","external_name":"type","restriction":"::Source::ServerType | ::Nil"},{"name":"os","default_value":"nil","external_name":"os","restriction":"::Source::OS | ::Nil"},{"name":"password","default_value":"nil","external_name":"password","restriction":"::Bool | ::Nil"},{"name":"secure","default_value":"nil","external_name":"secure","restriction":"::Bool | ::Nil"}],"args_string":"(protocol : UInt8 | Nil = nil, name : Nil | String = nil, map : Nil | String = nil, folder : Nil | String = nil, game : Nil | String = nil, app : UInt16 | Nil = nil, players : UInt8 | Nil = nil, max_players : UInt8 | Nil = nil, bots : UInt8 | Nil = nil, type : Source::ServerType | Nil = nil, os : Source::OS | Nil = nil, password : Bool | Nil = nil, secure : Bool | Nil = nil)","args_html":"(protocol : UInt8 | Nil = <span class=\"n\">nil</span>, name : Nil | String = <span class=\"n\">nil</span>, map : Nil | String = <span class=\"n\">nil</span>, folder : Nil | String = <span class=\"n\">nil</span>, game : Nil | String = <span class=\"n\">nil</span>, app : UInt16 | Nil = <span class=\"n\">nil</span>, players : UInt8 | Nil = <span class=\"n\">nil</span>, max_players : UInt8 | Nil = <span class=\"n\">nil</span>, bots : UInt8 | Nil = <span class=\"n\">nil</span>, type : <a href=\"../Source/ServerType.html\">Source::ServerType</a> | Nil = <span class=\"n\">nil</span>, os : <a href=\"../Source/OS.html\">Source::OS</a> | Nil = <span class=\"n\">nil</span>, password : Bool | Nil = <span class=\"n\">nil</span>, secure : Bool | Nil = <span class=\"n\">nil</span>)","location":{"filename":"src/source/response.cr","line_number":30,"url":null},"def":{"name":"new","args":[{"name":"protocol","default_value":"nil","external_name":"protocol","restriction":"::UInt8 | ::Nil"},{"name":"name","default_value":"nil","external_name":"name","restriction":"::Nil | ::String"},{"name":"map","default_value":"nil","external_name":"map","restriction":"::Nil | ::String"},{"name":"folder","default_value":"nil","external_name":"folder","restriction":"::Nil | ::String"},{"name":"game","default_value":"nil","external_name":"game","restriction":"::Nil | ::String"},{"name":"app","default_value":"nil","external_name":"app","restriction":"::UInt16 | ::Nil"},{"name":"players","default_value":"nil","external_name":"players","restriction":"::UInt8 | ::Nil"},{"name":"max_players","default_value":"nil","external_name":"max_players","restriction":"::UInt8 | ::Nil"},{"name":"bots","default_value":"nil","external_name":"bots","restriction":"::UInt8 | ::Nil"},{"name":"type","default_value":"nil","external_name":"type","restriction":"::Source::ServerType | ::Nil"},{"name":"os","default_value":"nil","external_name":"os","restriction":"::Source::OS | ::Nil"},{"name":"password","default_value":"nil","external_name":"password","restriction":"::Bool | ::Nil"},{"name":"secure","default_value":"nil","external_name":"secure","restriction":"::Bool | ::Nil"}],"visibility":"Public","body":"_ = allocate\n_.initialize(protocol, name, map, folder, game, app, players, max_players, bots, type, os, password, secure)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"html_id":"app:UInt16|Nil-instance-method","name":"app","doc":"Steam Application ID of game.","summary":"<p>Steam Application ID of game.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":14,"url":null},"def":{"name":"app","return_type":"UInt16 | ::Nil","visibility":"Public","body":"@app"}},{"html_id":"bots:UInt8|Nil-instance-method","name":"bots","doc":"Number of bots on the server.","summary":"<p>Number of bots on the server.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":20,"url":null},"def":{"name":"bots","return_type":"UInt8 | ::Nil","visibility":"Public","body":"@bots"}},{"html_id":"folder:String|Nil-instance-method","name":"folder","doc":"Name of the folder containing the game files.","summary":"<p>Name of the folder containing the game files.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":10,"url":null},"def":{"name":"folder","return_type":"String | ::Nil","visibility":"Public","body":"@folder"}},{"html_id":"game:String|Nil-instance-method","name":"game","doc":"Full name of the game.","summary":"<p>Full name of the game.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":12,"url":null},"def":{"name":"game","return_type":"String | ::Nil","visibility":"Public","body":"@game"}},{"html_id":"map:String|Nil-instance-method","name":"map","doc":"Map the server has currently loaded.","summary":"<p>Map the server has currently loaded.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":8,"url":null},"def":{"name":"map","return_type":"String | ::Nil","visibility":"Public","body":"@map"}},{"html_id":"max_players:UInt8|Nil-instance-method","name":"max_players","doc":"Maximum number of players the server reports it can hold.","summary":"<p>Maximum number of players the server reports it can hold.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":18,"url":null},"def":{"name":"max_players","return_type":"UInt8 | ::Nil","visibility":"Public","body":"@max_players"}},{"html_id":"name:String|Nil-instance-method","name":"name","doc":"Name of the server.","summary":"<p>Name of the server.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":6,"url":null},"def":{"name":"name","return_type":"String | ::Nil","visibility":"Public","body":"@name"}},{"html_id":"os:Source::OS|Nil-instance-method","name":"os","doc":"Operating system of the server,","summary":"<p>Operating system of the server,</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":24,"url":null},"def":{"name":"os","return_type":"Source::OS | ::Nil","visibility":"Public","body":"@os"}},{"html_id":"password:Bool|Nil-instance-method","name":"password","doc":"Indicates whether the server requires a password,","summary":"<p>Indicates whether the server requires a password,</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":26,"url":null},"def":{"name":"password","return_type":"Bool | ::Nil","visibility":"Public","body":"@password"}},{"html_id":"players:UInt8|Nil-instance-method","name":"players","doc":"Number of players on the server.","summary":"<p>Number of players on the server.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":16,"url":null},"def":{"name":"players","return_type":"UInt8 | ::Nil","visibility":"Public","body":"@players"}},{"html_id":"protocol:UInt8|Nil-instance-method","name":"protocol","doc":"Protocol version used by the server.","summary":"<p>Protocol version used by the server.</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":4,"url":null},"def":{"name":"protocol","return_type":"UInt8 | ::Nil","visibility":"Public","body":"@protocol"}},{"html_id":"secure:Bool|Nil-instance-method","name":"secure","doc":"Specifies whether the server uses VAC,","summary":"<p>Specifies whether the server uses VAC,</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":28,"url":null},"def":{"name":"secure","return_type":"Bool | ::Nil","visibility":"Public","body":"@secure"}},{"html_id":"type:Source::ServerType|Nil-instance-method","name":"type","doc":"Type of the server","summary":"<p>Type of the server</p>","abstract":false,"location":{"filename":"src/source/response.cr","line_number":22,"url":null},"def":{"name":"type","return_type":"Source::ServerType | ::Nil","visibility":"Public","body":"@type"}}]},{"html_id":"source/Source/OS","path":"Source/OS.html","kind":"enum","full_name":"Source::OS","name":"OS","abstract":false,"ancestors":[{"html_id":"source/Enum","kind":"struct","full_name":"Enum","name":"Enum"},{"html_id":"source/Comparable","kind":"module","full_name":"Comparable","name":"Comparable"},{"html_id":"source/Value","kind":"struct","full_name":"Value","name":"Value"},{"html_id":"source/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/source/const/os.cr","line_number":2,"url":null}],"repository_name":"source","program":false,"enum":true,"alias":false,"const":false,"constants":[{"id":"Linux","name":"Linux","value":"0"},{"id":"Windows","name":"Windows","value":"1"},{"id":"Mac","name":"Mac","value":"2"}],"namespace":{"html_id":"source/Source","kind":"module","full_name":"Source","name":"Source"},"instance_methods":[{"html_id":"linux?-instance-method","name":"linux?","abstract":false,"location":{"filename":"src/source/const/os.cr","line_number":3,"url":null},"def":{"name":"linux?","visibility":"Public","body":"self == Linux"}},{"html_id":"mac?-instance-method","name":"mac?","abstract":false,"location":{"filename":"src/source/const/os.cr","line_number":5,"url":null},"def":{"name":"mac?","visibility":"Public","body":"self == Mac"}},{"html_id":"windows?-instance-method","name":"windows?","abstract":false,"location":{"filename":"src/source/const/os.cr","line_number":4,"url":null},"def":{"name":"windows?","visibility":"Public","body":"self == Windows"}}]},{"html_id":"source/Source/Query","path":"Source/Query.html","kind":"class","full_name":"Source::Query","name":"Query","abstract":false,"superclass":{"html_id":"source/Reference","kind":"class","full_name":"Reference","name":"Reference"},"ancestors":[{"html_id":"source/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"source/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/source/query.cr","line_number":5,"url":null}],"repository_name":"source","program":false,"enum":false,"alias":false,"const":false,"namespace":{"html_id":"source/Source","kind":"module","full_name":"Source","name":"Source"},"constructors":[{"html_id":"new(ip:String,port:UInt32)-class-method","name":"new","abstract":false,"args":[{"name":"ip","external_name":"ip","restriction":"String"},{"name":"port","external_name":"port","restriction":"UInt32"}],"args_string":"(ip : String, port : UInt32)","args_html":"(ip : String, port : UInt32)","location":{"filename":"src/source/query.cr","line_number":6,"url":null},"def":{"name":"new","args":[{"name":"ip","external_name":"ip","restriction":"String"},{"name":"port","external_name":"port","restriction":"UInt32"}],"visibility":"Public","body":"_ = allocate\n_.initialize(ip, port)\nif _.responds_to?(:finalize)\n  ::GC.add_finalizer(_)\nend\n_\n"}}],"instance_methods":[{"html_id":"close-instance-method","name":"close","doc":"Closes connection","summary":"<p>Closes connection</p>","abstract":false,"location":{"filename":"src/source/query.cr","line_number":13,"url":null},"def":{"name":"close","visibility":"Public","body":"@client.close"}},{"html_id":"info:Source::InfoResponse-instance-method","name":"info","doc":"Returns info about server","summary":"<p>Returns info about server</p>","abstract":false,"location":{"filename":"src/source/query.cr","line_number":36,"url":null},"def":{"name":"info","return_type":"Source::InfoResponse","visibility":"Public","body":"handshake(Source::A2S_INFO)\n@client.skip(4)\nheader = @client.read_byte\nif header == Source::S2C_CHALLENGE\n  proccess_challenge(Source::A2S_INFO)\n  @client.skip(4)\nend\nprotocol = @client.read_byte\nname = @client.read_source_string\nmap = @client.read_source_string\nfolder = @client.read_source_string\ngame = @client.read_source_string\napp = @client.read_short\nplayers = @client.read_byte\nmax_players = @client.read_byte\nbots = @client.read_byte\ntype = @client.read_source_type\nenvironment = @client.read_source_os\npassword = @client.read_bool\nsecure = @client.read_bool\nSource::InfoResponse.new(protocol, name, map, folder, game, app, players, max_players, bots, type, environment, password, secure)\n"}}]},{"html_id":"source/Source/ServerType","path":"Source/ServerType.html","kind":"enum","full_name":"Source::ServerType","name":"ServerType","abstract":false,"ancestors":[{"html_id":"source/Enum","kind":"struct","full_name":"Enum","name":"Enum"},{"html_id":"source/Comparable","kind":"module","full_name":"Comparable","name":"Comparable"},{"html_id":"source/Value","kind":"struct","full_name":"Value","name":"Value"},{"html_id":"source/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/source/const/type.cr","line_number":2,"url":null}],"repository_name":"source","program":false,"enum":true,"alias":false,"const":false,"constants":[{"id":"Dedicated","name":"Dedicated","value":"0","doc":"Dedicated server","summary":"<p>Dedicated server</p>"},{"id":"Localhost","name":"Localhost","value":"1","doc":"Non-dedicated server","summary":"<p>Non-dedicated server</p>"},{"id":"Proxy","name":"Proxy","value":"2","doc":"SourceTV relay (proxy)","summary":"<p>SourceTV relay (proxy)</p>"}],"namespace":{"html_id":"source/Source","kind":"module","full_name":"Source","name":"Source"},"instance_methods":[{"html_id":"dedicated?-instance-method","name":"dedicated?","abstract":false,"location":{"filename":"src/source/const/type.cr","line_number":4,"url":null},"def":{"name":"dedicated?","visibility":"Public","body":"self == Dedicated"}},{"html_id":"localhost?-instance-method","name":"localhost?","abstract":false,"location":{"filename":"src/source/const/type.cr","line_number":6,"url":null},"def":{"name":"localhost?","visibility":"Public","body":"self == Localhost"}},{"html_id":"proxy?-instance-method","name":"proxy?","abstract":false,"location":{"filename":"src/source/const/type.cr","line_number":8,"url":null},"def":{"name":"proxy?","visibility":"Public","body":"self == Proxy"}}]},{"html_id":"source/Source/Socket","path":"Source/Socket.html","kind":"class","full_name":"Source::Socket","name":"Socket","abstract":false,"superclass":{"html_id":"source/UDPSocket","kind":"class","full_name":"UDPSocket","name":"UDPSocket"},"ancestors":[{"html_id":"source/UDPSocket","kind":"class","full_name":"UDPSocket","name":"UDPSocket"},{"html_id":"source/IPSocket","kind":"class","full_name":"IPSocket","name":"IPSocket"},{"html_id":"source/Socket","kind":"class","full_name":"Socket","name":"Socket"},{"html_id":"source/Crystal/System/Socket","kind":"module","full_name":"Crystal::System::Socket","name":"Socket"},{"html_id":"source/IO/Evented","kind":"module","full_name":"IO::Evented","name":"Evented"},{"html_id":"source/IO/Buffered","kind":"module","full_name":"IO::Buffered","name":"Buffered"},{"html_id":"source/IO","kind":"class","full_name":"IO","name":"IO"},{"html_id":"source/Reference","kind":"class","full_name":"Reference","name":"Reference"},{"html_id":"source/Object","kind":"class","full_name":"Object","name":"Object"}],"locations":[{"filename":"src/source/socket.cr","line_number":2,"url":null}],"repository_name":"source","program":false,"enum":false,"alias":false,"const":false,"namespace":{"html_id":"source/Source","kind":"module","full_name":"Source","name":"Source"},"instance_methods":[{"html_id":"read_bool:Bool-instance-method","name":"read_bool","doc":"Reads byte as `Bool`","summary":"<p>Reads byte as <code>Bool</code></p>","abstract":false,"location":{"filename":"src/source/socket.cr","line_number":53,"url":null},"def":{"name":"read_bool","return_type":"Bool","visibility":"Public","body":"read_byte == 1 ? true : false"}},{"html_id":"read_short:UInt16-instance-method","name":"read_short","doc":"Reads 2 bytes as short","summary":"<p>Reads 2 bytes as short</p>","abstract":false,"location":{"filename":"src/source/socket.cr","line_number":45,"url":null},"def":{"name":"read_short","return_type":"UInt16","visibility":"Public","body":"bytes = Bytes.new(2)\nread_fully(bytes)\n(Pack.unpack(bytes, \"v\"))[0]\n"}},{"html_id":"read_source_os:Source::OS-instance-method","name":"read_source_os","doc":"Reads byte as `Source::OS`","summary":"<p>Reads byte as <code><a href=\"../Source/OS.html\">Source::OS</a></code></p>","abstract":false,"location":{"filename":"src/source/socket.cr","line_number":19,"url":null},"def":{"name":"read_source_os","return_type":"Source::OS","visibility":"Public","body":"byte = read_byte\nif byte == 108\n  return Source::OS::Linux\nelse\n  if byte == 119\n    return Source::OS::Windows\n  else\n    return Source::OS::Mac\n  end\nend\n"}},{"html_id":"read_source_string:String-instance-method","name":"read_source_string","doc":"Reads string terminated by `0x00`","summary":"<p>Reads string terminated by <code>0x00</code></p>","abstract":false,"location":{"filename":"src/source/socket.cr","line_number":4,"url":null},"def":{"name":"read_source_string","return_type":"String","visibility":"Public","body":"array = [] of UInt8\nwhile true\n  byte = read_byte\n  if byte == 0\n    break\n  end\n  array << byte.not_nil!\nend\nString.new(Slice.new(array.to_unsafe, array.size))\n"}},{"html_id":"read_source_type:Source::ServerType-instance-method","name":"read_source_type","doc":"Reads byte as `Source::ServerType`","summary":"<p>Reads byte as <code><a href=\"../Source/ServerType.html\">Source::ServerType</a></code></p>","abstract":false,"location":{"filename":"src/source/socket.cr","line_number":32,"url":null},"def":{"name":"read_source_type","return_type":"Source::ServerType","visibility":"Public","body":"byte = read_byte\nif byte == 100\n  return Source::ServerType::Dedicated\nelse\n  if byte == 108\n    return Source::ServerType::Localhost\n  else\n    return Source::ServerType::Proxy\n  end\nend\n"}}]}]}]}})