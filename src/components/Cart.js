import React from 'react';
import WithContext from '../context/WithContext'
import CartItem from './CartItem'

const Cart = props => {
    const {cart} = props.context;
    const cartKeys = Object.keys(cart || {});
    return (
        <>
            <section className='hero is-primary is-small'>
                <div className='hero-body'>
                    <div className='title has-text-centered'>My Cart</div>
                </div>
            </section>
            <br/>
            <div className='container'>
                {cartKeys.length? (
                    <div className='columns is-multiline'>
                        {cartKeys.map(key => (
                            <CartItem 
                            cartKey={key}
                            key={key}
                            cartItem={cart[key]}
                            removeFromCart={props.context.removeFromCart}
                            />
                        ))}
                        <div className='column is-12 is-clearfix'>
                            <br/>
                            <div className='is-pulled-right'>
                                <button
                                className='button is-warning'
                                onClick={props.context.clearCart}
                                >Clear Cart
                                </button>{' '}
                                <button
                                className='button is-success'
                                onClick={props.context.checkout}
                                >Checkout
                                </button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className='column has-text-centered'>
                        <span className='title has-text-grey-light'>
                            No Item In Cart!
                        </span>
                    </div>
                )}
            </div>
        </>
    )
}
export default WithContext(Cart);
