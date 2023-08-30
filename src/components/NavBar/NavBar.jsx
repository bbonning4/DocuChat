import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn-ghost btn text-xl normal-case">DocuChat</Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="btn-ghost btn">
            menu
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu menu-sm z-[1] mt-3 w-52 bg-base-200 p-2 shadow"
          >
            <li>
              <Link to="/documents">My Documents</Link>
            </li>
            <li>
              <a onClick={handleLogOut}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}