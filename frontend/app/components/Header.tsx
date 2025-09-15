'use client';
import { Button } from 'react-bootstrap';

type HeaderBarProps = {
  name?: string | null;
  onLogout?: () => void;
};

export default function HeaderBar({ name, onLogout }: HeaderBarProps) {
  return (
    <header className="bg-light border-bottom">
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <h2 className="m-0">Header</h2>

        {name && (
          <div className="d-flex flex-column align-items-end">
            <strong>{name}</strong>
            {onLogout && (
              <Button variant="outline-secondary" size="sm" className="mt-1" onClick={onLogout}>
                Çıkış
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
