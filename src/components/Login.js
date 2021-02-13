import React from 'react';
import { Redirect } from 'react-router-dom';
import WithContext from '../context/WithContext';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            error: ''
        });
    }

    login(e) {
        e.preventDefault();

        const {email, password} = this.state;
        if(!email || !password){
           return this.setState({error: 'Fill All Fields!'})
        }
        this.props.context.login(email, password).then((isLoggedIn) => {
            if(!isLoggedIn) {
                this.setState({error: 'Invalid Credentials!'})
            }
        })
    }

    render() {
        return !this.props.context.user? (
        <>
            <section className='hero is-primary is-small'>
                <div className='hero-body'>
                    <p className='title'>
                        Login
                    </p>
                </div>
            </section>
            <br/>
            <form onSubmit={this.login}>
                <div className='columns is-mobile is-centered'>
                    <div className='column is-one-third'>
                        <div className='field'>
                            <div className='label'>Email</div>
                            <input
                            name='email'
                            value={this.state.email}
                            onChange={this.handleChange} 
                            type='email' 
                            className='input' 
                            />
                        </div>
                        <div className='field'>
                            <div className='label'>Password</div>
                            <input
                            name='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            type='password'
                            className='input'
                            />
                        </div>
                        {this.state.error && 
                        (<div className='has-danger-text'>
                            {this.state.error}
                        </div>)}
                        <div className='field'>
                            <button className='button is-primary is-outlined is-pulled-right'>
                                Submit
                            </button>
                        </div>
                    </div>  
                </div>
            </form>
        </>
        ) : (
        <Redirect to='/products' />
        )
    }

}
export default WithContext(Login);