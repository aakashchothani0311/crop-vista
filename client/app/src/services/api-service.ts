const serverURL = 'http://localhost:3000'

/* GET method to query all/ filtered documents as per the value of params passed */
export const search = async <T>(path: string, params: {}): Promise<T | T[]> => {
    const query: URLSearchParams = new URLSearchParams(params);
    const response = await fetch(`${serverURL}/${path}/?${query}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    return response.json();
}

/* GET method to fetch existing document identified by the id */
export const getById = async <T>(path: string, id: string): Promise<T> => {
    const response = await fetch(`${serverURL}/${path}/${id}`, { 
        method: 'GET', 
        headers: {
            'Accept': 'application/json'
        }
    });
    return response.json();
}

/* POST method to create new document as per the values passed in body */
export const post = async <T>(path: string, body: {}): Promise<T> => {
    const response = await fetch(`${serverURL}/${path}`, {
        method: 'POST', 
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    return response.json();
}

/* PUT method to update existing document identified by the id and values passed in body */
export const put = async <T>(path: string, id: string,  body: {}): Promise<T> => {
    const response = await fetch(`${serverURL}/${path}/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    return response.json();
}

// DELETE method to delete a documents identified by the id
// export const remove = async <T>(path: string, id: string): Promise<T> => {
//     const response = await fetch(`${serverURL}/${path}/${id}`, { method: 'DELETE' });
//     return response.json();
// }