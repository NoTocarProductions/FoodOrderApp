import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) { // a little helper utility function that wraps the logic for dealing with send requests.
    const response = await fetch(url, config);

    const resData = await response.json();

    if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong, failed to send request. Please try again later.');
    }

    // if everything is fine then:
    return resData;
}

export default function useHttp(url, config, initialData) { // custom hooks should start with 'use' to signal it's a hook.
    
    const [data, setData] = useState(initialData); // pass an empty array of initialData for the loaded meals otherwise you get an error for trying to load undefined.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    function clearData() {
        setData(initialData);
    }
    

    const sendRequest = useCallback(async function sendRequest(data) { // updating some state based on the request status
        setIsLoading(true);
        try {
           const resData = await sendHttpRequest(url, {...config, body: data});
           setData(resData);
        }
        catch (error) {
            setError(error.message || 'Something went wrong!')
        }
        setIsLoading(false); 
    }, [url, config]) // like this together with useEffect --> sends the request whenever the component that uses this hooks loads
    // so perfect for the meals component(GET the meals when the page loads) but not for the checkout!


    useEffect(() => {
        if ((config && (config.method === 'GET' || !config.method)) || !config) { // check first if it actually asks a GET method
            sendRequest();
        }
        
    }, [sendRequest, config])



    return {
        data,
        isLoading,
        error,
        sendRequest, // for all the requests that are not GET expose the function here so they can execute it whenever they want
        clearData
    }
}