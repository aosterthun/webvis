# YouTube Network Analyzer
---
## Idea

<img src="assets/HoB.jpg" style="border:none;"></img>

Note: lorem ipsum

+++

<img src="assets/links.jpg" style="border:none;"></img>

---

## Concept




<table>
  <tr class="fragment">
    <td>
      <img src="assets/graph.jpg" style="border:none;"></img>
    </td>
    <td>
      <div>
        <table style="border:none; ">
          <tr class="fragment">
            <td style="text-align:right;">
              <span style="color:red;"> linked </span>
            </td>
            <td>
              <div style="width:355px; background-color:red;">
                355
              </div>
            </td>
          </tr>
          <tr class="fragment">
            <td style="text-align:right;">
              <span style="color:blue;"> double-linked </span>
            </td>
            <td>
              <div style="width:153px; background-color:blue;">
                153
              </div>
            </td>
          </tr>
        </table>
        <small>Example: YouTube Channel <a href="https://www.youtube.com/user/HandIOfIBlood">HandOfBlood</a> Depth 3</small>
      </div>
    </td>
  </tr>
</table>


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
