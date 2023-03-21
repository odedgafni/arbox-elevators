import { useState, useContext, useMemo, createContext, useEffect } from "react";
import bell from "../assets/bell.mp3";
import { Elevator, ElevatorStatus } from "../elevator";

const noop = () => {};

interface PendingRequests {
    floor: number;
    elevatorId: number;
    time: number;
}

interface ElevatorsManager {
    queue: number[];
    pending: PendingRequests[];
    arrived: number[];
    addToQueue: (floor: number) => void;
    setElevator: (elevator: Elevator) => void;
    arrive: (elevator: Elevator, floor: number) => void;
}

const ElevatorsManagerContext = createContext<ElevatorsManager>({
    queue: [],
    pending: [],
    arrived: [],
    addToQueue: noop,
    setElevator: noop,
    arrive: noop,
});

const ElevatorManagerProvider = (props: any) => {
    const [queue, setQueue] = useState<number[]>([]);
    const [elevators, setElevators] = useState<Elevator[]>([]);
    const [pending, setPending] = useState<PendingRequests[]>([]);
    const [arrived, setArrived] = useState<number[]>([]);

    useEffect(() => {
        tryCallElevator();
    }, [queue, elevators]);

    const setElevator = (elevator: Elevator) => {
        setElevators((prev) => [...prev, elevator]);
    };

    const addToQueue = (floor: number) => {
        setQueue((prev) => [...prev, floor]);
    };

    const arrive = (elevator: Elevator, floor: number) => {
        new Audio(bell).play();
        elevator.setStatus(ElevatorStatus.PENDING);

        setPending((prev) => prev.filter((p) => p.floor !== floor));
        setArrived((prev) => [...prev, floor]);

        setTimeout(() => {
            complete(elevator, floor);
        }, 2000);
    };

    const complete = (elevator: Elevator, floor: number) => {
        elevator.setStatus(ElevatorStatus.FREE);
        setArrived((prev) => [...prev.filter((p) => p !== floor)]);
        setElevators((prev) => [...prev]);
    };

    const getClosest = (floor: number): Elevator => {
        const { index } = elevators.reduce(
            (closest, elevator, index) => {
                if (elevator.status !== ElevatorStatus.FREE) return closest;

                const currDistance = Math.abs(elevator.currentFloor - floor);
                return currDistance < closest.minDistance
                    ? { minDistance: currDistance, index }
                    : closest;
            },
            { minDistance: Infinity, index: -1 }
        );

        return elevators[index];
    };

    const tryCallElevator = () => {
        if (!queue.length) return;

        const elevator = getClosest(queue[0]);
        if (!elevator) return;

        const nextFloor = queue.shift();
        const time = Math.abs(nextFloor! - elevator.currentFloor) * 2;

        setPending((prev) => [...prev, { floor: nextFloor!, elevatorId: elevator.id, time }]);
        elevator.onCall(nextFloor!);
    };

    const manager: ElevatorsManager = { addToQueue, queue, pending, setElevator, arrive, arrived };

    return <ElevatorsManagerContext.Provider value={manager} {...props} />;
};

export default ElevatorManagerProvider;

export const useElevatorManager = () => useContext(ElevatorsManagerContext);
