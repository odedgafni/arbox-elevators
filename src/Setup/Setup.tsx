import "./Setup.scss";

interface Props {
    setNumOfFloors: React.Dispatch<React.SetStateAction<number | null>>;
    setNumOfElevators: React.Dispatch<React.SetStateAction<number | null>>;
}

const Setup = ({ setNumOfFloors, setNumOfElevators }: Props) => {
    const onSubmit = (e: any) => {
        e.preventDefault();

        const floors = e.target[0];
        const elevators = e.target[1];

        setNumOfFloors(Number(floors.value));
        setNumOfElevators(Number(elevators.value));
    };

    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="form-row">
                <label htmlFor="floor">Number Of Floors:</label>
                <input name="floor" type="number" defaultValue={10} min={5} max={20} />
            </div>
            <div className="form-row">
                <label htmlFor="elevator">Number Of Elevators:</label>
                <input name="elevator" type="number" defaultValue={5} min={1} max={10} />
            </div>
            <p className="form-text">* Please enter number of floors and elevators.</p>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Setup;
