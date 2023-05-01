require "./spec_helper"
require "../src/source"

describe Source do
  it "connect" do
    query = Source::Query.new "37.230.162.62", 27015
    query.close
  end

  it "info" do
    query = Source::Query.new "37.230.162.62", 27015
    query.info
    query.close
  end
end