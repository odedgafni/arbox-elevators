import { useState } from "react";
import { Elevator } from "./elevator";
import ElevatorManagerProvider from "./ElevatorManager/useElevatorManager";
import Floor from "./Floor/Floor";
import Setup from "./Setup/Setup";
import "./App.scss";

function App() {
    const [numOfFloors, setNumOfFloors] = useState<number | null>(null);
    const [numOfElevators, setNumOfElevators] = useState<number | null>(null);

    const floors = [...Array(numOfFloors).keys()].reverse();
    const elevators = Array.from(Array(numOfElevators)).map((_, i: number) => new Elevator(i));

    return (
        <div className="app">
            <h1>Elevator Excercise</h1>
            <div className="building">
                {numOfFloors && numOfElevators ? (
                    <ElevatorManagerProvider>
                        {floors.map((floor) => (
                            <Floor key={floor} floor={floor} elevators={elevators} />
                        ))}
                    </ElevatorManagerProvider>
                ) : (
                    <Setup setNumOfFloors={setNumOfFloors} setNumOfElevators={setNumOfElevators} />
                )}
            </div>
        </div>
    );
}

export default App;
