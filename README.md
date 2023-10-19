# React OpenLayers Map App

This project implements an interactive map in React using the OpenLayers library.

## Overview

The app displays a basic map with the following features:

- Renders a tile layer base map from OpenStreetMap
- Displays map coordinates and scale info in a control panel
- Allows clicking on the map to add marker icons
- Changes the mouse cursor on hover over markers
- Removes markers on click

## Implementation

The project uses:

- React for component architecture
- OpenLayers for the map implementation
- Material UI for styled components

The key files are:

- `BasicMap.tsx` - Contains the OpenLayers map setup and React hooks
- `App.tsx` - Renders the BasicMap component

The map instance is initialized on mount using a ref. Layers and interactions are added/removed based on React effects.

## Running Locally

To run this project locally:

1. Clone the repo
2. Run `npm install`
3. Run `npm start`
4. Access the app at [http://localhost:3000](http://localhost:3000)

## Next Steps

Some ideas for extending the application:

- Add more map layers and controls
- Integrate with GeoJSON data
- Implement map click popup info
- Add search/geocoding
- Allow drawing geometries
- Connect to backend APIs
