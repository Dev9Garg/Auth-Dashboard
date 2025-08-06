import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import jwt from "jsonwebtoken"

const User = sequelize.define(
    'User',

    {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        isBlacklisted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "active",
            allowNull: false
        },

        isInactiveUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        refreshToken: {
            type: DataTypes.STRING,
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },

    {
        timestamps: true
    }
);

const BlacklistEmails = sequelize.define(
    'BlacklistEmails',

    {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },

        blockedBy: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },

    {
        timestamps: true
    }
)

const Request = sequelize.define(
    'Request',

    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },

        requestedByName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        requestedById: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },

    {
        timestamps: true
    }
)


User.prototype.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this.id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

User.prototype.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const modelSync = async () => {
    await sequelize.sync({
        alter: true
    });
    console.log("models synchronized successfully !");
}

export {modelSync, User, BlacklistEmails, Request};