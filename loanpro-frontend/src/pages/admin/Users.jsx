import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { apiGet, apiPut } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet(`/admin/users?page=${page}&size=10`);
        if (!cancelled) {
          setUsers(res?.content || []);
          setTotalPages(res?.totalPages || 1);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page]);

  const toggleRole = async (u) => {
    const nextRole = String(u.role).toUpperCase() === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    setUpdatingId(u.id);
    try {
      await apiPut(`/admin/users/${u.id}/role?role=${nextRole}`);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: nextRole } : x)));
    } catch {
      // ignore — leave role unchanged on failure
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="users-page">
      <div className="users-page__header">
        <div>
          <h2 className="users-page__title">User Management</h2>
          <p className="users-page__subtitle">View and manage all system users</p>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="page-loading">Loading users…</div>
        ) : error ? (
          <div className="page-error">{error}</div>
        ) : (
          <div className="users-page__table-wrap">
            <table className="users-page__table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="users-page__id">#{u.id}</td>
                      <td className="users-page__name">{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-badge--${String(u.role).toLowerCase()}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className="status-badge status-badge--active">Active</span>
                      </td>
                      <td>
                        <div className="users-page__actions">
                          <Button variant="ghost" size="sm" onClick={() => toggleRole(u)} disabled={updatingId === u.id}>
                            {updatingId === u.id
                              ? 'Saving…'
                              : String(u.role).toUpperCase() === 'ADMIN' ? 'Make Customer' : 'Make Admin'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="users-page__pagination" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</Button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page {page + 1} of {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Users;
