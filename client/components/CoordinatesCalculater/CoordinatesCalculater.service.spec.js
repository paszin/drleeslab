'use strict';

describe('Service: CoordinatesCalculater', function () {

  // load the service's module
  beforeEach(module('spaceappsApp'));

  // instantiate service
  var CoordinatesCalculater;
  beforeEach(inject(function (_CoordinatesCalculater_) {
    CoordinatesCalculater = _CoordinatesCalculater_;
  }));

  it('should do something', function () {
    expect(!!CoordinatesCalculater).toBe(true);
  });

});
