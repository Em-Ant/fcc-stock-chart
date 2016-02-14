#Dynamic App Project: Chart the Stock Market

Heroku app: http://stock-chart.herokuapp.com

###User stories:

* I can view a graph displaying the recent trend lines for each added stock.
* I can add new stocks by their symbol name.
* I can remove stocks.
* I can see changes in real-time when any other user adds or removes a stock.

###Usage :

Add a Stock Code using the input form. Try to open the app in two separate windows.
The two instances will sync, when adding a Stock Code.

###Tools:

* React (no Flux),
* SCSS - no Bootstrap,
* Sockets.io,
* C3.js (D3.js based chart library),
* Quandl API.

###Warning

This app has no database. The stock codes will be reset to ['FB', 'AAPL'] on server restart.
