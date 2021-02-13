import './App.css';
import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';

function App() {
  return (
    <div className="App">
      <AddProduct />
      <Cart />
      <Login />
      <ProductList />
    </div>
  );
}

export default App;
