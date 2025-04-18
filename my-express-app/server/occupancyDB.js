const data = {};

function updateOccupancy(lab, seat, status,clientid) {
  if (!data[lab]) data[lab] = {};
  data[lab][seat] = {
    status,
    clientid,
    lastUpdated: new Date()
  };
}

function getOccupancy() {
  return data;
}

module.exports = { updateOccupancy, getOccupancy };