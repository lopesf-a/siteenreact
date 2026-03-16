const Input = ({ label, type, name, value, onChange }) => {
    return (
        <div className="Input">
            <label>{label}</label>
            <input type={type} name={name} value={value} onChange={onChange} />
        </div>
    );
};

export default Input;