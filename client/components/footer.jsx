var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <footer>
        <div className="container">
          <div>
            <p>
              by <a href="http://www.emant.altervista.org" target="_blank">em-ant</a> |
              <a href="https://github.com/Em-Ant" target="_blank">@github</a> |
              <a href="http://codepen.io/Em-Ant/" target="_blank">@codepen</a> |
              <a href="http://www.freecodecamp.com/em-ant" target="_blank">@freeCodeCamp</a>
            </p>
            <p>Powered by <a className="Quandl" href="https://www.quandl.com/" target="_blank">Quandl</a>.</p>
          </div>
        </div>
      </footer>
    )
  }
})
