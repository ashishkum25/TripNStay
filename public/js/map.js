// Ensure mapToken is properly set
mapboxgl.accessToken = mapToken;

// Log the map token and coordinates to verify they are set
console.log("Map Token:", mapToken);
console.log("Coordinates:", listing.geometry.coordinates);

const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// Ensure coordinates are correct and add marker with popup
if (listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
  const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates) // [lng, lat]
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popup
      .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);
} else {
  console.error("Invalid coordinates:", listing.geometry.coordinates);
}
