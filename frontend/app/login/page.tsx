/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { redirect, useRouter } from 'next/navigation';
import { api } from '../../src/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
    
      const res = await api<{ message: string; user: { id: string; name: string; email: string } }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );


      localStorage.setItem('authEmail', res.user.email);
      localStorage.setItem('authName', res.user.name);

      router.replace('/app');
    } catch (e: any) {
      setError(e.message ?? 'Giriş başarısız');
    }
  };
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4 text-center">Giriş Yap</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>E-posta</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit">Giriş</Button>
                </div>
                <div className="d-grid">
                  <Button onClick={() => redirect('/hakkimizda')}>test</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
