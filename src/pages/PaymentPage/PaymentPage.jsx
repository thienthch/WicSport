import { Checkbox, Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Lable, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSilde';
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as message from '../../components/MessageComponent/Message'
import * as OrderService from '../../services/OrderService'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';



const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

    const [delivery, setDelivery] = useState('fast')
    const [payment, setPayment] = useState('later_money')
    const navigate = useNavigate()
    const [sdkReady, setSdkReady] = useState(false)

    const [isModalOpenUpdateInfo, setIsModalOpenUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })
    const [form] = Form.useForm();

    const dispatch = useDispatch()


    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isModalOpenUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isModalOpenUpdateInfo])

    const handleOnChangeAddress = () => {
        setIsModalOpenUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount * cur.amount) / 100)
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const deliveryMemo = useMemo(() => {
        if ((priceMemo + priceMemo * 8 / 100) > 1000000 || priceMemo == 0) {
            return 0
        } else {
            return 30000
        }
    }, [order])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryMemo)
    }, [priceMemo, priceDiscountMemo, deliveryMemo])

    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSlected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            // eslint-disable-next-line no-unused-expressions
            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSlected,
                    fullName: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    city: user?.city,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: deliveryMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email
                }
            )
        }
    }

    console.log('order', order, user)

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,
                { ...rests }, token)
            return res
        },
    )

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const {
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        },
    )

    const { isLoading, data } = mutationUpdate
    const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = []
            order?.orderItemsSlected?.forEach(element => {
                arrayOrdered.push(element.product)
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
            message.success('Đặt hàng thành công')
            // navigate('/orderSuccess', {
            //     state: {
            //         delivery,
            //         payment,
            //         orders: order?.orderItemsSlected,
            //         totalPriceMemo: totalPriceMemo
            //     }
            // })
            navigate('/');
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsModalOpenUpdateInfo(false)
    }

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid: true,
                paidAt: details.update_time,
                email: user?.email
            }
        )
    }


    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetails
        if (name && address && city && phone) {
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }))
                    setIsModalOpenUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleDilivery = (e) => {
        setDelivery(e.target.value)
    }

    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const addPaypalScript = async () => {
        // const { data } = await PaymentService.getConfig()
        // const script = document.createElement('script')
        // script.type = 'text/javascript'
        // script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        // script.async = true;
        // script.onload = () => {
        //     setSdkReady(true)
        // }
        // document.body.appendChild(script)
    }

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript()
        } else {
            setSdkReady(true)
        }
    }, [])

    return (
        <>
            <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '20px', margin: '0 0 20px 0', paddingTop: '20px' }}>Giỏ hàng</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio >
                                        <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                                        <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio >
                                        <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div>
                                        <span style={{ fontSize: '18px' }}>Địa chỉ:  </span>
                                        <span onClick={handleOnChangeAddress} style={{ color: 'blue', fontSize: '18px', cursor: 'pointer' }}>{`${user?.address} - ${user?.city}`}</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '18px' }}>Tạm tính</span>
                                        <span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold' }}>{priceMemo.toLocaleString()} VND</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '18px' }}>Giảm giá</span>
                                        <span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold' }}>{priceDiscountMemo || 0} VND</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '18px' }}>Thuế</span>
                                        <span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold' }}>{(priceMemo * 8 / 100).toLocaleString()} VND</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '18px' }}>Phí giao hàng</span>
                                        <span style={{ color: '#000', fontSize: '18px', fontWeight: 'bold' }}>{deliveryMemo.toLocaleString()} VND</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span style={{ fontSize: '18px' }}>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{(priceMemo + (priceMemo * 8 / 100) + deliveryMemo).toLocaleString()} VND</span>
                                        <span style={{ color: '#000', fontSize: '14px' }}>(Đã bao gồm VAT nếu có)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            <ButtonComponent
                                onClick={() => handleAddOrder()}
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '360px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginLeft: '42px'
                                }}
                                textButton={'Đặt hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isModalOpenUpdateInfo} onOk={handleUpdateInforUser} onCancel={handleCancleUpdate}>
                    <Form
                        name='basic'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={handleUpdateInforUser}
                        autoComplete='off'
                        form={form}
                    >
                        <Form.Item label="Tên người dùng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}>
                            <InputComponent name='name' value={stateUserDetails.name} onChange={handleOnchangeDetails} />
                        </Form.Item>

                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn!' }]}>
                            <InputComponent name='phone' value={stateUserDetails.phone} onChange={handleOnchangeDetails} />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng địa chỉ của bạn!' }]}>
                            <InputComponent name='address' value={stateUserDetails.address} onChange={handleOnchangeDetails} />
                        </Form.Item>

                        <Form.Item label="Thành phố" name="city" rules={[{ required: true, message: 'Vui lòng nhập thành phố bạn đang sống!' }]}>
                            <InputComponent name='city' value={stateUserDetails.city} onChange={handleOnchangeDetails} />
                        </Form.Item>

                    </Form>
                </ModalComponent>
            </div>
        </>
    )
}

export default OrderPage