import { Menu } from 'antd'
import React, { useState } from 'react'
import { AppstoreOutlined, UserDeleteOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';

const items = [
    {
        key: 'user',
        icon: <UserDeleteOutlined />,
        label: 'Người dùng'
    },
    {
        key: 'product',
        icon: <AppstoreOutlined />,
        label: 'Sản phẩm'
    },
];
// const getLevelKeys = (items1) => {
//     const key = {};
//     const func = (items2, level = 1) => {
//         items2.forEach((item) => {
//             if (item.key) {
//                 key[item.key] = level;
//             }
//             if (item.children) {
//                 func(item.children, level + 1);
//             }
//         });
//     };
//     func(items1);
//     return key;
// };
// const levelKeys = getLevelKeys(items);
const AdminPage = () => {
    // const [stateOpenKeys, setStateOpenKeys] = useState(['user', 'product']);
    const [keySelected, setKeySelected] = useState('')
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            default:
                return <></>
        }
    }
    // const onOpenChange = (openKeys) => {
    //     const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    //     // open
    //     if (currentOpenKey !== undefined) {
    //         const repeatIndex = openKeys
    //             .filter((key) => key !== currentOpenKey)
    //             .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
    //         setStateOpenKeys(
    //             openKeys
    //                 // remove repeat key
    //                 .filter((_, index) => index !== repeatIndex)
    //                 // remove current level all child
    //                 .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
    //         );
    //     } else {
    //         // close
    //         setStateOpenKeys(openKeys);
    //     }
    // };

    const handleOnClick = (event) => {
        setKeySelected(event.key)
    }

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['231']}
                    // openKeys={stateOpenKeys}
                    // onOpenChange={onOpenChange}
                    style={{
                        width: 256,
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: '1', padding: '15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )
};

export default AdminPage;
