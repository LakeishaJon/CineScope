import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

export default function LoginPage({ onLogin, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img 
                src="/CineScope logo.png" 
                alt="CineScope Logo" 
                style={{ 
                  height: '100px', 
                  width: 'auto',
                  maxWidth: '300px',
                  transition: 'transform 0.3s ease'
                 }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
               />
            </div>
            <h1 className="text-white fw-bold mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ color: '#A0A3A8' }}>
              {isRegister ? 'Join CineScope to save your favorites' : 'Sign in to continue to CineScope'}
            </p>
          </div>

          {/* Form Card */}
          <Card className="login-card border-0">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white fw-semibold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="form-control-dark"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-control-dark"
                  />
                </Form.Group>

                <Button
                  onClick={handleSubmit}
                  className="w-100 btn-gradient py-3 mb-3"
                  size="lg"
                >
                  {isRegister ? 'Register' : 'Login'}
                </Button>
              </Form>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsRegister(!isRegister)}
                  style={{ color: '#A0A3A8', textDecoration: 'none' }}
                >
                  {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                  <span style={{ color: '#FFB400', fontWeight: 'bold' }}>
                    {isRegister ? 'Login' : 'Register'}
                  </span>
                </Button>
              </div>

              {/* Back Button */}
              <Button
                variant="outline-secondary"
                onClick={onBack}
                className="w-100 mt-3"
                style={{ 
                  borderColor: 'rgba(160, 163, 168, 0.25)',
                  color: '#A0A3A8'
                }}
              >
                Back to Home
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}