// Comprehensive list of Indian cities
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Udaipur", "Manali",
  "Shimla", "Rishikesh", "Dehradun", "Mussoorie", "Ooty", "Munnar",
  "Kochi", "Trivandrum", "Chennai", "Hyderabad", "Pune", "Indore",
  "Bhopal", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Amritsar",
  "Chandigarh", "Ludhiana", "Patiala", "Srinagar", "Leh", "Kargil",
  "Darjeeling", "Gangtok", "Kalimpong", "Siliguri", "Kolkata",
  "Bhubaneswar", "Puri", "Vizag", "Vijayawada", "Tirupati",
  "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Vellore",
  "Kanyakumari", "Rameswaram", "Pondicherry"
];

// Amenities pool
const amenitiesPool = [
  "WiFi", "Pool", "Gym", "Spa", "Parking", "Restaurant",
  "Bar", "Airport Shuttle", "Room Service", "Pet Friendly"
];

// Sample images for hotels
const hotelImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb210a6",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1560347876-aeef00ee58a1",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  "https://images.unsplash.com/photo-1559599238-308793637427",
  "https://images.unsplash.com/photo-1568495248636-6432b97bd949",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1612320582823-0c77b49d7b33",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
  "https://images.unsplash.com/photo-1592229505726-ca121723b8ef",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
  "https://images.unsplash.com/photo-1598928636135-d146006ff4be"
];

// Helper function to get random amenities
function randomAmenities() {
  const shuffled = amenitiesPool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
}

// Helper function to get random images for a hotel
function selectHotelImages() {
  const shuffled = hotelImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(4, hotelImages.length));
}

// Helper function to generate rooms
function generateRooms(basePrice) {
  return [
    { number: "101", type: "Single", price: Math.floor(basePrice * 0.8), amenities: ["AC", "TV", "WiFi"], isAvailable: true },
    { number: "102", type: "Double", price: Math.floor(basePrice), amenities: ["AC", "TV", "WiFi", "Balcony"], isAvailable: true },
    { number: "201", type: "Deluxe", price: Math.floor(basePrice * 1.3), amenities: ["AC", "TV", "WiFi", "Balcony", "Mini Bar"], isAvailable: true },
    { number: "202", type: "Suite", price: Math.floor(basePrice * 1.8), amenities: ["AC", "TV", "WiFi", "Balcony", "Kitchen", "Jacuzzi"], isAvailable: true }
  ];
}

// Generate 70 hotels across all Indian cities
const hotelsData = Array.from({ length: 70 }).map((_, i) => {
  const city = cities[i % cities.length];
  const basePrice = 3000 + (i % 8) * 1500; // Base price between 3000-12000

  return {
    name: `${city} Grand Stay ${Math.floor(i / cities.length) + 1}`,
    city,
    address: `Central ${city}, ${city} Region`,
    description: `Experience premium comfort at ${city} Grand Stay. Located in the heart of ${city}, this hotel offers modern amenities, spacious rooms, and exceptional service. Ideal for business travelers, families, and vacationers looking for a relaxing stay with world-class hospitality and local experiences.`,
    basePrice,
    rating: parseFloat((3.8 + (i % 12) * 0.1).toFixed(1)),
    amenities: randomAmenities(),
    images: selectHotelImages(),
    rooms: generateRooms(basePrice)
  };
});

export default hotelsData;
