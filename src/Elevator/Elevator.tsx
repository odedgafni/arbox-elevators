import classNames from "classnames";
import { useEffect, useRef } from "react";
import { ReactComponent as ElevatorSvg } from "../assets/elevator.svg";
import { Elevator, ElevatorStatus } from "../elevator";
import { useElevatorManager } from "../ElevatorManager/useElevatorManager";
import "./Elevator.scss";

const pixelsPerFloor = 62;

const ElevatorComponent = ({ elevator }: { elevator: Elevator }) => {
    const elevatorsRef = useRef<any>(null);
    const manager = useElevatorManager();

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        elevator.registerCallback(moveElevator);
        manager.setElevator(elevator);
    };

    const moveElevator = (nextFloor: number) => {
        if (!elevatorsRef.current) return;

        const time = Math.abs(nextFloor - elevator.currentFloor) * 2;

        elevatorsRef.current.style.transition = `bottom ${time}s ease-in-out`;
        elevatorsRef.current.style.bottom = `${pixelsPerFloor * nextFloor}px`;

        elevator.setCurrentFloor(nextFloor);
        elevator.setStatus(ElevatorStatus.BUSY);

        setTimeout(() => {
            manager.arrive(elevator, nextFloor);
        }, time * 1000);
    };

    return (
        <div className="elevator" ref={elevatorsRef}>
            <ElevatorSvg
                className={classNames({
                    busy: elevator.status === ElevatorStatus.BUSY,
                    arrived: elevator.status === ElevatorStatus.PENDING,
                })}
            />
        </div>
    );
};

export default ElevatorComponent;
