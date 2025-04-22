import { FaBookOpenReader } from "react-icons/fa6";

const navbar = ({ show }: { show: boolean }) => {
  return (
    <div className={show ? "sidebar active" : "sidenav"}>
      <ul>
        <li>
          <a href="/">Certificate lookup by tokenID</a>
        </li>
        <li>
          <a href="/by-address">Certificate lookup by address</a>
        </li>
        <li>
          <a href="/admin">Admin (mint & revoke) functions</a>
        </li>
        <li>
          <a href="/team">Meet the team</a>
        </li>
      </ul>
    </div>
  );
};

export default navbar;
