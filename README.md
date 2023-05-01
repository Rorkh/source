# source

[Source Query](https://developer.valvesoftware.com/wiki/Server_queries) library for Crystal

[![view - Documentation](https://img.shields.io/badge/view-Documentation-blue?style=for-the-badge)](https://rorkh.github.io/source/index.html "Go to project documentation")

## Installation

1. Add the dependency to your `shard.yml`:

   ```yaml
   dependencies:
     source:
       github: Rorkh/source
   ```

2. Run `shards install`

## Usage

```crystal
require "source"

query = Source::Query.new "37.230.162.62", 27015
info = query.info

puts info.players

query.close
```

## Contributing

1. Fork it (<https://github.com/Rorkh/source/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [Rorkh](https://github.com/Rorkh) - creator and maintainer