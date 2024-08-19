import React from 'react'
import { Lable, WrapperInfo, WrapperContainer, WrapperValue, WrapperOrderInfo } from './style';
import { useSelector } from 'react-redux';
import { WrapperCountOrder, WrapperItemOrder } from '../OrderPage/style';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { covertPrice } from '../../util'



const OrderSuccessPage = () => {
    const order = useSelector((state) => state.order)

    const location = useLocation()
    const { state } = location

    return (
        <>
            <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '20px', margin: '0 0 20px 0', paddingTop: '20px' }}>Đặt hàng thành công!!</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <Lable style={{ fontSize: '18px' }}>Phương thức giao hàng</Lable>
                                    <WrapperValue style={{ fontSize: '18px', padding: '20px' }}>
                                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}> {orderContant.delevery[state?.delivery]}</span> Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable style={{ fontSize: '18px' }}>Phương thức thanh toán</Lable>
                                    <WrapperValue style={{ fontSize: '18px', padding: '20px' }}>{orderContant.payment[state?.payment]}</WrapperValue>

                                </div>
                            </WrapperInfo>
                            <WrapperOrderInfo>
                                {state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder>
                                            <div style={{ width: '500px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <img src={order.image} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <div style={{
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    fontSize: '20px',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>{order?.name}</div>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span>
                                                    <span style={{ fontSize: '18px', color: '#242424' }}>{covertPrice(order?.price)} VND</span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '18px', color: '#242424' }}> Số lượng {order?.amount}</span>
                                                </span>

                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}

                            </WrapperOrderInfo>
                            <div>
                                <span style={{ fontSize: '18px', color: 'red' }}>Thành tiền {covertPrice(state?.totalPriceMemo)} VND</span>
                            </div>
                        </WrapperContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSuccessPage