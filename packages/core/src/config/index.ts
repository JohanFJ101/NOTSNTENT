import { z } from 'zod' //import zod into the file

export const ConfigSchema = z.object({ // define the schema
    ollamaUrl: z.string().url(), // here this field should be a URL string
    niModel: z.string().default('qwen2.5:1.5b-instruct'), // again a string with a default given
    delegateModel: z.string().default('qwen3:8b'), 
    telegramToken: z.string(),
    amygdalaThreshold: z.number().int().positive(),
    idleWindow: z.number().int().positive(),
})

export type Config = z.infer<typeof ConfigSchema> //tells ts to generate a type from schema from zod.

export function loadConfig(): Config { //loads the config from the env file.
    return ConfigSchema.parse({
        ollamaUrl: process.env.OLLAMA_URL,
        niModel: process.env.NI_MODEL,
        delegateModel: process.env.DELEGATE_MODEL,
        telegramToken: process.env.TELEGRAM_TOKEN,
        amygdalaThreshold: Number(process.env.AMYGDALA_THRESHOLD ?? 80),
        idleWindow: Number(process.env.IDLE_WINDOW ?? 30),
    })
}