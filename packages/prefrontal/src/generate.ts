import type { TierHandoff } from '@brain/core'
import { createLogger } from '@brain/core'
import { getContext } from '@brain/hippocampus'

type PrefrontalResponse = {
  reply: string
  model: string
  tier: 'NI' | 'DEL'
  latencyMs: number
}

const MODEL_MAP: Record<'NI' | 'DEL', string> = {
  NI: 'qwen2.5:1.5b-instruct',
  DEL: 'qwen3:8b',
}

const OLLAMA_URL = 'http://localhost:11434/api/generate'

const logger = createLogger('prefrontal')

type OllamaGenerateResponse = {
  response?: unknown
}

export async function generate(handoff: TierHandoff): Promise<PrefrontalResponse> {
  logger.debug(
    { tier: handoff.tier, reason: handoff.reason },
    'starting generation',
  )

  const start = Date.now()

  // Placeholder — will be merged into the prompt once Hippocampus is real.
  const context = await getContext()

  const model = MODEL_MAP[handoff.tier]
  const prompt = handoff.message.text

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    })

    if (!response.ok) {
      logger.error(
        { status: response.status, statusText: response.statusText, tier: handoff.tier, model },
        'ollama request failed',
      )
      throw new Error(`Ollama request failed with status ${response.status} ${response.statusText}`)
    }

    const payload: unknown = await response.json()
    const parsed = payload as OllamaGenerateResponse

    if (typeof parsed.response !== 'string') {
      throw new Error('Ollama response was missing a string "response" field')
    }

    const reply = parsed.response
    const latencyMs = Date.now() - start

    logger.info({ model, tier: handoff.tier, latencyMs }, 'generation completed')

    return { reply, model, tier: handoff.tier, latencyMs }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error({ tier: handoff.tier, model, error: error.message }, 'generation failed')
      throw error
    }
    logger.error({ tier: handoff.tier, model, error: String(error) }, 'generation failed')
    throw new Error('Generation failed due to an unknown error')
  }
}