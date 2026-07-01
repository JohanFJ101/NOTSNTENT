//file to "enrich" the telegram message with details which will help it in deciding which model is required


import type { TelegramMessage, EnrichedMessage } from '@brain/core'

const REASONING_WORDS = [ //TODO: I doubt ill be doing stuff like this in a message. Make smarter.
    'analyze', 'compare', 'explain why', 'plan', 'restructure',
    'summarize'
]

const TIME_REFERENCES = [ //TODO: Make TIME_REFERENCES smarter.
    'last week', 'last month', 'over the past',
    'yesterday', 'this week'
]

export function enrich(
    msg: TelegramMessage,
    hotMemoryMiss: boolean,
    tokenThreshold: number
): EnrichedMessage {
    const text = msg.text.toLowerCase()
    const messageLength = msg.text.split(' ').length

    const reasoningWords = REASONING_WORDS.some(word => text.includes(word))
    const timeReference = TIME_REFERENCES.some(ref => text.includes(ref))

    const isComplex = (
        messageLength > tokenThreshold ||
        reasoningWords ||
        timeReference ||
        hotMemoryMiss
    )

    return {
        ...msg,
        messageLength,
        reasoningWords,
        hotMemoryMiss,
        timeReference,
        tier: isComplex ? 'DEL' : 'NI',
    }
}