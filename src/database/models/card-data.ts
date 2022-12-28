import { AcceptedTypes } from './'
import { Dict } from '../../type-utils'

export interface CardData extends Dict<AcceptedTypes> {

    entityId: string

    messageId: string

    userTags: string[]

    roleTag: string

    gameImageSrc: string

    description: string

    title: string

}
