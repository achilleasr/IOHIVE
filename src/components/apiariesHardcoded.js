// Demo data matching the real BEEP API response shape.
// Key difference from real data: coordinates live on the APIARY (coordinate_lat/coordinate_lon),
// NOT on individual hives. The map offsets hive markers around the apiary point.
// Field names match what GET /locations returns, not what POST /locations accepts.

export const apiariesHardcoded = [
  {
    id: 1,
    name: "Apano Meria – North",
    coordinate_lat: 37.4612,
    coordinate_lon: 24.8978,
    hex_color: "#FABB13",
    hives: [
      {
        id: 101,
        name: "Hive 01",
        notes: "Langstroth deep, Italian bees. Queen marked blue (2022).",
        alert: true,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-14T09:12:00.000+0300",
            note: "Varroa count high – treated with oxalic acid strips.",
          },
          {
            date: "2023-07-28T08:45:00.000+0300",
            note: "Queen spotted, good brood pattern.",
          },
          {
            date: "2023-07-01T10:00:00.000+0300",
            note: "Added super, colony strong.",
          },
        ],
      },
      {
        id: 102,
        name: "Hive 02",
        notes: "Langstroth deep. Swarm captured May 2023.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-14T09:40:00.000+0300",
            note: "Colony building up well post-swarm.",
          },
          {
            date: "2023-07-28T09:05:00.000+0300",
            note: "No queen cells, calm colony.",
          },
        ],
      },
      {
        id: 103,
        name: "Hive 03",
        notes: "National hive, local Aegean bees. Very defensive.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-10T07:30:00.000+0300",
            note: "Full inspection. 8 frames of brood. Honey super 60% full.",
          },
        ],
      },
      {
        id: 104,
        name: "Hive 04",
        notes: "Recently split from Hive 01. Queen cell introduced.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-14T10:15:00.000+0300",
            note: "New queen laying. 3 frames capped brood.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Posidonia Olive Grove",
    coordinate_lat: 37.4189,
    coordinate_lon: 24.8891,
    hex_color: "#379C5A",
    hives: [
      {
        id: 201,
        name: "Hive 01",
        notes: "Warré hive. Untreated, monitoring only.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-05T08:00:00.000+0300",
            note: "Colony looks healthy, small population.",
          },
          { date: "2023-06-20T09:00:00.000+0300", note: "Added second box." },
        ],
      },
      {
        id: 202,
        name: "Hive 02",
        notes: "Langstroth, thyme honey producer. Best colony.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-12T07:45:00.000+0300",
            note: "Extracted 14kg thyme honey. Colony still very strong.",
          },
          {
            date: "2023-07-15T08:20:00.000+0300",
            note: "Queen spotted. 11 frames of brood.",
          },
        ],
      },
      {
        id: 203,
        name: "Hive 03",
        notes: "Observation hive, glass side panel.",
        alert: true,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-13T11:00:00.000+0300",
            note: "Possible laying worker – no capped worker brood, many drone cells. Intervention needed.",
          },
          {
            date: "2023-07-30T09:30:00.000+0300",
            note: "Queen missing. Introduced emergency cell.",
          },
        ],
      },
      {
        id: 204,
        name: "Hive 04",
        notes: "Production colony, double brood box.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-10T08:30:00.000+0300",
            note: "All good. Capped honey ready for extraction next week.",
          },
        ],
      },
      {
        id: 205,
        name: "Hive 05",
        notes: "Newly installed nucleus, June 2023.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-08T09:15:00.000+0300",
            note: "Expanding well, queen laying on 6 frames.",
          },
        ],
      },
      {
        id: 206,
        name: "Hive 06",
        notes: "Carniolan bees, imported 2022.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-11T07:55:00.000+0300",
            note: "Calm inspection. No issues.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Galissas Hillside",
    coordinate_lat: 37.4401,
    coordinate_lon: 24.8934,
    hex_color: "#E46268",
    hives: [
      {
        id: 301,
        name: "Hive 01",
        notes: "Top-bar hive. Research colony.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-09T10:00:00.000+0300",
            note: "Comb building active. Honey stored in 4 combs.",
          },
        ],
      },
      {
        id: 302,
        name: "Hive 02",
        notes: "Langstroth, aggressive but productive.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-13T07:30:00.000+0300",
            note: "Full protective gear required. Colony very defensive. 12 frames brood.",
          },
        ],
      },
      {
        id: 303,
        name: "Hive 03",
        notes: "Winter survivor, no treatment 3 years.",
        alert: true,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-14T08:00:00.000+0300",
            note: "Significant chalkbrood. Will monitor.",
          },
          {
            date: "2023-07-20T09:00:00.000+0300",
            note: "Some chalkbrood mummies noticed. Colony otherwise strong.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Vari Coast",
    coordinate_lat: 37.4143,
    coordinate_lon: 24.9402,
    hex_color: "#587FC0",
    hives: [
      {
        id: 401,
        name: "Hive 01",
        notes: "Coastal apiary, thyme and wildflower flora.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-07T08:45:00.000+0300",
            note: "Good colony, queen seen. Super almost full.",
          },
        ],
      },
      {
        id: 402,
        name: "Hive 02",
        notes: "Swarm hive placed here temporarily.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-07T09:10:00.000+0300",
            note: "Small colony, building up. Leave for winter.",
          },
        ],
      },
      {
        id: 403,
        name: "Hive 03",
        notes: "Production colony.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-07T09:35:00.000+0300",
            note: "Extracted 10kg. Colony healthy.",
          },
        ],
      },
      {
        id: 404,
        name: "Hive 04",
        notes: "Queen rearing colony.",
        alert: false,
        hex_color: null,
        inspections: [
          {
            date: "2023-08-06T08:00:00.000+0300",
            note: "6 queen cells capped. Will split next week.",
          },
        ],
      },
    ],
  },
];
