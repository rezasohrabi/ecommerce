import './App.css';
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Context from './context/Context';
import axios from 'axios'
import jwt_decode from 'jwt-decode'

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

  async componentDidMount() {
    const products = await axios.get('http://localhost:3001/products');
    let user = localStorage.getItem('user');
    user = user? JSON.parse(user) : null;
    this.setState({user, products: products.data});
  }

  login = async (email, password) => {
    const res = await axios.post(
      'http://localhost:3001/login',
      {email, password}
    ).catch(res => {
      return {status: res.status , message: res.message}
    });
    
    if(res.status === 200) {
      const {email} = jwt_decode(res.data.accessToken);
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === 'admin@example.com'? 0 : 1
      }
      this.setState({user});
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }else{
      return false;
    }
  }

  logout = (e) => {
    e.preventDefault();
    this.setState({user: null});
    localStorage.removeItem('user');
  }

  addProduct = (product, callback) => {
    const products = this.state.products.slice();
    products.push(product);
    this.setState({products}, () => {callback && callback()})
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
            className='navbar container'
            role='navigation'
            aria-label='main navigation'>
              <div className='navbar-brand'>
                <strong className='navbar-item'>E-commerce</strong>
                <label
                role='button'
                className='navbar-burger burger'
                aria-label='menu'
                aria-expanded='false'
                onClick={(e) => {
                  e.preventDefault();
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
                    <span className='tag is-primary' style={{marginLeft: '5px'}}>
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
