// Module: Handles the signed-in user's profile and admin user management.
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../middlewares/catchAsync");
const ApiFeatures = require("../utils/ApiFeatures");
const { deleteOne, getAll, getOne, updateOne } = require("../utils/crudFactory");

const USER_FIELDS = "firstName lastName slug email phone role isVerified isActive createdAt updatedAt";

function publicUser(user) {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        slug: user.slug,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

exports.getUsers = getAll(User, {
    modelName: "users",
    searchFields: ["firstName", "lastName", "email", "role"],
    defaultLimit: 10,
    defaultSort: "-createdAt",
    filterFactory: (req) => ({ _id: { $ne: req.user._id } }),
    select: USER_FIELDS,
    serializer: publicUser,
});

exports.getAllUsersByAdmin = catchAsync(async (req, res) => {
    const features = new ApiFeatures(
        User,
        req.validatedQuery,
        { _id: { $ne: req.user._id } },
    )
        .search(["firstName", "lastName", "email", "role"])
        .filter()
        .sort(req.validatedQuery.sort || "-createdAt")
        .select(USER_FIELDS)
        .loadMore(10);

    await features.buildMeta();
    const users = await features.query;

    return res.status(StatusCodes.OK).json({
        success: true,
        data: { users },
        meta: features.meta,
    });
});

exports.getUser = getOne(User, {
    modelName: "user",
    select: USER_FIELDS,
    serializer: publicUser,
});

exports.getCurrentUser = catchAsync(async (req, res) => {
    return res.status(StatusCodes.OK).json({
        success: true,
        data: { user: publicUser(req.user) },
    });
});

exports.updateUser = updateOne(User, {
    modelName: "user",
    idFromRequest: (req) => req.params.id || req.user._id,
    allowedFields: ["firstName", "lastName", "phone"],
    serializer: publicUser,
});

exports.authorizeOwnProfile = (req, res, next) => {
    if (req.user._id.toString() !== req.params.id) {
        return next(new ApiError("You can only update your own profile.", StatusCodes.FORBIDDEN));
    }

    next();
};

// Require the current password, then invalidate refresh sessions after changing credentials.
exports.changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.validatedBody;
    const user = await User.findById(req.user._id).select("+password +refreshTokens");

    if (!user) {
        throw new ApiError("User not found.", StatusCodes.NOT_FOUND);
    }

    if (!(await user.comparePassword(currentPassword))) {
        throw new ApiError("Current password is incorrect.", StatusCodes.BAD_REQUEST);
    }

    if (currentPassword === newPassword) {
        throw new ApiError("New password must be different from the current password.", StatusCodes.BAD_REQUEST);
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Password changed successfully. Please sign in again.",
    });
});

exports.deleteUser = deleteOne(User, {
    modelName: "user",
    beforeDelete: ({ req, document }) => {
        if (document._id.toString() === req.user._id.toString()) {
            throw new ApiError(
                "You cannot delete your own account through this endpoint.",
                StatusCodes.BAD_REQUEST,
            );
        }
    },
});

exports.updateUserByAdmin = catchAsync(async (req, res) => {
    const { role, isActive } = req.validatedBody;
    const isCurrentAdmin = req.params.id === req.user._id.toString();

    if (isCurrentAdmin && isActive === false) {
        throw new ApiError("You cannot deactivate your own account.", StatusCodes.BAD_REQUEST);
    }

    if (isCurrentAdmin && role && role !== "admin") {
        throw new ApiError("You cannot remove your own admin role.", StatusCodes.BAD_REQUEST);
    }

    const user = await User.findById(req.params.id).select(
        "+otp +otpExpires +otpResendTimeout +otpAttempts +otpPurpose +refreshTokens",
    );

    if (!user) {
        throw new ApiError("User not found.", StatusCodes.NOT_FOUND);
    }

    if (role !== undefined) {
        user.role = role;
    }

    if (isActive !== undefined) {
        user.isActive = isActive;

        if (isActive) {
            user.otp = undefined;
            user.otpExpires = undefined;
            user.otpResendTimeout = undefined;
            user.otpAttempts = 0;
            user.otpPurpose = undefined;
            user.isVerified = true;
        } else {
            user.refreshTokens = [];
        }
    }

    await user.save();

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "User updated successfully.",
        data: { user: publicUser(user) },
    });
});

exports.getUsers = exports.getAllUsersByAdmin;
