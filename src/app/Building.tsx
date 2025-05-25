import React from "react";
import { Elevator } from "./Elevator";

export class Building extends React.Component<{
  buildingId: number;
  numFloors: number;
  elevatorCount: number;
}> {
  buildingId: number;
  numFloors: number;
  elevatorCount: number;
  elevators: any[];
  buildingRef: any;

  constructor(props: {
    buildingId: number;
    numFloors: number;
    elevatorCount: number;
  }) {
    super(props);
    this.buildingId = props.buildingId;
    this.numFloors = props.numFloors;
    this.elevatorCount = props.elevatorCount;
    this.elevators = [];
    this.buildingRef = React.createRef();

    this.initializeElevators();

    this.state = {
      activeFloors: [],
    };
  }

  componentDidUpdate(prevProps: {
    buildingId: number;
    numFloors: number;
    elevatorCount: number;
  }) {
    if (
      prevProps.elevatorCount !== this.props.elevatorCount ||
      prevProps.numFloors !== this.props.numFloors
    ) {
      this.elevatorCount = this.props.elevatorCount;
      this.numFloors = this.props.numFloors;
      this.initializeElevators();
      this.forceUpdate();
    }
  }

  initializeElevators() {
    this.elevators = [];
    for (let i = 1; i <= this.elevatorCount; i++) {
      this.elevators.push(new Elevator(i, 0, this.numFloors));
    }
  }

  callNearestElevator = (floor: number) => {
    if (this.elevators.length === 0) return;

    let fastestElevator = this.elevators[0];
    let minTime = fastestElevator.estimateTimeToFloor(floor);

    for (let i = 1; i < this.elevators.length; i++) {
      const time = this.elevators[i].estimateTimeToFloor(floor);
      if (time < minTime) {
        fastestElevator = this.elevators[i];
        minTime = time;
      }
    }

    fastestElevator.addDestination(floor);
    console.log(
      `Building ${this.buildingId} - Calling elevator #${
        fastestElevator.elevatorId
      } to floor ${floor}. ETA: ${minTime.toFixed(1)}s`
    );
  };

  render() {
    return (
      <div className="building-container border-2 p-4 rounded-lg">
        <div className="building-header text-center mb-4">
          <h3 className="text-lg font-bold">Building {this.buildingId}</h3>
          <p className="text-sm text-gray-600">
            {this.numFloors} floors, {this.elevatorCount} elevators
          </p>
        </div>

        <div className="building-content flex">
          <div className="flex flex-col">
            {[...Array(this.numFloors + 1)].map((_, i) => (
              <div className="floor" key={i}>
                <div className="metal radial">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      this.callNearestElevator(this.numFloors - i);
                    }}
                    className="relative z-10 cursor-pointer"
                  >
                    {this.numFloors - i}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="relative elevators-container flex justify-around flex-1">
            {this.elevators.map((elevator, index) => (
              <div key={index} className="m-0">
                {elevator.render()}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
