import {Socket} from "phoenix"

(function() {
  var Game = function(opts) {
    this.id         = opts.id;
    this.lang       = ko.observable(opts.lang);
    this.numPlayers = ko.observable(opts.numPlayers);
    this.maxPlayers = ko.observable(opts.maxPlayers);
    this.status     = ko.observable(opts.status);
    this.statusText = ko.observable(opts.statusText);
    this.statusCss  = ko.computed(function() {
      var bindings = {
        'waiting': 'text-warning',
        'ingame':  'text-success'
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

      channel.push('games:join', { game: this.id, player: player });

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

  var viewModel = {
    games:       ko.observableArray(),
    languages:   ko.observableArray(),
    loading:     ko.observable(false),
    loaded:      ko.observable(false),
    newGameType: ko.observable(''),
    setGameType: function(gameType) {
      this.newGameType(gameType);
      this.slideForward();
    },
    slideForward: function() {
      $('.gametype-container').hide('slide', { direction: 'left' });
      $('.lang-container').show('slide', { direction: 'right' });
    },
    newGame: function(lang) {
      $('button.back-btn').attr('disabled', 'disabled');
      $('button.lang').attr('disabled', 'disabled');
      $('button.join-btn').attr('disabled', 'disabled');
      $('button.lang-' + lang).addClass('lang-choice');

      channel.push('games:create', {
        lang: lang,
        player: player,
        gameType: viewModel.newGameType() // TODO: Must be a better way to do this.
      });
    }
  };

  ko.applyBindings(viewModel);

  var socket  = new Socket('/ws')
  socket.connect()

  var channel = null;

  var player = {
    id: chance.guid(),
    name: chance.name()
  };

  socket.join('lobby', { player: player }).receive('ok', chan => {

    channel = chan;

    chan.on('games:fetch:res', payload => {
      var games = _.map(payload.games, function(g) {
        return new Game(g);
      });

      viewModel.games(games);
      viewModel.loading(false);
      viewModel.loaded(true);
    });

    chan.on('games:create:res', payload => {
      if (payload.success) {
        location.href = "/games/" + payload.game.id + "/player/" + player.id;
      } else {
        alert(payload.reason);
        location.href = "/"
      }
    });

    chan.on('games:join:res', payload => {
      if (payload.success) {
        location.href = "/games/" + payload.game.id + "/player/" + player.id;
      }
    });

    chan.on('languages:fetch:res', payload => {
      viewModel.languages(payload.languages);
    });

    chan.push('languages:fetch');

    setInterval(function() {
      chan.push('games:fetch');
    }, 1000);


  });

  viewModel.loading(true);
})();

