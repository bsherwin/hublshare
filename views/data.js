var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
	var dataset = {
		"nodes": [
			{ "an": { "60": { "label": "PARK", "size": 10, "r": 1, "g": 0, "b": 0, "name": "Magic Kingdom" } } },
			{ "an": { "79": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Contemporary Resort" } } },
			{ "an": { "91": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "The Villas at Wilderness Lodge" } } },
			{ "an": { "82": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Wilderness Lodge" } } },
			{ "an": { "90": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "The Villas at Grand Floridian Resort & Spa" } } },
			{ "an": { "81": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Polynesian Village Resort" } } },
			{ "an": { "80": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Grand Floridian Resort & Spa" } } },
			{ "an": { "73": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Coronado Springs Resort" } } },
			{ "an": { "95": { "label": "PLACE", "size": 10, "r": 0, "g": 0, "b": 1, "name": "Disney Springs" } } },
			{ "an": { "62": { "label": "PARK", "size": 10, "r": 1, "g": 0, "b": 0, "name": "Hollywood Studios" } } },
			{ "an": { "63": { "label": "PARK", "size": 10, "r": 1, "g": 0, "b": 0, "name": "Animal Kingdom" } } },
			{ "an": { "64": { "label": "PARK", "size": 10, "r": 1, "g": 0, "b": 0, "name": "Blizzard Beach" } } },
			{ "an": { "72": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Caribbean Beach Resort" } } },
			{ "an": { "84": { "label": "RESORT", "size": 10, "r": 0, "g": 1, "b": 0, "name": "Bay Lake Tower at Contemporary Resort" } } },
			{ "an": { "65": { "label": "PARK", "size": 10, "r": 1, "g": 0, "b": 0, "name": "Typhoon Lagoon" } } }],
		"edges": [
			{ "ae": { "8b05871c-73c7-4c4b-b610-d00800a4c4ed": { "label": "RIDE_THE_MONORAIL_TO", "source": "60", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "fcc98464-ce0d-4f34-9c73-aa2a641dddf6": { "label": "WALK_TO", "source": "60", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "5906be31-e770-4889-9b10-3a7d63712a11": { "label": "RIDE_A_BOAT_TO", "source": "60", "target": "91", "weight": 1, "directed": false } } },
			{ "ae": { "e1e9d8ad-0c98-4aab-ac34-1a621321e195": { "label": "RIDE_A_BOAT_TO", "source": "91", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "9d367620-53b5-4624-801b-1b2b3da45d5e": { "label": "RIDE_A_BOAT_TO", "source": "60", "target": "82", "weight": 1, "directed": false } } },
			{ "ae": { "2bafc2c5-4f98-42c2-8815-f25462f06958": { "label": "RIDE_A_BOAT_TO", "source": "82", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "3600a786-3cb9-4ab7-8548-0a546a757324": { "label": "RIDE_A_BOAT_TO", "source": "60", "target": "90", "weight": 1, "directed": false } } },
			{ "ae": { "a4ded1b5-123c-43c7-886a-00e495328bdc": { "label": "RIDE_THE_MONORAIL_TO", "source": "90", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "0d11c00d-741b-4259-bce5-23c5b57465c8": { "label": "RIDE_A_BOAT_TO", "source": "60", "target": "81", "weight": 1, "directed": false } } },
			{ "ae": { "2651d66a-d4b3-4f5e-befb-05f5f22f01c9": { "label": "RIDE_THE_MONORAIL_TO", "source": "81", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "4a780aa5-393e-4440-ac4b-580a04a615b5": { "label": "RIDE_A_BOAT_TO", "source": "60", "target": "80", "weight": 1, "directed": false } } },
			{ "ae": { "d6affd50-e6f1-41b9-8df2-c4a7a14f69ff": { "label": "RIDE_THE_MONORAIL_TO", "source": "80", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "1fffa395-4a61-4609-950b-fcf00f08a115": { "label": "WALK_TO", "source": "60", "target": "84", "weight": 1, "directed": false } } },
			{ "ae": { "5d97a03a-6898-47bb-bb62-047a5f47cb2a": { "label": "WALK_TO", "source": "84", "target": "79", "weight": 1, "directed": false } } },
			{ "ae": { "9b1ee20a-687d-42af-b410-8b4da2b3920c": { "label": "RIDE_A_BUS_TO", "source": "60", "target": "73", "weight": "20", "directed": true } } },
			{ "ae": { "33f1f035-aea9-4dfd-9f64-3f14bddf3447": { "label": "RIDE_A_BUS_TO", "source": "73", "target": "95", "weight": "15", "directed": true } } },
			{ "ae": { "7230970a-c27c-4e86-9026-e84e1fc18047": { "label": "RIDE_A_BUS_TO", "source": "95", "target": "79", "weight": "45", "directed": true } } },
			{ "ae": { "8c7db535-cf07-427f-8320-2c5163757e41": { "label": "RIDE_A_BUS_TO", "source": "73", "target": "62", "weight": "15", "directed": true } } },
			{ "ae": { "af1e513b-5098-4182-88a1-f83213a4b1bc": { "label": "RIDE_A_BUS_TO", "source": "62", "target": "79", "weight": "20", "directed": true } } },
			{ "ae": { "358e9a16-bb6a-4f39-a311-8099dbe029af": { "label": "RIDE_A_BUS_TO", "source": "73", "target": "63", "weight": "20", "directed": true } } },
			{ "ae": { "7829bd9c-cf04-4350-a08e-c5e861274252": { "label": "RIDE_A_BUS_TO", "source": "63", "target": "79", "weight": "25", "directed": true } } },
			{ "ae": { "139f1248-5fe3-4e82-8355-5f0521f77ed3": { "label": "RIDE_A_BUS_TO", "source": "73", "target": "64", "weight": "10", "directed": true } } },
			{ "ae": { "570194d8-7423-4514-a97f-eb91499abf5d": { "label": "RIDE_A_BUS_TO", "source": "64", "target": "79", "weight": "15", "directed": true } } },
			{ "ae": { "9a08a74b-adaf-4466-a56f-a95bbd593ccd": { "label": "RIDE_A_BUS_TO", "source": "60", "target": "72", "weight": "15", "directed": true } } },
			{ "ae": { "df9f405b-b68b-4720-b9a7-0260874408cb": { "label": "RIDE_A_BUS_TO", "source": "72", "target": "64", "weight": "15", "directed": true } } },
			{ "ae": { "688885b1-82e1-406f-8d36-7566408e9430": { "label": "RIDE_A_BUS_TO", "source": "72", "target": "65", "weight": "20", "directed": true } } },
			{ "ae": { "e6f1c973-4869-4164-b633-3501a0b92706": { "label": "RIDE_A_BUS_TO", "source": "65", "target": "79", "weight": "20", "directed": true } } },
			{ "ae": { "6091b6ef-9f72-43e0-adf1-abe5ec8f8588": { "label": "RIDE_A_BUS_TO", "source": "72", "target": "95", "weight": "10", "directed": true } } }
		]
	};
	res.send(JSON.stringify(dataset));
});

module.exports = router;