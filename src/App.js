import React, { useState, useEffect } from "react";
import { AdvancedMarker, Map, Pin, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useSearchParams } from "react-router-dom";

//http://localhost:3000/?start=-23.635045390687917,-46.641225924716395&end=-23.635260103279446,-46.636307225320905
const App = () => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [searchParams] = useSearchParams();

  // Initial Locations
  const startLocation = {
    lat: parseFloat(searchParams.get("start")?.split(',')[0] || '-23.635045390687917'), 
    lng: parseFloat(searchParams.get("start")?.split(',')[1] || '-46.641225924716395')
  };

  const endLocation = {
    lat: parseFloat(searchParams.get("end")?.split(',')[0] || '-23.635260103279446'),
    lng: parseFloat(searchParams.get("end")?.split(',')[1] || '-46.636307225320905') 
  };
  
  // eslint-disable-next-line 
  const [currentLocation, setCurrentLocation] = useState(null);
  // eslint-disable-next-line
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPath, setUserPath] = useState([]);

  // Mock Current Location updates every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex + 1 <= userPath.length) {
          const nextIndex = (prevIndex + 1);
          setCurrentLocation(userPath[nextIndex]); // Update the current location
          return nextIndex;
        } else {
          return userPath.length;
        }
      });
    }, 4000);

    return () => clearInterval(interval); // Cleanup on unmount
    // eslint-disable-next-line
  }, [userPath]);

  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer());
  }, [routesLibrary]);

  useEffect(() => {
    if (!map) return;
    if (!directionsService) return;
    if (!directionsRenderer) return;
    
    console.log('Calculating route...');
    directionsService.route(
        {
            origin: startLocation,
            destination: endLocation,
            travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK && result !== null) {
                console.log('Got directions', result);

                const stepByStep = [];
                result.routes[0].legs.forEach(leg => {
                  leg.steps.forEach(step => {
                    step.path.forEach(path => {
                      stepByStep.push(path.toJSON());
                    })
                  })
                });
                
                setUserPath(stepByStep);

                // will start from about 25% of the way
                const startingPointIndex = Math.round(stepByStep.length / 4); // starting from 25%
                setCurrentIndex(startingPointIndex);
                const startingPoint = stepByStep[startingPointIndex];
                setCurrentLocation(startingPoint); 

                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(result);
                console.log('Directions rendered');
            } else {
                console.error(`Error fetching directions: ${status}`);
            }
        }
        );
        // eslint-disable-next-line 
  }, [map, directionsService, directionsRenderer]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
        <div>
          <center>
            <h1 style={{ font: "'TwilioSansMono', Courier, monospace"}}>Current User Location</h1>
          </center>
          <Map
            mapId={ 'd1182a0081116563' }
            style={{ width: "650px", height: "500px" }}
            defaultZoom={16} 
            defaultCenter={currentLocation || startLocation}
          >
            {currentLocation && 
            (
                <AdvancedMarker position={currentLocation} title="Current User Location" >
                  <Pin background={"#00000000"} borderColor={"#00000000"}>
                    <img src="https://cdn-icons-png.freepik.com/512/5147/5147215.png" 
                         alt="Current User Location" width="60" />
                  </Pin>
                </AdvancedMarker>
            )}
          </Map>
        </div>
      </div>
    </>
  );
};

export default App;