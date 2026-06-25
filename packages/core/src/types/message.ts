// the raw message recieved from the telegram API
export type TelegramMessage = {
    message_id: number
    date: number
    text: string
}
// These are all the fields that will determine how "complex" a message is to make sure its smartly routed between the models

export type ComplexitySignals = {
    messageLength: number 
    reasoningWords: boolean
    hotMemoryMiss: boolean 
}

//The 2 tiers used.
export type Tier = "NI" | "DEL"

//Message which was passed through the amygdala

 export type EnrichedMessage = TelegramMessage & ComplexitySignals & {
  tier: Tier
}

