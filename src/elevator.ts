export enum ElevatorStatus {
    FREE,
    BUSY,
    PENDING,
}

export class Elevator {
    id: number;
    currentFloor: number;
    status: ElevatorStatus;
    callback: (floor: number) => void;

    constructor(id: number) {
        this.id = id;
        this.currentFloor = 0;
        this.status = ElevatorStatus.FREE;
        this.callback = () => {};
    }

    onCall = (floor: number) => {
        this.callback(floor);
    };

    registerCallback = (cb: (floor: number) => void) => {
        this.callback = cb;
    };

    setCurrentFloor = (floor: number) => {
        this.currentFloor = floor;
    };

    setStatus = (status: ElevatorStatus) => {
        this.status = status;
    };
}