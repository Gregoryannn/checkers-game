(function() {
        /**
         * Set namespace and options default.
         */
        var app = {},
            settings = {
                scope: "game-stage",
                board: "board",
                score: {
                    element: "score",
                    playerOne: "score__player-one",
                    playerTwo: "score__player-two"
                },
                player: {
                    one: {
                        name: "Player One"
                    },
                    two: {
                        name: "Player Two"
                    }
                }
            };
        /**
         * Init is like a summary of process.
         */
        app.init = function() {
            app.setup();
            app.build();
            app.attach();
            app.updatePlayer();
            //  app.updateScore();
            //  app.bind();
        };

        /**
         * Get elements from DOM and initialize some objects.
         */

        app.setup = function() {
            app.scope = document.getElementById(settings.scope), app.board = app.scope.getElementsByClassName(settings.board)[0];
        };


        /**
         * Create HTML for board and pieces.
         */

        app.build = function() {
            var html = [];
            for (var y = 0; y < 8; y++) {
                html.push('<div class="row">');
                for (var x = 0; x < 8; x++) {
                    var squareType = (y + x) % 2 ? "dark" : "light";
                    html.push('<span class="board__square ' + squareType + '" data-position="' + y + "-" + x + '">');
                    if (squareType === "dark" && y > 4) {
                        html.push('<span class="board__piece player-one" data-piece-type="player-one"></span>');
                    }
                    if (squareType === "dark" && y < 3) {
                        html.push('<span class="board__piece player-two" data-piece-type="player-two"></span>');
                    }
                    html.push("</span>");
                }
                html.push("</div>");
            }
            app.board.innerHTML = html.join("");
        };


        /**
         * Setup after the game built.
         */


        app.attach = function() {
            app.squares = document.getElementsByClassName("board__square dark");
            app.score = app.scope.getElementsByClassName(settings.score.element)[0];
            elmPlayerTwo = app.score.getElementsByClassName(settings.score.playerTwo)[0].getElementsByTagName("span");
            app.selectedPiece = null;
            app.selectedSquare = null;
            app.selectedDestiny = null;

            app.player = {
                    one: {
                        score: 0
                    }
                },
                two: {
                    score: 0
                }
        };
        app.isPlayerOne = true;
    };


    /**
     * General listeners.
     */


    app.bind = function() {
        for (var i = 0, len = app.squares.length; i < len; i++) {
            app.squares[i].addEventListener("click", function() {
                app.move(this);
            }, false);
        }
    };


    /**
     * Setup the process of current match.
     * @param  {object} target DOM element clicked.
     */

    app.move = function(target) {
        if (app.selectedPiece == null) {
            app.choosePiece(target);
        } else {
            if (!app.getPiece(target)) {
                app.selectedDestiny = target;
                app.destinyPosition = app.getPosition(target);
                app.jump();
                app.resetVars();
            } else {
                app.showMessage("Você deve escolher um destino válido.");
                app.resetVars();
                return false;
            }
        }
    };

    /**
     * Select a piece to the match.
     * @param  {object} target The selected square.
     */

    app.choosePiece = function(square) {
        var pieceType = null,
            piece = app.getPiece(square);
        if (piece) {
            app.selectedPiece = piece;
            pieceType = app.getPieceType(piece);
            if (app.isValidPiece(pieceType)) {
                app.selectedSquare = square;
                app.selectedPiece.classList.add("selected");
            } else {
                app.selectedPiece = null;
                app.showMessage("Você não pode jogar com uma peça do adversário.");
                return false;
            }
        } else {
            app.showMessage("Você deve escolher uma peça antes do destino.");
        }
    };

    /**
     * Select a destiny to the piece.
     * @param  {object} target The selected square.
     */
    app.hasPiece = function(square) {
        app.getPiece(square);
    };




    // pega a peça e retorna a mesma ou false.
    app.getPiece = function(square) {
        return square.getElementsByClassName("board__piece")[0] || false;
    };
    // verifica se a peça selecionada é do jogador.
    app.isValidPiece = function(pieceType, isToCapture) {
        var captureFlag = isToCapture || false;
        if (captureFlag) {
            return app.isPlayerOne && pieceType === "player-two" || !app.isPlayerOne && pieceType === "player-one" ? true : false;




        } else {
            return app.isPlayerOne && pieceType === "player-one" || !app.isPlayerOne && pieceType === "player-two" ? true : false;
        }
    };

    /**
     * Check if is a valid movement.
     * @return {boolean} True for valid movement or false for not.
     */

    app.validateMove = function() {
        return app.isPlayerOne && app.position.destiny.y < app.position.piece.y || !app.isPlayerOne && app.position.destiny.y > app.position.piece.y ? true : false;
    };


    /**
     * Check if there is piece to be captured.
     * @todo: refactoring is needed.
     */
    app.isKing = function(piece) {
        return piece.classList.contains("king");
    };
    /**
     * Set piece like king.
     * @param {object} piece DOM element.
     */
    app.setKing = function(piece) {
        piece.classList.add("king");
    };
    // configura cordenadas possiveis
    app.setupPosibilities = function() {
        var position = app.getPosition(app.selectedDestiny);



        if (app.isKing(app.selectedPiece)) {


            nextSquare = [{
                y: app.position.destiny.y - 1,
                x: app.position.destiny.x + 1
            }, {
                y: app.position.destiny.y - 1,
                x: app.position.destiny.x - 1
            }, {
                y: app.position.destiny.y + 1,
                x: app.position.destiny.x + 1
            }, {
                y: app.position.destiny.y + 1,
                x: app.position.destiny.x - 1
            }];



            futureSquare = [{
                y: app.position.destiny.y - 2,
                x: app.position.destiny.x + 2
            }, {
                y: app.position.destiny.y - 2,
                x: app.position.destiny.x - 2
            }, {
                y: app.position.destiny.y + 2,
                x: app.position.destiny.x + 2
            }, {
                y: app.position.destiny.y + 2,
                x: app.position.destiny.x - 2
            }];
        } else {
            if (app.isPlayerOne) {
                nextSquare = [{
                    y: app.position.destiny.y - 1,
                    x: app.position.destiny.x + 1
                }, {
                    y: app.position.destiny.y - 1,
                    x: app.position.destiny.x - 1
                }];
                futureSquare = [{
                    y: app.position.destiny.y - 2,
                    x: app.position.destiny.x + 2
                }, {
                    y: app.position.destiny.y - 2,
                    x: app.position.destiny.x - 2
                }];
            } else {
                nextSquare = [{
                    y: app.position.destiny.y + 1,
                    x: app.position.destiny.x + 1
                }, {
                    y: app.position.destiny.y + 1,
                    x: app.position.destiny.x - 1
                }];
                futureSquare = [{
                    y: app.position.destiny.y + 2,
                    x: app.position.destiny.x + 2
                }, {
                    y: app.position.destiny.y + 2,
                    x: app.position.destiny.x - 2
                }];
            }
        }


        for (var i = 0, len = nextSquare.length; i < len; i++) {
            dataValue = nextSquare[i].y + "-" + nextSquare[i].x;
            domNextSquare = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0] || false;
            if (domNextSquare) {
                domNextPiece = domNextSquare.getElementsByClassName("board__piece")[0] || false;
            }
            dataValue = futureSquare[i].y + "-" + futureSquare[i].x;
            domFutureSquare = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0] || false;
            if (domFutureSquare) {
                domFuturePiece = domFutureSquare.getElementsByClassName("board__piece")[0] || false;
            }
            if (domNextPiece) {
                isAdversary = app.isPlayerOne && app.getPieceType(domNextPiece) === "player-two" || !app.isPlayerOne && app.getPieceType(domNextPiece) === "player-one" ? true : false;
            }
            if (domNextPiece && !domFuturePiece && domFutureSquare && isAdversary) {
                break;
            } else {
                if (i === len - 1) {

                    app.changePlayer();
                }
            }
        }
    };


    /**
     * Move the piece to the destiny. If has capture, remove.
     * @param  {object} captured DOM element to remove or false.
     */

    app.movePiece = function(captured) {
        app.selectedDestiny.appendChild(app.selectedPiece);
        if (captured) {
            captured.remove();
        }
    };

    /**
     * 
     * Get the captured piece.
     * @todo: refactoring is needed.
     * @return {object} DOM element or false.
     * 
     */

    app.getCaptured = function() {
        var dataValue = null,
            captured = null,
            coordinates = {
                x: null,
                y: null
            };
        if (app.isKing(app.selectedPiece)) {
            if (app.position.piece.x > app.position.destiny.x) {
                coordinates.x = app.position.destiny.x + 1;
            } else {
                coordinates.x = app.position.destiny.x - 1;
            }
            if (app.position.piece.y > app.position.destiny.y) {
                coordinates.y = app.position.destiny.y + 1;
            } else {
                coordinates.y = app.position.destiny.y - 1;
            }
            dataValue = coordinates.y + "-" + coordinates.x;
        } else {
            if (app.isPlayerOne) {
                if (app.position.piece.x > app.position.destiny.x) {
                    dataValue = app.position.destiny.y + 1 + "-" + (app.position.destiny.x + 1);
                } else {
                    dataValue = app.position.destiny.y + 1 + "-" + (app.position.destiny.x - 1);
                }
            } else {
                if (app.position.piece.x > app.position.destiny.x) {
                    dataValue = app.position.destiny.y - 1 + "-" + (app.position.destiny.x + 1);
                } else {
                    dataValue = app.position.destiny.y - 1 + "-" + (app.position.destiny.x - 1);
                }
            }
        }
        captured = app.board.querySelectorAll('[data-position="' + dataValue + '"]')[0];
        return captured.getElementsByClassName("board__piece")[0] || false;
    };


    /**
     * Configure the coordinates.
     */

    app.setMatchPosition = function() {
        app.position.piece.y = app.getPosition(app.selectedSquare).y;
        app.position.piece.x = app.getPosition(app.selectedSquare).x;
        app.position.destiny.y = app.getPosition(app.selectedDestiny).y;
        app.position.destiny.x = app.getPosition(app.selectedDestiny).x;
        app.position.diff.y = app.position.piece.y - app.position.destiny.y < 0 ? (app.position.piece.y - app.position.destiny.y) * -1 : app.position.piece.y - app.position.destiny.y;
        app.position.diff.x = app.position.piece.x - app.position.destiny.x < 0 ? (app.position.piece.x - app.position.destiny.x) * -1 : app.position.piece.x - app.position.destiny.x;
    };

    /**
     * Set piece like king.
     * @param {object} piece DOM element.
     */

    app.setKing = function(piece) {
        piece.classList.add("king");
    };

    /**
     * Check if selected piece is king.
     * @param  {object}  piece DOM element.
     * @return {Boolean}       True if is king or false if not.
     */

    app.isKing = function(piece) {
        return piece.classList.contains("king");
    };
    /**
     * Change the player's turn.
     */
    app.changePlayer = function() {
        app.isPlayerOne = !app.isPlayerOne;
    };
    /**
     * Check if there is piece in the square.
     * @param  {object}  square DOM element
     * @return {Boolean}        true if there is piece or false if not.
     */
    app.hasPiece = function(square) {
        var piece = square.getElementsByClassName("board__piece")[0];
        return piece ? true : false;
    };
    /**
     * Get the square's position in the board.
     * @param  {object} element A DOM element.
     * @return {object}         Position x and y of the element.
     */
    app.getPosition = function(element) {
        var dataPos = element.getAttribute("data-position").split("-");
        return {
            y: parseInt(dataPos[0]),
            x: parseInt(dataPos[1])
        };
    };
    /**
     * Get the piece's type.
     * @param  {object} element A DOM element.
     * @return {String}         Type of the piece.
     */
    app.getPieceType = function(element) {
        return element.getAttribute("data-piece-type");
    };
    /**
     * Update the visual score.
     */
    app.updateScore = function() {
        app.player.one.dom.score.innerHTML = app.player.one.score;
        app.player.two.dom.score.innerHTML = app.player.two.score;
    };
    /**
     * Update player's name.
     */
    app.updatePlayer = function() {
        app.player.one.dom.name.innerHTML = app.player.one.name + ": ";
        app.player.two.dom.name.innerHTML = app.player.two.name + ": ";
    };
    /**
     * @todo: Exibir um feedback para o usuário.
     */
    app.showMessage = function(message) {
        console.log("### ", message);
    };
    /**
     * Reset global variables.
     */
    app.resetVars = function() {
        app.selectedPiece.classList.remove("selected");
        app.selectedPiece = null;
        app.selectedSquare = null;
        app.selectedDestiny = null;
    };
    /**
     * Let's go =]
     */
    app.init();
})();