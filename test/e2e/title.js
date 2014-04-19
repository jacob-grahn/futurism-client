describe('title', function() {

    var ptor = protractor.getInstance();

    var Title = function() {
        this.gameName = element(by.binding('lang.title.gameName'));
        this.loginBt = element(by.binding('lang.title.login'));
        this.instructionsBt = element(by.binding('lang.title.instructions'));
        this.creditsBt = element(by.binding('lang.title.credits'));

        this.get = function() {
            browser.get('http://localhost:9000');
        };

        this.get();
    };


    it('should show a logo', function() {
        var title = new Title();
        expect(title.gameName.getText()).toEqual('FUTURISM');
    });


    it('login button should go to login or lobby', function() {
        var title = new Title();
        title.loginBt.click();
        expect(ptor.getCurrentUrl()).toContain('/lobby');
    });


    it('instructions should to go instructions', function() {
        var title = new Title();
        title.instructionsBt.click();
        expect(ptor.getCurrentUrl()).toContain('/instructions');
    });


    it('credits should go to credits', function() {
        var title = new Title();
        title.creditsBt.click();
        expect(ptor.getCurrentUrl()).toContain('/credits');
    });

});