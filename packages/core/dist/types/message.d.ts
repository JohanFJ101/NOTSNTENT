export type TelegramMessage = {
    message_id: number;
    date: number;
    text: string;
};
export type ComplexitySignals = {
    messageLength: number;
    reasoningWords: boolean;
    hotMemoryMiss: boolean;
};
export type Tier = "NI" | "DEL";
export type EnrichedMessage = TelegramMessage & ComplexitySignals & {
    tier: Tier;
};
//# sourceMappingURL=message.d.ts.map