import React, { useContext } from 'react'
import { useForm } from "react-hook-form";
import { JwtContext } from '../../shared/contexts/JwtContext';
import { API } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {

    const { register, handleSubmit } = useForm();
    const { setJwt } = useContext(JwtContext);
    const navigate = useNavigate();

    const onSubmit = formData => {
        API
            .post('login', formData)
            .then((res) => {
                console.log('Login with response:', res.data, 'Full AxiosResponse:', res);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('name', JSON.stringify(res.data.userInfo.name));
                localStorage.setItem('email_verified', JSON.stringify(res.data.userInfo.email_verified));
                setJwt(true);
                navigate('/hello-user');
            })
            .catch((error) => {
                console.log('Error logging in:', error);
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='form'>
            <div className='form-input'>
                <label htmlFor="name">name</label>
                <input id="name" {...register("name", { required: true })} />
            </div>
            <div className='form-input'>
                <label htmlFor="email">email</label>
                <input id="email" {...register("email", { required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })} />
            </div>
            <div className='form-input'>
                <label htmlFor="password">password</label>
                <input id="password" type="password" {...register("password", { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ })} />
            </div>
            <input type="submit" value="Login" />
        </form>
    )
}
