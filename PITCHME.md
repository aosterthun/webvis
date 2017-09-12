# YouTube Network Analyzer
---

## Concept

- YouTube Channels 
- YouTube Featured Channels (Meta Data)
- Graph structure
- Horizontal graph layout 
- Too many links
Example YouTube Channel HandOfBlood
Depth 3: 355 linked channels
         153 double-linked channels

- More meaningfull base data
  - Search for double links
  - Implicit shortest path between YouTube Channels

+++

## Visualization Goals

- Discover new YouTube Channels based on user preferences
- User preferences:
  - YouTube Channel as seed for data crawling
  - Marking of interesting YouTube Channels (Clustering -> Technical Challenges)
  - Depth threshold for graph search

---

# Demo

---

## Design Challenges

- In- and Inter-Layer cluster arrangement
- Seperation of data gathering and visualization
  - Server-Client layout
- Ground up implementation
  <ul style="list-style: none;">
    <li>🔍 Technical curiosity </li>
    <li>🐢 Slow data structure algorithms </li>
  </ul>
