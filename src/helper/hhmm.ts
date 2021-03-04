import moment from 'moment'

export const hhmm: any = function(v: string): string {
    return moment(v).format('hh:mm')
}