import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Submitting login data:', formData);
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status);
            
            // Safe way to handle the response
            let data;
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            try {
                // Only try to parse as JSON if there's actual content
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error('JSON parsing error:', parseError);
                throw new Error('Server response was not valid JSON. Please try again later.');
            }

            if (!response.ok) {
                throw new Error(data?.error || `Register failed with status: ${response.status}`);
            }

            // If login is successful
            console.log('Registration successful:', data);
            
            // Store user data in localStorage or context/state management
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            // Redirect to dashboard or specified route
            navigate(data.redirectTo || '/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Create Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username}
                        onChange={handleChange}
                        // required 
                    />
                </div>
                <div>
                    <label htmlFor="password">Create Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        // required 
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}