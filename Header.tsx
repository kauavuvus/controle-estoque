import React from "react";

const Header = () => {
    return (
        <header style={{ display: "flex", alignItems: "center", padding: "10px", backgroundColor: "#0A1F44" }}>
            <img src="/assets/logo.png" alt="WJR Logo" style={{ height: "50px", marginRight: "10px" }} />
            <h1 style={{ color: "white", fontSize: "24px" }}>Controle de Estoque WJR</h1>
        </header>
    );
};

export default Header;
