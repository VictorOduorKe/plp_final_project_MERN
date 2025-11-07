import { useState, useEffect } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { hideConsoleLogInProduction } from "../../context/hideLogs";
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  // cookie-based auth: server will validate via httpOnly cookie, no token required here
 const handleDelete = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("Error deleting user: ", err.response?.data || err.message);
      hideConsoleLogInProduction("Error deleting user: ", err.response?.data || err.message);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        hideConsoleLogInProduction("Error loading users: ", err.response?.data || err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration
              </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 whitespace-nowrap  text-violet-700">{u.first_name} {u.second_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap  text-violet-700">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap  text-violet-700">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-violet-700">
                    {u.role === "admin" ? "forever" : u.plan || "free"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap  text-violet-700">
                    {u.role === "admin" ? "never":u.plan || "3days remainig"}</td>
                    <td className="px-6 py-4 whitespace-nowrap  text-violet-700">
                      <button className="p-2 bg-red-900 text-white border-r-8" data-id={u._id}>Block</button>
                      <button className="p-2 bg-gray-600 text-white border-r-4" data-id={u._id}>View</button>
                      <button onClick={()=>handleDelete(u._id)} className="p-2 bg-red-600 text-red-50 font-bold border-r-4 rounded" data-id={u._id}>Delete </button>
                    </td>
                </tr>
                
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
