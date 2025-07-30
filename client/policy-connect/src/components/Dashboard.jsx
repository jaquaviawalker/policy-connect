import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [policies, setPolicies] = useState([
        { id: 1, name: 'Home Insurance Policy', type: 'Home', status: 'Active', renewal: '2025-12-15' },
        { id: 2, name: 'Auto Insurance Policy', type: 'Auto', status: 'Active', renewal: '2026-03-22' },
        { id: 3, name: 'Life Insurance Policy', type: 'Life', status: 'Pending', renewal: '2026-01-10' },
        { id: 4, name: 'Health Insurance Policy', type: 'Health', status: 'Review', renewal: '2025-09-05' }
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load user data from localStorage (from login)
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
            navigate('/login');
            return;
        }
        
        try {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
        } catch (error) {
            console.error('Error parsing user data', error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        // Call logout API endpoint
        fetch('/api/auth/logout')
            .then(response => response.json())
            .then((data) => {
                // Remove user data from localStorage
                localStorage.removeItem('user');
                // Redirect to login page with success message
                navigate('/login', { 
                    state: { message: data.message || "You have been successfully logged out" } 
                });
            })
            .catch(error => {
                console.error('Logout error:', error);
                // Still remove user data and redirect even if API call fails
                localStorage.removeItem('user');
                navigate('/login', { 
                    state: { message: "You have been logged out" } 
                });
            });
    };

    if (loading) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="logo">Policy Connect</div>
                <div className="user-info">
                    <span>Welcome, {userData?.username || 'User'}</span>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>

            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <nav>
                        <ul>
                            <li className="active"><a href="#dashboard">Dashboard</a></li>
                            <li><a href="#policies">My Policies</a></li>
                            <li><a href="#claims">Claims</a></li>
                            <li><a href="#payments">Payments</a></li>
                            <li><a href="#documents">Documents</a></li>
                            <li><a href="#profile">Profile</a></li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="dashboard-content">
                    <h1>Dashboard Overview</h1>
                    
                    {/* Stats Summary */}
                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Total Policies</h3>
                            <p className="stat-value">{policies.length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Active Policies</h3>
                            <p className="stat-value">{policies.filter(p => p.status === 'Active').length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Pending Review</h3>
                            <p className="stat-value">{policies.filter(p => p.status === 'Review' || p.status === 'Pending').length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Next Renewal</h3>
                            <p className="stat-value">
                                {new Date(policies.sort((a, b) => new Date(a.renewal) - new Date(b.renewal))[0]?.renewal).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Policies List */}
                    <div className="policies-container">
                        <h2>Your Policies</h2>
                        <table className="policies-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Policy Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Renewal Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.map(policy => (
                                    <tr key={policy.id}>
                                        <td>{policy.id}</td>
                                        <td>{policy.name}</td>
                                        <td>{policy.type}</td>
                                        <td>
                                            <span className={`status-badge ${policy.status.toLowerCase()}`}>
                                                {policy.status}
                                            </span>
                                        </td>
                                        <td>{new Date(policy.renewal).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn-view">View</button>
                                            <button className="btn-edit">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
