import { Ticket } from '../types/ticket';

let ws: WebSocket | null = null;
const messageHandlers = new Map<string, Function>();

const initializeSocket = async () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
        ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/socketio`);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'ticket-created') {
                    const handler = messageHandlers.get('new-tickets');
                    if (handler) {
                        handler(data.data);
                    }
                } else if (data.type === 'ticket-updated') {
                    const handler = messageHandlers.get('ticket-updates');
                    if (handler) {
                        handler(data.data);
                    }
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return new Promise((resolve) => {
            if (!ws) return;
            ws.onopen = () => resolve(ws);
        });
    }
    return ws;
};

const sendMessage = (message: any) => {
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected');
    }
};

export const subscribeToNewTickets = (callback: (ticket: Ticket) => void) => {
    initializeSocket().then(() => {
        messageHandlers.set('new-tickets', callback);
    }).catch(error => {
        console.error('Error initializing WebSocket:', error);
    });

    return () => {
        messageHandlers.delete('new-tickets');
        if (ws?.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };
};

export const subscribeToTicketUpdates = (callback: (ticket: Ticket) => void) => {
    initializeSocket().then(() => {
        messageHandlers.set('ticket-updates', callback);
    }).catch(error => {
        console.error('Error initializing WebSocket:', error);
    });

    return () => {
        messageHandlers.delete('ticket-updates');
    };
};

export const notifyTicketCreated = (ticket: Ticket) => {
    sendMessage({
        type: 'new-ticket',
        ticket
    });
};

export const notifyTicketUpdated = (ticket: Ticket) => {
    sendMessage({
        type: 'update-ticket',
        ticket
    });
};