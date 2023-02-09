import kafkaProducer from '@src/common/kafka/producer';
import { logger } from '@src/common/winston';

const processLogger = logger('process');

export default function gracefulShutdown() {
  process.on('unhandledRejection', (reason, p) => {
    processLogger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });

  process.on('uncaughtException', async (err) => {
    processLogger.error('Uncaught Exception thrown', err);
    try {
      processLogger.info('Closing http server.');
      await kafkaProducer.disconnect();
      process.exit(1);
    } catch (err) {
      processLogger.error(err);
      process.exit(1);
    }
  });

  process.once('SIGINT', async () => {
    try {
      processLogger.info('SIGINT signal received.');
      processLogger.info('Closing http server.');
      await kafkaProducer.disconnect();
      process.exit(0);
    } catch (err) {
      processLogger.error(err);
      process.exit(1);
    }
  });

  process.once('SIGTERM', async () => {
    try {
      processLogger.info('SIGTERM signal received.');
      processLogger.info('Closing http server.');
      await kafkaProducer.disconnect();
      process.exit(0);
    } catch (err) {
      processLogger.error(err);
      process.exit(1);
    }
  });
}
