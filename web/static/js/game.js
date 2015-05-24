import {Socket} from "phoenix"

var GAME_SINGLE_PLAYER_WAIT_TIME = 3;

var user = null;

(function() {
  hljs.tabReplace = '    ';

  var socket = new Socket('/ws')
  socket.connect()

  var channel = null;

  var GameState = function() {
    this.gameStatus    = ko.observable('Loading...');
    this.gameStatusCss = ko.observable('');
    this.timer         = ko.observable('');
    this.timerCss      = ko.observable('');
    this.timerRunning  = ko.observable(false);
    this.started       = ko.observable(false);
    this.gamecode      = ko.observable('');
    this.projectName   = ko.observable('');
    this.langCss       = ko.observable('');
    this.isMultiplayer = ko.observable(false);
    this.players       = ko.observableArray();
  };

  var playerMapping = {
    player0: 'success',
    player1: 'info',
    player2: 'warning',
    player3: 'danger'
  };

  var Player = function(id, numId, name) {
    this.id = id;
    this.name = ko.observable(name);
    this.percentage = ko.observable(0);
    this.cssClass = ko.observable('player' + numId);
    this.colorClass = ko.observable(playerMapping[this.cssClass()]);
  };

  Player.prototype.formattedName = function(n) {
    return this.name().length > n ?
      this.name().substr(0, n-1) + '&hellip;' :
      this.name();
  };

  var viewModel = {
    loaded: ko.observable(false),
    loading: ko.observable(false),
    completionText: ko.observable(''),
    stats: {
      time: ko.observable(''),
      speed: ko.observable(0),
      typeables: ko.observable(0),
      keystrokes: ko.observable(0),
      percentUnproductive: ko.observable(0),
      mistakes: ko.observable(0)
    },
    game: new GameState(),
    hideCompletionDialog: function() {
      $('#completion-dialog').modal('hide');
    }
  };

  ko.applyBindings(viewModel);

  var $gamecode = null;

  var game = null;
  var exercise = null;
  var nonTypeables = null;

  var CodeCursor = function(cfg) {
    this.playerId          = cfg.playerId;
    this.playerName        = cfg.playerName;
    this.cursor            = cfg.cursor;
    this.code              = cfg.code;
    this.codeLength        = cfg.code.length;
    this.pos               = 0;
    this.keystrokes        = 0;
    this.isMistaken        = false;
    this.mistakePathLength = 0;
    this.mistakes          = 0;
    this.mistakePositions  = [];

    this.isMainPlayer = cfg.isMainPlayer || false;

    this.onCorrectKey    = cfg.onCorrectKey    || function() {};
    this.onAdvanceCursor = cfg.onAdvanceCursor || function() {};
    this.onRetreatCursor = cfg.onRetreatCursor || function() {};
    this.onGameComplete  = cfg.onGameComplete  || function() {};

    this.cursor.addClass(this.playerName);
  };

  CodeCursor.prototype.processKey = function(key) {
    if (this.isMistaken) {
      this.mistakePathKey();
    } else if (key === this.code.charAt(this.pos)) {
      this.correctKey();
    } else {
      this.incorrectKey();
    }
  };

  CodeCursor.prototype.advanceCursor = function() {
    this.advanceCursorWithClass(this.playerName);
  };

  CodeCursor.prototype.advanceCursorWithClass = function(curClass, trailingClass) {
    this.keystrokes++;
    this.pos++;

    this.cursor.removeClass(curClass);
    if (this.isMainPlayer) {
      this.cursor.removeClass('untyped');
      this.cursor.addClass('typed');
    }
    this.cursor.addClass(trailingClass);

    this.cursor = this.cursor.nextAll('.code-char').first();
    this.cursor.addClass(curClass);

    this.onAdvanceCursor.call(this, this);
  };

  CodeCursor.prototype.retreatCursor = function() {
    this.retreatCursorWithClass(this.playerName);
  };

  CodeCursor.prototype.retreatCursorWithClass = function(curClass, trailingClass) {
    this.keystrokes++;
    this.pos--;
    this.mistakePathLength--;

    this.cursor.removeClass(curClass);
    this.cursor = this.cursor.prevAll('.code-char').first();

    this.cursor.removeClass(trailingClass);
    if (this.isMainPlayer) {
      this.cursor.removeClass('typed');
      this.cursor.addClass('untyped');
    }
    this.cursor.addClass(curClass);

    this.onRetreatCursor.call(this, this);
  };

  CodeCursor.prototype.correctKey = function() {
    this.advanceCursorWithClass(this.playerName);

    this.onCorrectKey.call(this, this);
    if (this.pos === this.codeLength) {
      this.onGameComplete.call(this, this);
    }
  };

  CodeCursor.prototype.incorrectKey = function() {
    if (this.pos < this.codeLength - 1) {
      this.isMistaken = true;
      this.mistakes++;
      this.mistakePositions.push(this.pos);
      this.advanceCursorWithClass(this.playerName, 'mistake');
      this.mistakePathLength++;
    }
    this.cursor.addClass('mistaken');
  };

  CodeCursor.prototype.mistakePathKey = function() {
    if (this.pos < this.codeLength - 1) {
      if (this.mistakePathLength < 10) {
        this.advanceCursorWithClass(this.playerName + ' mistaken', 'mistake-path');
        this.mistakePathLength++;
      }
    }
  };

  CodeCursor.prototype.backspaceKey = function() {
    if (this.isMistaken) {
      this.retreatCursorWithClass(this.playerName + ' mistaken', 'mistake-path mistake');

      if (this.mistakePathLength === 0) {
        this.isMistaken = false;
        this.cursor.removeClass('mistaken');
      }
    }
  };

  CodeCursor.prototype.destroy = function() {
    this.cursor.removeClass(this.playerName);
  };


  var state = {
    time: null,
    startTime: null,
    code: null,
    playerCursor: null,
    opponents: 0,
    opponentCursors: {}
  };

  var bindCodeCharacters = function() {
    $gamecode = $('#gamecode');

    var codemap = [];
    var $contents = $gamecode.contents();

    _.each($contents, function(elem, elIdx) {
      var $elem = $(elem);

      if ($elem.is(nonTypeables)) {
        // Handle special case of end-of-line comment
        var $prev = $($contents.get(elIdx - 1)),
      $next = $($contents.get(elIdx + 1));

    if ($prev && $next) {
      // End-of-line comment is preceded by non-newline and
      // followed by newline
      var isEndOfLineComment =
      !$prev.text().match(/\n\s*$/) &&
      $next.text().charAt(0) === '\n';

    if (isEndOfLineComment) {
      // Add the return at the end of the previous
      // element
      codemap.push({
        char: '\n',
        beforeComment: true,
        idx: $prev.text().search(/\s*$/),
        elIdx: elIdx - 1,
        el: $prev
      });
    }
    }
    return;
      }

      var text = $elem.text();
      _.each(text, function(s, i) {
        codemap.push({
          char: s,
          beforeComment: false,
          idx: i,
          elIdx: elIdx,
          el: $elem
        });
      });
    });

    var iterativeFilter = function(collection, state, loopFn) {
      var indices = {};
      var addSection = function(lastIdx, curIdx) {
        var start = lastIdx + 1,
            howMany = curIdx - start;

        if (howMany > 0) {
          for (var i = start; i < start + howMany; i++) {
            indices[i] = true;
          }
        }
      };

      _.each(collection, function(piece, i) {
        loopFn.call(state, piece, i, addSection);
      });

      return _.filter(collection, function(piece, i) {
        return !indices[i];
      });
    };

    codemap = iterativeFilter(codemap, {
      leadingSearch: true,
            trailingSearch: false,
            lastNewline: -1,
            lastTypeable: -1,
            setMode: function(mode) {
              this.leadingSearch = mode === 'leading';
              this.trailingSearch = mode === 'trailing';
            }
    }, function(piece, i, addSection) {
      if (piece.char === ' ' || piece.char === '\t') {
        // Skip over
        return;
      } else if (piece.char === '\n') {
        // New line
        if (this.trailingSearch) {
          this.setMode('leading');
          addSection(this.lastTypeable, i);
        }
        this.lastNewline = i;
      } else {
        // Typeable
        if (this.leadingSearch) {
          this.setMode('trailing');
          addSection(this.lastNewline, i);
        }
        this.lastTypeable = i;
      }
    });

    codemap = iterativeFilter(codemap, {
      firstTypeableFound: false,
            newlineFound: false,
            typeableFound: false,
            lastRelevantNewline: -1,
            setFound: function(found) {
              this.newlineFound = found === 'newline';
              this.typeableFound = found === 'typeable';
              if (found === 'typeable') {
                this.firstTypeableFound = true;
              }
            }
    }, function(piece, i, addSection) {
      if (piece.char === ' ' || piece.char === '\t') {
        // Skip over
        return;
      } else if (piece.char === '\n') {
        // Newline
        if (this.firstTypeableFound && !this.newlineFound) {
          this.lastRelevantNewline = i;
        }
        this.setFound('newline');
      } else {
        if (this.newlineFound) {
          addSection(this.lastRelevantNewline, i);
        }
        this.setFound('typeable');
      }
    });

    var isTextNode = function(el) {
      return el.get(0).nodeType === 3;
    };

    // Group remaining code chars by original element, and loop through
    // every element group and replace the element's text content with the
    // wrapped code chars
    var groupedCodemap = _.groupBy(codemap, function(piece) { return piece.elIdx; });
    _.each(groupedCodemap, function(codeGroup) {
      var $elem = codeGroup[0].el,
      text = $elem.text();

    var collapseCodeGroup = function(codeGroup, text) {
      var chunks = [],
      idx = 0;

      _.each(codeGroup, function(piece) {
        chunks.push(text.slice(idx, piece.idx));
        idx = piece.idx + 1;

        if (piece.char === '\n') {
          chunks.push('<span class="code-char return-char"></span>');
          if (!piece.beforeComment) {
            chunks.push('\n');
          }
        } else {
          chunks.push('<span class="code-char">' + piece.char + '</span>');
        }
      });

      chunks.push(text.slice(idx, text.length));
      return chunks.join('');
      };

      if (isTextNode($elem)) {
        $elem.replaceWith(collapseCodeGroup(codeGroup, text));
      } else {
        // Re-add highlighting classes to the new spans
        var oldClass = $elem.attr('class');
        var $newContent = $(collapseCodeGroup(codeGroup, text));
        $elem.replaceWith($newContent);
        $newContent.addClass(oldClass);
      }
    });
    $gamecode.find('.code-char').addClass('untyped');
  };

  var checkGameState = function() {
    viewModel.game.timerRunning(game.starting || game.started);
    viewModel.game.started(game.started);
    addRemoveOpponents();

    if (game.started) {
      setStarting();
      startGame();
    } else if (game.starting) {
      setStarting();
    } else {
      resetStarting();
    }
  };

  var fullyStarted = false;
  var startGame = function() {
    if (fullyStarted) {
      return;
    }

    viewModel.game.gameStatus('Go!');
    viewModel.game.gameStatusCss('text-info control-panel-go');
    fullyStarted = true;
    channel.push("ingame:started")
  };

  var setStarting = function() {
    if (fullyStarted) {
      return;
    }

    viewModel.game.gameStatus('Get ready... ');

    updateTime();
    if (!state.playerCursor) {
      state.playerCursor = new CodeCursor({
        isMainPlayer: true,
        playerId: user.id,
        playerName: 'player',
        cursor:          $gamecode.find('.code-char').first(),
        code:            state.code,
        onAdvanceCursor: onPlayerAdvanceCursor,
        onRetreatCursor: emitCursorRetreat,
        onGameComplete:  completeGame
      });
    }
  };

  var addRemoveOpponents = function() {
    // Remove opponents that are no longer in-game
    _.each(state.opponentCursors, function(cursor, opponentId) {
      if (!_.contains(game.players, opponentId)) {
        removeOpponent(opponentId);
      }
    });

    // Add new opponents that are not in the list yet
    _.each(game.players, function(player, i) {
      // Do not add self as an opponent
      if (player.id != user.id && !(player.id in state.opponentCursors)) {
        addOpponent(player.id, game.players[i].name);
      }
    });
  };

  var addOpponent = function(opponentId, opponentName) {
    state.opponents++;
    state.opponentCursors[opponentId] = new CodeCursor({
      playerId: opponentId,
      playerName: 'opponent' + state.opponents,
      cursor: $gamecode.find('.code-char').first(),
      code: state.code,
      onAdvanceCursor: updatePlayerProgress
    });
    viewModel.game.players.push(new Player(opponentId, state.opponents, opponentName));
  };

  var removeOpponent = function(opponentId) {
    state.opponents--;
    if (opponentId in state.opponentCursors) {
      state.opponentCursors[opponentId].destroy();
      delete state.opponentCursors[opponentId];
    }

    var match = ko.utils.arrayFirst(viewModel.game.players(), function(player) {
      return player.id == opponentId;
    });
    if (match) {
      viewModel.game.players.remove(match);
    }
  };

  var updatePlayerProgress = function(cursor) {
    var match = ko.utils.arrayFirst(viewModel.game.players(), function(player) {
      return player.id == cursor.playerId;
    });
    if (match) {
      match.percentage((cursor.pos / cursor.codeLength * 100) | 0);
    }
  };

  var onPlayerAdvanceCursor = function(cursor) {
    scrollToCursor(cursor);
    updatePlayerProgress(cursor);
    emitCursorAdvance();
  };

  var scrollToCursor = function(cursor) {
    // Make sure the cursor DOM element exists
    if (cursor.cursor.length) {
      var windowHeight = $(window).height(),
        isAnimating = $('html, body').is(':animated'),
                    cursorPos = cursor.cursor.offset().top,
                    windowPos = $(window).scrollTop() + windowHeight;

      // Begin scrolling when 25% from the bottom
      if (windowPos - cursorPos < windowHeight * 0.25 && !isAnimating) {
        $('html, body').animate({
          // Move to 25% from top
          scrollTop: cursorPos - windowHeight * 0.25
        }, 1000);
      }
    }
  };

  var addInitialPlayer = function() {
    viewModel.game.players.push(new Player(user.id, 0, user.name));
  };

  var emitCursorAdvance = function() {
    channel.push('ingame:advancecursor', {
      player_id: user.id
    });
  };

  var emitCursorRetreat = function() {
    channel.push('ingame:retreatcursor', {
      player_id: user.id
    });
  };

  var completeGame = function(cursor) {
    game.isComplete = true;
    clearTimeout(timeId);
    lastTimestamp = null;

    var stats = {
      time: state.time,
      keystrokes: cursor.keystrokes,
      mistakes: cursor.mistakes,
    };

    var CHARACTERS_PER_WORD = 5;
    var MILLISECONDS_PER_MINUTE = 60000;

    var realTime    = (moment().unix() - state.startTime) * 1000;
    stats.time      = realTime;
    stats.typeables = exercise.typeableCode.length;
    stats.speed     = parseInt((stats.typeables / CHARACTERS_PER_WORD) * (1 / (stats.time / MILLISECONDS_PER_MINUTE)));
    stats.percentUnproductive = 1 - stats.typeables / stats.keystrokes;

    channel.push('ingame:complete', {
      stats: stats
    });
  };

  var timeId = null;
  var lastTimestamp = null;
  var updateTime = function() {
    if (game.starting && !game.isComplete) {
      if (state.startTime) {
        state.time = (moment().unix() - state.startTime) * 1000;
      }
      var t = moment.duration(state.time);
      var minutes = t.minutes();
      var seconds = t.seconds();
      seconds = state.time < 0 ? -seconds + 1 : seconds;

      viewModel.game.timer(sprintf('%s%d:%02d', state.time < 0 ? 'T-' : '', minutes, seconds));
      viewModel.game.timerCss(state.time < 0 ? 'label-warning' : 'label-info');

      // Increment with smaller granularity for the cruicial starting time
      if (lastTimestamp && !state.startTime) {
        state.time += (moment().unix() - lastTimestamp) * 1000;
      }
      lastTimestamp = moment().unix();

      // Schedule the start of the game if close enough
      if (state.time > -2500 && state.time < 0) {
        setTimeout(startGame, -state.time);
      }

      timeId = setTimeout(updateTime, 100);
    }
  };

  var resetStarting = function() {
    viewModel.game.gameStatus('Waiting for players...');
    if (state.playerCursor) {
      state.playerCursor.destroy();
      state.playerCursor = null;
    }

    clearTimeout(timeId);
    lastTimestamp = null;
  };

  var wrapFullyStarted = function(fn) {
    return function() {
      if (fullyStarted) {
        fn.apply(this, arguments);
      }
    };
  };

  var keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  keys = keys.concat(_.map(keys, function(k) { return k.toUpperCase(); }));
  keys = keys.concat(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  keys = keys.concat(['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', '{', ']', '}', '\\', '|', '\'', '"', ';', ':', '/', '?', '.', '>', ',', '<']);
  keys = keys.concat(['enter', 'space', 'shift+space', 'shift+enter']);

  Mousetrap.bind(keys, wrapFullyStarted(function(e, key) {
    e.preventDefault();

    if (state.time < 0) return;

    key = _.contains(['space', 'shift+space'], key) ? ' ' :
    _.contains(['enter', 'shift+enter'], key) ? '\n' :
    key;

    state.playerCursor.processKey(key);
  }));

  Mousetrap.bind(['backspace', 'shift+backspace'], wrapFullyStarted(function(e, key) {
    e.preventDefault();
    state.playerCursor.backspaceKey();
  }));
  
  var pathTokens = window.location.pathname.split("/")
  var game_id    = pathTokens[2];
  var player_id  = pathTokens[4];

  socket.join("games:" + game_id, {player_id: player_id}).receive('ok', chan => {

    channel = chan;

    chan.push('ingame:ready'); 

    chan.on('ingame:ready:res', payload => {
      if (!payload.success) {
        alert("Opps, something went wrong!");
        return;
      }

      user          = payload.player;
      game          = payload.game;
      exercise      = payload.game.exercise;
      exercise.code = exercise.code.replace(/(^\n+)|(\s+$)/g, '') + '\n';

      var highlight = (exercise.lang in hljs.listLanguages()) ?
                      hljs.highlight(exercise.lang, exercise.code, true) :
                      hljs.highlightAuto(exercise.code);

      var NON_TYPEABLES = ['hljs-comment', 'template_comment', 'diff', 'javadoc', 'phpdoc'];
      var NON_TYPEABLE_CLASSES = _.map(NON_TYPEABLES, function(c) { return '.' + c; }).join(',');

      var commentlessCode      = $(highlight.value).filter(function(index, el) {  return !$(el).hasClass("hljs-comment") })
      exercise.highlitCode     = highlight.value;
      exercise.commentlessCode = commentlessCode.text();
      exercise.typeableCode    = exercise.commentlessCode.replace(/(^[ \t]+)|([ \t]+$)/gm, '').replace(/\n+/g, '\n').trim() + '\n';
      exercise.typeables       = exercise.typeableCode.length;

      state.code      = exercise.typeableCode;
      state.startTime = game.startTime;

      nonTypeables = ".hljs-comment";

      viewModel.loaded(true);
      viewModel.loading(false);
      viewModel.game.isMultiplayer(!game.isSinglePlayer);
      viewModel.game.gameStatus('Waiting for players...');
      viewModel.game.gamecode(exercise.code);
      viewModel.game.projectName(exercise.projectName);

      viewModel.game.langCss(game.lang);
      hljs.initHighlighting();
      bindCodeCharacters();
      addInitialPlayer();
      checkGameState();
    });

    chan.on('ingame:complete:res', payload => {
      game = payload.game;
      var message;
      if (game.isSinglePlayer) {
        message = 'You completed the code! Well done!';
      } else {
        if (game.winner.id === user.id) {
          message = 'Congratulations! You got 1st place!';
        } else {
          message = 'Nicely done!';
        }
      }

      viewModel.completionText(message);
      viewModel.stats.time(moment(payload.stats.time).format('mm:ss'));
      viewModel.stats.speed(payload.stats.speed | 0);
      viewModel.stats.typeables(payload.stats.typeables | 0);
      viewModel.stats.keystrokes(payload.stats.keystrokes | 0);
      viewModel.stats.percentUnproductive((payload.stats.percentUnproductive * 100).toFixed(2));
      viewModel.stats.speed(payload.stats.speed | 0);
      viewModel.stats.mistakes(payload.stats.mistakes | 0);

      var $dialog = $('#completion-dialog');
      $dialog.on('shown.bs.modal', function() {
        var rows = $('#completion-dialog .row'),
          animIdx = 0;

        var animateSingle = function(row) {
          $(row).animate({
            opacity: 1,
            left: 0
          }, {
            queue: true,
            duration: 200,
            complete: function() {
              enqueueAnimation();
            }
          });
        };

        var enqueueAnimation = function() {
          if (animIdx < rows.length) {
            animateSingle(rows[animIdx++]);
          }
        };

        enqueueAnimation();
      });
      $dialog.modal('show');
    });

    chan.on('ingame:advancecursor', payload => {
      var opponent_id = payload.player_id;
      if (opponent_id in state.opponentCursors) {
        state.opponentCursors[opponent_id].advanceCursor();
      }
    });

    chan.on('ingame:retreatcursor', payload => {
      var opponent_id = payload.player_id;
      if (opponent_id in state.opponentCursors) {
        state.opponentCursors[opponent_id].retreatCursor();
      }
    });

    chan.on('ingame:update', payload => {
      game = payload.game;
      state.startTime = game.startTime;
      state.time = game.timeLeft;
      checkGameState();
    });
  });

  viewModel.loading(true);
})();
