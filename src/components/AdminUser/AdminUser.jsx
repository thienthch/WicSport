import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, message, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
//import { WrapperUploadFile } from '../AdminProduct/style'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useQuery } from '@tanstack/react-query'
import { getBase64 } from '../../util'
import { DeleteOutlined, EditFilled, SearchOutlined } from '@ant-design/icons'
import * as UserService from '../../services/UserService'



const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''
    })

    const [form] = Form.useForm()

    useEffect(() => {
        if (rowSelected) {
            fetchGetUserDetails(rowSelected)
        }
    }, [rowSelected])

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])



    const fetchGetUserDetails = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar
            })
        }
    }

    const handleDetailsUser = () => {
        if (rowSelected) {
            fetchGetUserDetails(rowSelected)
        }
        setIsOpenDrawer(true)
        console.log('rowSelected', rowSelected)
    }

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = UserService.updateUser(id, { ...rests }, token)
            return res
        }
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = UserService.deleteUser(id, token)
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...names } = data
            const res = UserService.deleteManyUser(names, token)
            return res
        }
    )

    console.log('mutationDeletedMany', mutationDeletedMany)

    const getAllUsers = async () => {
        const res = await UserService.getAllUser()
        return res
    }

    const handleDeleteManyUsers = (name) => {
        mutationDeletedMany.mutate({ names: name, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccesUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccesDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccesDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    console.log('dataUpdated', dataUpdated)
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
    const { data: users } = queryUser
    const renderAction = () => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <EditFilled onClick={handleDetailsUser} style={{ color: '#B2A4EE', fontSize: '20px', cursor: 'pointer' }} />
                <DeleteOutlined onClick={() => setIsModalOpenDelete(true)} style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });


    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'isAdmin',
                    value: 'true',
                },
                {
                    text: 'not Admin',
                    value: 'false',
                },
            ],
            onFilter: (value, record) => {
                if (value === 'true') {
                    return record.isAdmin === 'TRUE'
                } else {
                    return record.isAdmin === ''
                }
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];


    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return {
            ...user,
            key: user.id,
            isAdmin: user.isAdmin ? 'TRUE' : ''
        }
    })

    useEffect(() => {
        if (isSuccesDeleted && dataDeleted?.status === 'OK') {
            message.success('Đã xóa 1 tài khoản')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccesDeleted])

    useEffect(() => {
        if (isSuccesDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Đã xóa 1 tài khoản')
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccesDeletedMany])

    useEffect(() => {
        if (isSuccesUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật thành công!')
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccesUpdated])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
    }

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    return (
        <div>
            <WrapperHeader>Quản lí người dùng</WrapperHeader>
            <div>
                <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        },
                    }
                }} />
            </div>
            <DrawerComponent title='Thông tin người dùng' isOpen={isOpenDrawer} width='90%' onClose={() => setIsOpenDrawer(false)}>
                <Form
                    name='basic'
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onUpdateUser}
                    autoComplete='off'
                    form={form}
                >
                    <Form.Item label="Tên người dùng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                        <InputComponent name='name' value={stateUserDetails.name} onChange={handleOnChangeDetails} />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục sản phẩm!' }]}>
                        <InputComponent name='email' value={stateUserDetails.email} onChange={handleOnChangeDetails} />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số lượng sẵn có của sản phẩm!' }]}>
                        <InputComponent name='phone' value={stateUserDetails.phone} onChange={handleOnChangeDetails} />
                    </Form.Item>

                    <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập số lượng sẵn có của sản phẩm!' }]}>
                        <InputComponent name='address' value={stateUserDetails.address} onChange={handleOnChangeDetails} />
                    </Form.Item>

                    <Form.Item label="Admin" name="isAdmin" rules={[{ required: true, message: 'Vui lòng nhập giá của sản phẩm!' }]}>
                        <InputComponent name='isAdmin' value={stateUserDetails.isAdmin} onChange={handleOnChangeDetails} />
                    </Form.Item>

                    <Form.Item label="Avatar" name="avatar" rules={[{ required: true, message: 'Vui lòng thêm ảnh đại diện' }]}>
                        <WrapperUploadFile name='avatar' onChange={handleOnChangeAvatarDetails} maxCount='1'>
                            <Button>Select File</Button>
                            {stateUserDetails?.avatar && (
                                <img src={stateUserDetails?.avatar} style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: '10px',
                                }} alt="avatar" />
                            )}
                        </WrapperUploadFile>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerComponent>
            <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onOk={handleDeleteUser} onCancel={handleCancelDelete}>
                <div>Bạn có chắc chắn muốn xóa người dùng này không?</div>
            </ModalComponent>
        </div>
    )
}

export default AdminUser
