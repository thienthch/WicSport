import axios from "axios"
import { axiosJWT } from "./UserService"

// export const createProduct = async (data) => {
//     const res = await axios.post(`http://localhost:3000/api/product/create`, data)
//     return res.data
// }

export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`http://localhost:3000/api/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}