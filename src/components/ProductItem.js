const ProductItem = props => {
    const {product} = props;
    return (
        <div className='column is-one-quarter'>
            <div className='card'>
                <div className='card-image'>
                    <figure className='image is64x64'>
                        <img 
                        src='https://bulma.io/images/placeholders/128x128.png' 
                        alt={product.shortDesc} 
                        />
                    </figure>
                </div>
                <div className='card-content'>
                    <div className='media'>
                        <div className='media-content'>
                            <p className='title'>{product.name}</p>
                            <p className='subtitle has-text-primary'>{product.price} {' $'}</p>
                        </div>
                    </div>
                    <div className='content'>
                    {product.description}
                    </div>
                    {product.stock > 0 ? (
                    <>
                        <small>{product.stock + ' Available'}</small>
                        <div className='is-clearfix'>
                            <button
                            className='button is-outlined is-primary is-small'
                            onClick={() => 
                                props.addToCart({
                                    id: product.name,
                                    product,
                                    amount: 1
                                })
                            }>
                                Add To Cart
                            </button>
                        </div>
                    </>
                    ) : (
                        <span className='has-text-danger'>Out of Stock</span>
                    )}
                </div>
            </div>
        </div>
    )
}
export default ProductItem;