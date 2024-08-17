import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style'

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 3000,
        autoplay: true,
    };
    return (
        <WrapperSliderStyle  {...settings}>
            {arrImages.map((image) => {
                return (
                    <Image key={image} src={image} alt="silder" preview={false} width="1000px" height='274px' />
                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent
