var React = require('react');
var ReactDOM = require('react-dom');
var css = require('../style/main.scss');
var Ajax = new (require('../js/ajax-functions.js'));

var Footer = require('./footer.jsx');

var io = require('socket.io-client');
var c3 = require('c3');

var appUrl = window.location.origin;


function _mapData(stock) {
  var newCol = [stock.dataset.dataset_code];
  stock.dataset.data.forEach(function(e){
    newCol.push(e[1]);
  })
  d=[['x']];
  stock.dataset.data.forEach(function(e){
    d[0].push(new Date(e[0]));
  })
  d.push(newCol);
  return d;
};


function _requestStock(stockCode, cb) {
  Ajax.ajaxRequest('get', appUrl + '/api/stock/' + stockCode, cb)
}


var Hello = React.createClass({
  socket: null,
  componentDidMount: function () {
    var self = this;
    var chart;
    var socket = this.socket = io.connect(appUrl);
    this.setState({loading: true});
    socket.on('add', function(code) {
      self.setState({loading: true});
      _requestStock(code, function(data){
        if(data) {
          chart.load({
            columns : _mapData(data)
          })
        }
        var c =  self.state.codes;
        c.push(code);
        self.setState({codes: c, loading: false});
      });
    });
    socket.on('remove', function (code) {
      self.setState({loading: true});
      chart.unload({
        ids: code
      })
      var c =  self.state.codes;
      var i = c.indexOf(code);
      c.splice(i,1);
      self.setState({codes: c, loading: false});
    })

    chart = c3.generate({
        padding: {
          top: 30,
          bottom: 10,
          left: 70,
          right: 40
        },
        data: {
            x: 'x',
    //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
          columns: []
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d'
                }
            },
            y: {
              label : {
                text: 'Value',
                position: 'outer-middle'
              }
            }
        },
        grid : {
          x: {
            show: true
          },
          y: {
            show: true
          }
        }
    });

    Ajax.ajaxRequest('get', appUrl + '/api/codes', function(res){
      var codes = res.codes;
      if (codes.length === 0) {
        self.setState({codes: codes, loading: false});
      }
      var count = 0;
      var datasets = [];
      codes.forEach(function(code) {
        _requestStock(code, function(data){
          if(data) {
            datasets.push(_mapData(data));
            count++;
            if(count === codes.length) {
              datasets.forEach(function(d){
                chart.load({
                  columns : d
                })
              });
              self.setState({codes: codes, loading: false});
            }
          }
        })
      })
    });
  },
  getInitialState : function () {
    return {codes:[]};
  },
  add: function (e) {
    e.preventDefault();
    if (!this.state.loading && this.refs.code.value) {
      var self = this;
      this.setState({loading: true});
      Ajax.ajaxRequest('post', appUrl + '/api/codes/' + this.refs.code.value, function(data){
        if(!data.error) {
          self.socket.emit('add', data.newCode);
          self.setState({error: ''});
          self.refs.code.value = '';
        } else {
          self.setState({error: data.error, loading: false});
        }
      })
    }
  },
  remove: function (code) {
    if (!this.state.loading) {
      var self = this;
      this.setState({loading: true});
      Ajax.ajaxRequest('delete', appUrl + '/api/codes/' + code, function(data){
        if(!data.error) {
          self.socket.emit('remove', data.removed);
        }
      });
    }
  },
  //
  render: function () {
    var st = this.state.codes;
    var self = this;
    var stocks = st.map(function(s, i){
      return <div className="stocks" key={i} onClick={self.remove.bind(null,s)}>
        {s}
        <span className="close">x</span>
      </div>
    });
    return (
      <div className="container">
        <h1>Stocks</h1>
          <div >
            <div id="chart"></div>
          </div>
          <div className="menu">
            <form onSubmit={this.add}>
              <input ref="code"  placeholder="enter a stock code..."></input>
            </form>
            {stocks}
            <div>{this.state.loading ? 'loading...' : this.state.error}</div>
          </div>
          <Footer/>
      </div>
    )
  }
});

ReactDOM.render(<Hello/>, document.getElementById('appView'));
