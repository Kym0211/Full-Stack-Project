import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, "Health check passed"));
})

export { healthCheck };