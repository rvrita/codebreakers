var fisherYatesShuffle = function (array) {
  var i = array.length, k, temp;
  while (i !== 0) {
    k = Math.floor(Math.random() * i);
    i -= 1;
    temp = array[i];
    array[i] = array[k];
    array[k] = temp;
  }
}

class Rules extends React.Component {
  render() {
    return (
      <div className="rules">
        <h4>Rules</h4>
        <p>
          Codenames is a game of guessing which codenames (i.e., words) in a set are related to a hint-word given by another player.<br /><br />Players split into two teams: red and blue. One player of each team is selected as the team's spymaster; the others are field operatives.<br /><br />Twenty-five Codename cards, each bearing a word, are laid out in a 5×5 rectangular grid, in random order. A number of these words represent red agents, a number represent blue agents, one represents an assassin, and the others represent innocent bystanders.<br /><br />The teams' spymasters are given a randomly-dealt map card showing a 5×5 grid of 25 squares of various colors, each corresponding to one of the code name cards on the table. Teams take turns. On each turn, the appropriate spymaster gives a verbal hint about the words on the respective cards. Each hint may only consist of one single word and a number. The spymaster gives a hint that is related to as many of the words on his/her own agents' cards as possible, but not to any others – lest they accidentally lead their team to choose a card representing an innocent bystander, an opposing agent, or the assassin.<br /><br />The hint's word can be chosen freely, as long as it is not (and does not contain) any of the words on the code name cards still showing at that time. Code name cards are covered as guesses are made.<br /><br />The hint's number tells the field operatives how many words in the grid are related to the word of the clue. It also determines the maximum number of guesses the field operatives may make on that turn, which is the hint's number plus one. Field operatives must make at least one guess per turn, risking a wrong guess and its consequences. They may also end their turn voluntarily at any point thereafter.<br /><br />After a spymaster gives the hint with its word and number, their field operatives make guesses about which code name cards bear words related to the hint and point them out, one at a time. When a code name card is pointed out, the spymaster covers that card with an appropriate identity card – a blue agent card, a red agent card, an innocent bystander card, or the assassin card – as indicated on the spymasters' map of the grid. If the assassin is pointed out, the game ends immediately, with the team who identified him losing. If an agent of the other team is pointed out, the turn ends immediately, and that other team is also one agent closer to winning. If an innocent bystander is pointed out, the turn simply ends.<br /><br />The game ends when all of one team's agents are identified (winning the game for that team),[3] or when one team has identified the assassin (losing the game). Source: <a href="https://en.wikipedia.org/wiki/Codenames_(board_game)">Wikipedia</a>
        </p>
      </div>
    )
  }
}

