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
    let cart = localStorage.getItem('cart');
    user = user? JSON.parse(user) : null;
    cart = cart? JSON.parse(cart) : {};
    this.setState({user, products: products.data, cart});
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

  removeProduct = async (id) => {
    const cart = this.state.cart;
    const res = await axios.delete(
      `http://localhost:3001/products/${id}`
      ).catch(res => {
        return {status: res.status, message: res.message}
      });
      if (res.status === 200) {
        const products = this.state.products.filter(p => {
          if(p.id !== id) return p;
          else delete cart[p.name];
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        this.setState({products, cart});
      }
  }

  addToCart = cartItem => {
    const cart = this.state.cart;
    if(cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    if(cart[cartItem.id].amount > cart[cartItem.id].product.stock){
      cart[cartItem.id].amount = cart[cartItem.id].product.stock; 
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.setState({cart});
  }

  removeFromCart = cartItemId => {
    const cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem('cart', JSON.stringify(cart));
    this.setState({cart});
  }

  clearCart = () => {
    const cart = {};
    localStorage.removeItem('cart');
    this.setState({cart});
  }

  checkout = () => {
    if(!this.state.user) {
      return this.routerRef.current.history.push('./login');
    }

    const cart = this.state.cart;
    const products = this.state.products.map((p) => {
      if(cart[p.name]) {
        p.stock = p.stock - cart[p.name].amount;
        axios.put(
          `http://localhost:3001/products/${p.id}`,
          {...p}
        )
      }
      return p;
    });
    this.setState({products});
    this.clearCart();
  }

  render() {
    return(
      <Context.Provider value={{
        ...this.state,
        removeFromCart: this.removeFromCart,
        addToCart: this.addToCart,
        clearCart: this.clearCart,
        checkout: this.checkout,
        addProduct: this.addProduct,
        removeProduct: this.removeProduct,
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
