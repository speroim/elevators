"use client";
import React, { useState, useEffect } from "react";
import { Building } from "./Building";

interface BuildingConfig {
  buildingId: number;
  numFloors: number;
  elevatorCount: number;
}

function App() {
  const [buildingCount, setBuildingCount] = useState(1);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<number>(1);
  const [showSettings, setShowSettings] = useState(false);

  const [buildingConfigs, setBuildingConfigs] = useState<BuildingConfig[]>([
    { buildingId: 1, numFloors: 15, elevatorCount: 1 },
  ]);

  useEffect(() => {
    const newBuildings = [];
    const newConfigs = [];

    for (let i = 1; i <= buildingCount; i++) {
      const existingConfig = buildingConfigs.find(
        (config) => config.buildingId === i
      );
      const config = existingConfig || {
        buildingId: i,
        numFloors: 15,
        elevatorCount: 1,
      };

      newConfigs.push(config);
      newBuildings.push(
        new Building({
          buildingId: i,
          numFloors: config.numFloors,
          elevatorCount: config.elevatorCount,
        })
      );
    }

    setBuildingConfigs(newConfigs);
    setBuildings(newBuildings);
    console.log(`Created ${buildingCount} buildings`);
  }, [buildingCount]);

  const updateBuildingConfig = (
    buildingId: number,
    numFloors: number,
    elevatorCount: number
  ) => {
    const updatedConfigs = buildingConfigs.map((config) =>
      config.buildingId === buildingId
        ? { ...config, numFloors, elevatorCount }
        : config
    );
    setBuildingConfigs(updatedConfigs);

    const updatedBuildings = buildings.map((building) => {
      if (building.buildingId === buildingId) {
        return new Building({
          buildingId,
          numFloors,
          elevatorCount,
        });
      }
      return building;
    });
    setBuildings(updatedBuildings);
  };

  const getCurrentBuildingConfig = () => {
    return (
      buildingConfigs.find(
        (config) => config.buildingId === selectedBuilding
      ) || { buildingId: selectedBuilding, numFloors: 15, elevatorCount: 1 }
    );
  };

  return (
    <div className="app-container p-4">
      <div className="p-4 text-center my-4 bg-gray-100 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Elevator Management System</h2>
        <div className="mb-4">
          <span className="mr-4 font-semibold">
            Choose number of buildings:
          </span>
          {[1, 2, 3, 4, 5].map((count) => (
            <button
              key={count}
              onClick={() => setBuildingCount(count)}
              className={`py-2 px-4 rounded mx-2 cursor-pointer transition-colors ${
                buildingCount === count
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {count}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition-colors"
        >
          {showSettings ? "Hide Settings" : "Building Settings"}
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel bg-gray-50 p-4 rounded-xl mb-4 border">
          <h3 className="text-lg font-bold mb-4">Building Configuration</h3>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Select Building to Configure:
            </label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 bg-white"
            >
              {Array.from({ length: buildingCount }, (_, i) => i + 1).map(
                (id) => (
                  <option key={id} value={id}>
                    Building {id}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">
                Number of Floors (max 100):
              </label>
              <input
                type="number"
                value={getCurrentBuildingConfig().numFloors}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= 100 && value >= 1) {
                    updateBuildingConfig(
                      selectedBuilding,
                      value,
                      getCurrentBuildingConfig().elevatorCount
                    );
                  }
                }}
                max={100}
                min={1}
                className="border border-gray-300 rounded px-3 py-2 w-full bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Number of Elevators:
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() =>
                      updateBuildingConfig(
                        selectedBuilding,
                        getCurrentBuildingConfig().numFloors,
                        count
                      )
                    }
                    className={`py-2 px-4 rounded cursor-pointer transition-colors ${
                      getCurrentBuildingConfig().elevatorCount === count
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black hover:bg-gray-200 border"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="buildings-container">
        <div
          className={`grid gap-4 ${
            buildingCount === 1
              ? "grid-cols-1"
              : buildingCount === 2
              ? "grid-cols-1 lg:grid-cols-2"
              : buildingCount <= 3
              ? "grid-cols-1 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          }`}
        >
          {buildings.map((building, index) => (
            <div key={building.buildingId} className="building-wrapper">
              {building.render()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
