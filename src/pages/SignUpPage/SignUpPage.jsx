import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogoSignIn from '../../assets/images/logologin.png'
import { Image } from 'antd'
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/MessageComponent/Message'

const SignUpPage = () => {
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )

    const { data, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleNavigateSignIn()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const handleOnChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }


    const navigate = useNavigate()
    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    const handleSignUp = () => {
        mutation.mutate({ email, password, confirmPassword })
    }

    return (
        <div >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
                <div style={{ width: '800px', height: '445px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex' }}>
                    <WrapperContainerLeft>
                        <h1 style={{ fontSize: '25px', marginBottom: '0px' }}>Xin Chào</h1>
                        <p style={{ fontSize: '18px' }}>Đăng nhập và tạo tài khoản</p>
                        <InputForm style={{ marginBottom: '10px' }} placeholder='abc@gmail.com' value={email} onChange={handleOnChangeEmail} />
                        <div style={{ position: 'relative' }}>
                            <span onClick={() => setIsShowPassword(!isShowPassword)} style={{ zIndex: 10, position: 'absolute', top: '12px', right: '8px' }}>
                                {
                                    isShowPassword ? (
                                        <EyeFilled />) : (<EyeInvisibleFilled />)
                                }
                            </span>
                            <InputForm style={{ marginBottom: '10px' }} placeholder='password' type={isShowPassword ? "text" : "password"}
                                value={password} onChange={handleOnChangePassword} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} style={{ zIndex: 10, position: 'absolute', top: '12px', right: '8px' }}>
                                {
                                    isShowConfirmPassword ? (
                                        <EyeFilled />) : (<EyeInvisibleFilled />)
                                }
                            </span>
                            <InputForm placeholder='comfirm password' type={isShowConfirmPassword ? "text" : "password"}
                                value={confirmPassword} onChange={handleOnChangeConfirmPassword} />
                        </div>
                        {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: '15px' }}>{data?.message}</span>}
                        <ButtonComponent
                            disabled={!email.length || !password.length || !confirmPassword.length}
                            onClick={handleSignUp}
                            size={40}
                            styleButton={{ background: 'rgb(255, 57, 69)', border: 'none', height: '48px', width: '100%', borderRadius: '4px', margin: '26px 0 10px' }}
                            textButton={'Đăng ký'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                        <p style={{ fontSize: '15px' }}>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn} style={{ cursor: 'pointer', fontSize: '15px' }}>Đăng nhập</WrapperTextLight></p>
                    </WrapperContainerLeft>
                    <WrapperContainerRight>
                        <Image src={ImageLogoSignIn} preview={false} alt='image-logo-login' height='203px' width='203px' />
                        <h4 style={{ fontSize: '20px' }}>Mua sắm tại WICSport</h4>
                    </WrapperContainerRight>
                </div>
            </div>
        </div >
    )
}

export default SignUpPage
