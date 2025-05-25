import React from "react";

export class Elevator extends React.Component {
  elevatorId: number;
  currentFloor: number;
  destinations: number[];
  numFloors: number;
  estimatedArrivalTimes: number[];
  elevatorRef: any;
  isMoving: boolean;

  constructor(elevatorId: number, currentFloor = 0, numFloors: number) {
    super({});
    this.elevatorId = elevatorId;
    this.currentFloor = currentFloor;
    this.destinations = [];
    this.estimatedArrivalTimes = [];
    this.numFloors = numFloors;
    this.isMoving = false;
    this.state = {
      currentFloor: currentFloor,
      destinations: [],
      isMoving: false,
    };
    this.elevatorRef = React.createRef();
  }

  estimateTimeToFloor(targetFloor: number): number {
    const currentDestinations = [...this.destinations];
    let currentFloorPosition = this.currentFloor;
    let totalTime = 0;

    for (const destination of currentDestinations) {
      const travelTime = Math.abs(destination - currentFloorPosition) * 0.5;
      const stopTime = 2;
      totalTime += travelTime + stopTime;
      currentFloorPosition = destination;
    }

    const finalTravelTime = Math.abs(targetFloor - currentFloorPosition) * 0.5;
    totalTime += finalTravelTime;

    return parseFloat(totalTime.toFixed(2));
  }

  calculateEstimatedArrivalTimes() {
    let times: number[] = [];
    let total = 0;
    let current = this.currentFloor;

    for (let i = 0; i < this.destinations.length; i++) {
      const next = this.destinations[i];
      const floorsToTravel = Math.abs(next - current);
      const travelTime = floorsToTravel * 0.5;
      total += travelTime;

      if (i > 0) total += 2;

      times.push(parseFloat(total.toFixed(2)));
      current = next;
    }

    this.estimatedArrivalTimes = times;
    console.log(
      `Elevator ${this.elevatorId} - Estimated Arrival Times:`,
      this.estimatedArrivalTimes
    );
  }

  addDestination(floor: number) {
    if (floor === this.currentFloor || this.destinations.includes(floor)) {
      return;
    }

    this.destinations.push(floor);
    console.log(
      `Elevator ${this.elevatorId} - Added floor ${floor} to destinations:`,
      this.destinations
    );

    if (this.destinations.length === 1 && !this.isMoving) {
      this.moveElevatorToFloor(floor);
    }

    this.calculateEstimatedArrivalTimes();
  }

  move() {
    const index = this.destinations.indexOf(this.currentFloor);
    if (index !== -1) {
      this.destinations.splice(index, 1);
    }

    if (this.destinations.length > 0) {
      const nextFloor = this.destinations[0];
      this.moveElevatorToFloor(nextFloor);
    } else {
      this.isMoving = false;
      this.setState({ isMoving: false });
    }
  }

  moveElevatorToFloor(floor: number) {
    if (this.isMoving && this.destinations[0] !== floor) {
      return;
    }

    this.isMoving = true;
    this.setState({ isMoving: true });

    if (this.elevatorRef.current) {
      const newPosition = `${floor * 122}px`;
      const transitionTime = Math.abs(this.currentFloor - floor) * 0.5;

      this.elevatorRef.current.style.bottom = newPosition;
      this.elevatorRef.current.style.transition = `bottom ${transitionTime}s ease-in-out`;

      console.log(
        `Elevator ${this.elevatorId} moving from floor ${this.currentFloor} to floor ${floor}`
      );

      setTimeout(() => {
        this.currentFloor = floor;
        this.setState({ currentFloor: floor });

        try {
          const arrivalSound = new Audio("ding.mp3");
          arrivalSound.play().catch(() => {
            console.log("Could not play arrival sound");
          });
        } catch (error) {
          console.log("Audio not available");
        }

        console.log(`Elevator ${this.elevatorId} arrived at floor ${floor}`);

        setTimeout(() => {
          this.move();
        }, 2000);
      }, transitionTime * 1);
    }
  }

  render() {
    const floorHeight = 122;
    const containerHeight = this.numFloors * floorHeight;
    return (
      <div
        className="elevator-container relative w-[80px] ml-2.5"
        style={{ height: `${containerHeight}px` }}
      >
        <div className="elevator-info text-center text-sm">
          {this.destinations.length > 0 && (
            <div className="text-green-600 text-xs">
              Queue: {this.destinations.join(", ")}
            </div>
          )}
        </div>

        <div className="relative w-full h-full bg-transparent">
          <div className="elevator" ref={this.elevatorRef}>
            <img src="/elv.png" alt="Elevator" />
          </div>
        </div>
      </div>
    );
  }
}
