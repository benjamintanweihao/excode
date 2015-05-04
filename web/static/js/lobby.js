(function() {
    $(document).ready(function() {
        $('.panel-body').slimScroll({
            color: '#2c3e50',
            height: '386px'
        });

        $('.language-list').slimScroll({
            color: '#2c3e50',
            height: '430px'
        });
    });

    // TODO: Rethink the gameNum concept
    var gameNum = 1;
    var Game = function(opts) {
        this._id        = opts._id;
        this.num        = ko.observable(opts.num || (gameNum++));
        this.lang       = ko.observable(opts.lang);
        this.langName   = ko.observable(opts.langName);
        this.numPlayers = ko.observable(opts.numPlayers);
        this.maxPlayers = ko.observable(opts.maxPlayers);
        this.status     = ko.observable(opts.status);
        this.statusText = ko.observable(opts.statusText);
        this.statusCss  = ko.computed(function() {
            var bindings = {
                'waiting': 'text-warning',
                'ingame': 'text-success'
            };
            return bindings[this.status()];
        }, this);
        this.isJoinable = ko.observable(opts.isJoinable);
        this.joinCss = ko.observable();

        this.join = function() {
            $('button.join-btn').attr('disabled', 'disabled');
            $('button.game-type').attr('disabled', 'disabled');
            $('button.back-btn').attr('disabled', 'disabled');
            $('button.lang').attr('disabled', 'disabled');
            this.joinCss('join-choice');

            console.log('emit games:join');
            // socket.emit('games:join', { game: this._id, player: user._id });
        }.bind(this);

        this.update = function(item) {
            var self = this;
            _.forOwn(item, function(val, key) {
                if (key in this) {
                    if (ko.isObservable(this[key])) {
                        this[key](val);
                    } else {
                        this[key] = val;
                    }
                }
            }, this);
        }.bind(this);
    };

    viewModel = {
        games: ko.observableArray(),
        loading: ko.observable(false),
        loaded: ko.observable(false),
        newGameType: ko.observable(''),
        setGameType: function(gameType) {
            this.newGameType(gameType);
            this.slideForward();
        },
        slideForward: function() {
            $('.gametype-container').hide('slide', { direction: 'left' });
            $('.lang-container').show('slide', { direction: 'right' });
        },
        slideBack: function() {
            $('.lang-container').hide('slide', { direction: 'right' });
            $('.gametype-container').show('slide', { direction: 'left' });
        },
        newGame: function(key) {
            $('button.back-btn').attr('disabled', 'disabled');
            $('button.lang').attr('disabled', 'disabled');
            $('button.join-btn').attr('disabled', 'disabled');
            $('button.lang-' + key).addClass('lang-choice');

            console.log('emit games:createnew');
            // socket.emit('games:createnew', {
            //     key: key,
            //     player: user._id,
            //     gameType: this.newGameType()
            // });
        }
    };

    ko.applyBindings(viewModel);


    var fetchGames = function() {
        console.log('received games:fetch:res');

        viewModel.loading(false);
        viewModel.loaded(true);
    };

    // socket.on('games:fetch:res', function(data) {
    //     console.log('received games:fetch:res');
    //     var games = _.map(data, function(v) {
    //         return new Game(v);
    //     });
    //     ko.utils.arrayPushAll(viewModel.games, games);
    //     viewModel.loading(false);
    //     viewModel.loaded(true);
    // });

    // socket.on('games:update', function(data) {
    //     console.log('received games:update');
    //     var match = ko.utils.arrayFirst(viewModel.games(), function(item) {
    //         return item._id == data._id;
    //     });
    //     if (match) {
    //         match.update(data);
    //     }
    // });

    // socket.on('games:join:res', function(data) {
    //     console.log('received games:join:res');
    //     if (data.success) {
    //         redirect('/game');
    //     }
    // });

    // socket.on('games:new', function(data) {
    //     console.log('received games:new');
    //     viewModel.games.unshift(new Game(data));
    // });

    // socket.on('games:createnew:res', function(data) {
    //     console.log('received games:createnew:res');
    //     if (data.success) {
    //         redirect('/game');
    //     }
    // });

    // socket.on('games:remove', function(data) {
    //     console.log('received games:remove');
    //     var match = ko.utils.arrayFirst(viewModel.games(), function(item) {
    //         return item._id == data._id;
    //     });
    //     if (match) {
    //         viewModel.games.remove(match);
    //     }
    // });

    console.log('emit games:fetch');
    // socket.emit('games:fetch');
		fetchGames();

    viewModel.loading(true);
})();

