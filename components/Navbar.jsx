import { Link } from "react-router-dom";
import '../src/styles.css';

function Navbar(){
    return(
        <nav className="nav">
            <div className="Logo">Budgetify</div>
                <Link to='/'>Home</Link>
                <Link to='/Transactions'>Transactions</Link>
                <Link to='/Budget'>Budget</Link>
        </nav>
    )
}

export default Navbar;