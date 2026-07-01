import { describe, it, expect } from 'vitest'
import { enrich } from '@brain/amygdala'
import type { TelegramMessage } from '@brain/core'
import { route } from './route.js'

function makeMessage(text: string): TelegramMessage {
    return {
        message_id: 1,
        date: 1700000000,
        text,
    }
}

describe('amygdala -> thalamus pipeline', () => {
    it('routes a short, simple message to NI', () => {
        const msg = makeMessage('hey what time is it')
        const enriched = enrich(msg, false, 80)
        const handoff = route(enriched)

        expect(handoff.tier).toBe('NI')
        expect(handoff.reason).toBe('message length within threshold')
        expect(handoff.timestamp).toBe(msg.date)
    })

    it('routes a message with reasoning keywords to DEL', () => {
        const msg = makeMessage('can you analyze this for me')
        const enriched = enrich(msg, false, 80)
        const handoff = route(enriched)

        expect(handoff.tier).toBe('DEL')
        expect(handoff.reason).toContain('reasoning keywords detected')
    })

    it('routes a message on hot memory miss to DEL', () => {
        const msg = makeMessage('hello there')
        const enriched = enrich(msg, true, 80)
        const handoff = route(enriched)

        expect(handoff.tier).toBe('DEL')
        expect(handoff.reason).toContain('hot memory miss')
    })
})
