import { Expose, plainToInstance } from 'class-transformer'
import { Response } from 'express'
import { config } from '../configs'
import { logger } from './logger'
import { ResponseWrapper } from './response'

export class ErrorResp extends Error {
    @Expose()
    readonly status: number

    @Expose()
    readonly code: string

    @Expose()
    readonly message: string

    @Expose()
    readonly metadata: object

    @Expose()
    readonly title: string

    constructor(
        code: string,
        message: string,
        status?: number,
        metadata?: object,
        title?: string
    ) {
        super()
        this.status = status
        this.code = code
        this.message = message
        this.stack = undefined
        this.metadata = metadata
        this.title = title
    }
}

export const Errors = {
    BadRequest: new ErrorResp('error.badRequest', 'Bad request', 400),
    LimitInvalid: new ErrorResp(
        'error.LimitInvalid',
        'Limit invalid (maximum is 100)',
        400
    ),
    Unauthorized: new ErrorResp('error.unauthorized', 'Unauthorized', 401),
    BeApiKeyInvalid: new ErrorResp(
        'error.BeApiKeyInvalid',
        'BE API Key invalid',
        401
    ),
    Forbidden: new ErrorResp('error.forbiden', 'Forbidden', 403),
    Sensitive: new ErrorResp(
        'error.sensitive',
        'An error occurred, please try again later.',
        400
    ),
    InternalServerError: new ErrorResp(
        'error.internalServerError',
        'Internal server error.',
        500
    ),
    InvalidFileType: new ErrorResp(
        'error.invalidFileType',
        'Invalid file type.'
    ),
    UserNotFound: new ErrorResp('error.userNotFound', 'User not found'),
    ProfileTypeNotFound: new ErrorResp(
        'error.profileTypeNotFound',
        'Profile type not found'
    ),
    UserUsageNotFound: new ErrorResp(
        'error.UserUsageNotFound',
        'User usage not found'
    ),
    UserInactive: new ErrorResp('error.UserInactive', 'User inactive'),
    PhoneNumberInvalid: new ErrorResp(
        'error.PhoneNumberInvalid',
        'Phone number invalid'
    ),
    DepositAmountOrPeriodInvalid: new ErrorResp(
        'error.DepositAmountOrPeriodInvalid',
        'Deposit amount or period invalid'
    ),
    EmailHasBeenTaken: new ErrorResp(
        'error.EmailHasBeenTaken',
        'Email has been taken'
    ),
    PhoneNumberHasBeenTaken: new ErrorResp(
        'error.PhoneNumberHasBeenTaken',
        'Phone number has been taken'
    ),
    InvalidAccount: new ErrorResp('error.invalidAccount', 'Invalid account'),
    AccountBlocked: new ErrorResp(
        'error.accountBlocked',
        'Your account has been blocked due to having too many attempts to log in with the wrong password. Please contact our customer service for help.'
    ),
    AccountBanned: new ErrorResp(
        'error.accountBanned',
        'Your account has been banned. Please contact our customer service for help.'
    ),
    AccountSelfExcluded: new ErrorResp(
        'error.accountSelfExcluded',
        'Your account was closed.'
    ),
    AccountBreakWithData: (breakTime) =>
        new ErrorResp('error.accountBreak', 'Your account was closed.', 400, {
            breakTime,
        }),
    InvalidBreakTime: new ErrorResp(
        'error.InvalidBreakTime',
        'Invalid break time'
    ),
    InvalidAge: new ErrorResp('error.InvalidAge', 'Invalid Age'),
    AccountNotFound: new ErrorResp(
        'error.AccountNotFound',
        'Account not found'
    ),
    OTPResendLimitExceeded: new ErrorResp(
        'error.OTPResendLimitExceeded',
        'OTP send limit exceeded'
    ),
    InvalidOtpType: new ErrorResp('error.InvalidOtpType', 'OTP type invalid'),
    InvalidOtp: new ErrorResp('error.InvalidOtp', 'OTP invalid'),
    InvalidOtpSendMethod: new ErrorResp(
        'error.InvalidOtpSendMethod',
        'Otp send method invalid'
    ),
    StateNotFound: new ErrorResp('error.StateNotFound', 'State not found'),
    IdentityInfoNotFound: new ErrorResp(
        'error.IdentityInfoNotFound',
        'Identity Info not found'
    ),
    StreetTypeNotFound: new ErrorResp(
        'error.StreetTypeNotFound',
        'StreetType not found'
    ),
    MailEventInvalid: new ErrorResp(
        'error.MailEventInvalid',
        'MailEvent invalid'
    ),
    IsoDateTimeStringInvalid: new ErrorResp(
        'error.IsoDateTimeStringInvalid',
        'ISO8601 Date Time Strong Invalid'
    ),
    AccountVerifyFail: new ErrorResp(
        'error.AccountVerifyFail',
        'Account verify fail'
    ),
    UsernameHasBeenTaken: new ErrorResp(
        'error.UsernameHasBeenTaken',
        'Username has been taken'
    ),
    PasswordIncorrect: new ErrorResp(
        'error.passwordIncorrect',
        'Incorrect password.'
    ),
    SelfActionPasswordIncorrect: new ErrorResp(
        'error.SelfActionPasswordIncorrect',
        'Incorrect password.'
    ),
    UnverifiedUser: new ErrorResp('error.Unverified', 'Unverified user'),
    RoleNotFound: new ErrorResp('error.RoleNotFound', 'Role not found'),
    InvalidAmount: new ErrorResp('error.InvalidAmount', 'Invalid amount'),
    InvalidUserPassword: new ErrorResp(
        'error.InvalidUserPassword',
        'Invalid password'
    ),
    DateFilterExceededDayLimit: new ErrorResp(
        'error.DateFilterExceededDayLimit',
        'Exceeded days limit'
    ),
    SettingNotFound: new ErrorResp(
        'error.SettingNotFound',
        'Setting not found'
    ),
    SettingExisted: new ErrorResp('error.SettingExisted', 'Setting existed'),
    InvalidPostCode: new ErrorResp(
        'error.InvalidPostCode',
        'Post code invalid'
    ),
    ExpiredTimeRemind: new ErrorResp(
        'error.ExpiredTimeRemind',
        'Expired time remind'
    ),
    NotImplement: new ErrorResp('error.NotImplement', 'Not implement'),
    InvalidData: new ErrorResp('error.InvalidData', 'Invalid data'),
    NotSupportedFeature: new ErrorResp(
        'error.NotSupportedFeature',
        'Not supported feature'
    ),
    ProcessIsRunning: new ErrorResp(
        'error.ProcessIsRunning',
        'Process is running. Please try again later!'
    ),
    NotVerifiedRequest: new ErrorResp(
        'error.NotVerifiedRequest',
        'Request must be verified first.'
    ),
    NotLoadedField: new ErrorResp(
        'error.NotLoadedField',
        'The field is not loaded'
    ),
    InvalidToken: new ErrorResp('error.InvalidToken', 'Invalid token'),
    InvalidSessionToken: new ErrorResp(
        'error.InvalidSessionToken',
        'Invalid session token'
    ),
}

export const handleError = (err: Error, res: Response) => {
    if (err instanceof ErrorResp) {
        const errResp = err as ErrorResp
        res.status(errResp.status || Errors.BadRequest.status).json(
            new ResponseWrapper(
                null,
                plainToInstance(ErrorResp, errResp, {
                    excludeExtraneousValues: true,
                })
            )
        )
    } else {
        logger.error(err.message, err)

        if (config.isProduction()) {
            res.status(Errors.Sensitive.status).json(
                new ResponseWrapper(null, Errors.Sensitive)
            )
            return
        }
        const errResp = new ErrorResp(
            Errors.InternalServerError.code,
            err.message,
            Errors.InternalServerError.status
        )

        res.status(Errors.Sensitive.status).json(
            new ResponseWrapper(null, errResp)
        )
    }
}
