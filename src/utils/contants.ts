export const PI_BASE_URL = "https://api.minepi.com/v2"

export const USER_ENDPOINT = PI_BASE_URL + "/me"
export const PI_APPROVE_ENDPOINT = (payment_id: string) => PI_BASE_URL + `/payments/${ payment_id }/approve`
export const PI_COMPLETE_ENDPOINT = (payment_id: string) => PI_BASE_URL + `/payments/${ payment_id }/complete`
