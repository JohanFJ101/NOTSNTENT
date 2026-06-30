// routes an enriched message to the correct model tier, building a TierHandoff

import type { EnrichedMessage, TierHandoff } from '@brain/core'
import { createLogger } from '@brain/core'

const logger = createLogger('thalamus')

export function route(msg: EnrichedMessage): TierHandoff {
    switch (msg.tier) {
        case 'NI':
        case 'DEL':
            return {
                tier: msg.tier,
                message: msg,
            }
        default: {
            logger.warn({ tier: msg.tier }, 'Unknown tier, defaulting to NI')
            return {
                tier: 'NI',
                message: msg,
            }
        }
    }
}