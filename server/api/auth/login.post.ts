import { getUserByUsername } from "../../db/users.js"
import bcrypt from "bcrypt"
import { generateTokens } from "../../utils/jwt.js"
import { userTransformer } from "~/server/transformers/user"
import { sendError } from "h3"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { username, password } = body

    if (!username || !password) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Ivalid params'
        }))
    }

    const user:any = await getUserByUsername(username)

    if (!user) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username or password is invalid'
        }))
    }

    const doesThePasswordMatch = await bcrypt.compare(password, user.password)

    if (!doesThePasswordMatch) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: 'Username or password is invalid'
        }))
    }

    const { accessToken, refreshToken } = generateTokens(user)

    return {
        access_token: accessToken, user: userTransformer(user)
    }

})