class Board extends React.Component {
  render() {
    return (
      <table className="board">
        <tbody>
          {this.props.cards.map((row, indexRow) => {
            return (
              <tr key={indexRow}>
                {row.map((card, indexCol) => <Card
                  card={card}
                  key={indexRow * 5 + indexCol}
                  isRevealButtonOn={this.props.isRevealButtonOn}
                  indexRow={indexRow}
                  indexCol={indexCol}
                  handleCardClick={this.props.handleCardClick} />)}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

class Card extends React.Component {
  render() {
    var classes = 'card';
    if (this.props.isRevealButtonOn) {
      classes += ` ${this.props.card.color}b`;
    }
    if (this.props.card.isRevealed) {
      classes += ` ${this.props.card.color}`;
    }
    return (
      <td className={classes} onClick={(e) => {
        e.preventDefault();
        this.props.handleCardClick(this.props.indexRow, this.props.indexCol)
      }
      }>{this.props.card.word}</td>
    )
  }
}

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hintValue: '',
      isBluesHint: true
    },
    this.handleHintInputChange = this.handleHintInputChange.bind(this);
    this.setHintPlayer = this.setHintPlayer.bind(this);
  }

  handleHintInputChange(event) {
    this.setState({
      hintValue: event.target.value
    });
  }

  setHintPlayer(e) {
    this.setState({
      isBluesHint: e.target.value === 'Blue' ? true : false
    })
  }

  render() {
    if (this.props.gameStatus.redTotal === this.props.gameStatus.redRevealed) {
      var message = 'Red Team Won!'
    } else if (this.props.gameStatus.blueTotal === this.props.gameStatus.blueRevealed) {
      var message = 'Blue Team Won!'
    }
    return (
      <div className="infoboard">
        <h3 className="statusmessage">{message}</h3>
        <h3 className="playerturn">{this.props.isBluesTurn ? 'Blue' : 'Red'} Team starts</h3>
        <button className="revealbutton" onClick={(e) => {
          e.preventDefault();
          this.props.handleRevealClick();
        }}>Reveal</button><br />
        <form id="hint" onSubmit={(e) => {
          e.preventDefault();
          this.props.handleHintSubmit(this.state.hintValue, this.state.isBluesHint)
        }}>
          <label htmlFor="hintinput">Add a hint:</label>
          <input
            type="text"
            id="hintinput"
            name="hintinput"
            value={this.state.hintValue}
            onChange={this.handleHintInputChange} /><br />
          <div onChange={this.setHintPlayer}>
            <input type="radio" value="Red" name="player" /> Red
            <input type="radio" value="Blue" name="player" /> Blue
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

class InfoBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hintwords: {
        'Red': [],
        'Blue': []
      }
    };
    this.handleHintSubmit = this.handleHintSubmit.bind(this);
  }

  handleHintSubmit(word, isBluesHint) {
    if (isBluesHint) {
      var wordArray = this.state.hintwords['Blue'].slice();
      wordArray.push(word);
      this.setState({
        hintwords: {
          'Red': this.state.hintwords['Red'],
          'Blue': wordArray
        }
      })
    } else {
      var wordArray = this.state.hintwords['Red'].slice();
      wordArray.push(word);
      this.setState({
        hintwords: {
          'Red': wordArray,
          'Blue': this.state.hintwords['Blue']
        }
      })
    }
  }

  render() {
    return (
      <div className="flexcontainer">
        <Player
          team='Blue'
          hintWords={this.state.hintwords['Blue']}
          gameStatus={this.props.gameStatus} />
        <Info
          handleHintSubmit={this.handleHintSubmit}
          gameStatus={this.props.gameStatus}
          isBluesTurn={this.props.isBluesTurn}
          handleRevealClick={this.props.handleRevealClick}
        />
        <Player
          team='Red'
          hintWords={this.state.hintwords['Red']}
          gameStatus={this.props.gameStatus} />
      </div>
    )
  }
}

class Player extends React.Component {
  render() {
    if (this.props.team === 'Blue') {
      var allCards = this.props.gameStatus.blueTotal;
      var cardsLeft = allCards - this.props.gameStatus.blueRevealed;
    } else {
      var allCards = this.props.gameStatus.redTotal;
      var cardsLeft = allCards - this.props.gameStatus.redRevealed;
    }
    return (
      <div className="scoreboard">
        <h3>{this.props.team} Team's Scores:</h3>
        <table>
          <tbody>
            <tr>
              <td>All cards:</td>
              <td>{allCards}</td>
            </tr>
            <tr>
              <td>Cards left:</td>
              <td>{cardsLeft}</td>
            </tr>
          </tbody>
        </table><br />
        <p>Hints</p>
        <ul className="hintwords">
          {this.props.hintWords.map(word =>
          <li>{word}</li>
            )}
        </ul>
      </div>
    )
  }
}

class AddWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueList: 'built-in',
      valueSelect: 'Rita1',
      valueWord: '',
      valueOwnCollection: ''
    },
      this.handleWordListChange = this.handleWordListChange.bind(this);
    this.handleYourCollectionChange = this.handleYourCollectionChange.bind(this);
    this.handleCollectionChange = this.handleCollectionChange.bind(this);
    this.handleWordChange = this.handleWordChange.bind(this);
  }

  handleWordListChange(event) {
    this.setState({
      valueList: event.target.value
    });
  }

  handleYourCollectionChange(event) {
    this.setState({
      valueOwnCollection: event.target.value
    });
  }

  handleCollectionChange(event) {
    this.setState({
      valueSelect: event.target.value
    });
  }

  handleWordChange(event) {
    this.setState({
      valueWord: event.target.value
    });
  }

  render() {
    return (
      <div className="addwords-container">
        <div className="addwordsform">
          <h4>Add your own words (one at a time):</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            var word = this.state.valueWord;
            if (this.state.valueOwnCollection === '') {
              var list = this.state.valueSelect;
            } else {
              var list = this.state.valueOwnCollection;
            }
            this.props.handleAddWordSubmit(word, list);
          }}>
            <label>Name of your collection:
          <input type="text" id="collectionname" name="collectionname" value={this.state.valueOwnCollection} onChange={this.handleYourCollectionChange} />
            </label><br />
            <label>Or add to an existing list:
            <select value={this.state.valueSelect} onChange={this.handleCollectionChange}>
                {this.props.collections.filter(obj => obj.collection !== 'built-in').map((option, index) => {
                  return <option key={index} value={option.collection}>{option.collection}</option>
                })}
              </select>
            </label><br /><br />
            <label>Word:
              <input type="text" id="addwords" name="addwords" value={this.state.valueWord} onChange={this.handleWordChange} />
            </label><br />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="restartgame">
          <h4>Restart the game:</h4><br />
          <form onSubmit={(e) => {
            e.preventDefault();
            this.props.handleRestartSubmit(this.state.valueList);
          }}>
            <label>Choose a list:
            <select value={this.state.valueList} onChange={this.handleWordListChange}>
                {this.props.collections.filter(obj => obj.count > 25).map((option, index) => {
                  return <option key={index} value={option.collection}>{option.collection}</option>;
                })}
              </select>
            </label><br />
            <input type="submit" value="Restart" />
          </form>
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBluesTurn: true,
      cards: [],
      isRevealButtonOn: false,
      gameStatus: {
        redTotal: 0,
        redRevealed: 0,
        blueTotal: 0,
        blueRevealed: 0
      },
      collections: [],
      isRestarted: 0
    }
    this.handleRevealClick = this.handleRevealClick.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleRestartSubmit = this.handleRestartSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchWords('/getwords');
    fetch('/collections')
      .then(response => response.json())
      .then(result => {
        this.setState({
          collections: result
        })
      });
  }

  fetchWords(url) {
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(result => {
        var isBluesTurn = result[24].color === 'blue' ? true : false;
        fisherYatesShuffle(result);
        var newShuffle = [[], [], [], [], []]
        for (var i = 0; i < result.length; i++) {
          result[i].isRevealed = false;
          newShuffle[i % 5].push(result[i]);
        }
        this.setState({
          gameStatus: {
            redTotal: isBluesTurn ? 8 : 9,
            blueTotal: isBluesTurn ? 9 : 8,
            blueRevealed: 0,
            redRevealed: 0
          },
          isBluesTurn: isBluesTurn,
          cards: newShuffle
        });
      });
  }

  handleRevealClick() {
    this.setState({
      isRevealButtonOn: !this.state.isRevealButtonOn
    })
  }

  handleRestartSubmit(valueList) {
    this.fetchWords(`/collections/${valueList}`);
    this.setState({
      isRestarted: this.state.isRestarted + 1
    })
  }

  handleAddWordSubmit(word, list) {
    var data = { word: word, list: list };
    fetch('/addwords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }

  handleCardClick(indexRow, indexCol) {
    newCards = this.state.cards.slice();
    newCards[indexRow][indexCol].isRevealed = true;
    var color = newCards[indexRow][indexCol].color;

    var currentBlueNumber = this.state.gameStatus.blueRevealed;
    var currentRedNumber = this.state.gameStatus.redRevealed;
    this.setState({
      gameStatus: {
        blueRevealed: (color === 'blue') ? currentBlueNumber + 1 : currentBlueNumber,
        redRevealed: (color === 'red') ? currentRedNumber + 1 : currentRedNumber,
        redTotal: this.state.gameStatus.redTotal,
        blueTotal: this.state.gameStatus.blueTotal
      },
      cards: newCards
    });
  }

  render() {
    return (
      <div>
        <div>
          <h1>Codebreakers</h1>
          <h5>(a.k.a. Codenames)</h5>
        </div>
        <Board
          isRevealButtonOn={this.state.isRevealButtonOn}
          handleCardClick={this.handleCardClick}
          cards={this.state.cards} />
        <InfoBoard
          key={this.state.isRestarted}
          // this forces react to create new instance and remount infoboard - hacky!!!!! needs better solution lifting the state up
          isBluesTurn={this.state.isBluesTurn}
          handleRevealClick={this.handleRevealClick}
          cards={this.state.cards}
          gameStatus={this.state.gameStatus} />
        <AddWords
          handleRestartSubmit={this.handleRestartSubmit}
          handleAddWordSubmit={this.handleAddWordSubmit}
          collections={this.state.collections} />
        <Rules />
      </div>
    )
  }
}

ReactDOM.render(<Game />, document.getElementById('app'));

