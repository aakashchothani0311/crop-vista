// Send a successful response with a 200 status code
export const setResponse = (data, response) => {
    response.status(200).json(data);
}

// Handling and sending error responses based on error types
export const setError = (error, response) => {
    console.log('error', error);
    if (error.name === 'ValidationError') {
        response.status(400).json({
            error: {
                code: 'ValidationError',
                message: error.message
            }
        });
    } else if (error.name === 'CastError') {
        response.status(400).json({
            error: {
                code: 'InvalidId',
                message: 'Invalid ID format.'
            }
        });
    } else if (error.name === 'DocumentNotFoundError') {
        response.status(404).json({
            error: {
                code: 'NotFound',
                message: 'Document not found.'
            }
        });
    } else {
        response.status(500).json({
            error: {
                code: 'InternalServerError',
                message: 'An error occurred while processing the request.'
            }
        });
    }
};