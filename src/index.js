import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={ () => this.props.onClick() }
            >
                { this.props.value }
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare( i ) {
        return <Square value={ this.props.squares[ i ] } onClick={ () => this.props.onClick( i ) } />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    { this.renderSquare( 0 ) }
                    { this.renderSquare( 1 ) }
                    { this.renderSquare( 2 ) }
                </div>
                <div className="board-row">
                    { this.renderSquare( 3 ) }
                    { this.renderSquare( 4 ) }
                    { this.renderSquare( 5 ) }
                </div>
                <div className="board-row">
                    { this.renderSquare( 6 ) }
                    { this.renderSquare( 7 ) }
                    { this.renderSquare( 8 ) }
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            history : [
                {
                    squares : Array( 9 ).fill( null ),
                    xIsNext : true
                }
            ],
            stepNumber : 1
        }
    }

    getHistory( stepNumber ) {
        const history = this.state.history.slice( 0, stepNumber );
        const latestHistory = history[ history.length - 1 ];
        const currentSquares = latestHistory.squares;
        const xIsNext = latestHistory.xIsNext;
        return {
            history,
            currentSquares,
            xIsNext
        }
    }

    handleClick( i ) {
        const { history, currentSquares, xIsNext } = this.getHistory( this.state.stepNumber );
        const squares = currentSquares.slice();

        if( this.hasWinner || squares[ i ] ) {
            return false;
        }

        squares[ i ] = xIsNext ? 'X' : 'O';

        const newHistory = history.slice();
        newHistory.push( {
            squares,
            xIsNext : !xIsNext
        } );
        this.setState( {
            history : newHistory,
            stepNumber : this.state.stepNumber + 1
        } );
    }

    jumpTo( move ) {
        this.setState( {
            stepNumber : move + 1
        } );
    }


    render() {
        const { currentSquares, xIsNext } = this.getHistory( this.state.stepNumber );
        const hasWinner = calculateWinner( currentSquares );
        this.hasWinner = hasWinner;

        let status;
        if ( this.hasWinner ) {
            status = 'Winner: ' + ( !xIsNext ? 'X' : 'O' );
        } else {
            status = 'Next player: ' + ( xIsNext ? 'X' : 'O' );
        }

        const moves =  this.state.history.map( ( step, move ) => {
            const desc = move ? 'Go to Step ' + move : 'Go to Beginning';
            return (
                <li key={ move }>
                    <button onClick={ () => this.jumpTo( move ) }> { desc } </button>
                </li>
            )
        } );

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={ currentSquares }
                        xIsNext={ xIsNext }
                        onClick={ ( i ) => this.handleClick( i ) }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById( 'root' )
);

