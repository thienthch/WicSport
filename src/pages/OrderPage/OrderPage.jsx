import { Checkbox } from 'antd'
import React, { useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperInputNumber, WrapperQualityProduct } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct } from '../../redux/slides/orderSilde';

const OrderPage = ({ count = 1 }) => {
    const order = useSelector((state) => state.order)
    const [listChecked, setListChecked] = useState([])
    const dispatch = useDispatch()
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    };

    const handleChangeCount = (type, idProduct) => {
        if (type === 'increase') {
            dispatch(increaseAmount({ idProduct }))
        } else {
            dispatch(decreaseAmount({ idProduct }))
        }
    }

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))
    }

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItems?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItems?.reduce((total, cur) => {
            return total + ((cur.discount * cur.amount))
        }, 0)
        return result
    }, [order])

    const deliveryMemo = useMemo(() => {
        if (priceMemo > 1000000) {
            return 0
        } else {
            return 30000
        }
    }, [order])

    const handleRemoveAllOrder = () => {
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }

    return (
        <>
            <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '20px', margin: '0 0 20px 0', paddingTop: '20px' }}>Giỏ hàng</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperStyleHeader>
                                <span style={{ display: 'inline-block', width: '390px' }}>
                                    <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                                    <span style={{ fontSize: '18px' }}> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                                </span>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '18px' }}>Đơn giá</span>
                                    <span style={{ fontSize: '18px' }}>Số lượng</span>
                                    <span style={{ fontSize: '18px' }}>Thành tiền</span>
                                    <DeleteOutlined style={{ cursor: 'pointer', fontSize: '18px' }} onClick={handleRemoveAllOrder} />
                                </div>
                            </WrapperStyleHeader>
                            <WrapperListOrder>
                                {order?.orderItems?.map((order) => {
                                    const totalPrice = order?.price * order?.amount
                                    return (
                                        <WrapperItemOrder>
                                            <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                                                <img src={order?.image} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <div style={{
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    fontSize: '20px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>{order?.name}</div>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>
                                                    <span style={{ fontSize: '18px', color: '#242424' }}>{order?.price.toLocaleString()}</span>
                                                </span>
                                                <WrapperCountOrder>
                                                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                                                        <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                    </button>
                                                    <WrapperInputNumber defaultValue={1} value={order?.amount} size="small" />
                                                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)}>
                                                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                    </button>
                                                </WrapperCountOrder>
                                                <span style={{ color: 'rgb(255, 66, 78)', fontSize: '18px', fontWeight: 500 }}>{totalPrice.toLocaleString()}</span>
                                                <DeleteOutlined style={{ cursor: 'pointer', fontSize: '18px' }} onClick={() => handleDeleteOrder(order?.product)} />
                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}
                            </WrapperListOrder>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
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
                                // onClick={() => handleAddCard(productDetails, numProduct)}
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    marginLeft: '40px'
                                }}
                                textButton={'Mua hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                        </WrapperRight>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderPage