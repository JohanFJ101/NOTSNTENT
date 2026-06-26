// its the data package that moves from the Amygdala to Thalamus to the model

import { EnrichedMessage } from './message.js'

export type TierHandoff = {
    message: EnrichedMessage
    tier: 'NI' | 'DEL'
    reason: string
    timestamp: number
}