import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import ImageLogoSignIn from '../../assets/images/logologin.png'
import { Image } from 'antd'
import { EyeInvisibleFilled, EyeFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/MessageComponent/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'


function SignInPage() {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const location = useLocation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();

    const navigate = useNavigate()

    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )

    const { data, isSuccess } = mutation


    useEffect(() => {
        if (isSuccess) {
            message.success('Đăng nhập thành công!')
            if (location?.state) {
                navigate(location?.state)
            } else {
                navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token)
                console.log('decoded', decoded)
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }));
    }

    console.log('mutation', mutation)

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        if (!email || !password) {
            message.error('Vui lòng nhập đầy đủ thông tin')
            return
        } else {
            mutation.mutate({
                email,
                password
            })
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', backgroundColor: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1 style={{ fontSize: '25px', marginBottom: '0px' }}>Xin Chào</h1>
                    <p style={{ fontSize: '18px' }}>Đăng nhập và tạo tài khoản</p>
                    <InputForm style={{ marginBottom: '10px' }}
                        placeholder='abc@gmail.com'
                        value={email}
                        onChange={handleOnChangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span onClick={() => setIsShowPassword(!isShowPassword)} style={{ zIndex: 10, position: 'absolute', top: '12px', right: '8px' }}>
                            {isShowPassword ? (
                                <EyeFilled />) : (<EyeInvisibleFilled />)}
                        </span>
                        <InputForm placeholder='password'
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnChangePassword} />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    {/* <Loading isPending={isLoading}> */}
                    <ButtonComponent
                        disabled={!email.length || !password.length}
                        onClick={handleSignIn}
                        size={40}
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            border: 'none', height: '48px',
                            width: '100%', borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textButton={'Đăng nhập'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                    {/* </Loading> */}
                    <p><WrapperTextLight style={{ fontSize: '15px' }}>Quên mật khẩu</WrapperTextLight></p>
                    <p style={{ fontSize: '15px' }}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp} style={{ fontSize: '15px' }}>Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight onClick={() => navigate('/')}>
                    <Image src={ImageLogoSignIn} preview={false} alt='image-logo-login' height='203px' width='203px' />
                    <h4 style={{ fontSize: '20px' }}>Mua sắm tại WICSport</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage
