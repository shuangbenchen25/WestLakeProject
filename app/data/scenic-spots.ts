export type GuideMode = "visual" | "hearing";

export type ScenicSpotZone = {
  id: string;
  name: string;
  nameEn: string;
  coordinate: readonly [longitude: number, latitude: number];
  triggerRadiusMeters: number;
  routes: Record<GuideMode, string>;
};

// Temporary test geofence: the Elm College centre at NUS University Town.
// The 180 m radius covers Elm Dining Hall and must be restored before field use.
export const scenicSpotZones: readonly ScenicSpotZone[] = [
  {
    id: "quyuan-fenghe",
    name: "曲院风荷",
    nameEn: "Quyuan Garden",
    coordinate: [103.7723762, 1.3063908],
    triggerRadiusMeters: 180,
    routes: {
      visual: "/visual/quyuan-fenghe",
      hearing: "/hearing/quyuan-fenghe",
    },
  },
];

export function distanceInMeters(
  first: readonly [number, number],
  second: readonly [number, number],
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const latitudeDelta = toRadians(second[1] - first[1]);
  const longitudeDelta = toRadians(second[0] - first[0]);
  const firstLatitude = toRadians(first[1]);
  const secondLatitude = toRadians(second[1]);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
}
