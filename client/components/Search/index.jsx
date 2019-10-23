import React from 'react';
import QueryString from 'query-string';

class Search extends React.Component {
    static async query(view, params) {
        return await (await fetch(
            `/api/search/${view}?${QueryString.stringify(params)}`
        )).json();
    }
}

export default Search;
