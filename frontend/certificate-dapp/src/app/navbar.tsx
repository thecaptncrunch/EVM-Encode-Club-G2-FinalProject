import { FaBookOpenReader } from "react-icons/fa6";

const navbar = ({show}: {show: boolean}) => {
    return (
    <div className={ show? 'sidebar active' : 'sidenav' }>
        <ul>
            <li>
                <a href='/'>Home</a>
            </li>
            <li>
                <a href='/'>About Us</a>
            </li>
            <li>
                <a href='/'>Meet the Team</a>
            </li>
        </ul>
    </div>
    );
};

export default navbar