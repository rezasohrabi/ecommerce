import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import WithContext from '../context/WithContext';

const initState = {
    name: '',
    stock: '',
    price: '',
    shortDesc: '',
    description: ''
}

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState;
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value, error: ''
        });
    }

    async save(e) {
        e.preventDefault();
        const {name, stock, price, shortDesc, description} = this.state;

        if(name && price){
            const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
            await axios.post(
                'http://localhost:3001/products',
                {id, name, stock, price, shortDesc, description},
            )
            this.props.context.AddProduct(
            {
                name,
                stock: stock || 0,
                price,
                shortDesc,
                description
            }, 
            () => this.setState(initState));
            this.setState({
                flash: {status: 'is-success', msg: 'Product Created Successfully'}
            });
            
        }else {
            this.setState({
                flash: {status: 'is-danger', msg: 'Please Enter Name And Price'}
            })
        }
        
    }

    render() {
        const {name, stock, price, shortDesc, description} = this.state;
        const {user} = this.props.context.user;
        return !(user && user.accessLevel < 1)? (
            <Redirect to='/' />
        ) : (
            <>
            <section className='hero is-primary is-small'>
                <div className='hero-body'>
                    <p className='title'>Add Product</p>
                </div>
            </section>
            <form onSubmit={this.save}>
                <div className='container'>
                    <div className='columns is-one-third'>
                        <div className='field'>
                            <label className='label'>Product Name</label>
                            <input
                            className='input'
                            type='text'
                            name='name'
                            value={name}
                            onChange={this.handleChange}
                            required
                            />
                        </div>
                        <div className='field'>
                            <label className='label'>Price</label>
                            <input 
                            className='input'
                            type='number'
                            name='price'
                            value={price}
                            onChange={this.handleChange}
                            required
                            />
                        </div>
                        <div className='field'>
                            <label className='label'>Available In Stock</label>
                            <input 
                            className='input'
                            type='number'
                            name='stock'
                            value={stock}
                            onChange={this.handleChange}
                            />
                        </div>
                        <div className='field'>
                            <label className='label'>Short Description</label>
                            <input 
                            className='input'
                            type='text'
                            name='shortDesc'
                            value={shortDesc}
                            onChange={this.handleChange} 
                            />
                        </div>
                        <div className='field'>
                            <label className='label'>Description</label>
                            <input
                            className='input'
                            type='text'
                            name='description'
                            value={description}
                            onChange={this.handleChange}
                            />
                        </div>
                        {}
                    </div>
                </div>
            </form>
            </>
        )
    }
}
export default WithContext(AddProduct)