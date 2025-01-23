export type IResponse = {
    data: Object[] | any
    error: Error | any
}

export type INearestServiceProps = {
    currentLocation: [Number, Number] | any
}