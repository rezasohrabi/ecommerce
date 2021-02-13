import Context from 'context';

const WithContext = WrappedComponent => {
    const WithHOC = props => {
        return (
            <Context.Consumer>
                {context =>{
                    <WrappedComponent 
                    context={context}
                    {...props}
                    />
                }}
            </Context.Consumer>     
        )
    }
    return WithHOC;
}
export default WithContext;