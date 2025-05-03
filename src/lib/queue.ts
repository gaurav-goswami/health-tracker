/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import amqplib, { ConsumeMessage } from "amqplib";
import { Channel } from "amqplib";
import logger from "../config/logger";

class Queue {
  private static instance: Queue;
  private connection: amqplib.ChannelModel | null = null;
  private channel: amqplib.Channel | null = null;
  private readonly url = process.env.QUEUE_URL as string;

  private constructor() {}

  public static getInstance(): Queue {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }
    return Queue.instance;
  }

  public async connect(): Promise<Channel> {
    if (!this.connection) {
      this.connection = await amqplib.connect(this.url);
    }
    if (this.connection) {
      this.channel = await this.connection.createChannel();
    }
    return this.channel as Channel;
  }

  public async publish(queueName: string, message: any) {
    const channel = await this.connect();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  public async consume(queueName: string): Promise<void> {
    const channel = await this.connect();
    await channel.assertQueue(queueName, { durable: true });

    await channel.consume(queueName, (message: ConsumeMessage | null) => {
      if (!message) return;

      try {
        const data = JSON.parse(message.content.toString());
        logger.info(`Received from ${queueName}: ${JSON.stringify(data)}`);
        channel.ack(message);
      } catch (error: any) {
        logger.error(`Failed to process message: ${error}`);
        channel.ack(message);
      }
    });
  }

  public async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

export default Queue.getInstance();
