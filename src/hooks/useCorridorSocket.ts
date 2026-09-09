import { useState, useEffect, useRef } from 'react';

export interface TelemetryDetection {
  class: string;
  confidence: number;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  speed_kmh?: number;
}

export interface TelemetryPacket {
  timestamp: number;
  camera_id: string;
  emergency_active: boolean;
  current_node: number;
  signals_overridden: number;
  detections: TelemetryDetection[];
  inference_latency_ms: number;
  fps: number;
}

export function useCorridorSocket(wsUrl: string = 'ws://localhost:8000/ws/telemetry') {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryPacket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let unmounted = false;

    function connect() {
      try {
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          if (!unmounted) {
            setIsConnected(true);
          }
        };

        socket.onmessage = (event) => {
          if (!unmounted) {
            try {
              const data: TelemetryPacket = JSON.parse(event.data);
              setTelemetry(data);
            } catch {
              // Ignore parse errors on keepalive pings
            }
          }
        };

        socket.onclose = () => {
          if (!unmounted) {
            setIsConnected(false);
            // Reconnect with 3-second delay
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
          }
        };

        socket.onerror = () => {
          socket.close();
        };
      } catch {
        if (!unmounted) {
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      }
    }

    connect();

    return () => {
      unmounted = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [wsUrl]);

  return { isConnected, telemetry };
}
