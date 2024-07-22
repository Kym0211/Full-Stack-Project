class ApiResponse {
    constructor(statusCode, message = "Success", data, success = true){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = true;
    }
}

export default ApiResponse;