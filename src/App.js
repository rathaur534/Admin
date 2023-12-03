// Import necessary libraries and modules
import React, { useState, useEffect } from 'react';
import { FaSearch, FaPencilAlt, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import { BiChevronsRight } from "react-icons/bi";
import { BiChevronsLeft } from "react-icons/bi";





// Main App component
const App = () => {
  const [users, setUsers] = useState([]); // Store the fetched users
  const [displayedUsers, setDisplayedUsers] = useState([]); // Displayed users based on search and pagination
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const pageSize = 10; // Number of users per page

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Update displayed users based on search and pagination
  useEffect(() => {
    let filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    filteredUsers = filteredUsers.slice(startIndex, endIndex);

    setDisplayedUsers(filteredUsers);
  }, [users, searchQuery, currentPage]);

  // Toggle selection of all users
  const selectAll = () => {
    setSelectedUsers(selected => (selected.length === displayedUsers.length ? [] : [...displayedUsers]));
  };

  // Delete selected users
  const deleteSelected = () => {
    setUsers(users => users.filter(user => !selectedUsers.includes(user)));
    setSelectedUsers([]);
    setCurrentPage(1); // Reset to the first page after deletion
  };
// Delete a single user
const deleteUser = (userId) => {
  setUsers(users => users.filter(user => user.id !== userId));
  setSelectedUsers(selected => selected.filter(id => id !== userId));
  setCurrentPage(1); // Reset to the first page after deletion
};

  // Toggle editing mode for a user
  const toggleEditing = (id) => {
    setUsers(users => users.map(user =>
      user.id === id ? { ...user, editing: !user.editing } : user
    ));
  };

  // Handle editing a user's name
  const editName = (id, newName) => {
    setUsers(users => users.map(user =>
      user.id === id ? { ...user, name: newName, editing: false } : user
    ));
  };

  // Function to handle page navigation
  const gotoPage = (page) => {
    const totalPages = Math.ceil(users.length / pageSize);

    switch (page) {
      case 'first':
        setCurrentPage(1);
        break;
      case 'prev':
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        break;
      case 'next':
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        break;
      case 'last':
        setCurrentPage(totalPages);
        break;
      default:
        setCurrentPage(page);
        break;
    }
  };

  return (
    <div className="container mx-auto my-8 p-8 ">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-300 rounded mr-2 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="p-1 bg-blue-500 text-white rounded" onClick={selectAll}>
          <FaCheck /> Select All
        </button>
        <button className="p-1 bg-red-500 text-white rounded ml-2" onClick={deleteSelected}>
          <FaTrash /> Delete All
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.id} className={selectedUsers.includes(user) ? 'bg-gray-200' : ''}>
              <td>{user.id}</td>
              <td>
                {user.editing ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="p-2 border border-gray-300 rounded mr-2"
                      value={user.name}
                      onChange={(e) => setUsers(users => users.map(u => u.id === user.id ? { ...u, name: e.target.value } : u))}
                    />
                    <FaCheck className="h-4 w-3 text-green-500 cursor-pointer" onClick={() => editName(user.id, user.name)} />
                    <FaTimes className="h-4 w-3 text-red-500 cursor-pointer" onClick={() => toggleEditing(user.id)} />
                  </div>
                ) : (
                  <span className="cursor-pointer" onClick={() => toggleEditing(user.id)}>{user.name}</span>
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="flex items-center gap-4">
  <FaPencilAlt className="h-4 w-3 text-blue-500 cursor-pointer mr-2" onClick={() => toggleEditing(user.id)} />
  <FaTrash className="h-4 w-3 text-red-500 cursor-pointer hover:text-red-700 transition duration-300" onClick={() => deleteUser(user.id)} />
</td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <button className="p-2  rounded border border-black-600 " onClick={() => gotoPage('first')}>
        <BiChevronsLeft />
        </button>
        <button className="p-2  rounded border border-black-600 " onClick={() => gotoPage('prev')}>
        <GrFormPrevious />
        </button>
        {[...Array(Math.ceil(users.length / pageSize)).keys()].map(page => (
          <button key={page + 1} className="p-2  text-black-500 rounded border border-black-600 " onClick={() => gotoPage(page + 1)}>
            {page + 1}
          </button>
        ))}
        <button className="p-2  rounded border border-black-600 " onClick={() => gotoPage('next')}>
        <MdOutlineNavigateNext />
        </button>
        <button className="p-2  rounded border border-black-600 " onClick={() => gotoPage('last')}>
        <BiChevronsRight />
        </button>
      </div>
    </div>
  );
};

export default App;
