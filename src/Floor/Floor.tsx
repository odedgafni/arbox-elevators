import { useEffect, useState } from "react";
import ElevatorComponent from "../Elevator/Elevator";
import { useElevatorManager } from "../ElevatorManager/useElevatorManager";
import { Elevator } from "../elevator";
import classNames from "classnames";
import "./Floor.scss";

const ETA = ({ eta }: { eta: number }) => {
    const [time, setTime] = useState(eta);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((curr) => --curr);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return <div>{time} Sec.</div>;
};

interface Props {
    floor: number;
    elevators: Elevator[];
}

const Floor = ({ floor, elevators }: Props) => {
    const { addToQueue, queue, pending, arrived } = useElevatorManager();

    const isWaiting = () => queue.includes(floor) || pending.some((req) => req.floor === floor);
    const hasArrived = () => arrived.includes(floor);

    const isWaitingForElevator = (elevatorId: number) =>
        pending.some((req) => req.floor === floor && req.elevatorId === elevatorId);

    const handleCallElevator = () => {
        if (isWaiting() || hasArrived()) return;

        addToQueue(floor);
    };

    const getButtonTitle = () => {
        if (isWaiting()) return "Waiting";
        if (hasArrived()) return "Arrived";
        return "Call";
    };

    return (
        <div className="floor">
            <div className="floor-number">{floor > 0 ? `${floor}th` : "Ground Floor"}</div>
            {elevators.map((el) => (
                <div key={el.id} className="elevator-shaft">
                    {isWaitingForElevator(el.id) && (
                        <ETA
                            eta={
                                pending.find(
                                    (req) => req.floor === floor && req.elevatorId === el.id
                                )!.time
                            }
                        />
                    )}
                    {floor === 0 && <ElevatorComponent elevator={el} />}
                </div>
            ))}
            <button
                onClick={handleCallElevator}
                className={classNames("call-btn", { arrived: hasArrived(), waiting: isWaiting() })}
            >
                {getButtonTitle()}
            </button>
        </div>
    );
};

export default Floor;
