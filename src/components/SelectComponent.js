
const SelectComponent = ({ value, handleSelect }) => {
    return (
        <select value={value} onChange={handleSelect} className="filter-box">
            <option value="get">GET</option>
            <option value="rank">Rank</option>
        </select>
    )
}

export default SelectComponent