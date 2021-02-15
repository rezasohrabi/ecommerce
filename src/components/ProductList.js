import React from 'react';
import WithContext from '../context/WithContext';
import ProdcutItem from './ProductItem';
const ProductList = props => {
    const {products} = props.context;
    return (
        <>
            <section className='hero is-primary is-small'>
                <div className='hero-body'>
                    <p className='title has-text-centered'>Products</p>
                </div>
            </section>
            <br/>
            <div className='container'>
                <div className='columns is-multiline'>
                    {products && products.length? (
                        products.map(product => (
                            <ProdcutItem
                            key={product.id}
                            product={product}
                            addToCart={props.context.addToCart}
                            />
                        ))
                    ) : (
                        <div className='column has-text-centered'>
                            <span className='title has-text-grey-light'>
                                No Products Found!
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default WithContext(ProductList);