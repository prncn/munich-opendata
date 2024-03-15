export const corsPrefixer = 'https://corsproxy.io/?';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const placeholderRecord = [
//   {
//     _id: 1,
//     name: 'Zugspitze',
//     bayernCloudType: 'Natur',
//     description:
//       'Ein Tagesausflug auf den höchsten Berg Deutschlands? Von München aus ist das kein Problem!',
//     'geo/latitude': 47.42106809599,
//     'geo/longitude': 10.985362529755,
//     url: 'http://zugspitze.de/',
//   },
// ];

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance.toFixed(2);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function getDistanceFromCentral(lat: number, lon: number) {
  const centralStationPos = { lat: 48.14073, lon: 11.55694 };
  return getDistanceFromLatLonInKm(
    centralStationPos.lat,
    centralStationPos.lon,
    lat,
    lon
  );
}

export async function getFirstImageFromPage(url: string) {
  try {
    const response = await fetch(corsPrefixer + url);
    const html = await response.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const imageTags = tempDiv.querySelectorAll('img');

    if (imageTags.length >= 2) {
      const secondImage = imageTags[1];
      const imageUrl = secondImage.src;
      if (endsWithImageExtension(imageUrl)) {
        console.log(`Found image URL: ${imageUrl}`);
        return imageUrl;
      }
      return '';
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

function endsWithImageExtension(inputString: string) {
  const acceptedExtensions = ['.png', '.jpg'];
  const lowerCaseInput = inputString.toLowerCase(); // Convert to lowercase for case-insensitive comparison
  return acceptedExtensions.some((extension) =>
    lowerCaseInput.endsWith(extension)
  );
}
