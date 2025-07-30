import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Fetch real users from the database
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/users');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. ' + err.message);
                // Fallback to some placeholder data if API call fails
                setUsers([
                    { id: 1, username: 'Unable to fetch users' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);

    // In a real application, you'd have admin authentication here
    useEffect(() => {
        // Check if user is admin (placeholder - would use actual auth in real app)
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            navigate('/login');
        }
    }, [navigate]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccessMessage('');
        
        try {
            const response = await fetch(`/api/auth/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }
            
            // Remove the deleted user from the state
            setUsers(users.filter(user => user.id !== userId));
            setSuccessMessage(`User deleted successfully! ${data.message || ''}`);
            
        } catch (err) {
            console.error('Delete user error:', err);
            setError(err.message || 'Failed to delete user. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        // Call logout API endpoint
        fetch('/api/auth/logout')
            .then(response => response.json())
            .then((data) => {
                // Remove user data from localStorage
                localStorage.removeItem('user');
                // Redirect to login page with success message
                navigate('/login', { 
                    state: { message: data.message || "You have been successfully logged out from admin" } 
                });
            })
            .catch(error => {
                console.error('Admin logout error:', error);
                // Still remove user data and redirect even if API call fails
                localStorage.removeItem('user');
                navigate('/login', { 
                    state: { message: "You have been logged out from admin" } 
                });
            });
    };

    if (loading && users.length === 0) {
        return <div className="admin-loading">Loading users from database...</div>;
    }

    return (
        <div className="admin">
            {/* Header */}
            <header className="admin-header">
                <div className="logo">Policy Connect Admin</div>
                <div className="admin-controls">
                    <button onClick={() => navigate('/dashboard')} className="dashboard-button">Dashboard</button>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>

            <div className="admin-container">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <nav>
                        <ul>
                            <li className="active"><a href="#users">User Management</a></li>
                            <li><a href="#policies">Policy Management</a></li>
                            <li><a href="#reports">Reports</a></li>
                            <li><a href="#settings">System Settings</a></li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="admin-content">
                    <h1>User Administration</h1>
                    
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    
                    {/* User Management */}
                    <div className="user-management">
                        <h2>Manage Users</h2>
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>
                                                <button 
                                                    className="btn-edit-user"
                                                    onClick={() => alert('Edit user functionality would go here')}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn-delete-user"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.username === 'admin' || user.username?.includes('deactivated_')} // Prevent deleting admin or already deactivated accounts
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;
