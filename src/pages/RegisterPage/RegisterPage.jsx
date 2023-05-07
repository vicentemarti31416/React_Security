import React from 'react'
import { useForm } from "react-hook-form";
import { API } from "../../shared/services/api";

export default function RegisterPage() {

    const { register, handleSubmit } = useForm();

    const onSubmit = formData => {
        API
        .post('register', formData)
        .then((res) => {
            console.log('User registered successfully with response:', res.data, 'Full AxiosResponse:', res);
        })
        .catch((error) => console.log(error));
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
                <input name="password" id="password" type="password" {...register("password", { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ })} />

            </div>
            <input type="submit" value="Register" />
        </form>
    )
}
