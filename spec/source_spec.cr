require "./spec_helper"
require "../src/source"

describe Source do
  it "connect" do
    query = Source::Query.new "149.56.29.205", 27034
    query.challenge Source::A2S_RULES
    query.close
  end

  it "challenge" do
    query = Source::Query.new "149.56.29.205", 27034
    query.challenge Source::A2S_RULES
    query.close
  end
end
