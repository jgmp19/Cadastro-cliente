import './styles.css';
import { Link } from 'react-router-dom';

export default function Error(){
    return(
        <div className="not-exist">
            <h1>404</h1>
            <h2>Página não encontrada</h2>
            <Link to="/">Volte a Pággina Principal</Link>
        </div>
    )
}