import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './Style'
import { Checkbox, Rate } from 'antd'

const NavbarComponent = () => {

    const onChange = () => {

    }

    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperTextValue> {option}</WrapperTextValue >
                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: 0 }} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                    return (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span style={{ fontSize: '12px' }}>{`từ ${option} sao`}</span>
                        </div>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }

    return (
        <div>
            <WrapperLableText>Bộ lọc</WrapperLableText>
            <WrapperContent>
                {renderContent('text', ['Sản phẩm mới', 'Bán chạy nhất', 'Độc quyền trên WIC', 'Nam', 'Nữ'])}
            </WrapperContent>
        </div>
    )
}

export default NavbarComponent
