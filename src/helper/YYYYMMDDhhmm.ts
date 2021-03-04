import moment from 'moment'

export default function YYYYMMDDhhdd (v: string) {
    return moment(v).format('YYYY年MM月DD日hh:mm')
}