import React from 'react'
const CartItem = props => {
    const {cartItem, cartKey} = props;
    const {product, amount} = cartItem;
    return (
        <div className='column is-half'>
            <div className='box'>
                <article className='media'>
                    <div className='media-left'>
                        <figure className='image is-64x64'>
                            <img 
                            src="https://bulma.io/images/placeholders/128x128.png" 
                            alt={product.shortDesc}
                            />
                        </figure>
                    </div>
                    <div className='media-content'>
                        <div className='content'>
                            <p>
                                <div>
                                    <strong>{cartKey}</strong>
                                    {' '}
                                    <span className='has-text-primary'>{product.price}</span>
                                </div>                                
                                <br/>
                                <div>{product.description}</div>
                                <br/>
                                <small>{`${amount} In Cart`}</small>
                            </p>
                        </div>
                    </div>
                    <div 
                    className='media-right'
                    onClick={() => {props.removeFromCart(cartKey)}}
                    >
                        <span className='delete is-large'></span>
                    </div>
                </article>
            </div>
        </div>
    )

}
export default CartItem