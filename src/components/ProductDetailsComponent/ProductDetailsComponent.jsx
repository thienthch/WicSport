import { Col, Row, Image, Rate } from 'antd'
import React, { useState } from 'react'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import imageProductSmall from '../../assets/images/small.jpg'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSilde'
const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetProductDetails = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            setNumProduct(numProduct - 1)
        }
    }


    const { data: productDetails } = useQuery({ queryKey: ['products-details', idProduct], queryFn: fetchGetProductDetails, enabled: !!idProduct })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id
                }
            }))
        }
    }

    return (
        <div>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }} span={10}>
                    <Image style={{ width: '500px', height: '500px' }} src={productDetails?.image} alt="image product" preview={false} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}>
                            <Image style={{ width: '64px' }} src={productDetails?.image} alt="image product" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <Image style={{ width: '64px' }} src={productDetails?.image} alt="image product" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <Image style={{ width: '64px' }} src={productDetails?.image} alt="image product" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <Image style={{ width: '64px' }} src={productDetails?.image} alt="image product" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <Image style={{ width: '64px' }} src={productDetails?.image} alt="image product" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <Image style={{ width: '64px' }} src={productDetails?.image} alt="image product" preview={false} />
                        </WrapperStyleColImage>
                    </Row>
                </Col>
                <Col style={{ paddingLeft: '15px' }} span={14}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                    <WrapperStyleTextSell> | đã bán 1000+</WrapperStyleTextSell>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{productDetails?.price?.toLocaleString()} VND</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến  </span>
                        <span className='address'>{user?.address}</span>
                        <span className='change-address'> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ margin: '10px 0 20px', padding: '0 0 10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber min={1} value={numProduct} defaultValue={1} onChange={onChange} size='small' />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{ background: 'rgb(255, 57, 69)', border: 'none', height: '48px', width: '220px', borderRadius: '4px' }}
                            textButton={'Chọn mua'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            onClick={handleAddOrderProduct}
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{ background: '#fff', border: '1px solid rgb(13, 92, 182)', height: '48px', width: '220px', borderRadius: '4px' }}
                            textButton={'Mua trả sau'}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row>
        </div >
    )
}

export default ProductDetailsComponent
