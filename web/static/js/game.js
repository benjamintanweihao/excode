var user = {
	id: chance.guid(), 
	username: chance.name() 
};

var GAME_SINGLE_PLAYER_WAIT_TIME = 5;

(function() {
    hljs.tabReplace = '    ';

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

        /**
         * Reusable filter method that keeps track of indices
         * marked for removal, with custom criteria functions
         */
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

            // Remove the collected indices
            return _.filter(collection, function(piece, i) {
                return !indices[i];
            });
        };

        // Loop through the codemap and remove occurrences of leading and
        // trailing whitespace
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

        // Finally, remove contiguous blocks of newline+whitespace,
        // as well as globally leading whitespace
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
                // Typeable
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

        // Attach boundcode
        // swiftcode.boundCode = _.map(codemap, function(piece) { return piece.char; }).join('');

        // Set all code characters to untyped
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
        		viewModel.game.gameStatus('Go!');
            return;
        }
        viewModel.game.gameStatusCss('text-info control-panel-go');
        fullyStarted = true;
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
                cursor: $gamecode.find('.code-char').first(),
                code: state.code,
                onAdvanceCursor: onPlayerAdvanceCursor,
                onRetreatCursor: emitCursorRetreat,
                onGameComplete: completeGame
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
            if (player != user.id && !(player in state.opponentCursors)) {
                addOpponent(player, game.playerNames[i]);
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
        viewModel.game.players.push(new Player(user.id, 0, user.username));
    };

    var emitCursorAdvance = function() {};
    //     socket.emit('ingame:advancecursor', {
    //         game: game.id,
    //         player: user.id
    //     });
    // };

    var emitCursorRetreat = function() {};
    //     socket.emit('ingame:retreatcursor', {
    //         game: game.id,
    //         player: user.id
    //     });
    // };

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
 
        var realTime    = moment().diff(state.startTime, 'milliseconds');
        stats.time      = realTime;
        stats.typeables = exercise.typeableCode.length;
        stats.speed     = parseInt((stats.typeables / CHARACTERS_PER_WORD) * (1 / (stats.time / MILLISECONDS_PER_MINUTE)));
        stats.percentUnproductive = 1 - stats.typeables / stats.keystrokes;
 
        // socket.emit('ingame:complete', {
        //     time: state.time,
        //     keystrokes: cursor.keystrokes,
        //     mistakes: cursor.mistakes
        // });

				var data = {
					stats: stats,
					game: game
				}

				gameCompleted(data);
 
        console.log(data);
    };

    var timeId = null;
    var lastTimestamp = null;
    var updateTime = function() {
        if (game.starting && !game.isComplete) {
            // Synchronize with the time since start
            if (state.startTime) {
                state.time = moment().diff(state.startTime);
            }
            var t = moment.duration(state.time);
            var minutes = t.minutes();
            var seconds = t.seconds();
            seconds = state.time < 0 ? -seconds + 1 : seconds;

            viewModel.game.timer(sprintf('%s%d:%02d', state.time < 0 ? 'T-' : '', minutes, seconds));
            viewModel.game.timerCss(state.time < 0 ? 'label-warning' : 'label-info');

            // Increment with smaller granularity for the cruicial starting time
            if (lastTimestamp && !state.startTime) {
                state.time += moment().diff(lastTimestamp);
            }
            lastTimestamp = moment();

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

    // Bind key events
    var keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    keys = keys.concat(_.map(keys, function(k) { return k.toUpperCase(); }));
    keys = keys.concat(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
    keys = keys.concat(['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', '{', ']', '}', '\\', '|', '\'', '"', ';', ':', '/', '?', '.', '>', ',', '<']);
    keys = keys.concat(['enter', 'space', 'shift+space', 'shift+enter']);

    Mousetrap.bind(keys, wrapFullyStarted(function(e, key) {
        e.preventDefault();
			
				// prevent any keys when time is before 0
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

    // socket.on('ingame:ready:res', function(data) {
    var gameReady = function(data) {
        console.log('received ingame:ready:res');

        if (!data.success) {
						alert("Opps, something went wrong!");
            return;
        }

        game = data.game;
        exercise = data.exercise;
        state.code = data.exercise.typeableCode;
        state.startTime = moment().add(GAME_SINGLE_PLAYER_WAIT_TIME, 'seconds').toDate();

        nonTypeables = data.nonTypeables;
        viewModel.loaded(true);
        viewModel.loading(false);
        viewModel.game.isMultiplayer(!data.game.isSinglePlayer);
        viewModel.game.gameStatus('Waiting for players...');
        viewModel.game.gamecode(data.exercise.code);
        viewModel.game.projectName(data.exercise.projectName);
        viewModel.game.langCss('language-' + data.game.lang);

        hljs.initHighlighting();
        bindCodeCharacters();
        addInitialPlayer();
        checkGameState();
    };

    // socket.on('ingame:update', function(data) {
    //     console.log('received ingame:update');
    //     game = data.game;
    //     state.time = data.timeLeft;
    //     checkGameState();
    // });

		var gameCompleted = function(data) {

    // socket.on('ingame:complete:res', function(data) {
        console.log('received ingame:complete:res');
        game = data.game;

        var message;

        if (game.isSinglePlayer) {
            message = 'You completed the code! Well done!';
        } else {
            if (game.winner === user.id) {
                message = 'Congratulations! You got 1st place!';
            } else {
                message = 'Nicely done!';
            }
        }

        viewModel.completionText(message);
        viewModel.stats.time(moment(data.stats.time).format('mm:ss'));
        viewModel.stats.speed(data.stats.speed | 0);
        viewModel.stats.typeables(data.stats.typeables | 0);
        viewModel.stats.keystrokes(data.stats.keystrokes | 0);
        viewModel.stats.percentUnproductive((data.stats.percentUnproductive * 100).toFixed(2));
        viewModel.stats.speed(data.stats.speed | 0);
        viewModel.stats.mistakes(data.stats.mistakes | 0);

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
		};
    // });

    // socket.on('ingame:advancecursor', function(data) {
    //     var opponent = data.player;
    //     if (opponent in state.opponentCursors) {
    //         state.opponentCursors[opponent].advanceCursor();
    //     }
    // });

    // socket.on('ingame:retreatcursor', function(data) {
    //     var opponent = data.player;
    //     if (opponent in state.opponentCursors) {
    //         state.opponentCursors[opponent].retreatCursor();
    //     }
    // });

    console.log('emit ingame:ready');
    // socket.emit('ingame:ready', { player: user.id });


		var data = {}
		data.game = new GameState();
		data.game.starting = true;
		data.game.lang = "ruby"
		data.success = true;

    data.exercise = {
			id: "123",
			code: "\nalias_command :server, :serve\n\ncommand :doctor do |c|\n  c.syntax = 'jekyll doctor'\n  c.description = 'Search site and print specific deprecation warnings'\n\n  c.option '--config CONFIG_FILE[,CONFIG_FILE2,...]', Array, 'Custom configuration file'\n\n  c.action do |args, options|\n    options = normalize_options(options.__hash__)\n    options = Jekyll.configuration(options)\n    Jekyll::Commands::Doctor.process(options)\n  end\nend\nalias_command :hyde, :doctor\n",
			projectName: "Jekyll",
			typeableCode: "alias_command :server, :serve\ncommand :doctor do |c|\nc.syntax = 'jekyll doctor'\nc.description = 'Search site and print specific deprecation warnings'\nc.option '--config CONFIG_FILE[,CONFIG_FILE2,...]', Array, 'Custom configuration file'\nc.action do |args, options|\noptions = normalize_options(options.__hash__)\noptions = Jekyll.configuration(options)\nJekyll::Commands::Doctor.process(options)\nend\nend\nalias_command :hyde, :doctor\n"
		}
    // data.exercise = {
		// 	id: "123",
		// 	code: "def foo\nend\n",
		// 	projectName: "Jekyll",
		// 	typeableCode: "def foo\nend\n"
		// }

    gameReady(data);
		
    viewModel.loading(true);
})();
