/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { avatarman, preview, trash } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_ } from '../utils/myAxios';

const Users = () => {
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([])

    const columns = [
        {
            name: 'Name',
            sortable: true,
            selector: row => !row?.name ? 'User Not found' : row.name
        },
        {
            name: "Email",
            sortable: true,
            minWidth: '200px',
            selector: row => row?.email
        },
        {
            name: 'Phone',
            sortable: true,
            selector: row => row?.phone
        },
        {
            name: 'Created At',
            sortable: true,
            selector: (row) => row?.createdAt,
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1'>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        <button onClick={() => deleteUsers(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>
                    </div>
                )
            }
        }
    ]

    const fetchData = async () => {

        setLoading(true);
        try {
            let allChilds = [];
            for (let page = 1; page <= totalPages; page++) {
                let data1 = {}
                const endPoint = `users/all/${page}`
                const res = await dataGet_(endPoint, data1);
                if (res?.data) {
                    allChilds = allChilds.concat(res?.data?.users);
                    setTotalPages(res?.data?.count?.totalPage);
                }
            }
            setCategories(allChilds);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUsers = async (id) => {
        if (window.confirm("Are you sure to want delete")) {
            let data1 = {}
            const endPoint = `users/admin/delete/${id}`
            const res = await dataDelete(endPoint, data1);
            fetchData()
        }

    }

    useEffect(() => {
        fetchData();
    }, [totalPages]);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>Users</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !categories || categories.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Users Found</span>
                        </main> :
                        <ProductTable columns={columns} showFilter={true} data={categories} />
                }
            </main>
        </StyleSheetManager>
    )
}

export default Users;