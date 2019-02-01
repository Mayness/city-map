const d = require('./province-data/CHINA');
const pj = require('./province.map');

const fs = require('fs');

function getEachGPoint() {
  const GPointList = [];
  for (const item of d.features) {
    if (item.geometry.coordinates[ 0 ].length) {
      GPointList.push({ [ item.id ]: getGravityPointer(item.geometry.coordinates[ 0 ]) });
      pj[ item.id.toUpperCase() ].gps = getGravityPointer(item.geometry.coordinates[ 0 ]);
    }
  }

  fs.writeFile('./province.map.json', JSON.stringify(pj), err => {
    console.log(err);
  });
  return GPointList;
}

// 获取重心
function getGravityPointer(areaPoint) {
  if (areaPoint.length <= 1) {
    areaPoint = areaPoint[ 0 ];
  }
  let area = 0;
  let gx = 0;
  let gy = 0;
  for (let i = 1; i < areaPoint.length; i++) {
    const iLng = areaPoint[ i ][ 0 ];
    const iLat = areaPoint[ i ][ 1 ];
    const nextLng = areaPoint[ i - 1 ][ 0 ];
    const nextLat = areaPoint[ i - 1 ][ 1 ];
    const temp = (iLat * nextLng - iLng * nextLat) / 2;
    area += temp;
    gx += (temp * (iLat + nextLat)) / 3;
    gy += (temp * (iLng + nextLng)) / 3;
  }
  gx = gx / area;
  gy = gy / area;
  return [ gy, gx ];
}

console.log(getEachGPoint());
