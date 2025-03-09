
import varukorg from "../../Images/Varukorg.svg"
import "./Header.scss"

const header = () => {
    return (
    <div className="header">
        <button className="YYGS-button">
            <span className="letter letter-Y1">Y</span>
            <span className="letter letter-Y2">Y</span>
            <span className="letter letter-G">G</span>
            <span className="letter letter-S">S</span>
        </button>
        <button>
            <span className="count">0</span>
        <img src={varukorg} alt="varukorg"/>
        </button>
                 
    </div>
    )
}

export default header