export interface CoopStatus {
  timers: {
    openHour: number;
    openMinute: number;
    closeHour: number;
    closeMinute: number;
  };
  door: {
    isOpen: boolean,
    isClosed: boolean,
    isOpening: boolean,
    isClosing: boolean,
  };
  time: number;
  rssi: number;
}
