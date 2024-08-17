//import { Input } from 'antd'
import React from 'react'
import { WrapperInput } from './style'

const InputForm = (props) => {
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    const { placeholder = 'Nhập text', ...rests } = props
    return (
        //<div>
        <WrapperInput placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput} />
        //</WrapperInput>
        //</div>
    )
}

export default InputForm
