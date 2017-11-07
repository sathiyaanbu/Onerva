describe.skip('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = {};
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
  });
});

