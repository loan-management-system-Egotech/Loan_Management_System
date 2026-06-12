import Button from '../../components/Button';
import Card from '../../components/Card';
import { users } from '../../data/mockData';
import './Users.css';

function Users() {
  return (
    <div className="users-page">
      <div className="users-page__header">
        <div>
          <h2 className="users-page__title">User Management</h2>
          <p className="users-page__subtitle">View and manage all system users</p>
        </div>
        <Button variant="primary" icon="➕">Add User</Button>
      </div>

      <Card>
        <div className="users-page__table-wrap">
          <table className="users-page__table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="users-page__id">{u.id}</td>
                  <td className="users-page__name">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-badge--${u.role.toLowerCase()}`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${u.status.toLowerCase()}`}>{u.status}</span>
                  </td>
                  <td className="users-page__date">{u.lastLogin}</td>
                  <td>
                    <div className="users-page__actions">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Users;
