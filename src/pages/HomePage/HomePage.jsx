import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./Style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import bannerQC1 from '../../assets/images/bannerreal1.jpg'
import bannerQC3 from '../../assets/images/bannerreal2.jpg'
import bannerQC4 from '../../assets/images/bannerreal3.jpg'
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from '../../services/ProductService'
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDecounce = useDebounce(searchProduct, 1000)
    const [limit, setLimit] = useState(6)
    const [typeProduct, setTypeProduct] = useState([])
    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const [height, setHeight] = useState(950)

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProduct(res?.data)
        }
    }

    const { data: products, isPreviousData } = useQuery({ queryKey: ['products', limit, searchDecounce], queryFn: fetchProductAll, retry: 3, retryDelay: 1000, keepPreviousData: true })

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])


    return (
        <>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProduct.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id='container' style={{ height: `${height}px`, width: '1270px', margin: '0 auto' }}>
                    <SliderComponent arrImages={[bannerQC1, bannerQC3, bannerQC4]} />
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                            return (<CardComponent
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
                            />)
                        })}
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore styleButton={{
                            border: '1px solid rgb(11, 116, 229)',
                            color: 'rgb(11, 116, 229)',
                            width: '240px',
                            height: '38px',
                            borderRadius: '4px'
                        }}
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            textButton='Xem thêm' type='outline' styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                            onClick={() => {
                                setLimit((prev) => prev + 6)
                                setHeight(1300)
                            }} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage