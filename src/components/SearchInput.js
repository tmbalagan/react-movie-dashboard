
const SearchInput = ({ value, handleSearch, handleKeyDown }) => {
    return (
        <input placeholder='Enter your query' className='filter-box query-input-box' value={value} onChange={handleSearch} onKeyDown={handleKeyDown} />
    )
}

export default SearchInput