import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import '../App.css';

export const MyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('insert');
  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty, isValid } } = useForm();

  const populateFormData = (data) => {
    setMode('update');
    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });
  };

  useEffect(() => {
    async function fetchSingleProduct() {
      let { data } = await axios.get(`http://localhost:3000/products/${id}`);
      populateFormData(data)
    }
    if (id) {
      fetchSingleProduct()
    }
    // eslint-disable-next-line
  }, [id])

  const onSubmit = (data) => {
    if (!id) {
      axios.post("http://localhost:3000/products", data)
        .then((response) => {
          alert("Data added successfully")
          reset();
          navigate('/')
        })
        .catch((error) => console.log(error))
    } else {
      axios.put("http://localhost:3000/products/" + id, data)
        .then(res => {
          alert("Data updated successfully")
          navigate('/')
        })
    }
  };

  const cancel = () => {
    navigate('/')
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='m-2'>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
          <div className='col'>
            <label>Employee Name</label>
            <Form.Control type='text' {...register('empName', { minLength: 2, required: true })} className="pl-5" />
            {errors.empName && errors.empName.type === 'required' && <span>Employee Name can't be blank</span>}
            {errors.empName && errors.empName.type === 'minLength' && <span>Employee Name must hold atleast 2 Characters</span>}
          </div>
          <div className='col'>
            <label>Employee Email</label>
            <Form.Control type='email' {...register('empEmail', { required: true, pattern: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/ })} />
            {errors.empEmail && errors.empEmail.type === 'required' && <span>Email can't be blank</span>}
            {errors.empEmail && errors.empEmail.type === 'pattern' && <span>Please Enter valid Email</span>}
          </div>
          <div className='col'>
            <label>Password</label>
            <Form.Control type='password' {...register('password', { required: true, minLength: 6 })} />
            {errors.password && errors.password.type === 'required' && <span>Password can't be blank</span>}
            {errors.password && errors.password.type === 'minLength' && <span>Password must hold atleast 6 Characters</span>}
          </div>
        </div>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
          <div className='col'>
            <label>Gender</label>
            <Form.Check type='radio' value={'Male'} label="Male" {...register('gender')} />
            <Form.Check type='radio' value={'Female'} label="Female" {...register('gender')} />
          </div>
          <div className='col'>
            <label>Designation</label><br></br>
            <Form.Select {...register('designation')} className='select' defaultValue="">
              <option value="">Select an option</option>
              <option>Developer</option>
              <option>QA</option>
              <option>DBA</option>
            </Form.Select>
          </div>
          <div className='col'>
            <label>Technology</label>
            <Form.Check type='checkbox' label="Java" {...register('technologies')} value={'Java'} />
            <Form.Check type='checkbox' label=".Net" {...register('technologies')} value={'.Net'} />
            <Form.Check type='checkbox' label="Python" {...register('technologies')} value={'Python'} />
            <Form.Check type='checkbox' label="React" {...register('technologies')} value={'React'} />
          </div>
        </div>
      </div>
      <Button type="submit" disabled={!isDirty || !isValid} className='but'>{mode === 'insert' ? 'Add' : 'Update'}</Button>
      <Button variant="secondary" onClick={() => cancel()} className='but'>Cancel</Button>
    </form>
  );
};
