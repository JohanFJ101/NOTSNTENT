import { Bot } from 'grammy'
import { loadConfig, createLogger } from '@brain/core'
import { enrich } from '@brain/amygdala'
import { route } from '@brain/thalamus'
import { generate } from '@brain/prefrontal'
import { getContext, saveMessage } from '@brain/hippocampus'
import type { TelegramMessage } from '@brain/core'

const logger = createLogger('brainstem')
const config = loadConfig()

const bot = new Bot(config.telegramToken)

bot.on('message:text', async (ctx) => {
  const raw: TelegramMessage = {
    message_id: ctx.message.message_id,
    date: ctx.message.date,
    text: ctx.message.text,
  }

  logger.info({ text: raw.text }, 'message received')

  try {
    // Read context before saving this turn so it reflects only prior turns.
    // hotMemoryMiss: true when there is no prior conversation yet.
    const context = await getContext()
    const hotMemoryMiss = context.length === 0

    const enriched = enrich(raw, hotMemoryMiss, config.amygdalaThreshold)
    const handoff = route(enriched)
    const result = await generate(handoff)

    await saveMessage('user', raw.text)
    await saveMessage('assistant', result.reply)

    await ctx.reply(result.reply)

    logger.info(
      { tier: result.tier, model: result.model, latencyMs: result.latencyMs },
      'reply sent',
    )
  } catch (error: unknown) {
    logger.error({ error }, 'failed to process message')
    await ctx.reply('Something went wrong on my end.')
  }
})

bot.start()
logger.info('brainstem started, listening for messages')
