"use client";

import { useEffect, useRef, useState } from "react";

const NUM_FLOORS = 10;
const FLOOR_HEIGHT = 60; // px
const ELEVATOR_SPEED = 500; // milliseconds per floor

export default function Elevator() {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [targetFloor, setTargetFloor] = useState<number | null>(null);
  const elevatorRef = useRef<HTMLDivElement>(null);

  const handleCall = (floor: number) => {
    setTargetFloor(floor);
  };

  useEffect(() => {
    if (targetFloor === null || targetFloor === currentFloor) return;

    const floorsToTravel = Math.abs(targetFloor - currentFloor);
    const duration = floorsToTravel * ELEVATOR_SPEED;

    if (elevatorRef.current) {
      elevatorRef.current.style.transition = `transform ${duration}ms linear`;
      elevatorRef.current.style.transform = `translateY(-${
        FLOOR_HEIGHT * targetFloor
      }px)`;
    }

    const timeout = setTimeout(() => {
      setCurrentFloor(targetFloor);
      setTargetFloor(null);
      new Audio("/ding.mp3").play();
    }, duration);

    return () => clearTimeout(timeout);
  }, [targetFloor]);

  return (
    <div className="relative w-32 h-[600px] border border-gray-400 bg-red-300">
      {/* כפתורי הקומות */}
      <div className="absolute left-full ml-4 top-0 flex flex-col-reverse gap-1">
        {Array.from({ length: NUM_FLOORS }).map((_, i) => (
          <button
            key={i}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => handleCall(i)}
          >
            קומה {i}
          </button>
        ))}
      </div>

      {/* המעלית */}
      <div
        ref={elevatorRef}
        className="absolute left-2 w-24 h-[60px] bg-white rounded shadow"
        style={{ transform: `translateY(-${FLOOR_HEIGHT * currentFloor}px)` }}
      >
        <img
          src="/elv.png"
          alt="Elevator"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
