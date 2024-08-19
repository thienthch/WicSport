import { React, useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'

const TypeProductPage = () => {
    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const fetchProductType = async (type) => {
        const res = await ProductService.getProductType(type)
        if (res?.status === 'OK') {
            setProducts(res?.data)
        } else {

        }
    }

    useEffect(() => {
        if (state) {
            fetchProductType(state)
        }
    }, [])
    const onChange = () => {
    }
    return (
        <div style={{ width: '100%', backgroundColor: '#efefef', height: '728px' }}>
            <div style={{ flex: 1, width: '1270px', margin: '0 auto', }}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
                    <WrapperNavbar span={4}>
                        <NavbarComponent />
                    </WrapperNavbar>
                    <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <WrapperProducts style={{ height: '580px' }}>
                            {products?.map((product) => {
                                return (
                                    <CardComponent
                                        key={product._id}
                                        countInStock={product.countInStock}
                                        description={product.description}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        rating={product.rating}
                                        type={product.type}
                                        selled={product.selled}
                                        discount={product.discount}
                                        id={product._id}
                                    />
                                )
                            })}
                        </WrapperProducts>
                        <Pagination defaultCurrent={1} total={100} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px' }} />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default TypeProductPage
