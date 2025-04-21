import { FaBookOpenReader } from "react-icons/fa6";

const navbar = ({show}: {show: boolean}) => {
    return (
    <div className={ show? 'sidebar active' : 'sidenav' }>
        <ul>
            <li>
                <a href='/'>Home</a>
            </li>
            <li>
                <a href='/admin'>Admin Functions</a>
            </li>
            <li>
                <a href='/team'>Meet the Team</a>
            </li>
        </ul>
    </div>
    );
};

export default navbar