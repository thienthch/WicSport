import { Input } from "antd";
import React from "react";
import { SearchOutlined } from '@ant-design/icons'
import ButtonComponent from "../ButtonComponent/ButtonComponent";
const ButtonInputSearch = (props) => {
    const {
        size,
        placeholder,
        textButton,
        bordered,
        backgroundColorInput,
        backgroundColorButton = 'rgb(13,92,182)',
        colorButton = 'rgb(26, 148, 255)'
    } = props
    return (
        <div style={{ display: 'flex' }}>
            <Input
                size={size}
                placeholder={placeholder}
                style={{ backgroundColor: backgroundColorInput, borderRadius: '0' }}
                {...props}
            />
            <ButtonComponent
                size={size}
                styleButton={{ backgroundColor: backgroundColorButton, border: 'none', borderRadius: '0' }}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
                icon={<SearchOutlined color={colorButton} style={{ color: colorButton }} />}>
            </ButtonComponent>
        </div >
    )
}

export default ButtonInputSearch