import './App.css';
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Context from './context/Context';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      products: [],
      cart: {}
    }
    this.routerRef = React.createRef();
  }
  render() {
    return(
      <Context.Provider value={{
        ...this.state,
        removeFromCart: this.removeFromCart,
        addToCart: this.addToCart,
        clearCart: this.clearCart,
        addProduct: this.addProduct,
        login: this.login,
        logout: this.logout,
      }}>
        <Router ref={this.routerRef}>
          <div className='App'>
            <nav
            className='navbar'
            role='navigation'
            aria-label='main navigation'>
              <div className='navbar-brand'>
                <strong>E-commerce</strong>
                <label
                role='button'
                className='navbar-burger'
                aria-label='menu'
                aria-expanded='false'
                onClick={() => {
                  this.setState({showMenu: !this.state.showMenu});
                }}>
                  <span aria-hidden='true'></span>
                  <span aria-hidden='true'></span>
                  <span aria-hidden='true'></span>
                </label>
              </div>
              <div className={`navbar-menu ${
                this.state.showMenu? 'is-active' : ''
                }`}>
                <div className='navbar-start'>
                  <Link to='/products' className='navbar-item'>
                    Products
                  </Link>
                  <Link to='/cart' className='navbar-item'>
                    Cart
                    <span className='tag is-primary'>
                      {Object.keys(this.state.cart).length}
                    </span>
                  </Link>
                  {this.state.user && 
                  this.state.user.accessLevel < 1 &&
                  <Link to='/add-product' className='navbar-item'>
                    Add Product
                  </Link>
                  }
                </div>
                <div className='navbar-end'>
                  {!this.state.user ?
                    <Link to='/login' className='navbar-item'>
                      Login  
                    </Link>:
                    <Link to='/'
                    className='navbar-item'
                    onClick={this.logout}
                    >
                      Logout
                    </Link>
                    }
                </div>
              </div>
            </nav>
            <Switch>
              <Route exact path='/products' component={ProductList} />
              <Route exact path='/cart' component={Cart} />
              <Route exact path='/add-product' component={AddProduct} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/' component={ProductList} />
            </Switch>
          </div>
        </Router>
      </Context.Provider>
    )
  }
}

export default App;
