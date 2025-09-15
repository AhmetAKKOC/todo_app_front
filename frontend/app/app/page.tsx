/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Row, Col, Card, Form, Button, Table, Alert, Spinner, ButtonGroup,
} from 'react-bootstrap';

// Uygulama iskeleti
import HeaderBar from '../components/Header';
import PageContent from '../components/Pagecontent';
import SiteFooter from '../components/Footer';

// API helper
import { api } from '../../src/lib/api';

type Todo = {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: string;
  updatedAt: string;
};

export default function AppPage() {
  const router = useRouter();

  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);


  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string>('');
  const [busyIds, setBusyIds] = useState<number[]>([]); // status güncellerken butonları kilitle


  useEffect(() => {
    const email = typeof window !== 'undefined' ? localStorage.getItem('authEmail') : null;
    const name = typeof window !== 'undefined' ? localStorage.getItem('authName') : null;

    if (!email) {
      router.replace('/login');
      return;
    }
    setUserEmail(email);
    setUserName(name);
    setReady(true);
  }, [router]);

  //listeleme
  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        setError('');
        setLoading(true);
        const data = await api<Todo[]>('/todos');
        data.sort((a, b) => a.id - b.id);
        setTodos(data);
      } catch (e: any) {
        setError(e.message ?? 'Liste yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [ready]);

  // ekleme
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      setError('');
      const created = await api<Todo>('/todos', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      // Sona ekleme
      setTodos(prev => {
        const next = [...prev, created];
        next.sort((a, b) => a.id - b.id);
        return next;
      });
      setTitle('');
    } catch (e: any) {
      setError(e.message ?? 'Ekleme başarısız');
    } finally {
      setCreating(false);
    }
  };
  // silme
  const handleDelete = async (id: number) => {
    try {
      setBusyIds(prev => [...prev, id]);
      await api<{ ok: boolean }>(`/todos/${id}`, { method: 'DELETE' });
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e.message ?? 'Silme işlemi başarısız');
    } finally {
      setBusyIds(prev => prev.filter(x => x !== id));
    }
  };



  // gücelleme
  const updateStatus = async (id: number, status: Todo['status']) => {
    try {
      setBusyIds(prev => [...prev, id]);
      await api<Todo>(`/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setTodos(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
    } catch (e: any) {
      setError(e.message ?? 'Durum güncellenemedi');
    } finally {
      setBusyIds(prev => prev.filter(x => x !== id));
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authName');
    router.replace('/login');
  };

  if (!ready) return null;

  const listTodo = todos.filter(t => t.status === 'todo');
  const listDoing = todos.filter(t => t.status === 'doing');
  const listDone = todos.filter(t => t.status === 'done');

  const renderTable = (
    items: Todo[],
    actionsFor: (item: Todo) => React.ReactNode,
  ) => (
    <Card className="shadow-sm h-100">
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-4"><Spinner /></div>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Başlık</th>
                <th>Durum</th>
                <th>Oluşturma</th>
                <th style={{ width: 180 }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted">Kayıt yok</td></tr>
              ) : (
                items.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{t.status}</td>
                    <td>{new Date(t.createdAt).toLocaleString('tr-TR')}</td>
                    <td>{actionsFor(t)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      <HeaderBar name={userName} onLogout={handleLogout} />

      <PageContent title="Welcome">
        <Container className="py-4">
          <Row className="mb-4">
            <Col md={8} lg={7} className="mx-auto">
              <Card className="shadow-sm">
                <Card.Body>
                  <h4 className="mb-3">Yapılacak Ekle</h4>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handleAdd} className="d-flex gap-2">
                    <Form.Control
                      placeholder="örn: Kayın babama yemek götürim gelim"
                      value={title}
                      onChange={e => { setTitle(e.target.value); if (error) setError(''); }}
                    />
                    <Button type="submit" disabled={creating}>
                      {creating ? <Spinner size="sm" /> : 'Ekle'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3">
            <Col md={12} lg={4}>
              <h5 className="mb-2">Yapılacaklar</h5>
              {renderTable(listTodo, (t) => (
                <ButtonGroup>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => updateStatus(t.id, 'doing')}
                  >
                    İşleme Al
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => handleDelete(t.id)}
                  >
                    Sil
                  </Button>
                </ButtonGroup>
              ))}
            </Col>

            <Col md={12} lg={4}>
              <h5 className="mb-2">Yapılıyor</h5>
              {renderTable(listDoing, (t) => (
                <ButtonGroup>
                  <Button
                    size="sm"
                    variant="warning"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => updateStatus(t.id, 'todo')}
                  >
                    Geri Al
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => updateStatus(t.id, 'done')}
                  >
                    Tamamlandı
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => handleDelete(t.id)}
                  >
                    Sil
                  </Button>
                </ButtonGroup>
              ))}
            </Col>

            <Col md={12} lg={4}>
              <h5 className="mb-2">Yapıldı</h5>
              {renderTable(listDone, (t) => (
                <ButtonGroup>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => updateStatus(t.id, 'doing')}
                  >
                    Geri Al
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyIds.includes(t.id)}
                    onClick={() => handleDelete(t.id)}
                  >
                    Sil
                  </Button>
                </ButtonGroup>
              ))}
            </Col>
          </Row>
        </Container>
      </PageContent>

      <SiteFooter title="Footer" />
    </div>
  );
}
