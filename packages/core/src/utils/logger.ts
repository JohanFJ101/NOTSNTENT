//a single logger file which uses pino to log all organ functions.
import pino from 'pino'

export const logger = pino({
    level: process.env.LOG_LEVEL ?? 'info', //default logging is info but it can be overwritten in env file LOG_LEVEL
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
})

export function createLogger(pkg: string) {
    return logger.child({ pkg })
}

