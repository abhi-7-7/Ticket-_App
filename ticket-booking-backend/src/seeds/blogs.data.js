// Generate 40 travel blogs
const blogsData = Array.from({ length: 40 }).map((_, i) => {
  const topics = [
    "Ultimate Travel Guide",
    "Hidden Gems in",
    "Best Time to Visit",
    "Budget Travel Tips for",
    "Luxury Experience in",
    "Adventure Activities in",
    "Local Food Guide for",
    "Photography Spots in"
  ];

  const topic = topics[i % topics.length];

  return {
    title: `${topic} ${i + 1}`,
    slug: `${topic.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    author: "Travel Desk",
    body: `
# ${topic} ${i + 1}

## Introduction
Discover amazing travel experiences and unforgettable memories. This comprehensive guide helps you explore destinations smarter and experience the local culture authentically.

## Best Places to Stay
From budget-friendly guesthouses to luxury resorts, choosing the right accommodation can elevate your entire trip. Consider location, amenities, and local reviews when making your choice.

## Food & Culture
Local cuisine and cultural experiences are the heart of any destination. Don't miss trying authentic local dishes and engaging with the community.

## Travel Tips & Recommendations
- Book accommodations early for better rates
- Travel light but smart
- Respect local customs and culture
- Keep digital copies of important documents
- Learn basic local phrases
- Use local transportation for authentic experience
- Respect wildlife and nature

## Budget Planning
Plan your budget according to your comfort level. Research daily costs for food, accommodation, and activities. Always keep emergency funds aside.

## Packing Essentials
- Comfortable walking shoes
- Weather-appropriate clothing
- First aid kit
- Universal power adapter
- Camera for memories
- Comfortable day backpack

## Final Thoughts
Travel is not just about reaching a destination; it's about the journey, the people you meet, and the experiences you gather. Plan well, stay safe, and enjoy every moment of your adventure.

## Recommended Itinerary
Day 1: Arrival and local exploration
Day 2-3: Major attractions and landmarks
Day 4: Adventure activities
Day 5: Local culture immersion
Day 6: Shopping and leisure
Day 7: Departure

Share your travel stories and experiences with us!
    `,
  };
});

export default blogsData;
