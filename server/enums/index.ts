export enum TokenExpired {
    web = '1d',
    app = '7d',
    device = '30d',
}
export enum LengthID {
    user = 6,
    post = 8,
    project = 5,
    news = 7,
}
export enum LimitOTP {
    minute = 60 * 60 * 1000,
    hour = 60 * minute,
    otp = 10 * minute,
    failed = 30 * minute,
    renew = 24 * hour,
}
