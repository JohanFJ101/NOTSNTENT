// routes an enriched message to the correct model tier, building a TierHandoff

import type { EnrichedMessage, TierHandoff } from '@brain/core'
import { createLogger } from '@brain/core'

const logger = createLogger('thalamus')

function buildReason(msg: EnrichedMessage): string {
    const reasons: string[] = []

    if (msg.reasoningWords) reasons.push('reasoning keywords detected')
    if (msg.timeReference) reasons.push('time reference detected')
    if (msg.hotMemoryMiss) reasons.push('hot memory miss')
    if (msg.tier === 'DEL' && reasons.length === 0) {
        reasons.push('message length triggered complexity threshold')
    }
    if (reasons.length === 0) reasons.push('message length within threshold')

    return reasons.join('; ')
}

export function route(msg: EnrichedMessage): TierHandoff {
    switch (msg.tier) {
        case 'NI':
        case 'DEL':
            return {
                tier: msg.tier,
                message: msg,
                reason: buildReason(msg),
                timestamp: msg.date,
            }
        default: {
            logger.warn({ tier: msg.tier }, 'Unknown tier, defaulting to NI')
            return {
                tier: 'NI',
                message: msg,
                reason: 'unknown tier, defaulted to NI',
                timestamp: msg.date,
            }
        }
    }
}