const API_URL = "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

const map = L.map('map').setView([25.0478, 121.5319], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let userPos = { lat: 25.0478, lng: 121.5319 };
let markersLayer = L.layerGroup().addTo(map);
let userCircle = null;

function getMarkerColor(st) {
  if (parseInt(st.available_rent_bikes) === 0 || parseInt(st.available_return_bikes) === 0) return "red";
  if (parseInt(st.available_rent_bikes) <= 3 || parseInt(st.available_return_bikes) <= 3) return "yellow";
  return "green";
}

// 計算距離
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// 載入站點
async function loadStations(radiusKm = 0.5) {
  markersLayer.clearLayers();
  if (userCircle) map.removeLayer(userCircle);

  userCircle = L.circle([userPos.lat, userPos.lng], {
    radius: radiusKm * 1000,
    color: "blue",
    fillColor: "#aaddff",
    fillOpacity: 0.2
  }).addTo(map);

  try {
    const response = await fetch(API_URL);
    const stations = await response.json();

    stations.forEach(st => {
      const lat = parseFloat(st.latitude);
      const lng = parseFloat(st.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const dist = getDistance(userPos.lat, userPos.lng, lat, lng);
      if (dist > radiusKm) return;

      const color = getMarkerColor(st);

      L.circleMarker([lat, lng], {
        radius: 8,
        color: color,
        fillColor: color,
        fillOpacity: 0.8
      })
      .addTo(markersLayer)
      .bindPopup(
        `${st.sna}\n` +
        `可借車輛: ${st.available_rent_bikes}\n` +
        `剩餘空位: ${st.available_return_bikes}\n` +
        `更新時間: ${st.updateTime}`
      )
      .on('click', () => {
        document.getElementById("stationId").value = st.sno;
        document.getElementById("stationName").value = st.sna;
      });
    });
  } catch (err) {
    console.error("載入站點失敗", err);
  }
}

// 定位使用者
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    L.marker([userPos.lat, userPos.lng]).addTo(map).bindPopup("你的位置").openPopup();
    map.setView([userPos.lat, userPos.lng], 15);
    const radiusKm = parseFloat(document.getElementById("radius").value) || 0.5;
    loadStations(radiusKm);
  }, () => loadStations());
} else {
  loadStations();
}

// 半徑變動
document.getElementById("radius").addEventListener("change", () => {
  const radiusKm = parseFloat(document.getElementById("radius").value) || 0.5;
  loadStations(radiusKm);
});

// 提醒功能
document.getElementById("startBtn").addEventListener("click", () => {
  const stationId = document.getElementById("stationId").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const intervalMin = parseInt(document.getElementById("interval").value, 10) || 5;

  // 24小時制比較
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const currentTime = `${hh}:${mm}`;
  if(currentTime >= startTime && currentTime <= endTime){
    console.log("在提醒時間區間內，可觸發提醒功能");
  }

  if (!stationId) {
    alert("請先點擊地圖選擇站點！");
    return;
  }

  setInterval(async () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const currentTime = `${hh}:${mm}`;

    if (currentTime >= startTime && currentTime <= endTime) {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const station = data.find(s => s.sno === stationId);

        if (station) {
          const msg = `${station.sna}\n` +
                      `可借車輛: ${station.available_rent_bikes}\n` +
                      `剩餘空位: ${station.available_return_bikes}\n` +
                      `更新時間: ${station.updateTime}`;
          document.getElementById("status").innerText = msg;

          if (Notification.permission === "granted") {
            new Notification("YouBike 狀態更新", { body: msg });
          }
        }
      } catch(err) {
        console.error("提醒功能 fetch 失敗", err);
      }
    }
  }, intervalMin * 60 * 1000);
});

// 圖例
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  div.style.background = "white";
  div.style.padding = "6px";
  div.style.borderRadius = "5px";
  div.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
  div.innerHTML = `
    <h4 style="margin:2px 0;font-size:14px;">站點狀態</h4>
    <div><span style="display:inline-block;width:12px;height:12px;background:green;margin-right:4px;"></span> 正常</div>
    <div><span style="display:inline-block;width:12px;height:12px;background:yellow;margin-right:4px;"></span> 車或位不足 (<=3)</div>
    <div><span style="display:inline-block;width:12px;height:12px;background:red;margin-right:4px;"></span> 沒車/沒位</div>
  `;
  return div;
};
legend.addTo(map);
