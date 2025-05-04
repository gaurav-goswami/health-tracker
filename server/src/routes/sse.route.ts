/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response, Request } from 'express';

const sseRouter = express.Router();
const clients: Response[] = [];

sseRouter.get("/health-updates", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "stay-alive");

    res.flushHeaders();

    clients.push(res);

    req.on("close", () => {
        const index = clients.indexOf(res);
        if (index !== -1) clients.splice(index, 1);
        res.end();
    })
});

export const broadcastHealthUpdates = (data: any) => {
    const dataPayload = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => client.write(dataPayload));
}

export default sseRouter;