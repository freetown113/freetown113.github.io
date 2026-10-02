window.ADCS_SITE = {
  repositoryUrl: "https://github.com/freetown113/ADCS_RL",
  contactUrl: "freetown113@gmail.com",
  snapshotUrl: "https://github.com/freetown113/ADCS_RL/tree/develop",

  // Code placeholders appear in context. Replace each empty string with a
  // commit-pinned GitHub line URL, e.g. .../blob/FULL_SHA/path/file.py#L40-L80.
  // Set false before publishing if you prefer to hide unfinished references.
  showPendingCodeLinks: true,
  codeLinks: {
    mission: "",
    guidance: "",
    sensors: "",
    estimator: "",
    control: "",
    actuators: "",
    fdir: "",
    supervisor: "",
    environment: "https://github.com/freetown113/ADCS_RL/blob/develop/simulators/simplified/env.py",
    training: "",
    imitation: "",
    network: "",
    curriculum: "",
    interfaces: "",
    evaluation: "",
    sunPointing: "",
    groundTarget: "",
    scheduledSlew: "",
    nadirLvlh: ""
  },

  // Put the actual B3 video in assets/, then set its relative path.
  // Results shows a labeled placeholder until a real recording is configured.
  demoVideo: "",     // assets/update_0009250.mp4
  demoPoster: "",    // optional still image
  demoCaption: "B3 ground-station tracking · checkpoint 9,250 · 90 seconds of simulation, shown at approximately 4× speed. One recorded run; see the project overview for evaluation limits.",

  // Up to three matched checkpoints. One player is switched between them;
  // no autoplay. Put literal entries like this into the array when available:
  // { label: "Early", src: "assets/early.mp4", poster: "assets/early.jpg",
  //   checkpoint: "update 0001000", conditions: "Same evaluation seed, initial state, target and fault schedule." }
  // Use genuine checkpoint IDs and conditions. A similar-looking clip is not
  // necessarily a matched evaluation.
  trainingClips: [],

  // One exported experiment figure; never an invented performance curve.
  resultFigure: {
    src: "", // assets/pointing-error-comparison.png
    alt: "",
    caption: "" // Controller names, units, conditions, seeds/trials, key finding.
  }
};
