import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [users,setUsers]=useState([]);
  const [filterUsers,setFilterUsers]=useState([]);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [userData,setUserData]=useState({name:"",age:"",city:""});

  const getAllUser=async()=>{
   await axios.get('http://localhost:8000/users')
   .then((res)=>{
    setUsers(res.data);
    setFilterUsers(res.data);
  });
    
  }
  useEffect(()=>{
    getAllUser();
  },[]);

  
  //search Function
  const handleSearchChange=(e)=>{
    const searchText=e.target.value.toLowerCase();
    const filteredUsers=users.filter((user)=>user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText))
    setFilterUsers(filteredUsers);
  }

  //Delete Function
  const handleDelete=async(id)=>{
    const isConfirmed = window.confirm("Are You sure You want to delete this user? ");
    if(isConfirmed){
      await axios.delete(`http://localhost:8000/users/${id}`)
      .then((res)=>{
        setUsers(res.data);
        setFilterUsers(res.data);
      })
    }
  }


  //close Modal
  const closeModal=()=>{
    setIsModalOpen(false);
    getAllUser();
  }

  //Add New User Function
  const handleAddUser=()=>{
    setUserData({name:"",age:"",city:""});
    setIsModalOpen(true);
  }

  //handling data for new record and also for edit
  const handleData=(e)=>{
    setUserData({...userData,[e.target.name]:e.target.value});
  }

  //Submit the modal data to backend
  const handleSubmit=async(e)=>{
    if(userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData)
      .then((res)=>{console.log(res)});
    }
    else{
      e.preventDefault();
      await axios.post("http://localhost:8000/users/",userData)
      .then((res)=>{console.log(res)});
      // setIsModalOpen(false);
    }
    closeModal();
    setUserData({name:"",age:"",city:""});
  }


  //Update User function:
  const handleUpdateUser=async(user)=>{
    setUserData({...user});
    setIsModalOpen(true);
  }


  return (
    <>
      <div className='container'>
        <h3>Crud App in React With Node as Backend</h3>
        <div className='input-search'>
          <input type="search" placeholder='Search Text Here' onChange={handleSearchChange}/>
          <button className='btn green'onClick={handleAddUser}> Add User</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers && filterUsers.map((user,index)=>{
              return (<tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.city}</td>
                <td><button className='btn green' onClick={()=>{handleUpdateUser(user)}}>Edit</button></td>
                <td><button className='btn red' onClick={()=>{handleDelete(user.id)}}>Delete</button></td>
            </tr>)
            })}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className='close' onClick={closeModal}>&times;</span>
              <h2>{userData.id ?"Update Record":"Add Record"}</h2>

              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" id="name" value={userData.name} onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" name="age" id="age"  value={userData.age} onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" value={userData.city} onChange={handleData}/>
              </div>
              <button className='btn green' onClick={handleSubmit}>{userData.id ? "Update User":"Add User"}</button>

            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
