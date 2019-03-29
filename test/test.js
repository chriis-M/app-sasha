var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("https://www.ghusse.com");

// UNIT test

// Test si l'url retourne bien un 200
describe("SAMPLE unit test",function(){

  // #1 should return page code 200
  it("should return home page",function(done){

    // calling home page api
    server
    .get("/afidium/response.json")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      // Error key should be false.
      res.body.error.should.equal(false);
      done();
    });
  });

});