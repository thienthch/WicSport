import React, { useEffect, useRef, useState } from 'react'
import { PlusOutlined, DeleteOutlined, EditFilled, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import { Button, Form, message, Select, Space } from 'antd'
import { WrapperHeader, WrapperUploadFile } from './style'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../util'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const [typeSelect, setTypeSelect] = useState('')

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        countInStock: '',
        type: '',
        image: '',
        newType: '',
        discount: ''
    })

    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        countInStock: '',
        type: '',
        image: '',
        discount: '',
    })

    const [form] = Form.useForm()

    useEffect(() => {
        if (rowSelected) {
            fetchGetProductDetails(rowSelected)
        }
    }, [rowSelected])

    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])



    const fetchGetProductDetails = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                countInStock: res?.data?.countInStock,
                type: res?.data?.type,
                image: res?.data?.image,
                discount: res?.data?.discount
            })
        }
    }

    const handleDetailsProduct = () => {
        if (rowSelected) {
            fetchGetProductDetails(rowSelected)
        }
        setIsOpenDrawer(true)
    }



    const mutation = useMutationHooks(
        (data) => {
            const { name, price, description, rating, countInStock, type, image, discount } = data
            const res = ProductService.createProduct({ name, price, description, rating, countInStock, type, image, discount })
            return res
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = ProductService.updateProduct(id, token, { ...rests })
            return res
        }
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = ProductService.deleteProduct(id, token)
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...names } = data
            const res = ProductService.deleteManyProducts(names, token)
            return res
        }
    )


    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct('', 100)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const handleDeleteManyProducts = (name) => {
        mutationDeletedMany.mutate({ names: name, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccesUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccesDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccesDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany


    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
    const { data: products } = queryProduct
    const renderAction = () => {
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <EditFilled onClick={handleDetailsProduct} style={{ color: '#B2A4EE', fontSize: '20px', cursor: 'pointer' }} />
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
        //     render: (text) => 
        // searchedColumn === dataIndex ? (
        //     <Highlighter
        //         highlightStyle={{
        //             backgroundColor: '#ffc069',
        //             padding: 0,
        //         }}
        //         searchWords={[searchText]}
        //         autoEscape
        //         textToHighlight={text ? text.toString() : ''}
        //     />
        // ) : (
        //     text
        // ),
    });


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '> 50',
                    value: '>',
                },
                {
                    text: '<= 50',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>') {
                    return record.price > 50
                } else {
                    return record.price <= 50
                }
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 4',
                    value: '>=',
                },
                {
                    text: '< 4',
                    value: '<',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return Number(record.rating) >= 4
                } else {
                    return Number(record.rating) < 4
                }
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];


    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product,
            key: product.id,
        }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Tạo sản phẩm thành công!')
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isErrorDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success('Tạo sản phẩm thành công!')
            handleCancel()
        } else if (isErrorDeletedMany) {

            message.error()
        }
    }, [isErrorDeletedMany])

    useEffect(() => {
        if (isSuccesDeleted && dataDeleted?.status === 'OK') {
            message.success('Đã xóa 1 sản phẩm')
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccesDeleted])

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
    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            countInStock: '',
            type: '',
            image: '',
            discount: ''
        })
        form.resetFields()
    }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            countInStock: '',
            type: '',
            image: '',
        })
        form.resetFields()
    }



    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            countInStock: stateProduct.countInStock,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            image: stateProduct.image,
            discount: stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChangeImageProduct = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnChangeImageProductDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }

    return (
        <div>
            <div>
                <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
                <div style={{ marginTop: '10px' }}>
                    <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={showModal}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
                </div>
                <div>
                    <TableComponent handleDeleteMany={handleDeleteManyProducts} columns={columns} data={dataTable} onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            },
                        }
                    }} />
                </div>
                <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                    <Form
                        name='basic'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 30 }}
                        onFinish={onFinish}
                        autoComplete='off'
                        form={form}
                    >
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                            <InputComponent name='name' value={stateProduct.name} onChange={handleOnChange} />
                        </Form.Item>

                        <Form.Item label="Danh mục" name="type" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục sản phẩm!' }]}>
                            <Select
                                name='type'
                                value={stateProduct.type}
                                // defaultValue="lucy"
                                // style={{
                                //     width: 120,
                                // }}
                                onChange={handleOnChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item label='Thêm danh mục' name="newType" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục sản phẩm!' }]}>
                                <InputComponent name='newType' value={stateProduct.newType} onChange={handleOnChange} />
                            </Form.Item>
                        )}

                        <Form.Item label="Số lượng còn" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng sẵn có của sản phẩm!' }]}>
                            <InputComponent name='countInStock' value={stateProduct.countInStock} onChange={handleOnChange} />
                        </Form.Item>

                        <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá của sản phẩm!' }]}>
                            <InputComponent name='price' value={stateProduct.price} onChange={handleOnChange} />
                        </Form.Item>

                        <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá của sản phẩm!' }]}>
                            <InputComponent name='rating' value={stateProduct.rating} onChange={handleOnChange} />
                        </Form.Item>

                        <Form.Item label="Giảm giá" name="discount" rules={[]}>
                            <InputComponent name='discount' value={stateProduct.discount} onChange={handleOnChange} />
                        </Form.Item>

                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                            <InputComponent name='description' value={stateProduct.description} onChange={handleOnChange} />
                        </Form.Item>

                        <Form.Item label="Ảnh sản phẩm" name="image" rules={[{ required: true, message: 'Vui lòng thêm hình ảnh mô tả sản phẩm!' }]}>
                            <WrapperUploadFile name='image' onChange={handleOnChangeImageProduct} maxCount='1'>
                                <Button>Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px',
                                    }} alt="image" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </ModalComponent>
                <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} width='90%' onClose={() => setIsOpenDrawer(false)}>
                    <Form
                        name='basic'
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onUpdateProduct}
                        autoComplete='off'
                        form={form}
                    >
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                            <InputComponent name='name' value={stateProductDetails.name} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Danh mục" name="type" rules={[{ required: true, message: 'Vui lòng nhập tên danh mục sản phẩm!' }]}>
                            <InputComponent name='type' value={stateProductDetails.type} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Số lượng còn" name="countInStock" rules={[{ required: true, message: 'Vui lòng nhập số lượng sẵn có của sản phẩm!' }]}>
                            <InputComponent name='countInStock' value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Giá sản phẩm" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá của sản phẩm!' }]}>
                            <InputComponent name='price' value={stateProductDetails.price} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Vui lòng nhập đánh giá của sản phẩm!' }]}>
                            <InputComponent name='rating' value={stateProductDetails.rating} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Giảm giá (%)" name="discount" rules={[]}>
                            <InputComponent name='discount' value={stateProductDetails.discount} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                            <InputComponent name='description' value={stateProductDetails.description} onChange={handleOnChangeDetails} />
                        </Form.Item>

                        <Form.Item label="Ảnh sản phẩm" name="image" rules={[{ required: true, message: 'Vui lòng thêm hình ảnh mô tả sản phẩm!' }]}>
                            <WrapperUploadFile name='image' onChange={handleOnChangeImageProductDetails} maxCount='1'>
                                <Button>Select File</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px',
                                    }} alt="image" />
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
                <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onOk={handleDeleteProduct} onCancel={handleCancelDelete}>
                    <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
                </ModalComponent>
            </div>
        </div>
    )
}

export default AdminProduct
