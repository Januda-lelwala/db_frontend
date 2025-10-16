import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validators } from '../../utils/validators';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (validators.isEmpty(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (validators.isEmpty(formData.username)) {
      newErrors.username = 'Username is required';
    } else if (!validators.minLength(formData.username, 3)) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (validators.isEmpty(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!validators.isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!validators.passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      await register({
        ...userData,
        user_name: userData.username,
        phone_no: userData.phone
      });
      
      navigate('/customer');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-large">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join KandyPack today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {serverError && (
            <div className="alert alert-error">
              {serverError}
            </div>
          )}

          <div className="form-row">
            <Input
              type="text"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              required
            />

            <Input
              type="text"
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              error={errors.username}
              required
            />
          </div>

          <div className="form-row">
            <Input
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              error={errors.email}
            />

            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              error={errors.phone}
            />
          </div>

          <div className="form-row">
            <Input
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.confirmPassword}
              required
            />
          </div>

          <Input
            type="text"
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            error={errors.address}
          />

          <Input
            type="text"
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            placeholder="Colombo"
            error={errors.city}
          />

          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            fullWidth
          >
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="link-primary">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
