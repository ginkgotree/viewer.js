module('Pages Data Provider', {
    setup: function () {
        this.utilities = {
            ajax: {
                request: function() {}
            }
        };
        this.scope = Crocodoc.getScopeForTest(this);
        this.dataProvider = Crocodoc.getComponentForTest('dataprovider-page-svg', this.scope);
    },
    teardown: function () {
        this.scope.destroy();
    }
});

test('Should return an object with a get function', function(){
    equal(typeof this.dataProvider, 'object');
    equal(typeof this.dataProvider.get, 'function');
});

test('get() should return a $.Promise with an abort() function', function() {
    propEqual(this.dataProvider.get(), $.Deferred().promise({abort:function(){}}));
});

module('Pages Data Provider', {
    setup: function () {
        var me = this;
        this.requestObject = {
            abort: function() {}
        };
        this.utilities = {
            ajax: {
                request: sinon.stub().returns(this.requestObject)
            }
        };
        this.scope = Crocodoc.getScopeForTest(this);
        this.dataProvider = Crocodoc.getComponentForTest('dataprovider-page-svg', this.scope);
    },
    teardown: function () {
        this.scope.destroy();
    }
});

test('abort() should reject the promise and call abort on the request object returned from ajax', function() {
    this.mock(this.requestObject).expects('abort').once();

    this.promise = this.dataProvider.get('page-svg', 'testdatadoesnotmatter');
    this.promise.abort();
});

test('An ajax success should resolve the promise with a non-empty reponse', function() {
    var promiseResolved = false;
    var responseObject = {responseText:"testdatadoesnotmatter"};
    this.utilities.ajax.request.yieldsToOn("success",responseObject);

    this.promise = this.dataProvider.get('page-svg', 'testdatadoesnotmatter');
    this.promise.done(function(){promiseResolved = true;});
    ok(promiseResolved);
});

test('An ajax success should reject the promise with an empty reponse', function() {
    var promiseRejected = false;
    var responseObject = {responseText:""};
    this.utilities.ajax.request.yieldsToOn("success",responseObject);

    this.promise = this.dataProvider.get('page-svg', 'testdatadoesnotmatter');
    this.promise.fail(function(){promiseRejected = true;});
    ok(promiseRejected);
});

test('An ajax failure should reject the promise', function() {
    var promiseRejected = false;
    var responseObject = {status:"testdatadoesnotmatter", statusText:"testdatadoesnotmatter"};
    this.utilities.ajax.request.yieldsToOn("fail",responseObject);

    this.promise = this.dataProvider.get('page-svg', 'testdatadoesnotmatter');
    this.promise.fail(function(){promiseRejected = true;});
    ok(promiseRejected);
});