import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { Pagination } from './Paginations';
import { useForm } from 'react-hook-form';

export const MyComponent = () => {
    const { register } = useForm();
    const navigate = useNavigate()
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortedColumn, setSortedColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2);

    const handleEdit = (id) => {
        navigate(`/employee/${id}`)
    };

    const getEmployees = async () => {
        let result = await axios.get("http://localhost:3000/products")
        setItems(result.data)
    }

    const deleteEmployee = async (id) => {
        await axios.delete(`http://localhost:3000/products/${id}`)
            .then((response) => {
                setItems(items.filter((item) => item.id !== id))
                alert("Data deleted successfully")
                navigate('/')
            })
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        getEmployees()
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        if (column === sortedColumn) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(column);
            setSortOrder('asc');
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items
        .filter((row) => {
            const values = Object.values(row).join('').toLowerCase();
            return values.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const aValue = a[sortedColumn];
            const bValue = b[sortedColumn];
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        })
        .slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h1>Employee details</h1>
            <div className="d-flex justify-content-end">
                <Link to={'employee/'} className="btn btn-sm btn-success mr-4 bu"><FontAwesomeIcon icon={faPlus} /><FontAwesomeIcon icon={faUser} /></Link>
            </div><br></br>
            <Form.Control type="text" {...register('search')} onChange={handleSearch} className="search" />
            <Table striped bordered hover responsive size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th onClick={() => handleSort('empName')}>Name</th>
                        <th onClick={() => handleSort('empEmail')}>Email</th>
                        <th onClick={() => handleSort('gender')}>Gender</th>
                        <th onClick={() => handleSort('designation')}>Designation</th>
                        <th onClick={() => handleSort('technologies')}>Technologies</th>
                        <th style={{ width: '80px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => {
                        return <tr key={item.id}>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{item.empName}</td>
                            <td>{item.empEmail}</td>
                            <td>{item.gender}</td>
                            <td>{item.designation}</td>
                            <td>{item.technologies}</td>
                            <td style={{ width: '80px' }}><button onClick={() => { deleteEmployee(item.id) }} className="btn btn-sm btn-danger mr-1"><FontAwesomeIcon icon={faTrash} /></button>
                                <button onClick={() => handleEdit(item.id)} className="btn btn-sm btn-primary mr-1"><FontAwesomeIcon icon={faEdit} /></button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={items.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div >
    );
};
